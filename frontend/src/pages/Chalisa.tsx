import React, { useState } from 'react';
import { useSpeechNarration } from '../hooks/useSpeechNarration';
import { useGetAllChalisa } from '../hooks/useQueries';
import { HANUMAN_CHALISA } from '../lib/staticData';

interface ChalisaData {
  id: number;
  title: string;
  fullText: string;
  meaning: string;
  emoji: string;
}

const STATIC_CHALISA: ChalisaData[] = [
  {
    id: 1,
    title: 'हनुमान चालीसा',
    fullText: HANUMAN_CHALISA,
    meaning: 'हनुमान चालीसा में हनुमान जी के गुण, शक्ति और भक्ति का वर्णन है। इसके पाठ से सभी संकट दूर होते हैं।',
    emoji: '🐒',
  },
];

function ChalisaCard({ chalisa }: { chalisa: ChalisaData }) {
  const [expanded, setExpanded] = useState(false);
  const { startNarration, stopNarration, narrationState } = useSpeechNarration();
  const isSpeaking = narrationState === 'playing';

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{chalisa.emoji}</span>
          <div>
            <h3 className="text-foreground font-bold text-sm">{chalisa.title}</h3>
            <p className="text-muted-foreground text-xs">{chalisa.meaning.slice(0, 60)}...</p>
          </div>
        </div>
        <button
          onClick={() => isSpeaking ? stopNarration() : startNarration(chalisa.fullText)}
          className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
            isSpeaking
              ? 'bg-red-500/20 text-red-400 animate-pulse'
              : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
          }`}
        >
          {isSpeaking ? '⏹️' : '🔊'}
        </button>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[600px] overflow-y-auto' : 'max-h-20'}`}>
        <p className="text-foreground text-sm leading-relaxed whitespace-pre-line font-hindi">{chalisa.fullText}</p>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-xs text-amber-400 hover:text-amber-300 transition-colors"
      >
        {expanded ? '▲ कम दिखाएं' : '▼ पूरी चालीसा देखें'}
      </button>
    </div>
  );
}

export default function Chalisa() {
  const { data: backendChalisa } = useGetAllChalisa();

  const backendConverted: ChalisaData[] = (backendChalisa || []).map((c) => ({
    id: Number(c.id) + 1000,
    title: c.title,
    fullText: c.fullText,
    meaning: c.meaning,
    emoji: '📿',
  }));

  const allChalisa = [...STATIC_CHALISA, ...backendConverted];

  return (
    <div className="animate-fade-in-up">
      <div className="bg-gradient-to-b from-orange-900 to-background px-4 pt-6 pb-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-1">📿 चालीसा संग्रह</h1>
        <p className="text-orange-200 text-sm">पवित्र चालीसाएं — पूर्ण पाठ सहित</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {allChalisa.map((chalisa) => (
          <ChalisaCard key={chalisa.id} chalisa={chalisa} />
        ))}
      </div>
    </div>
  );
}

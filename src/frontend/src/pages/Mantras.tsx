import { useState } from "react";
import { useSpeechNarration } from "../hooks/useSpeechNarration";

interface MantraData {
  id: number;
  name: string;
  deity: string;
  sanskrit: string;
  hindi: string;
  english: string;
  emoji: string;
}

const MANTRAS: MantraData[] = [
  {
    id: 1,
    name: "गायत्री मंत्र",
    deity: "सूर्य देव",
    emoji: "☀️",
    sanskrit: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्।",
    hindi:
      "हम उस परमात्मा की उपासना करते हैं जो सूर्य के समान तेजस्वी है, जो हमारी बुद्धि को प्रेरित करे।",
    english:
      "We meditate on the divine light of the Sun God; may He illuminate our minds.",
  },
  {
    id: 2,
    name: "महामृत्युंजय मंत्र",
    deity: "भगवान शिव",
    emoji: "🔱",
    sanskrit:
      "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय माऽमृतात्।",
    hindi:
      "हम तीन नेत्रों वाले शिव की पूजा करते हैं जो सुगंधित और पोषण देने वाले हैं। जैसे ककड़ी अपने बंधन से मुक्त होती है, वैसे ही हमें मृत्यु से मुक्त करें।",
    english:
      "We worship the three-eyed Shiva who nourishes all beings. May He liberate us from death as a cucumber is freed from its vine.",
  },
  {
    id: 3,
    name: "ॐ नमः शिवाय",
    deity: "भगवान शिव",
    emoji: "🔱",
    sanskrit: "ॐ नमः शिवाय।",
    hindi: "मैं शिव को नमस्कार करता हूं। यह पंचाक्षरी मंत्र शिव के पांच तत्वों का प्रतीक है।",
    english:
      "I bow to Lord Shiva. This five-syllable mantra represents the five elements of Shiva.",
  },
  {
    id: 4,
    name: "हरे कृष्ण महामंत्र",
    deity: "भगवान कृष्ण",
    emoji: "🦚",
    sanskrit: "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे। हरे राम हरे राम राम राम हरे हरे।।",
    hindi:
      "हे कृष्ण! हे राम! हे हरि! मुझे अपनी भक्ति में लीन कर लो। यह महामंत्र मन को शुद्ध करता है।",
    english:
      "O Krishna! O Rama! O Hari! Absorb me in your devotion. This Maha Mantra purifies the mind.",
  },
  {
    id: 5,
    name: "महालक्ष्मी मंत्र",
    deity: "माँ लक्ष्मी",
    emoji: "🌸",
    sanskrit:
      "ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद ॐ श्रीं ह्रीं श्रीं महालक्ष्म्यै नमः।",
    hindi:
      "हे कमल पर विराजमान माँ लक्ष्मी! कृपया प्रसन्न हों और हमें धन, समृद्धि और सुख प्रदान करें।",
    english:
      "O Goddess Lakshmi seated on the lotus! Please be pleased and grant us wealth, prosperity, and happiness.",
  },
  {
    id: 6,
    name: "दुर्गा मंत्र",
    deity: "माँ दुर्गा",
    emoji: "⚔️",
    sanskrit: "ॐ दुं दुर्गायै नमः।",
    hindi: "हे माँ दुर्गा! मैं आपको नमस्कार करता हूं। आप सभी बाधाओं को दूर करने वाली हैं।",
    english:
      "O Mother Durga! I bow to you. You are the remover of all obstacles and difficulties.",
  },
  {
    id: 7,
    name: "सरस्वती मंत्र",
    deity: "माँ सरस्वती",
    emoji: "🎵",
    sanskrit: "ॐ ऐं सरस्वत्यै नमः।",
    hindi: "हे माँ सरस्वती! मैं आपको नमस्कार करता हूं। आप ज्ञान, विद्या और कला की देवी हैं।",
    english:
      "O Mother Saraswati! I bow to you. You are the goddess of knowledge, learning, and arts.",
  },
  {
    id: 8,
    name: "गणेश मंत्र",
    deity: "भगवान गणेश",
    emoji: "🐘",
    sanskrit: "ॐ गं गणपतये नमः।",
    hindi: "हे गणपति! मैं आपको नमस्कार करता हूं। आप सभी कार्यों के आरंभ में पूजे जाते हैं।",
    english:
      "O Ganapati! I bow to you. You are worshipped at the beginning of all auspicious works.",
  },
];

function MantraCard({ mantra }: { mantra: MantraData }) {
  const [expanded, setExpanded] = useState(false);
  const { startNarration, stopNarration, narrationState } =
    useSpeechNarration();
  const isSpeaking = narrationState === "playing";

  const handleTTS = () => {
    if (isSpeaking) {
      stopNarration();
    } else {
      startNarration(`${mantra.sanskrit} ${mantra.hindi}`);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 hover:border-gold-500/50 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{mantra.emoji}</span>
          <div>
            <h3 className="text-foreground font-bold text-sm">{mantra.name}</h3>
            <p className="text-muted-foreground text-xs">{mantra.deity}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleTTS}
          className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
            isSpeaking
              ? "bg-red-500/20 text-red-400 animate-pulse"
              : "bg-gold-500/20 text-gold-400 hover:bg-gold-500/30"
          }`}
          aria-label={isSpeaking ? "रोकें" : "सुनें"}
        >
          {isSpeaking ? "⏹️" : "🔊"}
        </button>
      </div>

      <p className="text-gold-300 text-sm font-medium leading-relaxed mb-2">
        {mantra.sanskrit}
      </p>

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? "▲ कम दिखाएं" : "▼ अर्थ देखें"}
      </button>

      {expanded && (
        <div className="mt-2 space-y-2 animate-fade-in">
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-xs text-amber-300 font-semibold mb-1">
              हिंदी अर्थ:
            </p>
            <p className="text-foreground text-xs leading-relaxed">
              {mantra.hindi}
            </p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-xs text-blue-300 font-semibold mb-1">
              English Meaning:
            </p>
            <p className="text-foreground text-xs leading-relaxed">
              {mantra.english}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Mantras() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-b from-purple-900 to-background px-4 pt-6 pb-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-1">🕉️ पवित्र मंत्र</h1>
        <p className="text-purple-200 text-sm">
          हिंदू धर्म के पवित्र मंत्र — अर्थ सहित
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {MANTRAS.map((mantra) => (
          <MantraCard key={mantra.id} mantra={mantra} />
        ))}
      </div>
    </div>
  );
}

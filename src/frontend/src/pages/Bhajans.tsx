import { useState } from "react";
import { useGetAllBhajans } from "../hooks/useQueries";
import { useSpeechNarration } from "../hooks/useSpeechNarration";

interface BhajanData {
  id: number;
  title: string;
  deity: string;
  emoji: string;
  lyrics: string;
}

const STATIC_BHAJANS: BhajanData[] = [
  {
    id: 1,
    title: "रघुपति राघव राजा राम",
    deity: "भगवान राम",
    emoji: "🏹",
    lyrics: `रघुपति राघव राजा राम, पतित पावन सीताराम।
सीताराम सीताराम, भज प्यारे तू सीताराम।
ईश्वर अल्लाह तेरो नाम, सबको सन्मति दे भगवान।
रघुपति राघव राजा राम, पतित पावन सीताराम।।`,
  },
  {
    id: 2,
    title: "हे राम हे राम",
    deity: "भगवान राम",
    emoji: "🏹",
    lyrics: `हे राम हे राम हे राम हे राम,
जपते रहो सुबह शाम हे राम।
राम नाम की माला जपो,
मन के सारे दुख हरो।
हे राम हे राम हे राम हे राम।।`,
  },
  {
    id: 3,
    title: "ओम जय जगदीश हरे",
    deity: "भगवान विष्णु",
    emoji: "🌸",
    lyrics: `ओम जय जगदीश हरे, स्वामी जय जगदीश हरे।
भक्त जनों के संकट, दास जनों के संकट,
क्षण में दूर करे। ओम जय जगदीश हरे।।
जो ध्यावे फल पावे, दुख बिनसे मन का।
स्वामी दुख बिनसे मन का।
सुख सम्पत्ति घर आवे, कष्ट मिटे तन का।
ओम जय जगदीश हरे।।`,
  },
  {
    id: 4,
    title: "जय गणेश जय गणेश",
    deity: "भगवान गणेश",
    emoji: "🐘",
    lyrics: `जय गणेश जय गणेश जय गणेश देवा।
माता जाकी पार्वती पिता महादेवा।।
एकदंत दयावंत चार भुजाधारी।
माथे सिंदूर सोहे मूसे की सवारी।।
जय गणेश जय गणेश जय गणेश देवा।।`,
  },
  {
    id: 5,
    title: "शिव शंकर को जिसने पूजा",
    deity: "भगवान शिव",
    emoji: "🔱",
    lyrics: `शिव शंकर को जिसने पूजा उसका बेड़ा पार हुआ।
भोले नाथ की जय बोलो, मन का अंधेरा दूर हुआ।।
हर हर महादेव बोलो, शिव की महिमा गाओ।
भोले बाबा के दर पर आकर, मन की मुराद पाओ।।
शिव शंकर को जिसने पूजा उसका बेड़ा पार हुआ।।`,
  },
  {
    id: 6,
    title: "माँ दुर्गे दुर्गति हारिणी",
    deity: "माँ दुर्गा",
    emoji: "⚔️",
    lyrics: `माँ दुर्गे दुर्गति हारिणी, जय जय जय माँ।
भव सागर तारिणी, जय जय जय माँ।।
नव दुर्गा नव रूप तुम्हारे,
जग में सबसे न्यारे।
माँ दुर्गे दुर्गति हारिणी, जय जय जय माँ।।`,
  },
  {
    id: 7,
    title: "राधे राधे बोलो",
    deity: "राधा कृष्ण",
    emoji: "🦚",
    lyrics: `राधे राधे बोलो, राधे राधे बोलो।
मन के सारे दुख भूलो, राधे राधे बोलो।।
वृंदावन की गलियों में, राधा कृष्ण खेलें।
प्रेम की बंसी बजाएं, मन को मोह लें।।
राधे राधे बोलो, राधे राधे बोलो।।`,
  },
  {
    id: 8,
    title: "तुम ही हो माता",
    deity: "माँ लक्ष्मी",
    emoji: "💛",
    lyrics: `तुम ही हो माता, पिता तुम ही हो।
तुम ही हो बंधु, सखा तुम ही हो।।
तुम ही हो साथी, तुम ही सहारा।
कोई न अपना सिवाय तुम्हारा।।
तुम ही हो माता, पिता तुम ही हो।।`,
  },
];

function BhajanCard({ bhajan }: { bhajan: BhajanData }) {
  const [expanded, setExpanded] = useState(false);
  const { startNarration, stopNarration, narrationState } =
    useSpeechNarration();
  const isSpeaking = narrationState === "playing";

  return (
    <div className="bg-card border border-border rounded-2xl p-4 hover:border-gold/50 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{bhajan.emoji}</span>
          <div>
            <h3 className="text-foreground font-bold text-sm">
              {bhajan.title}
            </h3>
            <p className="text-foreground/65 text-xs font-medium">
              {bhajan.deity}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            isSpeaking ? stopNarration() : startNarration(bhajan.lyrics)
          }
          className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
            isSpeaking
              ? "bg-red-500/20 text-red-400 animate-pulse"
              : "bg-gold/20 text-gold hover:bg-gold/30"
          }`}
        >
          {isSpeaking ? "⏹️" : "🔊"}
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-96" : "max-h-16"}`}
      >
        <p className="text-foreground text-sm leading-relaxed whitespace-pre-line font-hindi">
          {bhajan.lyrics}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-xs text-gold hover:text-gold/80 transition-colors"
      >
        {expanded ? "▲ कम दिखाएं" : "▼ पूरा भजन देखें"}
      </button>
    </div>
  );
}

export default function Bhajans() {
  const { data: backendBhajans } = useGetAllBhajans();

  const backendConverted: BhajanData[] = (backendBhajans || []).map((b) => ({
    id: Number(b.id) + 1000,
    title: b.title,
    deity: "भक्ति",
    emoji: "🎵",
    lyrics: b.lyrics,
  }));

  const allBhajans = [...STATIC_BHAJANS, ...backendConverted];

  return (
    <div className="animate-fade-in-up">
      <div className="bg-gradient-to-b from-pink-900 to-background px-4 pt-6 pb-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-1">🎵 भक्ति भजन</h1>
        <p className="text-white/90 text-sm">हिंदू भक्ति संगीत — पूर्ण गीत सहित</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {allBhajans.map((bhajan) => (
          <BhajanCard key={bhajan.id} bhajan={bhajan} />
        ))}
      </div>

      <footer className="px-4 py-6 text-center border-t border-border mt-4">
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} दिव्य दर्शन • Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-gold/80 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

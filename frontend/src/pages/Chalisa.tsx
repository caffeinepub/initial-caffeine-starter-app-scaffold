import React, { useState } from 'react';
import { useSpeechNarration } from '../hooks/useSpeechNarration';
import { useGetAllChalisa } from '../hooks/useQueries';

const HANUMAN_CHALISA = `॥ दोहा ॥
श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि।
बरनउँ रघुबर बिमल जसु, जो दायकु फल चारि॥

बुद्धिहीन तनु जानिके, सुमिरौं पवन-कुमार।
बल बुधि बिद्या देहु मोहिं, हरहु कलेस बिकार॥

॥ चौपाई ॥
जय हनुमान ज्ञान गुण सागर।
जय कपीस तिहुं लोक उजागर॥

राम दूत अतुलित बल धामा।
अंजनि-पुत्र पवनसुत नामा॥

महावीर विक्रम बजरंगी।
कुमति निवार सुमति के संगी॥

कंचन बरन बिराज सुबेसा।
कानन कुण्डल कुंचित केसा॥

हाथ बज्र औ ध्वजा बिराजै।
काँधे मूँज जनेऊ साजै॥

संकर सुवन केसरीनंदन।
तेज प्रताप महा जग बंदन॥

विद्यावान गुणी अति चातुर।
राम काज करिबे को आतुर॥

प्रभु चरित्र सुनिबे को रसिया।
राम लखन सीता मन बसिया॥

सूक्ष्म रूप धरि सियहिं दिखावा।
बिकट रूप धरि लंक जरावा॥

भीम रूप धरि असुर संहारे।
रामचंद्र के काज संवारे॥

लाय सजीवन लखन जियाये।
श्रीरघुबीर हरषि उर लाये॥

रघुपति कीन्ही बहुत बड़ाई।
तुम मम प्रिय भरतहि सम भाई॥

सहस बदन तुम्हरो जस गावैं।
अस कहि श्रीपति कंठ लगावैं॥

सनकादिक ब्रह्मादि मुनीसा।
नारद सारद सहित अहीसा॥

जम कुबेर दिगपाल जहाँ ते।
कबि कोबिद कहि सके कहाँ ते॥

तुम उपकार सुग्रीवहिं कीन्हा।
राम मिलाय राज-पद दीन्हा॥

तुम्हरो मंत्र बिभीषन माना।
लंकेस्वर भए सब जग जाना॥

जुग सहस्र जोजन पर भानू।
लील्यो ताहि मधुर फल जानू॥

प्रभु मुद्रिका मेलि मुख माहीं।
जलधि लाँघि गये अचरज नाहीं॥

दुर्गम काज जगत के जेते।
सुगम अनुग्रह तुम्हरे तेते॥

राम दुआरे तुम रखवारे।
होत न आज्ञा बिनु पैसारे॥

सब सुख लहै तुम्हारी सरना।
तुम रक्षक काहू को डर ना॥

आपन तेज सम्हारो आपै।
तीनों लोक हाँक तें काँपै॥

भूत पिसाच निकट नहिं आवै।
महाबीर जब नाम सुनावै॥

नासै रोग हरै सब पीरा।
जपत निरंतर हनुमत बीरा॥

संकट तें हनुमान छुड़ावै।
मन क्रम बचन ध्यान जो लावै॥

सब पर राम तपस्वी राजा।
तिन के काज सकल तुम साजा॥

और मनोरथ जो कोई लावै।
सोई अमित जीवन फल पावै॥

चारों जुग परताप तुम्हारा।
है परसिद्ध जगत उजियारा॥

साधु-संत के तुम रखवारे।
असुर निकंदन राम दुलारे॥

अष्ट सिद्धि नौ निधि के दाता।
अस बर दीन जानकी माता॥

राम रसायन तुम्हरे पासा।
सदा रहो रघुपति के दासा॥

तुम्हरे भजन राम को पावै।
जनम-जनम के दुख बिसरावै॥

अन्त काल रघुबर पुर जाई।
जहाँ जन्म हरि-भक्त कहाई॥

और देवता चित्त न धरई।
हनुमत सेई सर्ब सुख करई॥

संकट कटै मिटै सब पीरा।
जो सुमिरै हनुमत बलबीरा॥

जय जय जय हनुमान गोसाईं।
कृपा करहु गुरुदेव की नाईं॥

जो सत बार पाठ कर कोई।
छूटहि बंदि महा सुख होई॥

जो यह पढ़ै हनुमान चालीसा।
होय सिद्धि साखी गौरीसा॥

तुलसीदास सदा हरि चेरा।
कीजै नाथ हृदय मँह डेरा॥

॥ दोहा ॥
पवनतनय संकट हरन, मंगल मूरति रूप।
राम लखन सीता सहित, हृदय बसहु सुर भूप॥`;

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
        <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">{chalisa.fullText}</p>
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
    <div className="animate-fade-in">
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

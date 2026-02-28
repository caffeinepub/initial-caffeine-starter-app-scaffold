import { useState } from 'react';
import { useSpeechNarration } from '../hooks/useSpeechNarration';

const HANUMAN_CHALISA = `॥ दोहा ॥
श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि।
बरनउँ रघुबर बिमल जसु, जो दायकु फल चारि।।
बुद्धिहीन तनु जानिके, सुमिरौं पवन-कुमार।
बल बुधि बिद्या देहु मोहिं, हरहु कलेस बिकार।।

॥ चौपाई ॥
जय हनुमान ज्ञान गुण सागर।
जय कपीस तिहुं लोक उजागर।।
राम दूत अतुलित बल धामा।
अंजनि-पुत्र पवनसुत नामा।।

महावीर विक्रम बजरंगी।
कुमति निवार सुमति के संगी।।
कंचन बरन बिराज सुबेसा।
कानन कुण्डल कुंचित केसा।।

हाथ बज्र औ ध्वजा बिराजै।
काँधे मूँज जनेऊ साजै।।
संकर सुवन केसरीनंदन।
तेज प्रताप महा जग बंदन।।

विद्यावान गुणी अति चातुर।
राम काज करिबे को आतुर।।
प्रभु चरित्र सुनिबे को रसिया।
राम लखन सीता मन बसिया।।

सूक्ष्म रूप धरि सियहिं दिखावा।
बिकट रूप धरि लंक जरावा।।
भीम रूप धरि असुर संहारे।
रामचंद्र के काज संवारे।।

लाय सजीवन लखन जियाये।
श्रीरघुबीर हरषि उर लाये।।
रघुपति कीन्ही बहुत बड़ाई।
तुम मम प्रिय भरतहि सम भाई।।

सहस बदन तुम्हरो जस गावैं।
अस कहि श्रीपति कंठ लगावैं।।
सनकादिक ब्रह्मादि मुनीसा।
नारद सारद सहित अहीसा।।

जम कुबेर दिगपाल जहाँ ते।
कबि कोबिद कहि सके कहाँ ते।।
तुम उपकार सुग्रीवहिं कीन्हा।
राम मिलाय राज पद दीन्हा।।

तुम्हरो मंत्र बिभीषन माना।
लंकेस्वर भए सब जग जाना।।
जुग सहस्र जोजन पर भानू।
लील्यो ताहि मधुर फल जानू।।

प्रभु मुद्रिका मेलि मुख माहीं।
जलधि लाँघि गये अचरज नाहीं।।
दुर्गम काज जगत के जेते।
सुगम अनुग्रह तुम्हरे तेते।।

राम दुआरे तुम रखवारे।
होत न आज्ञा बिनु पैसारे।।
सब सुख लहै तुम्हारी सरना।
तुम रक्षक काहू को डर ना।।

आपन तेज सम्हारो आपै।
तीनों लोक हाँक तें काँपै।।
भूत पिसाच निकट नहिं आवै।
महाबीर जब नाम सुनावै।।

नासै रोग हरै सब पीरा।
जपत निरंतर हनुमत बीरा।।
संकट तें हनुमान छुड़ावै।
मन क्रम बचन ध्यान जो लावै।।

सब पर राम तपस्वी राजा।
तिन के काज सकल तुम साजा।।
और मनोरथ जो कोई लावै।
सोई अमित जीवन फल पावै।।

चारों जुग परताप तुम्हारा।
है परसिद्ध जगत उजियारा।।
साधु-संत के तुम रखवारे।
असुर निकंदन राम दुलारे।।

अष्ट सिद्धि नौ निधि के दाता।
अस बर दीन जानकी माता।।
राम रसायन तुम्हरे पासा।
सदा रहो रघुपति के दासा।।

तुम्हरे भजन राम को पावै।
जनम-जनम के दुख बिसरावै।।
अन्त काल रघुबर पुर जाई।
जहाँ जन्म हरि-भक्त कहाई।।

और देवता चित्त न धरई।
हनुमत सेई सर्ब सुख करई।।
संकट कटै मिटै सब पीरा।
जो सुमिरै हनुमत बलबीरा।।

जय जय जय हनुमान गोसाईं।
कृपा करहु गुरुदेव की नाईं।।
जो सत बार पाठ कर कोई।
छूटहि बंदि महा सुख होई।।

जो यह पढ़ै हनुमान चालीसा।
होय सिद्धि साखी गौरीसा।।
तुलसीदास सदा हरि चेरा।
कीजै नाथ हृदय मह डेरा।।

॥ दोहा ॥
पवनतनय संकट हरन, मंगल मूरति रूप।
राम लखन सीता सहित, हृदय बसहु सुर भूप।।`;

export default function Chalisa() {
  const [copied, setCopied] = useState(false);
  const { speak, stop, narrationState } = useSpeechNarration();
  const isSpeaking = narrationState === 'playing';

  const handleCopy = () => {
    navigator.clipboard.writeText(HANUMAN_CHALISA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'हनुमान चालीसा', text: HANUMAN_CHALISA });
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative">
        <img
          src="/assets/generated/om-lotus-ornament.dim_512x256.png"
          alt="Om Lotus"
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 flex items-end justify-center pb-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">🐒 हनुमान चालीसा</h1>
            <p className="text-amber-200 text-sm">गोस्वामी तुलसीदास रचित</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 px-4 py-4">
        <button
          onClick={() => isSpeaking ? stop() : speak(HANUMAN_CHALISA, 'hanuman-chalisa')}
          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 ${
            isSpeaking
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-gold-500/20 text-gold-400 border border-gold-500/30 hover:bg-gold-500/30'
          }`}
        >
          {isSpeaking ? '⏹️ रोकें' : '🔊 सुनें'}
        </button>
        <button
          onClick={handleCopy}
          className="flex-1 py-3 rounded-xl bg-muted text-foreground text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-muted/80"
        >
          {copied ? '✅ कॉपी हो गया' : '📋 कॉपी करें'}
        </button>
        <button
          onClick={handleShare}
          className="flex-1 py-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 text-sm font-medium transition-all duration-200 hover:scale-105"
        >
          📤 शेयर
        </button>
      </div>

      {/* Chalisa Text */}
      <div className="px-4 pb-8">
        <div className="bg-card border border-gold-500/30 rounded-2xl p-5 shadow-lg">
          <pre className="text-foreground text-sm leading-loose whitespace-pre-wrap font-sans">
            {HANUMAN_CHALISA}
          </pre>
        </div>
      </div>
    </div>
  );
}

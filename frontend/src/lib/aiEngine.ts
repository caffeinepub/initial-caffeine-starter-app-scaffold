// AI Engine using a local spiritual response system as primary,
// with optional Groq API as enhancement

const SPIRITUAL_RESPONSES: Record<string, string[]> = {
  greeting: [
    'नमस्ते! 🙏 मैं आपका AI गुरु हूँ। आज आप किस विषय पर मार्गदर्शन चाहते हैं?',
    'जय श्री राम! 🙏 आपका स्वागत है। आपकी आध्यात्मिक यात्रा में मैं आपकी सहायता करने के लिए यहाँ हूँ।',
    'ॐ नमः शिवाय! 🙏 आज आप किस बारे में जानना चाहते हैं?',
  ],
  meditation: [
    'ध्यान के लिए सबसे पहले एक शांत स्थान चुनें। पद्मासन या सुखासन में बैठें। आँखें बंद करें और अपनी श्वास पर ध्यान केंद्रित करें। "ॐ" का मानसिक जाप करते हुए मन को शांत करें। प्रतिदिन 15-20 मिनट का अभ्यास आपके जीवन को बदल देगा। 🧘‍♂️',
    'ध्यान एक अभ्यास है जो धीरे-धीरे गहरा होता है। शुरुआत में मन भटकेगा - यह स्वाभाविक है। जब भी मन भटके, धीरे से श्वास पर वापस लाएं। भगवद्गीता में श्रीकृष्ण कहते हैं: "अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते" - अभ्यास और वैराग्य से मन को वश में किया जा सकता है। 🙏',
  ],
  mantra: [
    'मंत्र जाप एक शक्तिशाली साधना है। "ॐ नमः शिवाय" का जाप करने से मन शांत होता है और आत्मा शुद्ध होती है। प्रतिदिन 108 बार जाप करने से विशेष लाभ होता है। माला का उपयोग करके जाप करें - यह एकाग्रता बढ़ाता है। 📿',
    '"हरे कृष्ण हरे कृष्ण, कृष्ण कृष्ण हरे हरे, हरे राम हरे राम, राम राम हरे हरे" - यह महामंत्र कलियुग में सबसे प्रभावशाली है। इसका जाप करने से मन की अशांति दूर होती है और भगवान की कृपा प्राप्त होती है। 🙏',
  ],
  dharma: [
    'धर्म का अर्थ है वह जो सृष्टि को धारण करता है। भगवद्गीता में श्रीकृष्ण कहते हैं: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत" - जब-जब धर्म की हानि होती है, तब-तब भगवान अवतार लेते हैं। अपने कर्तव्य का पालन करना ही सच्चा धर्म है। 🌸',
    'सनातन धर्म के चार पुरुषार्थ हैं: धर्म, अर्थ, काम और मोक्ष। इनमें से मोक्ष सर्वोच्च लक्ष्य है। सत्य बोलना, अहिंसा का पालन करना, और ईश्वर की भक्ति करना - ये धर्म के मूल स्तंभ हैं। 🙏',
  ],
  krishna: [
    'श्रीकृष्ण भगवान विष्णु के आठवें अवतार हैं। उनका जन्म मथुरा में हुआ था। उन्होंने भगवद्गीता का उपदेश दिया जो आज भी मानवता का मार्गदर्शन करती है। "कर्म करो, फल की चिंता मत करो" - यही उनका सबसे महत्वपूर्ण संदेश है। 🦚',
    'श्रीकृष्ण की बाल लीलाएँ अत्यंत मनोरम हैं। माखन चोरी, कालिया नाग मर्दन, गोवर्धन पर्वत उठाना - ये सभी लीलाएँ उनकी दिव्यता को प्रकट करती हैं। राधा-कृष्ण का प्रेम आत्मा और परमात्मा के मिलन का प्रतीक है। 💛',
  ],
  shiva: [
    'भगवान शिव त्रिदेव में से एक हैं - ब्रह्मा, विष्णु और महेश। वे संहार के देवता हैं लेकिन साथ ही वे आशुतोष भी हैं - जो शीघ्र प्रसन्न होते हैं। "ॐ नमः शिवाय" का जाप करने से उनकी कृपा प्राप्त होती है। 🔱',
    'महाशिवरात्रि शिव की सबसे पवित्र रात्रि है। इस दिन उपवास रखने और रात्रि जागरण करने से विशेष पुण्य मिलता है। शिव का अर्थ है "कल्याणकारी" - वे सभी का कल्याण करते हैं। 🙏',
  ],
  yoga: [
    'योग केवल शारीरिक व्यायाम नहीं है - यह आत्मा को परमात्मा से जोड़ने की विधि है। पतंजलि के अष्टांग योग में यम, नियम, आसन, प्राणायाम, प्रत्याहार, धारणा, ध्यान और समाधि शामिल हैं। नियमित अभ्यास से जीवन में शांति और आनंद आता है। 🧘',
    'भगवद्गीता में तीन प्रकार के योग बताए गए हैं: ज्ञान योग, भक्ति योग और कर्म योग। श्रीकृष्ण कहते हैं कि इनमें से कोई भी मार्ग अपनाकर मोक्ष प्राप्त किया जा सकता है। अपनी प्रकृति के अनुसार मार्ग चुनें। 🌺',
  ],
  default: [
    'आपका प्रश्न बहुत सुंदर है। 🙏 आध्यात्मिक मार्ग पर चलना ही सबसे बड़ी उपलब्धि है। भगवद्गीता में श्रीकृष्ण कहते हैं: "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्" - अपना धर्म, चाहे कितना भी कठिन हो, दूसरे के धर्म से श्रेष्ठ है। अपनी साधना जारी रखें। 🌸',
    'यह एक गहरा प्रश्न है। 🙏 हमारे शास्त्रों में कहा गया है: "सर्वे भवन्तु सुखिनः, सर्वे सन्तु निरामयाः" - सभी सुखी हों, सभी रोगमुक्त हों। ईश्वर की भक्ति और सेवा से जीवन में शांति और आनंद प्राप्त होता है। 🌺',
    'आपकी जिज्ञासा आपकी आध्यात्मिक प्रगति का प्रमाण है। 🙏 उपनिषदों में कहा गया है: "तत्त्वमसि" - वह तुम हो। आत्मा और परमात्मा एक ही हैं। इस सत्य को जानना ही मोक्ष है। ध्यान और जाप से इस सत्य का अनुभव होता है। 🧘',
    'बहुत अच्छा प्रश्न! 🙏 रामायण में श्रीराम का जीवन हमें सिखाता है कि कठिनाइयों में भी धर्म का पालन करना चाहिए। "रघुकुल रीत सदा चली आई, प्राण जाए पर वचन न जाई" - यही सच्चे धर्म का मार्ग है। 🌸',
  ],
};

function getLocalResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('नमस्ते') || lower.includes('hello') || lower.includes('hi') || lower.includes('हेलो') || lower.includes('प्रणाम')) {
    const responses = SPIRITUAL_RESPONSES.greeting;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  if (lower.includes('ध्यान') || lower.includes('meditation') || lower.includes('meditate')) {
    const responses = SPIRITUAL_RESPONSES.meditation;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  if (lower.includes('मंत्र') || lower.includes('जाप') || lower.includes('mantra') || lower.includes('jap')) {
    const responses = SPIRITUAL_RESPONSES.mantra;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  if (lower.includes('धर्म') || lower.includes('dharma') || lower.includes('karma') || lower.includes('कर्म')) {
    const responses = SPIRITUAL_RESPONSES.dharma;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  if (lower.includes('कृष्ण') || lower.includes('krishna') || lower.includes('राधा') || lower.includes('गीता') || lower.includes('gita')) {
    const responses = SPIRITUAL_RESPONSES.krishna;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  if (lower.includes('शिव') || lower.includes('shiva') || lower.includes('महादेव') || lower.includes('mahadev')) {
    const responses = SPIRITUAL_RESPONSES.shiva;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  if (lower.includes('योग') || lower.includes('yoga') || lower.includes('आसन') || lower.includes('asana')) {
    const responses = SPIRITUAL_RESPONSES.yoga;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  const responses = SPIRITUAL_RESPONSES.default;
  return responses[Math.floor(Math.random() * responses.length)];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function getAIResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  // Try Groq API first
  const GROQ_API_KEY = 'gsk_demo_replace_with_your_free_groq_key';
  const isRealKey = GROQ_API_KEY && !GROQ_API_KEY.includes('demo') && !GROQ_API_KEY.includes('replace');

  if (isRealKey) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are a wise Hindu spiritual guru and teacher. You provide guidance on Hindu philosophy, spirituality, meditation, mantras, yoga, and dharma. You speak with compassion and wisdom, drawing from the Bhagavad Gita, Upanishads, Puranas, and other sacred texts. Always respond in Hindi (Devanagari script) unless the user writes in English. Keep responses concise (2-3 paragraphs max). Use relevant Sanskrit shlokas when appropriate. Address the user respectfully.`,
        },
        ...conversationHistory.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: 'user',
          content: userMessage,
        },
      ];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) return content;
      throw new Error('Empty response from Groq');
    } catch (err) {
      console.error('Groq API failed, using local responses:', err);
    }
  }

  // Fallback: local spiritual response system
  // Simulate a small delay to feel natural
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));
  return getLocalResponse(userMessage);
}

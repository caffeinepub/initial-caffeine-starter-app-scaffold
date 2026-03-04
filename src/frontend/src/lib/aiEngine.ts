const POLLINATIONS_BASE = "https://text.pollinations.ai";

const SYSTEM_PROMPT = `आप "दिव्य गुरु" हैं - एक ज्ञानी हिंदू धर्म गुरु। आप केवल हिंदी में उत्तर देते हैं।
आप धर्म, कर्म, मोक्ष, पूजा, मंत्र, व्रत, ध्यान, भक्ति, और हिंदू दर्शन के विषयों पर मार्गदर्शन करते हैं।
आपके उत्तर सरल, स्पष्ट, और आध्यात्मिक होते हैं। आप श्रीमद्भगवद्गीता, रामायण, महाभारत और पुराणों से उद्धरण देते हैं।
हमेशा प्रेम और करुणा के साथ उत्तर दें। उत्तर 150-300 शब्दों में दें।`;

export async function generateDivyaGuruResponse(
  userMessage: string,
): Promise<string> {
  const prompt = `${SYSTEM_PROMPT}\n\nभक्त का प्रश्न: ${userMessage}\n\nदिव्य गुरु का उत्तर:`;

  // Strategy 1: POST request
  try {
    const response = await fetch(POLLINATIONS_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        model: "openai",
        seed: 42,
        jsonMode: false,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (response.ok) {
      const text = await response.text();
      if (text && text.length > 10) return text.trim();
    }
  } catch {}

  // Strategy 2: GET request
  try {
    const encoded = encodeURIComponent(prompt);
    const response = await fetch(
      `${POLLINATIONS_BASE}/${encoded}?model=openai&seed=42`,
      {
        signal: AbortSignal.timeout(15000),
      },
    );
    if (response.ok) {
      const text = await response.text();
      if (text && text.length > 10) return text.trim();
    }
  } catch {}

  // Strategy 3: Mistral model fallback
  try {
    const encoded = encodeURIComponent(prompt);
    const response = await fetch(
      `${POLLINATIONS_BASE}/${encoded}?model=mistral&seed=42`,
      {
        signal: AbortSignal.timeout(15000),
      },
    );
    if (response.ok) {
      const text = await response.text();
      if (text && text.length > 10) return text.trim();
    }
  } catch {}

  // Fallback response
  return getFallbackResponse(userMessage);
}

function getFallbackResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("कर्म") || q.includes("karma")) {
    return 'श्रीमद्भगवद्गीता में भगवान श्रीकृष्ण ने कहा है - "कर्म करो, फल की चिंता मत करो।" (अध्याय 2, श्लोक 47) कर्म का सिद्धांत यह है कि हमारे प्रत्येक कार्य का फल अवश्य मिलता है। अच्छे कर्म करने से जीवन में सुख और शांति आती है।';
  }
  if (q.includes("ध्यान") || q.includes("meditation")) {
    return 'ध्यान आत्मा को परमात्मा से जोड़ने का मार्ग है। प्रतिदिन प्रातःकाल ब्रह्म मुहूर्त में ध्यान करें। अपनी सांसों पर ध्यान केंद्रित करें और "ॐ" का मानसिक जाप करें। नियमित ध्यान से मन शांत होता है और आत्मज्ञान की प्राप्ति होती है।';
  }
  if (q.includes("पूजा") || q.includes("puja")) {
    return "पूजा भगवान के प्रति हमारी भक्ति और श्रद्धा का प्रतीक है। शुद्ध मन और तन से पूजा करें। पूजा में फूल, धूप, दीप, नैवेद्य अर्पित करें। भगवान को प्रेम से पुकारें - वे अवश्य सुनते हैं।";
  }
  return 'हे भक्त! आपका प्रश्न बहुत सुंदर है। भगवान श्रीकृष्ण ने गीता में कहा है - "जो मुझे सच्चे मन से याद करता है, मैं उसे कभी नहीं भूलता।" अपने मन को शुद्ध रखें, नित्य पूजा करें, और सत्य के मार्ग पर चलें। ईश्वर की कृपा सदा आप पर बनी रहे। 🙏';
}

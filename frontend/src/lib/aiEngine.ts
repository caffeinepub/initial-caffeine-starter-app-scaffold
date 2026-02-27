// AI Engine - Uses Pollinations.ai (free, no API key required)
// Text: https://text.pollinations.ai (POST)
// Image: https://image.pollinations.ai (GET)

const DIVYA_GURU_SYSTEM_PROMPT = `You are Divya Guru, a wise and compassionate Hindu spiritual guide. You speak with warmth, wisdom, and deep knowledge of Hindu scriptures, philosophy, and traditions.

Your responses should:
- Be spiritually uplifting and grounded in Hindu philosophy
- Reference relevant scriptures (Bhagavad Gita, Upanishads, Puranas, Vedas) when appropriate
- Use respectful terms like "dear devotee", "beloved seeker"
- Include Sanskrit shlokas with Hindi/English translations when relevant
- Blend Hindi and English naturally (Hinglish is welcome)
- Be concise but profound (2-4 paragraphs typically)
- Address questions about dharma, karma, bhakti, yoga, festivals, rituals, and daily spiritual practice
- Always end with a blessing or encouraging thought

You represent the living tradition of Sanatana Dharma with love and inclusivity.`;

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function tryPollinationsText(
  userMessage: string,
  conversationHistory: ConversationMessage[]
): Promise<string> {
  const messages = [
    { role: 'system', content: DIVYA_GURU_SYSTEM_PROMPT },
    ...conversationHistory.slice(-6),
    { role: 'user', content: userMessage }
  ];

  const response = await fetch('https://text.pollinations.ai/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      model: 'openai',
      seed: Math.floor(Math.random() * 1000),
      jsonMode: false
    }),
    signal: AbortSignal.timeout(30000)
  });

  if (!response.ok) {
    throw new Error(`Pollinations text API error: ${response.status}`);
  }

  const text = await response.text();
  if (!text || text.trim().length < 10) {
    throw new Error('Empty response from Pollinations text API');
  }
  return text.trim();
}

async function tryPollinationsTextGet(
  userMessage: string,
  conversationHistory: ConversationMessage[]
): Promise<string> {
  const systemContext = DIVYA_GURU_SYSTEM_PROMPT.substring(0, 200);
  const recentHistory = conversationHistory.slice(-2)
    .map(m => `${m.role}: ${m.content}`)
    .join('\n');
  const fullPrompt = `${systemContext}\n\n${recentHistory}\nuser: ${userMessage}\nassistant:`;
  const encoded = encodeURIComponent(fullPrompt.substring(0, 500));

  const response = await fetch(
    `https://text.pollinations.ai/${encoded}?model=openai&seed=${Math.floor(Math.random() * 9999)}`,
    { signal: AbortSignal.timeout(25000) }
  );

  if (!response.ok) throw new Error(`GET fallback error: ${response.status}`);
  const text = await response.text();
  if (!text || text.trim().length < 10) throw new Error('Empty GET response');
  return text.trim();
}

async function tryOpenRouterFree(
  userMessage: string,
  conversationHistory: ConversationMessage[]
): Promise<string> {
  // Use a completely free, no-auth endpoint as last resort
  const prompt = `You are a Hindu spiritual guide. Answer this question with wisdom and devotion: ${userMessage}`;
  const encoded = encodeURIComponent(prompt.substring(0, 400));

  const response = await fetch(
    `https://text.pollinations.ai/${encoded}?model=mistral&seed=${Date.now() % 9999}`,
    { signal: AbortSignal.timeout(20000) }
  );

  if (!response.ok) throw new Error(`Fallback error: ${response.status}`);
  const text = await response.text();
  if (!text || text.trim().length < 5) throw new Error('Empty fallback response');
  return text.trim();
}

export async function generateAIResponse(
  userMessage: string,
  conversationHistory: ConversationMessage[] = [],
  onRetry?: (attempt: number) => void
): Promise<string> {
  const providers = [
    () => tryPollinationsText(userMessage, conversationHistory),
    () => tryPollinationsTextGet(userMessage, conversationHistory),
    () => tryOpenRouterFree(userMessage, conversationHistory),
  ];

  let lastError: Error = new Error('All providers failed');

  for (let i = 0; i < providers.length; i++) {
    try {
      if (i > 0) {
        onRetry?.(i);
        await sleep(1000 * i);
      }
      const result = await providers[i]();
      return result;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`AI provider ${i + 1} failed:`, lastError.message);
    }
  }

  // Final fallback: return a devotional message
  return `🙏 प्रिय भक्त, \n\nआपका प्रश्न बहुत सुंदर है। इस समय तकनीकी कठिनाई के कारण मैं उत्तर देने में असमर्थ हूँ। कृपया थोड़ी देर बाद पुनः प्रयास करें।\n\nभगवान श्री कृष्ण ने गीता में कहा है: "योगस्थः कुरु कर्माणि" - स्थिर चित्त से कर्म करते रहो।\n\nहरि ॐ 🕉️`;
}

// ─── Image Generation ───────────────────────────────────────────────────────

export function detectImageRequest(message: string): boolean {
  const lower = message.toLowerCase();
  const keywords = [
    'image', 'photo', 'picture', 'show me', 'generate', 'draw', 'create image',
    'तस्वीर', 'चित्र', 'फोटो', 'दिखाओ', 'बनाओ'
  ];
  return keywords.some(kw => lower.includes(kw));
}

export function extractImagePrompt(message: string): string {
  const lower = message.toLowerCase();
  const prefixes = [
    'generate an image of', 'generate image of', 'create an image of', 'create image of',
    'show me an image of', 'show me a picture of', 'show me', 'generate a photo of',
    'generate a picture of', 'draw', 'create a picture of', 'image of', 'picture of',
    'photo of', 'generate', 'create'
  ];
  let prompt = message;
  for (const prefix of prefixes) {
    if (lower.startsWith(prefix)) {
      prompt = message.substring(prefix.length).trim();
      break;
    }
  }
  // Add devotional context if not already present
  if (!prompt.toLowerCase().includes('hindu') &&
      !prompt.toLowerCase().includes('krishna') &&
      !prompt.toLowerCase().includes('shiva') &&
      !prompt.toLowerCase().includes('temple') &&
      !prompt.toLowerCase().includes('deity')) {
    prompt = `${prompt}, Hindu devotional art style, spiritual, divine, beautiful`;
  }
  return prompt || message;
}

/**
 * Attempts to fetch and return a blob URL for the generated image.
 * Tries up to maxRetries times with exponential backoff.
 */
async function fetchImageWithRetry(
  imageUrl: string,
  maxRetries: number = 3,
  baseDelayMs: number = 2000
): Promise<string> {
  let lastError: Error = new Error('Image fetch failed');

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (attempt > 0) {
      await sleep(baseDelayMs * attempt);
    }
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(imageUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();

      // Validate the blob is a real image (not an error page)
      if (blob.size < 1000) {
        throw new Error('Response too small — likely an error page, not an image');
      }

      if (!blob.type.startsWith('image/')) {
        throw new Error(`Unexpected content type: ${blob.type}`);
      }

      return URL.createObjectURL(blob);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`Image generation attempt ${attempt + 1}/${maxRetries} failed:`, lastError.message);
    }
  }

  throw lastError;
}

export async function generateImage(prompt: string): Promise<string> {
  // Enhance the prompt for better devotional art quality
  const enhancedPrompt = `${prompt}, highly detailed, divine light, spiritual art, vibrant colors, 4k quality, masterpiece`;
  const encoded = encodeURIComponent(enhancedPrompt);
  const seed = Math.floor(Math.random() * 999999);

  // Primary URL with model=flux for better quality
  const primaryUrl = `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&seed=${seed}&nologo=true&model=flux`;

  try {
    return await fetchImageWithRetry(primaryUrl, 3, 2000);
  } catch (primaryErr) {
    console.warn('Primary image URL failed, trying fallback model:', primaryErr);

    // Fallback: try with default model and different seed
    const fallbackSeed = Math.floor(Math.random() * 999999);
    const fallbackUrl = `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&seed=${fallbackSeed}&nologo=true`;

    return await fetchImageWithRetry(fallbackUrl, 2, 3000);
  }
}

// Legacy aliases for backward compatibility
export function isImageRequest(message: string): boolean {
  return detectImageRequest(message);
}

export function buildImageUrl(prompt: string): string {
  const encoded = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 999999);
  return `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&seed=${seed}&nologo=true`;
}

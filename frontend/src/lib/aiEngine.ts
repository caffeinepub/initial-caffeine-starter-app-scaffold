// AI Engine using Google Gemini API (free tier) for real AI responses
// and Pollinations.ai for free image generation (no key required)
// Get your free Gemini API key at: https://aistudio.google.com/app/apikey

const API_KEY_STORAGE_KEY = 'ai_api_key';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  text?: string;
  imageUrl?: string;
  imagePrompt?: string;
  isImage: boolean;
}

// Detect if the user is requesting image generation
function detectImageRequest(message: string): string | null {
  const lower = message.toLowerCase();
  const imageKeywords = [
    'generate image',
    'create image',
    'make image',
    'draw',
    'show me a picture',
    'show me an image',
    'generate a picture',
    'create a picture',
    'make a picture',
    'paint',
    'illustrate',
    'visualize',
    'generate photo',
    'create photo',
    'image of',
    'picture of',
    'photo of',
    'तस्वीर बनाओ',
    'चित्र बनाओ',
    'इमेज बनाओ',
    'फोटो बनाओ',
  ];

  for (const keyword of imageKeywords) {
    if (lower.includes(keyword)) {
      return message;
    }
  }
  return null;
}

// Extract the image subject from the prompt
function extractImagePrompt(message: string): string {
  const lower = message.toLowerCase();
  const prefixes = [
    'generate image of',
    'generate image',
    'create image of',
    'create image',
    'make image of',
    'make image',
    'draw a picture of',
    'draw a',
    'draw an',
    'draw',
    'show me a picture of',
    'show me an image of',
    'show me a picture',
    'show me an image',
    'generate a picture of',
    'generate a picture',
    'create a picture of',
    'create a picture',
    'make a picture of',
    'make a picture',
    'paint a',
    'paint an',
    'paint',
    'illustrate',
    'visualize',
    'generate photo of',
    'generate photo',
    'create photo of',
    'create photo',
    'image of',
    'picture of',
    'photo of',
    'तस्वीर बनाओ',
    'चित्र बनाओ',
    'इमेज बनाओ',
    'फोटो बनाओ',
  ];

  let prompt = message;
  for (const prefix of prefixes) {
    if (lower.startsWith(prefix)) {
      prompt = message.slice(prefix.length).trim();
      break;
    }
    const idx = lower.indexOf(prefix);
    if (idx !== -1) {
      prompt = message.slice(idx + prefix.length).trim();
      break;
    }
  }

  return prompt || message;
}

// Get the stored Gemini API key from localStorage
export function getStoredApiKey(): string | null {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

// Save the Gemini API key to localStorage
export function saveApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
}

// Clear the stored Gemini API key from localStorage
export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

// Send a message to the Google Gemini API and return the AI response
export async function getAIResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<AIResponse> {
  // Check for image generation request first (no API key needed for Pollinations)
  const imageRequest = detectImageRequest(userMessage);
  if (imageRequest) {
    const imagePrompt = extractImagePrompt(userMessage);
    const encodedPrompt = encodeURIComponent(imagePrompt);
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=768&height=512&nologo=true`;

    return {
      imageUrl,
      imagePrompt,
      isImage: true,
    };
  }

  // For text responses, check for Gemini API key
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    return {
      text: "⚙️ Please configure your **Google Gemini API key** in the settings above to start chatting.\n\nYou can get a **free API key** from [Google AI Studio](https://aistudio.google.com/app/apikey) — no credit card required!\n\nNote: Image generation works without an API key — just ask me to 'generate an image of...'",
      isImage: false,
    };
  }

  try {
    // Build Gemini contents array from conversation history
    const contents = [
      ...conversationHistory.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      {
        role: 'user',
        parts: [{ text: userMessage }],
      },
    ];

    const systemInstruction = {
      parts: [
        {
          text: 'You are a helpful, knowledgeable AI assistant. You can answer questions on any topic — science, history, technology, arts, philosophy, spirituality, coding, and more. Be concise, accurate, and friendly. Format responses clearly using markdown when helpful.',
        },
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: systemInstruction,
          contents,
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 400) {
        const msg = errorData?.error?.message || '';
        if (msg.toLowerCase().includes('api key')) {
          throw new Error('Invalid Gemini API key. Please check your key in settings.');
        }
        throw new Error(msg || `API error: ${response.status}`);
      } else if (response.status === 401 || response.status === 403) {
        throw new Error('Invalid Gemini API key. Please check your key in settings.');
      } else if (response.status === 429) {
        throw new Error('Rate limit reached. Please wait a moment and try again.');
      } else {
        const msg = errorData?.error?.message || `API error: ${response.status}`;
        throw new Error(msg);
      }
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (content) {
      return { text: content, isImage: false };
    }

    // Handle safety blocks or empty responses
    const finishReason = data?.candidates?.[0]?.finishReason;
    if (finishReason === 'SAFETY') {
      throw new Error('Response blocked by safety filters. Please rephrase your question.');
    }

    throw new Error('Empty response from Gemini');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error occurred';
    throw new Error(message);
  }
}

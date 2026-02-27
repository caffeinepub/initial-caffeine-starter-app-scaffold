# Specification

## Summary
**Goal:** Replace the OpenRouter AI engine with Google Gemini API for the AI Guru chat feature.

**Planned changes:**
- Replace OpenRouter API calls in `aiEngine.ts` with calls to the Google Gemini REST endpoint (`gemini-1.5-flash:generateContent`), preserving message history and error handling
- Update API key storage/retrieval helpers to use Gemini API keys
- Update the API key configuration UI in `AIGuru.tsx` to reference "Google Gemini API Key" with a help link to `https://aistudio.google.com/app/apikey`, removing all OpenRouter references
- Update `frontend/.env.example` and any code comments to reference Gemini instead of OpenRouter/OpenAI

**User-visible outcome:** Users are prompted to enter their Google Gemini API key (obtained for free from Google AI Studio) to use the AI Guru chat, and all chat messages are processed through the Gemini API.

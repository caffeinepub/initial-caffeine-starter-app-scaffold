import React, { useState } from 'react';
import { Download, ImageOff } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'ai' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  imagePrompt?: string;
  isImage?: boolean;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Simple markdown-like renderer: bold (**text**), newlines
function renderContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\n)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part === '\n') {
      return <br key={i} />;
    }
    return <span key={i}>{part}</span>;
  });
}

function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

async function downloadImage(imageUrl: string, prompt: string) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-generated-${toKebabCase(prompt) || 'image'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    // Fallback: open in new tab
    window.open(imageUrl, '_blank');
  }
}

function GeneratedImage({ imageUrl, imagePrompt }: { imageUrl: string; imagePrompt: string }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    await downloadImage(imageUrl, imagePrompt);
    setDownloading(false);
  };

  return (
    <div className="mt-2 rounded-xl overflow-hidden border border-gold/30 shadow-md max-w-xs">
      {!imgLoaded && !imgError && (
        <div className="w-full h-48 bg-muted/50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="w-6 h-6 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
            <span className="text-xs">Generating image...</span>
          </div>
        </div>
      )}
      {imgError && (
        <div className="w-full h-48 bg-muted/50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageOff className="w-8 h-8" />
            <span className="text-xs">Image generation failed</span>
          </div>
        </div>
      )}
      <img
        src={imageUrl}
        alt={imagePrompt}
        className={`w-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0 h-0'}`}
        onLoad={() => setImgLoaded(true)}
        onError={() => setImgError(true)}
      />
      {imgLoaded && !imgError && (
        <div className="bg-white/90 dark:bg-background/90 px-3 py-2 flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground truncate flex-1">{imagePrompt}</span>
          <button
            onClick={handleDownload}
            disabled={downloading}
            aria-label="Download image"
            className="shrink-0 flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-2.5 py-1.5 rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {downloading ? (
              <div className="w-3 h-3 border border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Download className="w-3 h-3" />
            )}
            {downloading ? 'Saving...' : 'Download'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ChatMessage({ role, content, timestamp, imageUrl, imagePrompt, isImage }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex items-end gap-2 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md ${
          isUser
            ? 'bg-saffron text-white'
            : 'bg-gradient-to-br from-gold to-saffron text-white overflow-hidden'
        }`}
      >
        {isUser ? (
          <span>👤</span>
        ) : (
          <img
            src="/assets/generated/ai-guru-avatar.dim_256x256.png"
            alt="AI"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.textContent = '🤖';
            }}
          />
        )}
      </div>

      {/* Bubble */}
      <div className={`max-w-[78%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isUser
              ? 'bg-saffron text-white rounded-br-sm'
              : 'bg-white border border-gold/30 text-foreground rounded-bl-sm'
          }`}
        >
          {renderContent(content)}
          {/* Inline image for image generation responses */}
          {isImage && imageUrl && (
            <GeneratedImage
              imageUrl={imageUrl}
              imagePrompt={imagePrompt || 'generated image'}
            />
          )}
        </div>
        <span className="text-[10px] text-muted-foreground px-1">{formatTime(timestamp)}</span>
      </div>
    </div>
  );
}

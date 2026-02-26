import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AARTIS } from '../lib/staticData';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AartiDetail() {
  const { id } = useParams({ from: '/aarti/$id' });
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showHindi, setShowHindi] = useState(true);

  const aarti = AARTIS.find(a => a.id === id);

  if (!aarti) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <span className="text-5xl mb-4">🙏</span>
        <h2 className="font-devanagari text-xl font-bold text-foreground mb-2">Aarti not found</h2>
        <Button onClick={() => navigate({ to: '/' })} className="bg-saffron text-white">
          Go Home
        </Button>
      </div>
    );
  }

  const handleCopy = async () => {
    const text = `${aarti.name}\n\n${showHindi ? aarti.hindiText : aarti.englishText}\n\n— Sanatan Pro 🙏`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Aarti copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy');
    }
  };

  const handleShare = async () => {
    const text = `${aarti.name}\n\n${showHindi ? aarti.hindiText : aarti.englishText}\n\n— Sanatan Pro 🙏`;
    if (navigator.share) {
      try {
        await navigator.share({ title: aarti.name, text });
      } catch {
        // cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-saffron/20 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate({ to: '/' })}
          className="p-2 rounded-full hover:bg-saffron/10 text-saffron transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-2xl">{aarti.emoji}</span>
          <h1 className="font-devanagari text-lg font-bold text-foreground">{aarti.name}</h1>
        </div>
        <div className="flex gap-1">
          <button
            onClick={handleCopy}
            className="p-2 rounded-full hover:bg-saffron/10 text-saffron transition-colors"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-saffron/10 text-saffron transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Language Toggle */}
      <div className="px-4 pt-4">
        <div className="flex bg-muted rounded-xl p-1 gap-1">
          <button
            onClick={() => setShowHindi(true)}
            className={`flex-1 py-2 rounded-lg text-sm font-body font-medium transition-all ${
              showHindi ? 'bg-saffron text-white shadow-saffron' : 'text-muted-foreground'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setShowHindi(false)}
            className={`flex-1 py-2 rounded-lg text-sm font-body font-medium transition-all ${
              !showHindi ? 'bg-saffron text-white shadow-saffron' : 'text-muted-foreground'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Aarti Content */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-br from-saffron/5 to-gold/5 rounded-2xl border-2 border-gold/20 p-5">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gold/30" />
            <span className="text-3xl">{aarti.emoji}</span>
            <div className="h-px flex-1 bg-gold/30" />
          </div>
          <pre className={`whitespace-pre-wrap leading-relaxed text-foreground/90 ${
            showHindi ? 'font-devanagari text-base' : 'font-body text-sm'
          }`}>
            {showHindi ? aarti.hindiText : aarti.englishText}
          </pre>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px flex-1 bg-gold/30" />
            <span className="text-saffron font-devanagari text-sm">🙏 हरि ॐ</span>
            <div className="h-px flex-1 bg-gold/30" />
          </div>
        </div>

        <Button
          onClick={handleShare}
          className="w-full mt-4 bg-saffron hover:bg-saffron-dark text-white font-body gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share this Aarti
        </Button>
      </div>
    </div>
  );
}

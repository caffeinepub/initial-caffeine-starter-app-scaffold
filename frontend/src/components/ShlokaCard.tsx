import { useState, useRef } from 'react';
import { Share2, Download, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Shloka } from '../lib/staticData';

interface ShlokaCardProps {
  shloka: Shloka;
}

export default function ShlokaCard({ shloka }: ShlokaCardProps) {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleCopy = async () => {
    const text = `${shloka.sanskrit}\n\nहिंदी: ${shloka.hindiMeaning}\n\nEnglish: ${shloka.englishMeaning}\n\n— Sanatan Pro 🙏`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Shloka copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy text');
    }
  };

  const handleShare = async () => {
    const text = `${shloka.sanskrit}\n\nहिंदी: ${shloka.hindiMeaning}\n\nEnglish: ${shloka.englishMeaning}\n\n— Sanatan Pro 🙏`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Daily Shloka — Sanatan Pro', text });
      } catch {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  const handleGenerateImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, '#FFF8F0');
    grad.addColorStop(1, '#FFF3E0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    // Border
    ctx.strokeStyle = '#FF9933';
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, 1040, 1040);

    // Inner border
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, 1008, 1008);

    // Om symbol
    ctx.font = 'bold 80px serif';
    ctx.fillStyle = '#FF9933';
    ctx.textAlign = 'center';
    ctx.fillText('ॐ', 540, 130);

    // Title
    ctx.font = 'bold 36px serif';
    ctx.fillStyle = '#8B4513';
    ctx.fillText('Daily Shloka — Sanatan Pro', 540, 190);

    // Divider
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 210);
    ctx.lineTo(980, 210);
    ctx.stroke();

    // Sanskrit text
    ctx.font = '38px serif';
    ctx.fillStyle = '#1a1a1a';
    const words = shloka.sanskrit.split(' ');
    let line = '';
    let y = 290;
    for (const word of words) {
      const testLine = line + word + ' ';
      if (ctx.measureText(testLine).width > 900 && line !== '') {
        ctx.fillText(line, 540, y);
        line = word + ' ';
        y += 50;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 540, y);
    y += 70;

    // Hindi meaning
    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#FF9933';
    ctx.fillText('हिंदी अर्थ:', 540, y);
    y += 40;
    ctx.font = '26px sans-serif';
    ctx.fillStyle = '#333';
    const hindiWords = shloka.hindiMeaning.split(' ');
    let hLine = '';
    for (const word of hindiWords) {
      const testLine = hLine + word + ' ';
      if (ctx.measureText(testLine).width > 900 && hLine !== '') {
        ctx.fillText(hLine, 540, y);
        hLine = word + ' ';
        y += 38;
      } else {
        hLine = testLine;
      }
    }
    ctx.fillText(hLine, 540, y);
    y += 60;

    // English meaning
    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#FF9933';
    ctx.fillText('English Meaning:', 540, y);
    y += 38;
    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#333';
    const engWords = shloka.englishMeaning.split(' ');
    let eLine = '';
    for (const word of engWords) {
      const testLine = eLine + word + ' ';
      if (ctx.measureText(testLine).width > 900 && eLine !== '') {
        ctx.fillText(eLine, 540, y);
        eLine = word + ' ';
        y += 36;
      } else {
        eLine = testLine;
      }
    }
    ctx.fillText(eLine, 540, y);

    // Footer
    ctx.font = 'bold 28px serif';
    ctx.fillStyle = '#FF9933';
    ctx.fillText('🙏 Sanatan Pro — Your Dharma Companion', 540, 1020);

    // Download
    const link = document.createElement('a');
    link.download = 'daily-shloka-sanatan-pro.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('Shloka image downloaded!');
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gold/40 shadow-gold p-4 space-y-3 divine-glow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌸</span>
          <h3 className="font-devanagari text-saffron font-semibold text-base">आज का श्लोक</h3>
        </div>
        <span className="text-xs bg-saffron/10 text-saffron px-2 py-1 rounded-full font-body">Daily Shloka</span>
      </div>

      {/* Sanskrit */}
      <div className="bg-gradient-to-br from-saffron/5 to-gold/10 rounded-xl p-3 border border-gold/20">
        <p className="font-devanagari text-base text-foreground leading-relaxed text-center">
          {shloka.sanskrit}
        </p>
      </div>

      {/* Hindi Meaning */}
      <div>
        <p className="text-xs font-semibold text-saffron mb-1 font-body">हिंदी अर्थ:</p>
        <p className="text-sm text-foreground/80 font-body leading-relaxed">{shloka.hindiMeaning}</p>
      </div>

      {/* English Meaning */}
      <div>
        <p className="text-xs font-semibold text-saffron mb-1 font-body">English Meaning:</p>
        <p className="text-sm text-foreground/80 font-body leading-relaxed italic">{shloka.englishMeaning}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="flex-1 gap-1.5 border-saffron/30 text-saffron hover:bg-saffron/10 font-body text-xs"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleShare}
          className="flex-1 gap-1.5 border-saffron/30 text-saffron hover:bg-saffron/10 font-body text-xs"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleGenerateImage}
          className="flex-1 gap-1.5 border-gold/40 text-gold-dark hover:bg-gold/10 font-body text-xs"
        >
          <Download className="h-3.5 w-3.5" />
          Image
        </Button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

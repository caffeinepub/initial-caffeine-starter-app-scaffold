import { useGetFestivals } from '../hooks/useQueries';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const festDate = new Date(dateStr);
  festDate.setHours(0, 0, 0, 0);
  const diff = festDate.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function FestivalCountdownCard() {
  const { data: festivals } = useGetFestivals();

  const upcomingFestivals = (festivals || [])
    .map(f => ({ ...f, daysUntil: getDaysUntil(f.date) }))
    .filter(f => f.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const nextFestival = upcomingFestivals[0];

  const handleShareCard = () => {
    if (!nextFestival) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 540;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 1080, 540);
    grad.addColorStop(0, '#FF9933');
    grad.addColorStop(1, '#FFD700');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 540);

    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.arc(900, 100, 200, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 80px serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('🎉', 540, 120);

    ctx.font = 'bold 56px serif';
    ctx.fillText(nextFestival.name, 540, 220);

    ctx.font = 'bold 100px sans-serif';
    ctx.fillText(nextFestival.daysUntil === 0 ? 'TODAY!' : `${nextFestival.daysUntil}`, 540, 360);

    ctx.font = '36px sans-serif';
    ctx.fillText(nextFestival.daysUntil === 0 ? '' : 'days remaining', 540, 420);

    ctx.font = 'bold 28px serif';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText('🙏 Sanatan Pro', 540, 500);

    const link = document.createElement('a');
    link.download = `${nextFestival.name}-countdown.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('Festival card downloaded!');
  };

  if (!nextFestival) {
    return (
      <div className="bg-gradient-to-r from-saffron to-gold rounded-2xl p-4 text-white text-center">
        <p className="font-devanagari text-lg">🎉 Har Har Mahadev!</p>
        <p className="text-sm font-body opacity-90">Every day is a celebration of Dharma</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-saffron to-gold rounded-2xl p-4 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-body opacity-80 mb-1">🎉 Upcoming Festival</p>
            <h3 className="font-devanagari text-xl font-bold">{nextFestival.name}</h3>
            <p className="text-sm font-body opacity-90 mt-1">{nextFestival.description}</p>
          </div>
          <div className="text-center bg-white/20 rounded-xl px-3 py-2 min-w-[64px]">
            <p className="text-3xl font-bold font-body">
              {nextFestival.daysUntil === 0 ? '🎊' : nextFestival.daysUntil}
            </p>
            <p className="text-xs font-body opacity-90">
              {nextFestival.daysUntil === 0 ? 'Today!' : 'days'}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs font-body opacity-70">{nextFestival.date}</p>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleShareCard}
            className="text-white hover:bg-white/20 gap-1 text-xs h-7 font-body"
          >
            <Download className="h-3 w-3" />
            Share Card
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useGetDharmaQuote } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function DailyDharmaQuote() {
  const { data: quote, isLoading } = useGetDharmaQuote();

  const fallbackQuote = {
    englishText: "The soul is never born nor dies at any time. It is unborn, eternal, ever-existing, and primeval.",
    hindiText: "आत्मा न कभी जन्म लेती है और न ही मरती है। यह अजन्मा, नित्य, शाश्वत और पुरातन है।",
    author: "Bhagavad Gita 2.20",
  };

  const displayQuote = quote || fallbackQuote;

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, oklch(0.35 0.14 20), oklch(0.45 0.16 30))',
        border: '1px solid oklch(0.82 0.18 80 / 0.3)',
      }}
    >
      <div className="mandala-bg" style={{ opacity: 0.06 }} />
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <span className="text-xl">✨</span>
        <h3 className="font-heading text-base" style={{ color: '#FFD700' }}>
          आज का धर्म विचार
        </h3>
      </div>

      {isLoading ? (
        <div className="space-y-2 relative z-10">
          <Skeleton className="h-4 w-full opacity-30" />
          <Skeleton className="h-4 w-3/4 opacity-30" />
        </div>
      ) : (
        <div className="relative z-10 space-y-2">
          <p className="text-sm italic leading-relaxed" style={{ color: '#FFD700' }}>
            "{displayQuote.hindiText}"
          </p>
          <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.82 0.18 80 / 0.7)' }}>
            "{displayQuote.englishText}"
          </p>
          <p className="text-xs font-semibold text-right" style={{ color: 'oklch(0.72 0.19 55)' }}>
            — {displayQuote.author}
          </p>
        </div>
      )}
    </div>
  );
}

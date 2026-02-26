import { useGetDharmaQuoteOfDay } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function DailyDharmaQuote() {
  const { data: quote, isLoading } = useGetDharmaQuoteOfDay();

  // Fallback quotes if backend has none
  const fallbackQuote = {
    englishText: "The soul is never born nor dies at any time. It has not come into being, does not come into being, and will not come into being. It is unborn, eternal, ever-existing, and primeval.",
    hindiText: "आत्मा न कभी जन्म लेती है और न ही मरती है। यह अजन्मा, नित्य, शाश्वत और पुरातन है।",
    author: "Bhagavad Gita 2.20",
  };

  const displayQuote = quote || fallbackQuote;

  return (
    <div className="bg-gradient-to-br from-gold/10 to-saffron/5 rounded-2xl border-2 border-gold/30 p-4 space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">✨</span>
        <h3 className="font-devanagari text-saffron font-semibold text-sm">आज का धर्म विचार</h3>
        <span className="text-xs bg-gold/20 text-foreground/70 px-2 py-0.5 rounded-full font-body ml-auto">Daily Quote</span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : (
        <>
          <p className="text-sm font-body text-foreground/80 italic leading-relaxed">
            "{displayQuote.englishText}"
          </p>
          <p className="text-sm font-body text-foreground/70 leading-relaxed">
            "{displayQuote.hindiText}"
          </p>
          <p className="text-xs font-semibold text-saffron font-body text-right">
            — {displayQuote.author}
          </p>
        </>
      )}
    </div>
  );
}

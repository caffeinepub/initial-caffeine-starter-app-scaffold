import { Link } from '@tanstack/react-router';

interface AartiCardProps {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export default function AartiCard({ id, name, emoji, color }: AartiCardProps) {
  return (
    <Link
      to="/aarti/$id"
      params={{ id }}
      className="shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 border-saffron/20 bg-white hover:border-saffron hover:shadow-saffron transition-all duration-200 w-24 active:scale-95"
    >
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md ${color}`}
      >
        {emoji}
      </div>
      <span className="text-xs font-medium text-center text-foreground font-body leading-tight line-clamp-2">
        {name}
      </span>
    </Link>
  );
}

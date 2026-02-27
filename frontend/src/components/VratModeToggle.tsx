import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';

interface VratModeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function VratModeToggle({ enabled, onToggle }: VratModeToggleProps) {
  return (
    <div
      className={`rounded-2xl border p-4 transition-all ${
        enabled
          ? 'bg-amber-50 border-amber-300 dark:bg-amber-950/30 dark:border-amber-700'
          : 'bg-card border-border'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              enabled
                ? 'bg-amber-200 dark:bg-amber-800'
                : 'bg-muted'
            }`}
          >
            {enabled ? (
              <Moon className="w-5 h-5 text-amber-700 dark:text-amber-300" />
            ) : (
              <Sun className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">
              {enabled ? 'व्रत मोड सक्रिय' : 'व्रत मोड'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {enabled
                ? 'ब्रह्म मुहूर्त, उपवास ट्रैकर और एकादशी रिमाइंडर'
                : 'व्रत और उपवास के लिए विशेष सुविधाएं'}
            </p>
          </div>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          className={enabled ? 'data-[state=checked]:bg-amber-500' : ''}
        />
      </div>
    </div>
  );
}

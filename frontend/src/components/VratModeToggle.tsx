import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface VratModeToggleProps {
  enabled: boolean;
  onToggle: (val: boolean) => void;
}

export default function VratModeToggle({ enabled, onToggle }: VratModeToggleProps) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
      enabled ? 'border-saffron bg-saffron/5' : 'border-border bg-white'
    }`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">🌙</span>
        <div>
          <Label className="font-devanagari text-sm font-semibold text-foreground cursor-pointer">
            व्रत मोड (Vrat Mode)
          </Label>
          <p className="text-xs text-muted-foreground font-body">
            {enabled ? 'Active — Fasting tracker enabled' : 'Enable for fasting reminders'}
          </p>
        </div>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-saffron"
      />
    </div>
  );
}

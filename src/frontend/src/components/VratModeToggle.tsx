import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import React from "react";

interface VratModeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function VratModeToggle({
  enabled,
  onToggle,
}: VratModeToggleProps) {
  return (
    <div
      className="rounded-xl border p-4 transition-all duration-300"
      style={
        enabled
          ? {
              background:
                "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(249,115,22,0.08))",
              borderColor: "rgba(245,158,11,0.4)",
              boxShadow: "0 0 20px rgba(245,158,11,0.15)",
            }
          : {
              background:
                "linear-gradient(135deg, oklch(16% 0.025 240), oklch(19% 0.03 250))",
              borderColor: "rgba(255,255,255,0.08)",
            }
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={
              enabled
                ? {
                    background:
                      "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(249,115,22,0.15))",
                    border: "1px solid rgba(245,158,11,0.4)",
                    boxShadow: "0 0 12px rgba(245,158,11,0.3)",
                  }
                : {
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }
            }
          >
            {enabled ? (
              <Moon size={18} style={{ color: "#f59e0b" }} />
            ) : (
              <Sun size={18} className="text-muted-foreground" />
            )}
          </div>
          <div>
            <p
              className={`font-semibold text-sm ${enabled ? "text-gold-400" : "text-foreground"}`}
              style={enabled ? { color: "#f59e0b" } : {}}
            >
              व्रत मोड
            </p>
            <p className="text-xs text-muted-foreground">
              {enabled ? "व्रत मोड सक्रिय है" : "व्रत के दिन सक्रिय करें"}
            </p>
          </div>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          className={enabled ? "data-[state=checked]:bg-amber-500" : ""}
        />
      </div>
    </div>
  );
}

// Enhanced alert banner for critical accuracy drops - dramatic and attention-grabbing.
// Indicates potential sabotage with urgent visual design and animations.

import { useEffect, useState } from "react";
import { useGameStore } from "../store/game.js";
import type { AccuracyAlertPayload } from "starbite-shared";

// Station-specific theming for alerts
const STATION_ALERT_CONFIG = {
  grill: { icon: "🔥", color: "from-red-600 to-orange-600", name: "Grill Bot" },
  trash: { icon: "🗑️", color: "from-red-600 to-green-600", name: "Trash Sorter" },
  review: { icon: "🔍", color: "from-red-600 to-blue-600", name: "Review & Security" }
};

function AlertContent({ alert, onDismiss }: { alert: AccuracyAlertPayload; onDismiss: () => void }) {
  const config = STATION_ALERT_CONFIG[alert.stationId as keyof typeof STATION_ALERT_CONFIG] ||
    { icon: "⚠️", color: "from-red-600 to-red-700", name: alert.stationId.toUpperCase() };

  const dropAmount = alert.oldAccuracy - alert.newAccuracy;
  const severity = dropAmount >= 30 ? "CRITICAL" : dropAmount >= 20 ? "SEVERE" : "WARNING";
  const severityColor = severity === "CRITICAL" ? "text-red-100" : severity === "SEVERE" ? "text-orange-100" : "text-yellow-100";

  return (
    <div className={`
      relative overflow-hidden rounded-2xl shadow-2xl border-2 border-red-400/50
      bg-gradient-to-r ${config.color} p-6 text-white min-w-[400px] max-w-[500px]
      animate-[slideDownShake_0.6s_ease-out]
    `}>
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-red-500/20 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_infinite]"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl animate-bounce">{config.icon}</div>
            <div>
              <div className={`text-xs font-bold ${severityColor} uppercase tracking-wider`}>
                {severity} ALERT
              </div>
              <div className="text-lg font-bold">
                {config.name}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs opacity-80">Accuracy Drop</div>
              <div className="text-2xl font-bold text-red-200">
                -{dropAmount}%
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="text-white/80 hover:text-white bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center transition-colors z-20"
              title="Dismiss alert"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Main message */}
        <div className="text-center mb-2">
          <div className="text-lg font-bold mb-1">
            Station accuracy plummeted!
          </div>
          <div className="text-sm opacity-90">
            <span className="font-mono bg-white/20 px-2 py-1 rounded">{alert.oldAccuracy}%</span>
            {" → "}
            <span className="font-mono bg-white/20 px-2 py-1 rounded">{alert.newAccuracy}%</span>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center text-sm bg-white/10 rounded-lg py-2 px-4 animate-pulse">
          <strong>🚨 Investigate immediately!</strong> Check the Review Station for suspicious labels.
        </div>
      </div>

      {/* Side warning stripes */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-yellow-400 via-orange-400 to-red-400 animate-pulse"></div>
      <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-yellow-400 via-orange-400 to-red-400 animate-pulse"></div>
    </div>
  );
}

export function AlertBanner() {
  const alerts = useGameStore((s) => s.accuracyAlerts);
  const [show, setShow] = useState<AccuracyAlertPayload | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const last = alerts[alerts.length - 1];
    if (!last) return;

    // TODO: Play urgent alert sound when Helper 5 provides audio files
    // playSound('sfx_accuracy_alert.mp3');

    setShow(last);
    setIsExiting(false);

    // Start exit animation before hiding
    const exitTimer = setTimeout(() => setIsExiting(true), 5000);
    const hideTimer = setTimeout(() => setShow(null), 5500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, [alerts]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Dramatic backdrop blur */}
      <div className="absolute inset-0 bg-red-900/20 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]"></div>

      {/* Alert banner */}
      <div className={`
        absolute top-20 left-1/2 -translate-x-1/2 pointer-events-auto
        ${isExiting ? 'animate-[slideUpFade_0.5s_ease-in_forwards]' : ''}
      `}>
        <AlertContent alert={show} onDismiss={() => setShow(null)} />
      </div>

      {/* Emergency flash overlay */}
      <div className="absolute inset-0 bg-red-500/30 animate-[emergencyFlash_0.1s_ease-in-out_3] pointer-events-none"></div>
    </div>
  );
}

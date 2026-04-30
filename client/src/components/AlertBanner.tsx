// Top-of-screen banner for sudden accuracy drops.
// "Station accuracy dropped! Someone might be giving wrong labels!"

import { useEffect, useState } from "react";
import { useGameStore } from "../store/game.js";
import type { AccuracyAlertPayload } from "starbite-shared";

export function AlertBanner() {
  const alerts = useGameStore((s) => s.accuracyAlerts);
  const [show, setShow] = useState<AccuracyAlertPayload | null>(null);

  useEffect(() => {
    const last = alerts[alerts.length - 1];
    if (!last) return;
    setShow(last);
    const t = setTimeout(() => setShow(null), 6000);
    return () => clearTimeout(t);
  }, [alerts]);

  if (!show) return null;

  return (
    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 bg-diner-bad text-white px-6 py-3 rounded-xl shadow-2xl text-sm font-bold animate-pulse">
      ⚠️ {show.stationId.toUpperCase()} accuracy dropped from {show.oldAccuracy}%
      to {show.newAccuracy}%. Check the data!
    </div>
  );
}

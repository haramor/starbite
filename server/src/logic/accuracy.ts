// Pure functions for the probabilistic accuracy model.
// Per design doc:
//   - each LabelSubmission contributes 100% (correct) or 0% (wrong)
//   - flagged submissions don't count
//   - example accuracy = mean of its non-flagged submissions
//   - station accuracy = mean of its examples' accuracies (only counting examples with at least one non-flagged label)
//
// If a station has zero labeled examples, accuracy is reported as 100 (no data → no errors yet).
// This is a UI-friendly default; real ML would say "unknown".

import type { TrainingExample, Station } from "starbite-shared";

export function computeExampleAccuracy(example: TrainingExample): number {
  const live = example.submissions.filter((s) => !s.flagged);
  if (live.length === 0) return -1; // sentinel: no data
  const correct = live.filter((s) => s.isCorrect).length;
  return Math.round((correct / live.length) * 100);
}

export function computeStationAccuracy(station: Station): number {
  const accuracies: number[] = [];
  for (const ex of station.examples) {
    const a = computeExampleAccuracy(ex);
    if (a >= 0) accuracies.push(a);
  }
  if (accuracies.length === 0) return 100;
  const sum = accuracies.reduce((a, b) => a + b, 0);
  return Math.round(sum / accuracies.length);
}

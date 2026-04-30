// Customer cycle logic: pick an order, roll outcomes per station, set satisfaction delta.
//
// Per design doc:
//   - every CUSTOMER_CYCLE_MS, a customer arrives with an order touching N stations
//   - each station independently "rolls" (Math.random < accuracy/100) for success
//   - happy = all stations rolled success
//   - confused = exactly one station rolled failure
//   - angry = 2+ stations rolled failure
//   - one-station orders skip "confused"; they're either happy or angry
//
// Returns the rolled outcomes; caller writes them into state.

import {
  CUSTOMER_OUTCOME,
  SATISFACTION_HAPPY_GAIN,
  SATISFACTION_CONFUSED_LOSS,
  SATISFACTION_ANGRY_LOSS,
  type CustomerOutcome,
  type OrderTemplate,
  type CustomerProfile,
} from "starbite-shared";
import type { Station } from "starbite-shared";

export interface RolledStationOutcome {
  stationId: string;
  rolledProbability: number;
  success: boolean;
}

export interface RolledCustomerOutcome {
  outcome: CustomerOutcome;
  perStation: RolledStationOutcome[];
  satisfactionDelta: number;
}

export function pickOrder(orders: OrderTemplate[], customers: CustomerProfile[]) {
  if (orders.length === 0) return null;
  const order = orders[Math.floor(Math.random() * orders.length)];
  const customer =
    customers.length > 0
      ? customers[Math.floor(Math.random() * customers.length)]
      : { id: "default", name: order.customerName, emoji: "👽", color: "#cccccc" };
  return { order, customer };
}

export function rollCustomerOutcome(
  order: OrderTemplate,
  stationLookup: (id: string) => Station | undefined
): RolledCustomerOutcome {
  const perStation: RolledStationOutcome[] = [];
  let failures = 0;

  for (const req of order.requirements) {
    const station = stationLookup(req.stationId);
    const acc = station ? station.accuracy : 100;
    const probability = Math.max(0, Math.min(1, acc / 100));
    const roll = Math.random();
    const success = roll < probability;
    if (!success) failures++;
    perStation.push({
      stationId: req.stationId,
      rolledProbability: probability,
      success,
    });
  }

  let outcome: CustomerOutcome;
  let satisfactionDelta: number;
  if (failures === 0) {
    outcome = CUSTOMER_OUTCOME.HAPPY;
    satisfactionDelta = SATISFACTION_HAPPY_GAIN;
  } else if (failures === 1 && perStation.length > 1) {
    outcome = CUSTOMER_OUTCOME.CONFUSED;
    satisfactionDelta = SATISFACTION_CONFUSED_LOSS;
  } else {
    outcome = CUSTOMER_OUTCOME.ANGRY;
    satisfactionDelta = SATISFACTION_ANGRY_LOSS;
  }

  return { outcome, perStation, satisfactionDelta };
}

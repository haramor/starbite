// Loads /content/*.json into memory at server start.
// Helper 1 fills these JSON files in. The server reads them once and serves
// examples to clients on demand.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import type { GrillItem, TrashItem, OrderTemplate, CustomerProfile } from "starbite-shared";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// /server/dist/content -> ../../../content   OR   /server/src/content -> ../../../content
const CONTENT_DIR = path.resolve(__dirname, "..", "..", "..", "content");

export interface ContentBundle {
  grill: GrillItem[];
  trash: TrashItem[];
  orders: OrderTemplate[];
  customers: CustomerProfile[];
}

async function loadJSON<T>(filename: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(path.join(CONTENT_DIR, filename), "utf8");
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[content] failed to load ${filename}, using fallback`, err);
    return fallback;
  }
}

export async function loadContent(): Promise<ContentBundle> {
  const [grill, trash, orders, customers] = await Promise.all([
    loadJSON<GrillItem[]>("grill.json", []),
    loadJSON<TrashItem[]>("trash.json", []),
    loadJSON<OrderTemplate[]>("orders.json", []),
    loadJSON<CustomerProfile[]>("customers.json", []),
  ]);
  console.log(
    `[content] loaded grill=${grill.length}, trash=${trash.length}, orders=${orders.length}, customers=${customers.length}`
  );
  return { grill, trash, orders, customers };
}

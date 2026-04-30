// Types for the content JSON files in /content/.
// Helpers fill these files in; server loads them at startup.

export interface GrillItem {
  id: string;                 // "g_001"
  emoji: string;              // "🍔"
  description: string;        // "Burger, dark sear, juices running clear"
  groundTruth: "rare" | "done";
  // optional image URL if we replace emoji later
  imageUrl?: string;
}

export interface TrashItem {
  id: string;                 // "t_001"
  name: string;               // "Banana peel"
  emoji: string;              // "🍌"
  groundTruth: "recycle" | "compost" | "landfill";
  imageUrl?: string;
}

export type AnyContentItem = GrillItem | TrashItem;

// A customer order is a recipe of station outputs.
export interface OrderRequirement {
  stationId: string;          // "grill" | "trash"
  expectedValue: string;      // "rare" | "compost" | etc.
}

export interface OrderTemplate {
  id: string;                 // "o_001"
  customerName: string;       // "Captain Zorp"
  flavorText: string;         // "I'll have a rare burger and recycle the wrapper, please."
  requirements: OrderRequirement[];
}

export interface CustomerProfile {
  id: string;
  name: string;
  emoji: string;              // 👽 🤖 etc.
  color: string;              // hex code for sprite tint
}

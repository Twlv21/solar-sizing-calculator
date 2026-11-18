export type Appliance = { id: string; name: string; watts: number; qty: number; hours: number };

export const APPLIANCE_PRESETS: Omit<Appliance, "qty">[] = [
  { id: "led", name: "LED bulb", watts: 12, hours: 6 },
  { id: "fan-stand", name: "Standing fan", watts: 60, hours: 8 },
  { id: "fan-ceiling", name: "Ceiling fan", watts: 75, hours: 8 },
  { id: "tv", name: '55" LED TV', watts: 120, hours: 6 },
  { id: "decoder", name: "Decoder / soundbar", watts: 40, hours: 6 },
  { id: "router", name: "Wi‑Fi router", watts: 15, hours: 24 },
  { id: "laptop", name: "Laptop", watts: 65, hours: 6 },
  { id: "fridge", name: "Refrigerator", watts: 200, hours: 10 },
  { id: "freezer", name: "Deep freezer", watts: 300, hours: 10 },
  { id: "ac1", name: "1HP inverter AC", watts: 1000, hours: 6 },
  { id: "ac15", name: "1.5HP inverter AC", watts: 1400, hours: 6 },
  { id: "washer", name: "Washing machine", watts: 500, hours: 1 },
  { id: "pump", name: "Borehole pump (1HP)", watts: 750, hours: 1 },
  { id: "iron", name: "Pressing iron", watts: 1000, hours: 0.5 },
];

export const INVERTER_SIZES_KVA = [1.5, 2.5, 3.5, 5, 7.5, 10, 15];
export const BATTERY_UNIT_KWH = 5.12;
export const PANEL_WATTS = 550;
export const PEAK_SUN_HOURS = 5;

// Estimated Nigerian market pricing (Naira)
export const DEFAULT_PRICES = {
  inverterPerKva: 350_000,
  battery: 1_100_000,
  panel: 160_000,
  installRate: 0.15,
};

export function sizeSystem(items: Appliance[], prices = DEFAULT_PRICES) {
  const loadW = items.reduce((s, a) => s + a.watts * a.qty, 0);
  const dailyWh = items.reduce((s, a) => s + a.watts * a.qty * a.hours, 0);
  const neededKva = (loadW * 1.25) / 0.8 / 1000;
  const inverterKva = loadW === 0 ? 0 : (INVERTER_SIZES_KVA.find((k) => k >= neededKva) ?? Math.ceil(neededKva));
  const batteries = dailyWh === 0 ? 0 : Math.max(1, Math.ceil((dailyWh * 0.6) / 0.9 / 1000 / BATTERY_UNIT_KWH));
  const panels = dailyWh === 0 ? 0 : Math.max(2, Math.ceil(dailyWh / (PEAK_SUN_HOURS * 0.75) / PANEL_WATTS));
  const equipment = inverterKva * prices.inverterPerKva + batteries * prices.battery + panels * prices.panel;
  const total = equipment * (1 + prices.installRate);

  return {
    loadW,
    dailyWh,
    inverterKva,
    batteries,
    batteryKwh: +(batteries * BATTERY_UNIT_KWH).toFixed(2),
    panels,
    costLow: Math.round((total * 0.9) / 10_000) * 10_000,
    costHigh: Math.round((total * 1.1) / 10_000) * 10_000,
  };
}

export function savings(monthlySpend: number, systemCost: number) {
  const monthly = Math.round(monthlySpend * 0.8);
  return {
    monthly,
    yearly: monthly * 12,
    paybackYears: monthly > 0 && systemCost > 0 ? +(systemCost / (monthly * 12)).toFixed(1) : null,
  };
}

export const naira = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");

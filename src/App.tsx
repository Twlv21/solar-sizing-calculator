import { useMemo, useState } from "react";
import { Minus, Plus, Trash2, Sun, Zap, Check, Copy, Share2 } from "lucide-react";
import { APPLIANCE_PRESETS, PANEL_WATTS, naira, savings, sizeSystem, type Appliance } from "./lib/solar";
import { GlassBackdrop } from "./components/GlassBackdrop";

const defaultAppliances: Appliance[] = [
  { id: "led", name: "LED bulb", watts: 12, qty: 8, hours: 6 },
  { id: "fan-stand", name: "Standing fan", watts: 60, qty: 3, hours: 8 },
  { id: "tv", name: '55" LED TV', watts: 120, qty: 1, hours: 6 },
  { id: "fridge", name: "Refrigerator", watts: 200, qty: 1, hours: 10 },
  { id: "router", name: "Wi‑Fi router", watts: 15, qty: 1, hours: 24 },
];

export default function App() {
  const [items, setItems] = useState<Appliance[]>(defaultAppliances);
  const [custom, setCustom] = useState({ name: "", watts: "" });
  const [spend, setSpend] = useState(80_000);
  const [copied, setCopied] = useState(false);

  const r = useMemo(() => sizeSystem(items), [items]);
  const s = savings(spend, (r.costLow + r.costHigh) / 2);

  const update = (id: string, patch: Partial<Appliance>) => {
    setItems((xs) =>
      xs
        .map((a) => (a.id === id ? { ...a, ...patch } : a))
        .filter((a) => a.qty > 0)
    );
  };

  const add = (p: Omit<Appliance, "qty">) => {
    setItems((xs) =>
      xs.some((a) => a.id === p.id)
        ? xs.map((a) => (a.id === p.id ? { ...a, qty: a.qty + 1 } : a))
        : [...xs, { ...p, qty: 1 }]
    );
  };

  const summaryText = [
    `Solar Sizing Summary:`,
    `• Load: ${r.loadW.toLocaleString()} W (${(r.dailyWh / 1000).toFixed(1)} kWh/day)`,
    `• Inverter: ${r.inverterKva} kVA pure sine wave`,
    `• Battery: ${r.batteryKwh} kWh Lithium (${r.batteries} unit${r.batteries > 1 ? "s" : ""})`,
    `• Solar Panels: ${r.panels} × ${PANEL_WATTS}W`,
    `• Estimated Cost: ${naira(r.costLow)} – ${naira(r.costHigh)}`,
    `• Selected Appliances: ` + items.map((a) => `${a.qty}x ${a.name}`).join(", "),
  ].join("\n");

  const copySummary = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Hello, here is my solar sizing estimate:\n\n${summaryText}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="relative min-h-screen">
      <GlassBackdrop />

      {/* Header */}
      <header className="border-b border-border/70 bg-card/70 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-sun text-sun-foreground shadow-sm">
              <Sun className="size-5" />
            </div>
            <div>
              <span className="font-display font-bold text-lg leading-none">SolarCalc</span>
              <span className="block text-xs text-muted-foreground">Solar Sizing & Load Tool (₦)</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copySummary}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold hover:border-sun transition"
            >
              {copied ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
              {copied ? "Copied!" : "Copy Summary"}
            </button>
            <button
              onClick={shareWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              <Share2 className="size-3.5" />
              Share
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold sm:text-4xl text-foreground">
            Solar Sizing & Cost Calculator
          </h1>
          <p className="mt-2.5 text-base text-muted-foreground">
            Add the appliances you want to run on solar, specify quantities and operating hours.
            We'll calculate the right inverter, lithium battery, solar panel requirements and estimated cost in Naira (₦).
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_390px]">
          {/* Left Column: Appliances */}
          <div className="space-y-6">
            {/* Quick Presets */}
            <div className="glass-card rounded-2xl border border-border/80 p-5 shadow-sm">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Zap className="size-4 text-sun" />
                Tap to add common appliances
              </h2>
              <div className="mt-3.5 flex flex-wrap gap-2">
                {APPLIANCE_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => add(p)}
                    className="glass-chip rounded-full border border-border/70 px-3 py-1.5 text-xs font-medium hover:border-sun hover:bg-card transition"
                  >
                    + {p.name} <span className="text-muted-foreground ml-1">({p.watts}W)</span>
                  </button>
                ))}
              </div>

              {/* Custom appliance form */}
              <form
                className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-border/60"
                onSubmit={(e) => {
                  e.preventDefault();
                  const w = Number(custom.watts);
                  if (!custom.name.trim() || !(w > 0 && w <= 20000)) return;
                  add({ id: `c-${Date.now()}`, name: custom.name.trim().slice(0, 40), watts: w, hours: 4 });
                  setCustom({ name: "", watts: "" });
                }}
              >
                <input
                  value={custom.name}
                  onChange={(e) => setCustom({ ...custom, name: e.target.value })}
                  placeholder="Custom appliance name"
                  maxLength={40}
                  className="glass-field min-w-0 flex-1 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-sun"
                />
                <input
                  value={custom.watts}
                  onChange={(e) => setCustom({ ...custom, watts: e.target.value })}
                  placeholder="Watts (W)"
                  type="number"
                  min={1}
                  max={20000}
                  className="glass-field w-28 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-sun"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Appliance table */}
            <div className="glass-card rounded-2xl border border-border/80 overflow-hidden shadow-sm">
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 border-b border-border/70 bg-card/40 px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">
                <span>Appliance</span>
                <span className="w-24 text-center">Qty</span>
                <span className="w-20 text-center">Hours/day</span>
                <span className="w-8" />
              </div>

              {items.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No appliances selected. Click any preset above or enter a custom appliance.
                </p>
              ) : (
                <div className="divide-y divide-border/60">
                  {items.map((a) => (
                    <div key={a.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 px-5 py-3.5 hover:bg-card/30 transition">
                      <div>
                        <p className="font-semibold text-sm text-foreground">{a.name}</p>
                        <p className="text-xs text-muted-foreground">{a.watts} W each</p>
                      </div>
                      <div className="flex w-24 items-center justify-center gap-1.5">
                        <button
                          aria-label={`Decrease ${a.name}`}
                          onClick={() => update(a.id, { qty: a.qty - 1 })}
                          className="glass-chip grid size-7 place-items-center rounded-lg border border-border hover:border-sun"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{a.qty}</span>
                        <button
                          aria-label={`Increase ${a.name}`}
                          onClick={() => update(a.id, { qty: a.qty + 1 })}
                          className="glass-chip grid size-7 place-items-center rounded-lg border border-border hover:border-sun"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <div className="w-20 flex justify-center">
                        <input
                          type="number"
                          min={0}
                          max={24}
                          step={0.5}
                          value={a.hours}
                          onChange={(e) =>
                            update(a.id, { hours: Math.min(24, Math.max(0, Number(e.target.value))) })
                          }
                          className="glass-field w-16 rounded-lg border border-border px-2 py-1 text-center text-sm outline-none focus:border-sun font-medium"
                        />
                      </div>
                      <div className="w-8 flex justify-end">
                        <button
                          aria-label={`Remove ${a.name}`}
                          onClick={() => update(a.id, { qty: 0 })}
                          className="text-muted-foreground hover:text-destructive transition p-1"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sizing Results & Savings */}
          <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            {/* Recommendation card */}
            <div className="glass-deep rounded-2xl border border-primary-foreground/20 p-6 text-primary-foreground shadow-lg">
              <p className="text-xs font-medium uppercase tracking-wider opacity-80">Total Running Load</p>
              <p className="font-display text-3xl font-extrabold mt-1">{r.loadW.toLocaleString()} W</p>
              <p className="text-xs opacity-85 mt-0.5">{(r.dailyWh / 1000).toFixed(1)} kWh daily consumption</p>

              <dl className="mt-5 space-y-2.5 border-t border-primary-foreground/15 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="opacity-85">Recommended Inverter</dt>
                  <dd className="font-bold">{r.inverterKva ? `${r.inverterKva} kVA pure sine` : "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="opacity-85">Lithium Battery Capacity</dt>
                  <dd className="font-bold">{r.batteries ? `${r.batteryKwh} kWh (${r.batteries} unit${r.batteries > 1 ? "s" : ""})` : "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="opacity-85">Solar Panels</dt>
                  <dd className="font-bold">{r.panels ? `${r.panels} × ${PANEL_WATTS}W (${((r.panels * PANEL_WATTS) / 1000).toFixed(1)}kW)` : "—"}</dd>
                </div>
              </dl>

              <div className="mt-5 rounded-xl bg-sun p-4 text-sun-foreground">
                <p className="text-[11px] font-bold uppercase tracking-wider">Estimated System Cost (₦)</p>
                <p className="font-display text-2xl font-extrabold mt-0.5">
                  {r.loadW ? `${naira(r.costLow)} – ${naira(r.costHigh)}` : "—"}
                </p>
                <p className="text-[11px] mt-1 opacity-80">Includes inverter, lithium storage, panels & estimated installation.</p>
              </div>

              <button
                onClick={shareWhatsApp}
                className="mt-4 w-full rounded-xl bg-primary-foreground py-3 text-center text-sm font-bold text-primary hover:bg-white transition flex items-center justify-center gap-2"
              >
                <Share2 className="size-4" />
                Share Estimate via WhatsApp
              </button>
            </div>

            {/* Savings Calculator */}
            <div className="glass-card rounded-2xl border border-border/80 p-6 shadow-sm">
              <h2 className="text-base font-bold">Estimated Savings vs Grid/Fuel</h2>
              <label htmlFor="spend" className="mt-2.5 block text-xs text-muted-foreground">
                Current monthly spend on NEPA bills + generator fuel
              </label>
              <p className="font-display text-2xl font-extrabold mt-1 text-foreground">{naira(spend)}</p>

              <input
                id="spend"
                type="range"
                min={10_000}
                max={1_000_000}
                step={5_000}
                value={spend}
                onChange={(e) => setSpend(Number(e.target.value))}
                className="mt-3 w-full accent-amber-500 cursor-pointer"
              />

              <dl className="mt-4 space-y-2 border-t border-border/60 pt-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Est. Monthly Savings</dt>
                  <dd className="font-bold text-foreground">{naira(s.monthly)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Est. Yearly Savings</dt>
                  <dd className="font-bold text-foreground">{naira(s.yearly)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Payback Period</dt>
                  <dd className="font-bold text-foreground">
                    {s.paybackYears && r.loadW ? `~${s.paybackYears} years` : "—"}
                  </dd>
                </div>
              </dl>
            </div>

            <p className="rounded-xl border border-border/70 bg-card/60 px-3.5 py-2.5 text-xs text-muted-foreground">
              Note: Sizing calculations assume standard Nigerian insolation (~5 peak sun hours) and 5.12kWh lithium battery units.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}

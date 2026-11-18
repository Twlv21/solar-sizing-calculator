# Solar Sizing & Load Calculator (₦)

A modern, responsive web application for estimating solar power system sizing, equipment requirements, and costs tailored for Nigerian households and small businesses.

Live demo & repo: Built with React, TypeScript, and Tailwind CSS.

## Features

- **Appliance Load Calculator**: Select from common presets (LED bulbs, fans, refrigerators, inverter ACs, TVs, pumps) or add custom appliances.
- **Accurate Capacity Sizing**:
  - Continuous running load in Watts (W)
  - Daily energy consumption in kWh
  - Sized pure sine wave inverter in kVA (with 1.25x surge margin and 0.8 power factor)
  - Lithium battery capacity in kWh (5.12kWh unit blocks with 90% DoD and 60% night-time usage factor)
  - 550W Tier-1 solar panel array count (sized for 5 peak sun hours in Nigeria)
- **Naira (₦) Cost Estimations**: Equipment estimates including inverter, lithium storage, solar panels, and standard installation rates.
- **Generator & Grid Savings Calculator**: Compare monthly NEPA and generator fuel expenditure to estimate monthly/yearly savings and investment payback period.
- **Quick Sharing**: One-click summary copy to clipboard or formatted message to WhatsApp.

## Sizing Logic & Assumptions

- **Peak Sun Hours**: 5.0 hours (average Nigerian solar irradiance)
- **Battery Units**: 5.12 kWh 48V/100Ah Lithium iron phosphate (LiFePO4)
- **Solar Panels**: 550W Monocrystalline panels (75% system performance ratio)
- **Inverter Sizes**: 1.5 kVA, 2.5 kVA, 3.5 kVA, 5.0 kVA, 7.5 kVA, 10 kVA, 15 kVA

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or pnpm / yarn

### Installation

```bash
git clone https://github.com/Twlv21/solar-sizing-calculator.git
cd solar-sizing-calculator
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

## License

MIT

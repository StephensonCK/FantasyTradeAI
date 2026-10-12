# Fantasy Trade AI

A fantasy football trade analyzer for **redraft** leagues. Pick the players on each side of a trade and see whether it is fair, using real market values.

## How it works

- **Values** come from [FantasyCalc](https://fantasycalc.com)'s public API, requested for your scoring (Standard / Half PPR / PPR), QB setting (1 QB / Superflex) and league size. They are cached in localStorage for 6 hours and fall back to the saved copy if the network fails.
- **Verdict** (`src/utils/tradeValue.ts`): each side's players are summed, with a depth discount (10% per extra asset, floor 50%) because only so many players start. Sides within 5% of each other are called even. The discount is a rule of thumb, not fitted to data.
- **Suggestions**: when a trade is lopsided, the app lists players who would bring it closest to even and adds them with one click.

## Development

```bash
npm install
npm run dev     # local dev server
npm test        # unit tests (vitest)
npm run build   # type-check and production build
```

## Layout

```
src/
  services/fantasyCalc.ts   FantasyCalc fetch, parse, cache
  utils/tradeValue.ts       trade evaluation and balancing suggestions
  types/value.ts            shared types
  hooks/                    useValues, useTheme, useLocalStorage
  components/               SettingsBar, TradePanel, PlayerSearch, Verdict
  __tests__/                service and evaluator tests
```

Stack: React 18, TypeScript, Vite, Tailwind CSS 3, Geist (self-hosted via Fontsource), Lucide icons.

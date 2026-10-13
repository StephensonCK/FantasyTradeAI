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

## Design and accessibility

Football playbook styling in light and dark themes, with self-hosted Barlow Condensed and Geist fonts. The accessibility target is WCAG 2.2 AA, following https://www.w3.org/WAI/WCAG22/Understanding/ .

Run `npm run test:a11y` for Playwright and axe checks (Microsoft Edge must be installed). The suite starts Vite automatically and uses deterministic test-only player responses, never production mock data. Covers both themes at 1280px and 320px; empty, search, and populated trade states; arrow-key scoring controls; keyboard player selection; swap, remove and clear; skip link; and network-error recovery. Run `npm run typecheck`, `npm test`, `npm run lint`, and `npm run build` for the other checks.

Automated scans do not establish full WCAG conformance. Screen-reader testing with real assistive technology remains a manual release check. Contrast, visible focus, 44px controls, reduced motion, forced colors, live verdict updates, and non-sticky results are implemented.

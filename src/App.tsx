import { useMemo } from 'react';
import { ArrowLeftRight, Moon, RotateCcw, Sun, AlertTriangle, Goal, ArrowUpRight } from 'lucide-react';
import { SettingsBar } from './components/SettingsBar';
import { TradePanel } from './components/TradePanel';
import { Suggestions, Verdict } from './components/Verdict';
import { DEFAULT_SETTINGS } from './services/fantasyCalc';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { useValues } from './hooks/useValues';
import { LeagueSettings, ValuedPlayer } from './types/value';
import { evaluateTrade, suggestAdditions } from './utils/tradeValue';

interface TradeIds {
  get: string[];
  give: string[];
}

const EMPTY_TRADE: TradeIds = { get: [], give: [] };

function App() {
  const { theme, toggle } = useTheme();
  const [settings, setSettings] = useLocalStorage<LeagueSettings>('fta:settings', DEFAULT_SETTINGS);
  const [trade, setTrade] = useLocalStorage<TradeIds>('fta:trade', EMPTY_TRADE);
  const { snapshot, loading, error, retry } = useValues(settings);

  const pool = useMemo(() => snapshot?.players ?? [], [snapshot]);
  const byId = useMemo(() => new Map(pool.map(p => [p.id, p])), [pool]);

  const resolve = (ids: string[]) =>
    ids.map(id => byId.get(id)).filter((p): p is ValuedPlayer => Boolean(p));
  const getPlayers = resolve(trade.get);
  const givePlayers = resolve(trade.give);

  const evaluation =
    getPlayers.length > 0 && givePlayers.length > 0 ? evaluateTrade(getPlayers, givePlayers) : null;

  const suggestionSide = evaluation
    ? evaluation.favored === 'B'
      ? 'get'
      : evaluation.favored === 'A'
        ? 'give'
        : null
    : null;

  const suggestions = useMemo(
    () =>
      suggestionSide
        ? suggestAdditions(getPlayers, givePlayers, suggestionSide === 'get' ? 'A' : 'B', pool)
        : [],
    // getPlayers/givePlayers are rebuilt each render; their ids are the real inputs
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [suggestionSide, trade, pool]
  );

  const used = new Set([...trade.get, ...trade.give]);

  const add = (side: keyof TradeIds, id: string) =>
    setTrade(t => (t.get.includes(id) || t.give.includes(id) ? t : { ...t, [side]: [...t[side], id] }));
  const remove = (side: keyof TradeIds, id: string) =>
    setTrade(t => ({ ...t, [side]: t[side].filter(x => x !== id) }));

  const hasTrade = trade.get.length + trade.give.length > 0;
  const showSkeleton = !snapshot && loading;
  const showError = !snapshot && error;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#trade-desk">Skip to trade analyzer</a>
      <header className="site-header">
        <a href="#" className="brand" aria-label="Fantasy Trade AI home"><span className="brand-mark"><Goal aria-hidden="true" /></span><span>FANTASY<span className="brand-second">TRADE<span className="brand-ai">AI</span></span></span></a>
        <span className="header-caption">YOUR ROSTER. YOUR NEXT MOVE.</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setTrade(t => ({ get: t.give, give: t.get }))}
            disabled={!hasTrade}
            aria-label="Swap sides"
            className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm text-muted hover:bg-sunken hover:text-ink disabled:opacity-40"
          >
            <ArrowLeftRight className="size-4" strokeWidth={1.75} aria-hidden />
            <span className="hidden sm:inline">Swap sides</span>
          </button>
          <button
            type="button"
            onClick={() => setTrade(EMPTY_TRADE)}
            disabled={!hasTrade}
            aria-label="Clear trade"
            className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm text-muted hover:bg-sunken hover:text-ink disabled:opacity-40"
          >
            <RotateCcw className="size-4" strokeWidth={1.75} aria-hidden />
            <span className="hidden sm:inline">Clear</span>
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="grid size-10 place-items-center rounded-lg text-muted hover:bg-sunken hover:text-ink"
          >
            {theme === 'dark' ? (
              <Sun className="size-4" strokeWidth={1.75} />
            ) : (
              <Moon className="size-4" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </header>

      <main id="trade-desk" tabIndex={-1}>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">MAKE YOUR<br /><span>NEXT BIG PLAY.</span></h1>
          <p>Put the trade on the board. Compare player values.<br className="desktop-break" /> Find the move that moves your team forward.</p>
          <a className="hero-link" href="#lineups">Build your trade <ArrowUpRight size={19} aria-hidden="true" /></a>
        </div>
        <div className="playbook" aria-hidden="true">
          <div className="field-top"><span>TRADE PLAYBOOK</span><span>REDRAFT</span></div>
          <svg viewBox="0 0 420 220" fill="none">
            <defs><marker id="route-arrow" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6" stroke="currentColor" strokeWidth="1.6" /></marker></defs>
            <g className="yard-lines"><path d="M35 0V220M105 0V220M175 0V220M245 0V220M315 0V220M385 0V220" /><path d="M0 55H420M0 110H420M0 165H420" strokeDasharray="3 12" /></g>
            <path className="route-secondary" d="M105 165V85L175 40M245 165V120L310 85" markerEnd="url(#route-arrow)" />
            <path className="route-primary" d="M175 165V100Q175 75 200 75H340V30" markerEnd="url(#route-arrow)" />
            <g className="players"><circle cx="105" cy="177" r="10"/><circle cx="175" cy="177" r="10"/><circle cx="245" cy="177" r="10"/><circle cx="315" cy="177" r="10"/></g>
            <g className="defense"><path d="M92 128l14 14m0-14l-14 14M232 60l14 14m0-14l-14 14M302 118l14 14m0-14l-14 14"/></g>
          </svg>
          <div className="field-bottom"><span>READ THE FIELD.</span><span>MAKE THE CALL.</span></div>
        </div>
      </section>
      <section className="settings-section" aria-label="League settings">
        <div className="section-heading"><h2>League setup</h2><span>Dial in your scoring.</span></div>
        <SettingsBar settings={settings} onChange={setSettings} />
      </section>
      <div id="lineups" className="desk-heading"><h2>The trade desk</h2><span className="data-status">{loading ? 'Updating values' : snapshot ? 'Market values loaded' : 'Awaiting player values'}</span></div>

      {showError ? (
        <div role="alert" className="flex flex-col items-start gap-3 rounded-lg border border-line bg-surface p-5">
          <p className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="size-5 text-lose" strokeWidth={1.75} aria-hidden />
            Player values did not load
          </p>
          <p className="text-sm text-muted">{error}</p>
          <button
            type="button"
            onClick={retry}
            className="h-10 rounded-lg bg-accent px-4 text-sm font-medium text-accent-ink"
          >
            Try again
          </button>
        </div>
      ) : showSkeleton ? (
        <div className="flex flex-col gap-5" aria-busy="true" aria-label="Loading player values">
          <div className="skeleton h-40 rounded-lg" />
          <div className="grid gap-5 md:grid-cols-2">
            <div className="skeleton h-72 rounded-lg" />
            <div className="skeleton h-72 rounded-lg" />
          </div>
        </div>
      ) : (
        <>
          <div className="verdict-wrapper" aria-live="polite" aria-atomic="true">
            <Verdict evaluation={evaluation} />
          </div>

          <Suggestions
            suggestions={loading ? [] : suggestions}
            side={suggestionSide}
            onAdd={p => add(suggestionSide ?? 'get', p.id)}
          />

          <div
            className="grid gap-5 md:grid-cols-2"
            aria-busy={loading}
          >
            <TradePanel
              title="You get"
              hint="Players you receive"
              players={getPlayers}
              pool={pool}
              disabled={loading}
              excludeIds={used}
              onAdd={p => add('get', p.id)}
              onRemove={id => remove('get', id)}
            />
            <TradePanel
              title="You give"
              hint="Players you send away"
              players={givePlayers}
              pool={pool}
              disabled={loading}
              excludeIds={used}
              onAdd={p => add('give', p.id)}
              onRemove={id => remove('give', id)}
            />
          </div>
        </>
      )}

      </main>
      <footer className="mt-auto flex flex-col gap-2 border-t border-line pt-4 text-sm text-muted">
        <details>
          <summary className="cursor-pointer text-ink">How is this decided?</summary>
          <p className="mt-2">
            Every player has a market value for your league settings. We add up each side, and
            count extra players a little less because you can only start so many. If the two
            sides are close, it is a fair trade.
          </p>
        </details>
        {error && snapshot && <p>Showing saved values because the latest refresh failed.</p>}
      </footer>
    </div>
  );
}

export default App;

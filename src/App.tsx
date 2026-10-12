import { useMemo } from 'react';
import { ArrowLeftRight, Moon, RotateCcw, Sun, AlertTriangle } from 'lucide-react';
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

const timeAgo = (ts: number) => {
  const mins = Math.max(0, Math.round((Date.now() - ts) / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  return hours < 24 ? `${hours} h ago` : `${Math.round(hours / 24)} d ago`;
};

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
    <div className="mx-auto flex min-h-[100dvh] max-w-5xl flex-col gap-5 px-4 py-5 sm:px-6">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight">Fantasy Trade AI</h1>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setTrade(t => ({ get: t.give, give: t.get }))}
            disabled={!hasTrade}
            className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm text-muted hover:bg-sunken hover:text-ink disabled:opacity-40"
          >
            <ArrowLeftRight className="size-4" strokeWidth={1.75} aria-hidden />
            <span className="hidden sm:inline">Swap sides</span>
          </button>
          <button
            type="button"
            onClick={() => setTrade(EMPTY_TRADE)}
            disabled={!hasTrade}
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

      <SettingsBar settings={settings} onChange={setSettings} />

      {showError ? (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-line bg-surface p-5">
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
          <div className="sticky top-0 z-20 -mx-4 bg-bg/90 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6">
            <Verdict evaluation={evaluation} />
          </div>

          <Suggestions
            suggestions={suggestions}
            side={suggestionSide}
            onAdd={p => add(suggestionSide ?? 'get', p.id)}
          />

          <div
            className={`grid gap-5 transition-opacity md:grid-cols-2 ${loading ? 'opacity-60' : ''}`}
          >
            <TradePanel
              title="You get"
              hint="Players you receive"
              players={getPlayers}
              pool={pool}
              excludeIds={used}
              onAdd={p => add('get', p.id)}
              onRemove={id => remove('get', id)}
            />
            <TradePanel
              title="You give"
              hint="Players you send away"
              players={givePlayers}
              pool={pool}
              excludeIds={used}
              onAdd={p => add('give', p.id)}
              onRemove={id => remove('give', id)}
            />
          </div>
        </>
      )}

      <footer className="mt-auto flex flex-col gap-2 border-t border-line pt-4 text-sm text-muted">
        <details>
          <summary className="cursor-pointer text-ink">How is this decided?</summary>
          <p className="mt-2 max-w-prose">
            Every player has a market value for your league settings. We add up each side, and
            count extra players a little less because you can only start so many. If the two
            sides are close, it is a fair trade.
          </p>
        </details>
        <p>
          Redraft values from{' '}
          <a className="underline underline-offset-2 hover:text-ink" href="https://fantasycalc.com">
            FantasyCalc
          </a>
          {snapshot ? `, updated ${timeAgo(snapshot.fetchedAt)}` : ''}.
          {error && snapshot ? ' Showing saved values because the latest refresh failed.' : ''}
        </p>
      </footer>
    </div>
  );
}

export default App;

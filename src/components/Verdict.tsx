import { Plus } from 'lucide-react';
import { TradeEvaluation, ValuedPlayer } from '../types/value';
import { PositionChip } from './PlayerChip';

interface Props {
  evaluation: TradeEvaluation | null;
}

interface SuggestionsProps {
  suggestions: ValuedPlayer[];
  /** Which side the suggestions would be added to. */
  side: 'get' | 'give' | null;
  onAdd: (player: ValuedPlayer) => void;
}

const headlineFor = (e: TradeEvaluation): { text: string; tone: string } => {
  if (e.favored === 'even') return { text: 'Fair trade', tone: 'fair' };
  const larger = Math.max(e.sideA.adjustedValue, e.sideB.adjustedValue);
  const lopsided = Math.abs(e.gap) / larger > 0.25;
  if (e.favored === 'A') {
    return { text: lopsided ? 'Clearly in your favor' : 'Slightly in your favor', tone: 'win' };
  }
  return { text: lopsided ? 'Clearly against you' : 'Slightly against you', tone: 'lose' };
};

/** Marker position in percent: centre is even, the ends are a 50% value gap. */
const markerPercent = (e: TradeEvaluation) => {
  const larger = Math.max(e.sideA.adjustedValue, e.sideB.adjustedValue);
  if (larger === 0) return 50;
  const ratio = Math.max(-0.5, Math.min(0.5, e.gap / larger));
  return 50 + ratio * 100;
};

export const Verdict = ({ evaluation }: Props) => {
  if (!evaluation) {
    return (
      <div className="verdict-empty">
        <p className="text-lg font-semibold tracking-tight">Your next move, under review.</p>
        <p className="mt-1 text-sm text-muted">
          Add at least one player to each side. The result updates as you edit.
        </p>
      </div>
    );
  }

  const { text, tone } = headlineFor(evaluation);
  const position = markerPercent(evaluation);

  return (
    <div className={`verdict-result verdict-${tone}`}>
      <p className="text-center text-xl font-semibold tracking-tight sm:text-2xl">{text}</p>

      <div className="mt-4">
        <div className="relative h-6" role="img" aria-label={`Trade balance: ${text}`}>
          <div className="absolute inset-x-0 top-1/2 h-px bg-line" />
          <div className="absolute left-[45%] top-1/2 h-3 w-[10%] -translate-y-1/2 rounded-sm bg-sunken" />
          <div className="absolute left-1/2 top-1/2 h-4 w-px -translate-y-1/2 bg-muted" />
          <div
            className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-current transition-[left] duration-300 ease-out"
            style={{ left: `${position}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs">
          <span>You give more</span>
          <span>You get more</span>
        </div>
      </div>

    </div>
  );
};

export const Suggestions = ({ suggestions, side, onAdd }: SuggestionsProps) => {
  if (suggestions.length === 0 || !side) return null;
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <p className="text-sm font-medium">
        {side === 'get'
          ? 'Ask for one of these to even it out'
          : 'Add one of these to what you give to even it out'}
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {suggestions.map(p => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onAdd(p)}
              className="flex h-10 items-center gap-2 rounded-lg border border-line bg-surface px-2.5 text-sm hover:bg-sunken"
            >
              <PositionChip position={p.position} />
              <span className="font-medium">{p.name}</span>
              <Plus className="size-4 text-accent" strokeWidth={2} aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

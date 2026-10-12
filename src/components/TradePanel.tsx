import { X } from 'lucide-react';
import { ValuedPlayer } from '../types/value';
import { PositionChip } from './PlayerChip';
import { PlayerSearch } from './PlayerSearch';

interface Props {
  title: string;
  hint: string;
  players: ValuedPlayer[];
  pool: ValuedPlayer[];
  excludeIds: ReadonlySet<string>;
  disabled?: boolean;
  onAdd: (player: ValuedPlayer) => void;
  onRemove: (id: string) => void;
}

export const TradePanel = ({
  title,
  hint,
  players,
  pool,
  excludeIds,
  disabled,
  onAdd,
  onRemove
}: Props) => {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4" aria-label={title}>
      <header>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted">{hint}</p>
      </header>

      <PlayerSearch
        label="Add a player"
        pool={pool}
        excludeIds={excludeIds}
        disabled={disabled}
        onPick={onAdd}
      />

      {players.length === 0 ? (
        <p className="rounded-lg bg-sunken px-3 py-6 text-center text-sm text-muted">
          Search above to add players.
        </p>
      ) : (
        <ul className="flex flex-col gap-1">
          {players.map(p => (
            <li key={p.id} className="flex items-center gap-3 rounded-lg bg-sunken px-3 py-2">
              <PositionChip position={p.position} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{p.name}</div>
                <div className="truncate text-xs text-muted">
                  {p.team ?? 'Free agent'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(p.id)}
                aria-label={`Remove ${p.name}`}
                className="-mr-1 grid size-8 place-items-center rounded-md text-muted hover:bg-line hover:text-ink"
              >
                <X className="size-4" strokeWidth={1.75} />
              </button>
            </li>
          ))}
        </ul>
      )}

    </section>
  );
};

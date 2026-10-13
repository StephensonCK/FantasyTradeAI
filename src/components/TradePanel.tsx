import { useRef } from 'react';
import { X, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
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
  const panelRef = useRef<HTMLElement>(null);
  return (
    <section ref={panelRef} className="trade-panel" aria-label={title}>
      <header className="panel-heading">
        <h3 className="panel-title">{title}{title === 'You get' ? <ArrowDownLeft aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}</h3>
        <p className="text-sm text-muted">{hint}</p>
      </header>

      <PlayerSearch
        label={`Add a player to ${title.toLowerCase()}`}
        pool={pool}
        excludeIds={excludeIds}
        disabled={disabled}
        onPick={onAdd}
      />

      {players.length === 0 ? (
        <p className="empty-roster">
          <span className="empty-cross" aria-hidden="true">+</span><strong>Your {title === 'You get' ? 'incoming' : 'outgoing'} lineup starts here.</strong><span>Search a name or position to add a player.</span>
        </p>
      ) : (
        <ul className="flex flex-col gap-1">
          {players.map(p => (
            <li key={p.id} className="flex items-center gap-3 rounded-lg bg-sunken px-3 py-2">
              <PositionChip position={p.position} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium break-words">{p.name}</div>
                <div className="truncate text-xs text-muted">
                  {p.team ?? 'Free agent'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => { onRemove(p.id); panelRef.current?.querySelector('input')?.focus(); }}
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

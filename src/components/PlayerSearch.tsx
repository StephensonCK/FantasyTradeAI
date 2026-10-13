import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { ValuedPlayer } from '../types/value';
import { PositionChip } from './PlayerChip';

interface Props {
  label: string;
  pool: ValuedPlayer[];
  excludeIds: ReadonlySet<string>;
  disabled?: boolean;
  onPick: (player: ValuedPlayer) => void;
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '');
const MAX_RESULTS = 8;

export const PlayerSearch = ({ label, pool, excludeIds, disabled, onPick }: Props) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const results = useMemo(() => {
    const q = normalize(query.trim());
    const available = pool.filter(p => !excludeIds.has(p.id));
    const matches = q
      ? available.filter(p => normalize(p.name).includes(q) || p.position.toLowerCase() === q)
      : available;
    return matches.slice(0, MAX_RESULTS);
  }, [pool, excludeIds, query]);

  useEffect(() => {
    if (open) document.getElementById(`${listId}-option-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open, listId]);

  const pick = (player: ValuedPlayer) => {
    onPick(player);
    setQuery('');
    setOpen(false);
    setActive(0);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive(i => Math.max(0, Math.min(i + 1, results.length - 1)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && open && results[active]) {
      e.preventDefault();
      pick(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <label className="sr-only" htmlFor={`${listId}-input`}>
        {label}
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
        strokeWidth={1.75}
      />
      <input
        id={`${listId}-input`}
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={open && results.length ? listId : undefined}
        aria-activedescendant={open && results[active] ? `${listId}-option-${active}` : undefined}
        aria-autocomplete="list"
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
        value={query}
        placeholder={label}
        onChange={e => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        className="h-11 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-muted disabled:opacity-50"
      />
      {open && results.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          aria-label={`${label}: matching players`}
          className="absolute inset-x-0 top-full z-30 mt-1 max-h-80 overflow-y-auto rounded-lg border border-line bg-surface p-1 shadow-lg shadow-ink/10"
        >
          {results.map((p, i) => (
            <li
              key={p.id}
              id={`${listId}-option-${i}`}
              role="option"
              aria-selected={i === active}
              // Preserve focus on pointer down; commit on click to permit cancellation.
              onMouseDown={e => {
                e.preventDefault();
              }}
              onClick={() => pick(p)}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 ${
                i === active ? 'bg-sunken' : ''
              }`}
            >
              <PositionChip position={p.position} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{p.name}</span>
              <span className="text-xs text-muted">{p.team ?? 'FA'}</span>
            </li>
          ))}
        </ul>
      )}
      {open && query && results.length === 0 && (
        <div role="status" className="absolute inset-x-0 top-full z-30 mt-1 rounded-lg border border-line bg-surface px-3 py-3 text-sm text-muted shadow-lg shadow-ink/10">
          No player matches &ldquo;{query}&rdquo;.
        </div>
      )}
    </div>
  );
};

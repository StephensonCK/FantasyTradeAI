import { LeagueSettings } from '../types/value';

interface Props {
  settings: LeagueSettings;
  onChange: (next: LeagueSettings) => void;
}

interface Option<T> {
  value: T;
  label: string;
}

const Segmented = <T extends string | number>({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
}) => (
  <div role="radiogroup" aria-label={label} className="inline-flex rounded-lg bg-sunken p-1">
    {options.map(o => {
      const selected = o.value === value;
      return (
        <button
          key={String(o.value)}
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => onChange(o.value)}
          className={`h-8 rounded-md px-3 text-sm font-medium ${
            selected ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink'
          }`}
        >
          {o.label}
        </button>
      );
    })}
  </div>
);

const SCORING: Option<LeagueSettings['ppr']>[] = [
  { value: 0, label: 'Standard' },
  { value: 0.5, label: 'Half PPR' },
  { value: 1, label: 'PPR' }
];

const QBS: Option<LeagueSettings['numQbs']>[] = [
  { value: 1, label: '1 QB' },
  { value: 2, label: 'Superflex' }
];

const TEAM_COUNTS = [8, 10, 12, 14, 16];

export const SettingsBar = ({ settings, onChange }: Props) => (
  <div className="flex flex-wrap items-center gap-3">
    <Segmented
      label="Scoring"
      options={SCORING}
      value={settings.ppr}
      onChange={ppr => onChange({ ...settings, ppr })}
    />
    <Segmented
      label="Quarterbacks"
      options={QBS}
      value={settings.numQbs}
      onChange={numQbs => onChange({ ...settings, numQbs })}
    />
    <label className="inline-flex items-center gap-2 text-sm text-muted">
      League size
      <select
        value={settings.numTeams}
        onChange={e => onChange({ ...settings, numTeams: Number(e.target.value) })}
        className="h-10 rounded-lg border border-line bg-surface px-2 text-sm text-ink"
      >
        {TEAM_COUNTS.map(n => (
          <option key={n} value={n}>
            {n} teams
          </option>
        ))}
      </select>
    </label>
  </div>
);

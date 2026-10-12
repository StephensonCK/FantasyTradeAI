import { ValuedPosition } from '../types/value';

const STYLE: Record<ValuedPosition, string> = {
  QB: 'text-qb bg-qb/15',
  RB: 'text-rb bg-rb/15',
  WR: 'text-wr bg-wr/15',
  TE: 'text-te bg-te/15'
};

export const PositionChip = ({ position }: { position: ValuedPosition }) => (
  <span
    className={`inline-flex h-6 w-9 shrink-0 items-center justify-center rounded font-mono text-xs font-semibold ${STYLE[position]}`}
  >
    {position}
  </span>
);

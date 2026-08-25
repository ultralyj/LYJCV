import type { TagCategory } from '../types';

export interface FilterButton {
  label: string;
  value: string;
  count: number;
  category?: TagCategory | 'selected';
}

interface PublicationsFilterProps {
  buttons: FilterButton[];
  value: string;
  onChange: (value: string) => void;
}

export function PublicationsFilter({
  buttons,
  value,
  onChange,
}: PublicationsFilterProps) {
  return (
    <div className="publications-filter">
      <span className="publications-filter-label">Filter by topic:</span>
      <div className="publications-filter-buttons">
        {buttons.map((btn) => {
          const active = btn.value === value;
          const classes = [
            'pub-filter-btn',
            btn.category === 'selected' ? 'pub-filter-btn-selected' : '',
            btn.category && btn.category !== 'selected'
              ? `pub-filter-btn-category pub-filter-btn-${btn.category}`
              : '',
            active ? 'is-active' : '',
            btn.count === 0 ? 'is-empty' : '',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <button
              key={btn.value}
              type="button"
              className={classes}
              data-category={btn.category && btn.category !== 'selected' ? btn.category : undefined}
              aria-pressed={active}
              onClick={() => onChange(btn.value)}
            >
              <span>{btn.label}</span>
              <span className="pub-filter-count">{btn.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export interface TagFilterTag {
  label: string;
  value: string;
  count: number;
}

interface TagFilterProps {
  tags: TagFilterTag[];
  value: string;
  onChange: (value: string) => void;
}

export function TagFilter({ tags, value, onChange }: TagFilterProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {tags.map((tag) => {
        const active = tag.value === value;
        return (
          <button
            key={tag.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(tag.value)}
            className={`rounded-full px-3 py-1 text-xs transition ${
              active
                ? 'bg-accent text-white dark:bg-accent-dark'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {tag.label} ({tag.count})
          </button>
        );
      })}
    </div>
  );
}

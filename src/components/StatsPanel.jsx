export default function StatsPanel({ wpm, accuracy, timeLeft, duration }) {
  const items = [
    { label: 'Live WPM', value: `${wpm}` },
    { label: 'Accuracy', value: `${accuracy}%` },
    { label: 'Time Left', value: `${timeLeft}s` },
    { label: 'Duration', value: `${duration}s` },
  ];

  return (
    <aside className="sticky top-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
      <h3 className="text-lg font-medium text-white">Live Stats</h3>
      <div className="mt-4 space-y-3">
        {items.map((it) => (
          <div key={it.label} className="flex items-center justify-between rounded-lg bg-neutral-950/60 px-3 py-2 ring-1 ring-neutral-800">
            <span className="text-sm text-neutral-400">{it.label}</span>
            <span className="text-sm font-medium text-neutral-100">{it.value}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-neutral-500">
        Tip: Aim for smooth, consistent motion. Speed follows accuracy.
      </p>
    </aside>
  );
}

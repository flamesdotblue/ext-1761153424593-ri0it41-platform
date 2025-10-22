import { useEffect, useMemo, useState } from 'react';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}

export default function HistoryChart({ history: historyProp }) {
  const [history, setHistory] = useState(historyProp || []);

  useEffect(() => setHistory(historyProp || []), [historyProp]);

  const last = useMemo(() => history.slice(-20), [history]);
  const chart = useMemo(() => {
    if (last.length === 0) return { points: '', min: 0, max: 0 };
    const w = 600;
    const h = 140;
    const pad = 10;
    const xs = last.map((_, i) => pad + (i * (w - pad * 2)) / Math.max(1, last.length - 1));
    const wpms = last.map((r) => r.wpm || 0);
    const min = Math.min(...wpms);
    const max = Math.max(...wpms);
    const range = Math.max(1, max - min);
    const ys = wpms.map((v) => h - pad - ((v - min) * (h - pad * 2)) / range);
    const points = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
    return { points, min, max, w, h, xs, ys };
  }, [last]);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-white">Speed History</h3>
          <p className="text-sm text-neutral-400">Last {last.length} results</p>
        </div>
        {last.length > 0 && (
          <div className="text-right">
            <div className="text-xs text-neutral-400">Range</div>
            <div className="text-sm text-neutral-200">{chart.min} - {chart.max} WPM</div>
          </div>
        )}
      </div>

      {last.length === 0 ? (
        <div className="rounded-lg bg-neutral-950/60 p-6 text-center text-sm text-neutral-400 ring-1 ring-neutral-800">
          No results yet. Complete a test to see your progress here.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <svg width={chart.w} height={160} className="w-full min-w-[320px]">
            <defs>
              <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <polyline fill="none" stroke="url(#grad)" strokeWidth="3" points={chart.points} />
            {chart.xs?.map((x, i) => (
              <circle key={i} cx={x} cy={chart.ys[i]} r="3" fill="#a78bfa" />
            ))}
          </svg>
        </div>
      )}

      {last.length > 0 && (
        <div className="mt-6 divide-y divide-neutral-800 overflow-hidden rounded-xl ring-1 ring-neutral-800">
          {last
            .slice()
            .reverse()
            .map((r) => (
              <div key={r.id} className="grid grid-cols-2 items-center bg-neutral-950/50 px-4 py-3 text-sm text-neutral-200 sm:grid-cols-4">
                <div className="truncate">{formatDate(r.timestamp)}</div>
                <div className="text-neutral-300">{r.wpm} WPM</div>
                <div className="hidden sm:block text-neutral-400">{r.accuracy}% accuracy</div>
                <div className="hidden sm:block text-neutral-500">{r.duration}s test</div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

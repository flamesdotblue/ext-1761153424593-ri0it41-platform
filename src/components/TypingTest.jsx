import { useEffect, useMemo, useRef, useState } from 'react';

const PASSAGES = [
  'Practice makes progress. Keep your fingers light and your eyes on the line ahead.',
  'Typing is a rhythm. Trust your muscle memory and let accuracy guide your speed.',
  'Small steps add up quickly. Stay calm, keep breathing, and correct gently.',
  'Precision first, speed second. Consistency over time builds mastery.',
  'Focus on smooth motion. Rest your wrists and let the keys do the work.',
];

function computeStats(text, typed, startTime, now, totalDuration, correctChars) {
  const elapsedMs = Math.max(0, (startTime ? now - startTime : 0));
  const elapsedMin = elapsedMs / 60000 || 0;
  const grossWPM = elapsedMin > 0 ? (correctChars / 5) / elapsedMin : 0;
  const accuracy = typed.length > 0 ? (correctChars / typed.length) * 100 : 100;
  const timeLeft = Math.max(0, Math.ceil((totalDuration * 1000 - elapsedMs) / 1000));
  return {
    wpm: Math.max(0, Math.round(grossWPM)),
    accuracy: Math.min(100, Math.max(0, Math.round(accuracy))),
    timeLeft,
  };
}

export default function TypingTest({ onLiveUpdate, onComplete }) {
  const [duration, setDuration] = useState(60);
  const [target, setTarget] = useState('');
  const [typed, setTyped] = useState('');
  const [startedAt, setStartedAt] = useState(null);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const correctChars = useMemo(() => {
    let c = 0;
    for (let i = 0; i < typed.length && i < target.length; i++) {
      if (typed[i] === target[i]) c++;
    }
    return c;
  }, [typed, target]);

  const live = useMemo(() => {
    const now = Date.now();
    const stats = computeStats(target, typed, startedAt, now, duration, correctChars);
    return { ...stats, duration };
  }, [target, typed, startedAt, duration, correctChars]);

  useEffect(() => {
    onLiveUpdate?.(live);
  }, [live, onLiveUpdate]);

  const startNewTest = (d = duration) => {
    const newText = PASSAGES[Math.floor(Math.random() * PASSAGES.length)];
    setTarget(newText);
    setTyped('');
    setStartedAt(null);
    setFinished(false);
    setDuration(d);
    setTimeLeft(d);
    clearInterval(timerRef.current);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  useEffect(() => {
    startNewTest(duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!startedAt || finished) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((duration * 1000 - (now - startedAt)) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        finalizeTest();
      }
    }, 200);
    return () => clearInterval(timerRef.current);
  }, [startedAt, duration, finished]);

  const handleChange = (e) => {
    const val = e.target.value;
    if (!startedAt && val.length > 0) {
      setStartedAt(Date.now());
    }
    if (finished) return;
    setTyped(val);
    if (val.length >= target.length) {
      finalizeTest(val);
    }
  };

  const finalizeTest = (finalTyped = typed) => {
    if (finished) return;
    setFinished(true);
    clearInterval(timerRef.current);
    const end = Date.now();
    const correct = (() => {
      let c = 0;
      for (let i = 0; i < finalTyped.length && i < target.length; i++) if (finalTyped[i] === target[i]) c++;
      return c;
    })();
    const stats = computeStats(target, finalTyped, startedAt ?? end, end, duration, correct);
    const result = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      duration,
      textLength: target.length,
    };
    try {
      const raw = localStorage.getItem('typing_history');
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(result);
      localStorage.setItem('typing_history', JSON.stringify(arr));
    } catch {}
    onComplete?.(result);
  };

  const handleRestart = () => startNewTest(duration);

  const handleDurationChange = (e) => {
    const d = Number(e.target.value);
    setDuration(d);
    startNewTest(d);
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-400">Duration</span>
          <select
            value={duration}
            onChange={handleDurationChange}
            className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
          >
            <option value={15}>15s</option>
            <option value={30}>30s</option>
            <option value={60}>60s</option>
            <option value={120}>120s</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRestart}
            className="inline-flex items-center justify-center rounded-md bg-neutral-800 px-3 py-2 text-sm text-neutral-100 ring-1 ring-neutral-700 transition hover:bg-neutral-750 hover:ring-neutral-600"
          >
            Restart
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-neutral-950/60 p-4 ring-1 ring-neutral-800">
        <div className="mb-3 min-h-[96px] whitespace-pre-wrap text-base leading-7 text-neutral-300">
          {target.split('').map((ch, i) => {
            const t = typed[i];
            const isCorrect = t != null && t === ch;
            const isWrong = t != null && t !== ch;
            const isCurrent = i === typed.length;
            return (
              <span
                key={i}
                className={
                  isCorrect ? 'text-emerald-400' : isWrong ? 'text-rose-400' : isCurrent ? 'bg-neutral-800 text-white underline decoration-fuchsia-500 underline-offset-4' : 'text-neutral-500'
                }
              >
                {ch}
              </span>
            );
          })}
        </div>

        <textarea
          ref={inputRef}
          value={typed}
          onChange={handleChange}
          placeholder="Start typing here..."
          className="h-28 w-full resize-none rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-base text-neutral-100 outline-none ring-fuchsia-600/0 transition focus:ring-2"
        />

        {finished && (
          <div className="mt-3 text-sm text-neutral-300">
            Test complete. Press Restart to try again.
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-neutral-900 p-3 ring-1 ring-neutral-800">
          <div className="text-xs uppercase tracking-wider text-neutral-400">Time Left</div>
          <div className="text-2xl font-semibold text-white">{timeLeft}s</div>
        </div>
        <div className="rounded-lg bg-neutral-900 p-3 ring-1 ring-neutral-800">
          <div className="text-xs uppercase tracking-wider text-neutral-400">WPM</div>
          <div className="text-2xl font-semibold text-white">{live.wpm}</div>
        </div>
        <div className="rounded-lg bg-neutral-900 p-3 ring-1 ring-neutral-800">
          <div className="text-xs uppercase tracking-wider text-neutral-400">Accuracy</div>
          <div className="text-2xl font-semibold text-white">{live.accuracy}%</div>
        </div>
      </div>
    </div>
  );
}

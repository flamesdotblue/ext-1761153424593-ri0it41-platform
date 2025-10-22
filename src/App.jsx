import { useEffect, useState, useCallback } from 'react';
import Hero3D from './components/Hero3D';
import TypingTest from './components/TypingTest';
import StatsPanel from './components/StatsPanel';
import HistoryChart from './components/HistoryChart';

function App() {
  const [history, setHistory] = useState([]);
  const [liveStats, setLiveStats] = useState({ wpm: 0, accuracy: 100, timeLeft: 60, duration: 60 });

  const loadHistory = useCallback(() => {
    try {
      const raw = localStorage.getItem('typing_history');
      if (raw) setHistory(JSON.parse(raw));
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleComplete = (result) => {
    // result already saved to localStorage inside TypingTest
    loadHistory();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Hero3D />

      <main id="trainer" className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <TypingTest
              onLiveUpdate={(stats) => setLiveStats(stats)}
              onComplete={handleComplete}
            />
          </div>
          <div className="md:col-span-1">
            <StatsPanel
              wpm={liveStats.wpm}
              accuracy={liveStats.accuracy}
              timeLeft={liveStats.timeLeft}
              duration={liveStats.duration}
            />
          </div>
        </div>

        <section className="mt-12">
          <HistoryChart history={history} />
        </section>
      </main>

      <footer className="py-10 text-center text-sm text-neutral-400">
        Built for focused practice. Your data stays in your browser.
      </footer>
    </div>
  );
}

export default App;

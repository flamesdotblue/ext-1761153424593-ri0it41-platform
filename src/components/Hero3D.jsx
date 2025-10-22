import Spline from '@splinetool/react-spline';

export default function Hero3D() {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/sHDPSbszZja1qap3/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.25),transparent_60%)]" />

      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            TypeSwift
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-neutral-300 sm:text-lg">
            A sleek typing trainer with real-time stats and speed history. Practice, improve, and track your progress.
          </p>
          <a
            href="#trainer"
            className="pointer-events-auto mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-600 to-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-fuchsia-700/20 transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          >
            Start practicing
          </a>
        </div>
      </div>
    </section>
  );
}

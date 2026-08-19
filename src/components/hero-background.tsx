export function HeroBadge({ label }: { label: string }) {
  return (
    <span className="label inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-[11px] text-primary">
      <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-glow" />
      {label}
    </span>
  );
}

export function HeroGlow() {
  return <div className="hero-glow-bg pointer-events-none absolute inset-x-0 top-0 h-[420px]" />;
}

export function HomeHeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="home-hero-glow-bg absolute inset-0" />
      <div className="home-hero-grid absolute inset-x-0 bottom-0 h-[260px] opacity-70" />
    </div>
  );
}

const Sprig = ({ className }: { className: string }) => (
  <svg viewBox="0 0 40 60" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <path d="M20 58 C20 40 18 25 22 4" />
    <path d="M20 44 C12 42 9 36 10 32 C15 33 19 38 20 44Z" />
    <path d="M21 32 C28 30 31 24 30 20 C25 21 22 26 21 32Z" />
    <path d="M21 20 C15 18 13 13 14 9 C18 10 21 15 21 20Z" />
  </svg>
);
const Bloom = ({ className }: { className: string }) => (
  <svg viewBox="0 0 30 30" className={className} fill="currentColor">
    {[0, 72, 144, 216, 288].map((r) => (
      <ellipse key={r} cx="15" cy="8" rx="4" ry="6" transform={`rotate(${r} 15 15)`} opacity="0.7" />
    ))}
    <circle cx="15" cy="15" r="2.6" className="text-bloom-center" fill="currentColor" />
  </svg>
);
const Sun = ({ className }: { className: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <defs>
      <filter id="sun-haze" x="-70%" y="-70%" width="240%" height="240%">
        <feGaussianBlur stdDeviation="4.5" />
      </filter>
    </defs>
    <circle className="sun-haze" cx="32" cy="32" r="15" fill="currentColor" fillOpacity="0.32" filter="url(#sun-haze)" />
    <circle cx="32" cy="32" r="10.5" fill="currentColor" fillOpacity="0.2" />
    <circle cx="32" cy="32" r="10.5" />
    <g className="sun-rays">
      <path d="M47 32 L54 32" />
      <path d="M42.6 42.6 L46.9 46.9" />
      <path d="M32 47 L32 53" />
      <path d="M21.4 42.6 L18.6 45.4" />
      <path d="M17 32 L10 32" />
      <path d="M21.4 21.4 L17.1 17.1" />
      <path d="M32 17 L32 11" />
      <path d="M42.6 21.4 L45.4 18.6" />
    </g>
  </svg>
);

export function Botanicals() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <Sun className="absolute left-[5%] top-[0.5%] h-10 w-10 text-bloom-center opacity-75 sm:left-[7%] sm:top-[4%] sm:h-20 sm:w-20" />
      <Sprig className="absolute left-[3%] top-[17%] h-16 w-10 rotate-[-20deg] text-botanical" />
      <Bloom className="absolute right-[8%] top-[4%] h-6 w-6 text-blossom" />
      <Sprig className="absolute right-[3%] top-[38%] h-20 w-12 rotate-[25deg] text-botanical" />
      <Bloom className="absolute left-[6%] top-[52%] h-5 w-5 text-blossom-2" />
      <Bloom className="absolute right-[14%] bottom-[10%] h-7 w-7 text-blossom-2" />
      <Sprig className="absolute left-[10%] bottom-[4%] h-16 w-10 rotate-[15deg] text-botanical" />
      <Bloom className="absolute left-[45%] bottom-[2%] h-4 w-4 text-blossom" />
      <Bloom className="absolute left-[30%] top-[2%] h-4 w-4 text-blossom-2" />
    </div>
  );
}

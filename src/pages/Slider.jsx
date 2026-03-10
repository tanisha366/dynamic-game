import { useState, useRef } from "react";

const artworks = [
  {
    id: 1,
    title: "Ethereal Echoes",
    description: "A mesmerizing blend of digital fluidity and classical portraiture.",
    price: "$245.00",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Urban Geometry",
    description: "Striking architectural contrasts with a sleek, gold-tinted color grade.",
    price: "$405.00",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Neon Dreams",
    description: "Vibrant synthetic aesthetics with dynamic noise cancellation.",
    price: "$180.00",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Abstract Waves",
    description: "Smooth, flowing waveforms captured in a static medium.",
    price: "$320.00",
    image: "https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Crimson Horizon",
    description: "Deep, passionate reds meeting the void of space.",
    price: "$550.00",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  }
];

// Portrait = 28vw, Landscape = 42vw
const ITEM_WIDTHS = artworks.map((_, i) => (i % 2 === 0 ? 28 : 42));

const ITEM_CENTERS = ITEM_WIDTHS.map((width, index) => {
  let offsetLeft = 0;
  for (let i = 0; i < index; i++) {
    offsetLeft += ITEM_WIDTHS[i];
  }
  return offsetLeft + width / 2;
});

export default function BlurSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Ref to prevent hyper-scrolling (firing 50 scroll events in 1 second)
  const scrollLock = useRef(false);

  const handleNext = () => {
    if (currentIndex < artworks.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  // --- MOUSE WHEEL & TRACKPAD SCROLL LOGIC ---
  const handleWheel = (e) => {
    // If we are currently locked in a scroll transition, ignore new scrolls
    if (scrollLock.current) return;

    // Detect if the user is scrolling horizontally (trackpad) or vertically (mouse wheel)
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

    // Ignore tiny accidental touches
    if (Math.abs(delta) < 2) return;

    if (delta > 0 && currentIndex < artworks.length - 1) {
      scrollLock.current = true;
      handleNext();
      // Lock scrolling for 800ms so the user can feel the transition
      setTimeout(() => (scrollLock.current = false), 800);
    } else if (delta < 0 && currentIndex > 0) {
      scrollLock.current = true;
      handlePrev();
      setTimeout(() => (scrollLock.current = false), 800);
    }
  };

  const transitionStr = "transition-all duration-[1400ms] ease-[cubic-bezier(0.25,1,0.3,1)]";
  const trackTranslateX = 50 - ITEM_CENTERS[currentIndex];

  return (
    <div 
      // Locks the container to the viewport to completely eliminate white space and native scrolling
      className="fixed inset-0 w-full h-[100dvh] overflow-hidden bg-[#0a0a0a] font-sans selection:bg-white selection:text-black"
      onWheel={handleWheel} 
    >
      
      {/* 1. MASSIVE BACKGROUND TYPOGRAPHY */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden opacity-30">
        <h1 
          key={currentIndex}
          className="text-[30vh] md:text-[70vw] font-bold uppercase tracking-tighter whitespace-nowrap animate-fade-in-up text-transparent transition-all duration-500"
          style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}
        >
          {artworks[currentIndex].title}
        </h1>
      </div>

      {/* 2. THE CONTINUOUS FILM REEL TRACK */}
      <div 
        // CHANGED: gap-0 restored. Uses CSS vars to move Y on mobile and X on desktop based on your JS math
        className={`absolute top-0 left-0 w-full md:h-full flex flex-col md:flex-row items-center justify-center md:justify-start gap-0 z-20 ${transitionStr} max-md:translate-y-[calc(var(--scroll)*1vh)] md:translate-x-[calc(var(--scroll)*1vw)]`}
        style={{ '--scroll': trackTranslateX }}
      >
        {artworks.map((art, index) => {
          const diff = index - currentIndex;
          const isPortrait = index % 2 === 0;
          
          // Desktop horizontal sizes (Original)
          const deskW = isPortrait ? 28 : 42;
          const deskH = isPortrait ? 75 : 55;
          
          // Mobile vertical sizes (Flipped logic so it stacks vertically with alternating heights)
          const mobW = isPortrait ? 75 : 55;
          const mobH = isPortrait ? 28 : 42;

          return (
            <div
              key={art.id}
              // Uses arbitrary Tailwind variants to map the exact CSS variables responsively
              className={`relative overflow-hidden flex-shrink-0 group ${transitionStr} w-[var(--mob-w)] h-[var(--mob-h)] md:w-[var(--desk-w)] md:h-[var(--desk-h)]`}
              style={{
                '--desk-w': `${deskW}vw`,
                '--desk-h': `${deskH}vh`,
                '--mob-w': `${mobW}vw`,
                '--mob-h': `${mobH}vh`,
              }}
            >
              {/* THE INTERNAL PARALLAX MASK */}
              <img
                src={art.image}
                alt={art.title}
                // Applies vertical parallax on mobile, horizontal parallax on desktop
                className={`absolute top-1/2 left-1/2 w-[140%] h-[140%] max-w-none object-cover ${transitionStr} max-md:-translate-x-1/2 max-md:translate-y-[calc(-50%+var(--parallax)*1%)] md:-translate-y-1/2 md:translate-x-[calc(-50%+var(--parallax)*1%)]`}
                style={{
                  '--parallax': diff * -18
                }}
              />

              {/* HOVER DETAILS OVERLAY */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-10">
                <button 
                  onClick={() => alert(`Navigating to details page for: ${art.title}`)}
                  className="px-6 py-2 md:px-8 md:py-3 border border-white text-white text-[9px] md:text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-colors duration-300 translate-y-4 group-hover:translate-y-0"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. FOREGROUND UI OVERLAY */}
      <div className="absolute inset-0 z-40 pointer-events-none flex flex-col justify-between p-6 sm:p-8 md:p-12">
        
        <header className="w-full flex justify-between items-center text-white text-[9px] md:text-[10px] tracking-[0.3em] uppercase drop-shadow-md">
          <span>Gallery View</span>
        </header>

        <div className="w-full flex flex-col md:flex-row justify-end md:justify-between items-start md:items-end gap-8 md:gap-0 drop-shadow-xl mt-auto">
          
          <div className="flex flex-col gap-4 md:gap-6 pointer-events-auto text-white mix-blend-difference w-full md:w-auto">
            <div className="overflow-hidden">
               <h2 key={currentIndex} className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter uppercase leading-none animate-fade-in-up">
                 {artworks[currentIndex].title}
               </h2>
            </div>
            <div className="overflow-hidden max-w-xs sm:max-w-sm">
               <p key={`desc-${currentIndex}`} className="text-[10px] md:text-[11px] text-white/80 leading-relaxed tracking-widest uppercase animate-fade-in-up">
                 {artworks[currentIndex].description}
               </p>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-6 pointer-events-auto text-white mix-blend-difference w-full md:w-auto mt-4 md:mt-0">
             <div className="flex gap-3 w-full justify-between md:justify-end">
               <button 
                 onClick={handlePrev} 
                 disabled={currentIndex === 0}
                 className={`w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/40 flex items-center justify-center transition-all duration-300 ${currentIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white hover:text-black hover:border-white'}`}
               >
                 ←
               </button>
               <button 
                 onClick={handleNext} 
                 disabled={currentIndex === artworks.length - 1}
                 className={`w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/40 flex items-center justify-center transition-all duration-300 ${currentIndex === artworks.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white hover:text-black hover:border-white'}`}
               >
                 →
               </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
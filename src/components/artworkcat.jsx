import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Paintbrush, Hammer, Pencil, MonitorPlay, Camera, Printer } from "lucide-react";

// --- DYNAMIC CURATED DATA ---
const WALL_BG = "src/assets/faded-orange-wall-with-row-spotlights-empty-room.jpg"; 
const Studio_BG = "src/assets/4125099.jpg"; 

const CATEGORIES = [
  {
    id: 1,
    title: "Painting",
    type: "2D",
    frameStyle: "canvas", 
    bg: WALL_BG,
    desc: "Oil, Acrylic & Watercolor",
    year: "EST. 1600",
    artImg: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800",
    CursorIcon: Paintbrush
  },
  {
    id: 2,
    title: "Sculpture",
    type: "3D", 
    bg: Studio_BG,
    desc: "Marble, Bronze & Clay",
    year: "EST. 1400",
    artImg: "src/assets/sculptureguidehero-Photoroom.png",
    artImg2: "src/assets/wsc437_a02-Photoroom.png", 
    CursorIcon: Hammer
  },
  {
    id: 3,
    title: "Drawing",
    type: "2D",
    frameStyle: "frame", 
    bg: WALL_BG,
    desc: "Charcoal, Pencil & Ink",
    year: "EST. 1500",
    artImg: "src/assets/jene-stephaniuk--MCrF6hnojU-unsplash.jpg", 
    CursorIcon: Pencil
  },
  {
    id: 4,
    title: "Digital Art",
    type: "2D",
    frameStyle: "modern", 
    bg: Studio_BG,
    desc: "NFTs, 3D & Vector",
    year: "EST. 1980",
    artImg: "https://images.pexels.com/photos/2860804/pexels-photo-2860804.jpeg?auto=compress&cs=tinysrgb&w=800", 
    CursorIcon: MonitorPlay
  },
  {
    id: 5,
    title: "Photography",
    type: "2D",
    frameStyle: "frame", 
    bg: WALL_BG,
    desc: "Portrait, Landscape & Macro",
    year: "EST. 1839",
    artImg: "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800", 
    CursorIcon: Camera
  }
];

// --- 2D WALL SCENE COMPONENT ---
const WallScene = ({ bgImg, artImg, frameStyle, isActive }) => {
  let frameClasses = "";
  let frameStyles = {};

  if (frameStyle === "canvas") {
    frameClasses = "relative z-10 shadow-[20px_20px_50px_rgba(0,0,0,0.8)]";
    frameStyles = { borderLeft: "2px solid rgba(255,255,255,0.2)" };
  } else if (frameStyle === "modern") {
    frameClasses = "relative z-10 bg-[#111] p-1 shadow-[0_30px_60px_rgba(0,0,0,0.9)]";
    frameStyles = { outline: "1px solid #333" };
  } else {
    frameClasses = "relative z-10 bg-[#f4f4f0] p-2 md:p-4 shadow-[0_30px_60px_rgba(0,0,0,0.9)]";
    frameStyles = { 
      outline: "8px solid #1a1a1a",
      boxShadow: "inset 0 0 15px rgba(0,0,0,0.5), 0 30px 60px rgba(0,0,0,0.9)"
    };
  }

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
      {/* PERFECTLY FITTING BACKGROUND */}
      <div 
        className="absolute inset-0 bg-repeat bg-[length:900px] bg-center duration-700 opacity-40"
        style={{ backgroundImage: `url(${bgImg})` }} 
      />
      <motion.div 
        className={frameClasses}
        style={frameStyles}
        animate={{ 
          scale: isActive ? 1.05 : 0.85, 
          y: isActive ? -10 : 0,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <img 
          src={artImg} 
          alt="Artwork" 
          className="w-[100px] md:w-[180px] h-[140px] md:h-[240px] object-cover" 
        />
      </motion.div>
    </div>
  );
};

// --- 3D PEDESTAL SCENE COMPONENT ---
const PedestalScene = ({ bgImg, artImg, artImg2, isActive }) => (
  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-end pb-[10%] overflow-hidden">
    {/* PERFECTLY FITTING BACKGROUND */}
    <div 
      className="absolute inset-0 bg-cover bg-center duration-700 opacity-30"
      style={{ backgroundImage: `url(${bgImg})` }} 
    />
    <motion.div 
      className="relative z-10 flex flex-col items-center"
      animate={{ 
        scale: isActive ? 1.1 : 0.85, 
        y: isActive ? -10 : 10,
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="flex items-end justify-center gap-2 md:gap-4 relative z-20">
        <img 
          src={artImg} 
          alt="Sculpture 1" 
          className="h-[120px] md:h-[180px] object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]" 
        />
        {artImg2 && (
          <img 
            src={artImg2} 
            alt="Sculpture 2" 
            className="h-[140px] md:h-[200px] object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]" 
          />
        )}
      </div>
      <div className="relative z-10 -mt-[5px] md:-mt-[10px] w-[140px] md:w-[220px] h-[50px] md:h-[80px] bg-gradient-to-b from-[#2a2a2a] to-[#050505] shadow-[0_40px_50px_rgba(0,0,0,0.9)] border-t border-white/10 rounded-t-sm">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-white/20 blur-[1px]"></div>
      </div>
    </motion.div>
  </div>
);


export default function ArtCategories() {
  const [activeId, setActiveId] = useState(1);
  const [hoveredId, setHoveredId] = useState(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 300, mass: 0.8 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // ONLY tracks mouse, touch events removed for mobile
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  const ActiveIcon = hoveredId ? CATEGORIES.find(c => c.id === hoveredId)?.CursorIcon : null;

  return (
    // STRICT full-screen height (100dvh). flex-col on mobile, flex-row on desktop. NO scrolling.
    <div className="relative w-screen h-[100dvh] bg-[#050505] overflow-hidden flex flex-col md:flex-row text-white font-sans selection:bg-white/20 md:cursor-none">
      
      {/* CURSOR - Hidden on mobile entirely */}
      <motion.div className="hidden md:block fixed top-0 left-0 pointer-events-none z-[9999]" style={{ x: cursorXSpring, y: cursorYSpring }}>
        <div className="-translate-x-1/2 -translate-y-1/2">
          <AnimatePresence mode="wait">
            {ActiveIcon ? (
              <motion.div
                key="icon-cursor"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center justify-center w-9 h-9 bg-black/30 rounded-full backdrop-blur-[2px] border border-amber-400/40 shadow-sm"
              >
                <ActiveIcon strokeWidth={1.2} size={16} className="text-amber-400" />
              </motion.div>
            ) : (
              <motion.div
                key="default-cursor"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-8 h-8 bg-white rounded-full mix-blend-difference"
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* HEADER */}
      <nav className="absolute top-0 left-0 w-full p-4 md:p-8 z-50 flex justify-between items-center pointer-events-none">
        <div className="font-serif text-lg md:text-2xl font-bold text-amber-400 pointer-events-auto cursor-pointer z-50 drop-shadow-lg">
          Zigguratss<span className="font-light italic text-amber-50">ARTS</span>
        </div>
        <div className="flex flex-col items-end text-right pointer-events-auto z-50 max-w-[50%] md:max-w-none">
          <p className="text-[6px] md:text-[9px] tracking-[2px] md:tracking-[2.5px] uppercase text-white/50 mb-1">
            check out our most sold artwork categories
          </p>
          <h2 className="text-xs md:text-xl font-serif italic text-white tracking-wider border-b border-amber-400/30 pb-1 md:pb-2">
            Top Selling Artwork Categories
          </h2>
        </div>
      </nav>

      {/* MAIN ACCORDION */}
      {CATEGORIES.map((cat) => (
        <Panel 
          key={cat.id} 
          data={cat} 
          isActive={activeId === cat.id} 
          onClick={() => setActiveId(cat.id)}
          onHoverStart={() => setHoveredId(cat.id)}
          onHoverEnd={() => setHoveredId(null)}
        />
      ))}
    </div>
  );
}

// --- PANEL BLOCK ---
const Panel = ({ data, isActive, onClick, onHoverStart, onHoverEnd }) => {
  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      // PURE FLEXBOX: Adjusts height on mobile, width on desktop
      animate={{ flex: isActive ? 4 : 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
      className="relative w-full md:w-auto h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/5 bg-[#050505] cursor-pointer group"
    >
      
      {/* DYNAMIC SCENE RENDERER */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {data.type === "2D" ? (
          <WallScene bgImg={data.bg} artImg={data.artImg} frameStyle={data.frameStyle} isActive={isActive} />
        ) : (
          <PedestalScene bgImg={data.bg} artImg={data.artImg} artImg2={data.artImg2} isActive={isActive} />
        )}
      </div>

      {/* STATIC OVERLAYS - No dark hover effects */}
      <div className="absolute inset-0 pointer-events-none z-20" />
      <div className={`absolute inset-0 bg-gradient-to-t to-transparent transition-opacity duration-500 pointer-events-none z-30 ${isActive ? 'opacity-90' : 'opacity-60'}`} />

      {/* TEXT CONTENT */}
      <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end z-40 pointer-events-none">
        <AnimatePresence mode="wait">
          {isActive && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10, transition: { duration: 0.1 } }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="relative w-full"
            >
              <div className="text-[60px] md:text-[120px] font-serif leading-none opacity-5 absolute -top-12 md:-top-20 -left-2 md:-left-4 text-white select-none pointer-events-none">0{data.id}</div>
              <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                 <span className="px-2 py-1 border border-white/30 text-[7px] md:text-[9px] tracking-[2px] uppercase bg-black/20 backdrop-blur-sm">{data.year}</span>
                 <div className="h-[1px] w-8 md:w-12 bg-white/50"></div>
              </div>
              <h2 className="text-3xl md:text-7xl font-serif italic mb-2 md:mb-4 text-white drop-shadow-lg">{data.title}</h2>
              <p className="text-xs md:text-sm font-light tracking-wide max-w-md text-white/80 mb-4 md:mb-8 border-l border-white/30 pl-3 md:pl-4 hidden md:block drop-shadow-md">
                Explore the finest collection of {data.desc}. <br/>Curated for the modern connoisseur.
              </p>
              <button className="flex items-center gap-3 text-[9px] md:text-[11px] tracking-[3px] uppercase text-white transition-colors group/btn pointer-events-auto mt-2 md:mt-0">
                View Gallery
                <div className="p-1.5 md:p-2 rounded-full border border-white/30 group-hover/btn:bg-white group-hover/btn:text-black transition-all">
                  <ArrowUpRight size={14} />
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* INACTIVE TEXT - Centered horizontally on mobile, rotated on desktop */}
        {!isActive && (
           <div className="absolute inset-0 flex items-center justify-center">
             <motion.h3 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.3 }}
               className="text-lg md:text-4xl font-serif font-bold tracking-[4px] md:tracking-[6px] uppercase text-white/40 whitespace-nowrap md:-rotate-90 origin-center select-none drop-shadow-lg"
             >
               {data.title}
             </motion.h3>
             <div className="absolute right-4 md:right-auto md:bottom-8 text-[8px] md:text-[10px] text-white/30 tracking-widest">0{data.id}</div>
           </div>
        )}
      </div>
    </motion.div>
  );
};
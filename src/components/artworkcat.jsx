import React, { useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

// --- DYNAMIC CURATED DATA ---
const WALL_BG = "src/assets/faded-orange-wall-with-row-spotlights-empty-room.jpg"; 
const Studio_BG = "src/assets/4125099.jpg"; 

const CATEGORIES = [
  {
    id: 1,
    title: "Painting",
    type: "2D",
    bg: WALL_BG,
    artImg: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 2,
    title: "Sculpture",
    type: "3D", 
    bg: Studio_BG,
    artImg: "src/assets/sculptureguidehero-Photoroom.png",
  },
  {
    id: 3,
    title: "Drawing",
    type: "2D",
    bg: WALL_BG,
    artImg: "src/assets/jene-stephaniuk--MCrF6hnojU-unsplash.jpg", 
  },
  {
    id: 4,
    title: "Digital Art",
    type: "2D",
    bg: Studio_BG,
    artImg: "https://images.pexels.com/photos/2860804/pexels-photo-2860804.jpeg?auto=compress&cs=tinysrgb&w=800", 
  },
  {
    id: 5,
    title: "Photography",
    type: "2D",
    bg: WALL_BG,
    artImg: "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800", 
  }
];

// --- INDIVIDUAL ARTWORK COMPONENT ---
const ArtScene = ({ data, index, smoothProgress }) => {
  // 1. Image Animation Logic (Z-20: Middle Layer)
  const imgY = useTransform(smoothProgress, [index - 1, index, index + 1], ["120vh", "0vh", "-120vh"]);
  const imgX = useTransform(smoothProgress, [index - 1, index, index + 1], ["40vw", "12vw", "-40vw"]);
  const imgRotate = useTransform(smoothProgress, [index - 1, index, index + 1], [35, 0, -35]); 
  const imgScale = useTransform(smoothProgress, [index - 1, index, index + 1], [0.6, 1, 0.6]);
  const opacity = useTransform(smoothProgress, [index - 0.8, index, index + 0.8], [0, 1, 0]);

  // 2. Text Animation Logic (Shared for BOTH Text Layers)
  const textY = useTransform(smoothProgress, [index - 1, index, index + 1], ["100vh", "0vh", "-100vh"]);
  const textX = useTransform(smoothProgress, [index - 1, index, index + 1], ["-40vw", "-12vw", "40vw"]);
  const textRotate = useTransform(smoothProgress, [index - 1, index, index + 1], [-25, 0, 25]); 

  // 3. Background Crossfade Logic
  const bgOpacity = useTransform(smoothProgress, [index - 0.5, index, index + 0.5], [0, 0.25, 0]);

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden pointer-events-none">
      
      {/* Background Layer */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${data.bg})`, opacity: bgOpacity }}
      />

      {/* 1. SOLID TEXT LAYER (Z-10: Behind Image) */}
      <motion.div 
        className="absolute z-10 flex flex-col items-center justify-center pointer-events-none"
        style={{ y: textY, x: textX, rotate: textRotate, opacity }}
      >
        {/* Adjusted text size from 14vw to 8.5vw for mobile to fit "Photography" */}
        <h1 className="text-[8.5vw] md:text-[10vw] font-sans font-black uppercase tracking-tighter leading-none text-[#ffffff] select-none whitespace-nowrap drop-shadow-md scale-y-[1.9]">
          {data.title}
        </h1>
      </motion.div>

      {/* 2. CENTRAL ARTWORK LAYER (Z-20: Middle) */}
      <motion.div 
        className="absolute z-20 pointer-events-auto flex items-center justify-center"
        style={{ y: imgY, x: imgX, rotate: imgRotate, scale: imgScale, opacity }}
      >
        <img 
          src={data.artImg} 
          alt={data.title} 
          className="w-[300px] md:w-[550px] lg:w-[700px] object-cover shadow-2xl drop-shadow-[0_40px_60px_rgba(0,0,0,0.9)]"
          style={{ maxHeight: '85vh' }}
        />
      </motion.div>

      {/* 3. OUTLINED TEXT LAYER (Z-30: In Front of Image) */}
      <motion.div 
        className="absolute z-30 flex flex-col items-center justify-center pointer-events-none"
        style={{ y: textY, x: textX, rotate: textRotate, opacity }}
      >
        {/* Identical text styling, but transparent fill and white stroke */}
        <h1 
          className="text-[8.5vw] md:text-[10vw] font-sans font-black uppercase tracking-tighter leading-none text-transparent select-none whitespace-nowrap scale-y-[1.9]"
          style={{ WebkitTextStroke: "2px #ffffff" }}
        >
          {data.title}
        </h1>
      </motion.div>

    </div>
  );
};

export default function DesignEmbracedScroll() {
  // Use an integer to track the exact page (0, 1, 2, etc.)
  const targetIndex = useRef(0);
  // Add a lock to prevent rapid-fire scrolling (the "page flip" cooldown)
  const isScrolling = useRef(false);
  
  // The physics spring: Snappy, fast, and no bounce
  const smoothProgress = useSpring(0, {
    damping: 30,    // High enough to prevent wobbling/bouncing
    stiffness: 100, // Speed of the snap
    mass: 1,        // Normal weight so it doesn't feel sluggish
    restDelta: 0.001
  });

  useEffect(() => {
    // A helper function to trigger the move and lock the scroll temporarily
    const snapToNext = () => {
      isScrolling.current = true;
      smoothProgress.set(targetIndex.current);
      
      // Cooldown timer: Wait 800ms before letting the user flip again
      setTimeout(() => {
        isScrolling.current = false;
      }, 800); 
    };

    // --- DESKTOP WHEEL LOGIC ---
    const handleWheel = (e) => {
      if (isScrolling.current) return; // Ignore if currently animating

      const threshold = 30; // Ignore tiny accidental mouse movements

      if (e.deltaY > threshold) {
        // Scroll Down -> Snap to Next
        targetIndex.current = Math.min(targetIndex.current + 1, CATEGORIES.length - 1);
        snapToNext();
      } else if (e.deltaY < -threshold) {
        // Scroll Up -> Snap to Previous
        targetIndex.current = Math.max(targetIndex.current - 1, 0);
        snapToNext();
      }
    };

    // --- MOBILE TOUCH LOGIC ---
    let startY = 0;
    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
    };
    
    // Use touchEnd instead of touchMove to register a discrete "swipe"
    const handleTouchEnd = (e) => {
      if (isScrolling.current) return;

      const endY = e.changedTouches[0].clientY;
      const deltaY = startY - endY;
      const swipeThreshold = 40; // Minimum swipe distance to trigger a turn

      if (deltaY > swipeThreshold) {
        // Swipe Up -> Snap to Next
        targetIndex.current = Math.min(targetIndex.current + 1, CATEGORIES.length - 1);
        snapToNext();
      } else if (deltaY < -swipeThreshold) {
        // Swipe Down -> Snap to Previous
        targetIndex.current = Math.max(targetIndex.current - 1, 0);
        snapToNext();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [smoothProgress]);

  return (
    <div className="relative w-screen h-[100dvh] bg-[#0c0c0c] overflow-hidden text-[#e8e8e4] font-sans">

      {/* RENDER ALL SCENES */}
      {CATEGORIES.map((cat, index) => (
        <ArtScene 
          key={cat.id} 
          data={cat} 
          index={index} 
          smoothProgress={smoothProgress} 
        />
      ))}

    </div>
  );

}
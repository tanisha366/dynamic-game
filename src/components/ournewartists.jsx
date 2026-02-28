import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const artworks = [
  {
    title: "Priyanka Bardhan",
    category: "Painting",
    location: "Newdelhi, India",
    img: "https://zigguratss.com/assets/upload/artist/zigguratss_6ca65eccfa604a95f3bff20f64e5fbd8.jpg",
  },
  {
    title: "Vivek Kisan Vadkar",
    category: "Painting",
    location: "Karjat, India",
    img: "https://zigguratss.com/assets/upload/artist/zigguratss_fbcb02ffe4f2ed72538c4e24054f74e3.png",
  },
  {
    title: "PANCHU GHARAMI",
    category: "Painting",
    location: "KOLKATA, India",
    img: "https://zigguratss.com/assets/upload/artist/zigguratss_bc6b2b722eb5f6f13e40a325fa017aac.jpg",
  },
  {
    title: "Sangita agarwal",
    category: "Painting",
    location: "Howrah , India",
    img: "https://zigguratss.com/assets/upload/artist/zigguratss_83c3b422adf2f31766d3f171c6af966f.jpg",
  },
  {
    title: "Madhushree Pawar",
    category: "Digital",
    location: "Ahemdabad , India",
    img: "https://zigguratss.com/assets/upload/artist/zigguratss_7cb4901b38fa7a380ae9dbafc8eb2b42.jpg",
  },
];

export default function ArtistPage() {
  const [active, setActive] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const containerRef = useRef(null);
  const dragStartX = useRef(0);

  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % artworks.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRotate]);

  const handleWheel = (e) => {
    setAutoRotate(false);
    if (e.deltaY > 0) {
      setActive((prev) => (prev + 1) % artworks.length);
    } else {
      setActive((prev) => (prev - 1 + artworks.length) % artworks.length);
    }
  };

  const handleMouseDown = (e) => {
    setAutoRotate(false);
    dragStartX.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    const diff = e.clientX - dragStartX.current;
    if (diff > 50) {
      setActive((prev) => (prev - 1 + artworks.length) % artworks.length);
    } else if (diff < -50) {
      setActive((prev) => (prev + 1) % artworks.length);
    }
  };

  return ( 
    <div className="w-full h-screen bg-black flex">
     
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="relative w-[100%] h-[70%] flex items-center justify-center overflow-hidden bg-gray-900 "
      >
     
        <div className="absolute w-[600px] h-[600px] bg-purple-500/20 blur-3xl rounded-full animate-pulse" />

      

      
        <div className="relative w-full max-w-5xl h-[420px] flex items-center justify-center perspective-[2000px]">
          {artworks.map((art, i) => {
            let offset = i - active;

       
            if (offset > artworks.length / 2) offset -= artworks.length;
            if (offset < -artworks.length / 2) offset += artworks.length;

            return (
              <motion.div
                key={i}
                onClick={() => {
                  setAutoRotate(false);
                  setActive(i);
                }}
                animate={{
                  rotateY: offset * 40,
                  x: offset * 240,
                  scale: offset === 0 ? 1.15 : 0.8,
                  opacity: Math.abs(offset) > 2 ? 0 : 1,
                  z: offset === 0 ? 100 : -Math.abs(offset) * 100,
                }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
                className="absolute w-64 h-96 cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
              >
             
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
                  <img
                    src={art.img}
                    alt={art.title}
                    className="w-full h-3/4 object-cover pointer-events-none"
                  />

                  <div className="p-4 text-center">
                    <h2 className="text-white font-semibold text-lg">
                      {art.title}
                    </h2>
                    <p className="text-white/60 text-sm">
                      {art.category} • {art.location}
                    </p>
                  </div>
                </div>

             
                {offset === 0 && (
                  <div className="absolute inset-0 rounded-2xl border-2 border-purple-400 blur-md" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

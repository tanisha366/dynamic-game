import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const paintings = [
  {
    img: "https://zigguratss.com/assets/upload/art-1258.jpg",
    bgUrl: "https://zigguratss.com/assets/images/custom/room2.png",
    size: "w-52 h-52",
    top: "12%",
    left: "30%",
  },
  {
    img: "https://zigguratss.com/assets/upload/art/zigguratss_53fb79274c175b42da83e0518f2ef105.jpg",
    bgUrl: "https://zigguratss.com/assets/images/custom/room3.jpg",
    size: "w-64 h-48",
    top: "12%",
    left: "55%",
  },
  {
    img: "https://zigguratss.com/assets/upload/art-1229.jpg",
    bgUrl: "https://zigguratss.com/assets/images/custom/room.png",
    size: "w-48 h-64",
    top: "10%",
    left: "75%",
  },
];
function Mostview() {
   const [index, setIndex] = useState(0);
  const [showFrame, setShowFrame] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFrame(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % paintings.length);
        setShowFrame(true);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const leftPainting = paintings[index];
  const rightPainting = paintings[(index + 1) % paintings.length];

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* BACKGROUND */}
      <AnimatePresence mode="wait">
        <motion.div
          key={leftPainting.bgUrl}
          className="fixed inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${leftPainting.bgUrl})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
      </AnimatePresence>

      <div className="fixed inset-0 bg-black/20" />

      {/* LEFT FRAME */}
      <Frame
        painting={leftPainting}
        left="35%"
        showFrame={showFrame}
        animKey={`left-${index}`}
        rotateStart={-8}
      />

      {/* RIGHT FRAME */}
      <Frame
        painting={rightPainting}
        left="65%"
        showFrame={showFrame}
        animKey={`right-${index}`}
        rotateStart={8}
      />
    </div>
  );
}

function Frame({ painting, left, showFrame, animKey, rotateStart }) {
  return (
    <div
      className="absolute -translate-x-1/2"
      style={{
        left,
        top: painting.top,
      }}
    >
      <AnimatePresence>
        {showFrame && (
          <motion.div
            key={animKey}
            initial={{ y: -600, rotate: rotateStart, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              y: { duration: 0.9, ease: "easeOut" },
              rotate: { duration: 0.6, ease: "easeOut" },
              opacity: { duration: 0.4 },
            }}
            className="flex flex-col items-center"
          >
            {/* Nail */}
            <div className="w-2 h-2 bg-black rounded-full shadow-md" />

            {/* String */}
            <div className="w-[2px] h-10 bg-gray-700" />

            {/* Swing */}
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 3, -3, 2, -2, 1, -1, 0] }}
              transition={{
                delay: 0.9,
                duration: 2.2,
                ease: "easeInOut",
              }}
              className="origin-top"
            >
              {/* Frame */}
              <div
                className={`${painting.size} bg-white p-1 shadow-[0_25px_40px_rgba(0,0,0,0.6)] border-[6px] border-[#4a2f21] rounded-sm`}
              >
                <img
                  src={painting.img}
                  alt="painting"
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Mostview;
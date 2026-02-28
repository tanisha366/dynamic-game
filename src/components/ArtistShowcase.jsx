import React, { useState, useEffect } from 'react';

const ArtistShowcase = ({ users, activeId, direction, handleMouseEnter, setActiveId }) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeProfile = users.find((u) => u.id === activeId) || null;

  return (
    <div className=" relative h-screen flex items-center justify-center overflow-hidden w-full">
      <div className="absolute inset-0 overflow-hidden">
        {activeProfile && (
          <>
            {/* Blurred Backdrop */}
            <div
              className="absolute inset-0 transition-all duration-1000 bg-center bg-no-repeat bg-cover scale-110"
              style={{
                backgroundImage: `url(${activeProfile.image})`,
                filter: 'blur(15px) brightness(0.6)',
                zIndex: 0
              }}
            />
            {/* Centered Image (High Visibility) - Responsive sizing to keep it "fixed" behind the cart */}
            <img
              key={activeProfile.id}
              src={activeProfile.image}
              alt={activeProfile.name}
              referrerPolicy="no-referrer"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] h-[50vh] sm:w-[90vw] sm:h-[65vh] md:w-[85vw] md:h-[85vh] object-contain opacity-40 md:opacity-100 pointer-events-none transition-all duration-1000"
              style={{ zIndex: 1 }}
            />
          </>
        )}
      </div>



      {/* Vertical "ARTISTS" text on right side */}
      <div className="absolute text-green-700 flex flex-col items-center justify-center right-4 md:right-12  z-30">
        <h2 className="text-white text-3xl lg:text-4xl  md:text-5xl   font-black uppercase vertical-text  tracking-[0.30em]">
          MOST VISITED ARTISTS
        </h2>
      </div>

      {/* Subtle Gradient for Top-Left Text Visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-transparent z-10 pointer-events-none"></div>

      {/* Artist Detail Text in the Background (Top Left) - Responsive */}
      <div className="absolute left-4 md:left-12 top-24 md:top-40 z-30 pointer-events-none max-w-[90vw] md:max-w-none">
        {activeProfile && (
          <div
            key={activeProfile.id}
            className="flex flex-col items-start artist-info-animate"
          >
            <span className="text-yellow-400/90 text-[0.6rem] md:text-sm font-bold uppercase tracking-[0.3em] md:tracking-[0.6em] mb-2 md:mb-4 block drop-shadow-[0_2px_8px_rgba(250,204,21,0.4)]">
              Artist Spotlight
            </span>
            <h2 className="text-white text-2xl  lg:text-2xl font-serif font-black uppercase tracking-[0.04em] md:tracking-[0.08em] leading-tight mb-2 md:mb-5 max-w-2xl artist-name-glow">
              {activeProfile.name}
            </h2>
            <div className="w-16 md:w-28 h-1 md:h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500/60 mb-3 md:mb-7 shadow-[0_0_20px_rgba(250,204,21,0.7)] rounded-full"></div>

            <div className="flex flex-col gap-2 md:gap-2">

              <p className="text-white/80 text-[0.60rem] md:text-lg lg:text-lg tracking-[0.15em] md:tracking-[0.15em] uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] flex flex-wrap gap-1 md:gap-3 mt-1 md:mt-2">
                <span>{activeProfile.city}</span>
                <span className="text-white/40">•</span>
                <span>{activeProfile.state}</span>
                <span className="text-white/40">•</span>
                <span>{activeProfile.country}</span>
              </p>
              <div className="block items-center gap-2 md:gap-5 flex-wrap">
                <p className="text-white text-xs md:text-xl lg:text-xl font-semibold tracking-[0.1em] md:tracking-[0.25em] uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                  {activeProfile.role}
                </p>
                <span className="hidden md:block h-8 w-[2px] bg-gradient-to-b from-white/60 to-white/20"></span>
                <p className="text-yellow-400 text-xs md:text-lg lg:text-lg font-bold tracking-[0.06em] md:tracking-[0.12em] drop-shadow-[0_4px_12px_rgba(250,204,21,0.4)]">
                  {activeProfile.artworksCount}+ Artworks
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center z-10 w-full max-w-6xl relative pt-40 pb-16 md:pt-64 md:pb-32">
        <div className="relative flex flex-col items-center justify-center gap-0">
          {/* Main Card - Responsive sizing */}

          <div className="relative w-[220px] h-[300px] sm:w-[260px] sm:h-[340px] md:w-[300px] md:h-[400px]">
            {activeId && (
              <div
                key={`${activeId}-${direction}`}
                className={`absolute inset-0 animate-card-tree-fall-${direction} flex items-center justify-center`}
              >
                <div
                  className="relative w-full h-full bg-white rounded-[40px] shadow-[0_50px_160px_rgba(0,0,0,0.45)] flex items-center justify-center"
                >
                  <div className="relative w-[98%] h-[98%] overflow-hidden rounded-[26px]">
                    <img
                      src={activeProfile.image}
                      alt={activeProfile.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnails Circular "Tree-Fall" Style Carousel - Pulled up to touch the card */}
          <div
            className="relative w-full h-24 sm:h-32 md:h-48 flex justify-center -mt-6 sm:-mt-8 md:-mt-12 overflow-visible"
            onMouseLeave={() => setActiveId(activeProfile.id)}
          >
            <div className="relative w-full max-w-2xl h-full flex items-center justify-center">
              {users.map((user, index) => {
                const activeIndex = activeId
                  ? users.findIndex((u) => u.id === activeId)
                  : 0;
                const offset = index - activeIndex;
                const isActive = activeId === user.id;

                // Responsive Circular Arc Math - Spaced out to create a gap on all devices
                const angle = offset * (windowWidth < 768 ? 32 : 26);
                const radius = windowWidth < 480 ? 130 : windowWidth < 768 ? 170 : 230;
                const tx =
                  Math.sin((angle * Math.PI) / 180) * radius;
                const ty =
                  (1 - Math.cos((angle * Math.PI) / 180)) * radius;

                return (
                  <div
                    key={user.id}
                    className="absolute transition-all duration-1000 cubic-bezier(0.19, 1, 0.22, 1) cursor-pointer"
                    style={{
                      left: '50%',
                      transform: `translateX(calc(-50% + ${tx}px)) translateY(${ty}px) rotate(${angle}deg) scale(${isActive ? 1.3 : 0.9
                        })`,
                      zIndex: 100 - Math.abs(offset),
                      opacity:
                        isActive
                          ? 1
                          : Math.abs(offset) > 2 // Show 2 users on each side (5 total)
                            ? 0
                            : 0.8 - (Math.abs(offset) * 0.2), // Smooth fade for 2 items
                      transformOrigin: 'bottom center',
                    }}
                    onMouseEnter={() => handleMouseEnter(user)}
                  >
                    <div
                      className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full border-2 md:border-4 ${isActive
                        ? 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.6)]'
                        : 'border-white'
                        } overflow-hidden shadow-xl transition-all duration-500 bg-white group hover:scale-110`}
                    >
                      <img
                        src={user.thumb}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-500"
                      />
                    </div>

                    {isActive && (
                      <div className="absolute inset-0 rounded-full animate-pulse border-2 border-white/50 "></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistShowcase;

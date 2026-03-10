

import React from "react";

const ORBIT_ANGLES = [270, 315, 0, 45, 90, 135, 180, 225]; // degrees
const RADIUS = 42; // percent of container

function getOrbitStyle(angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  const x = 50 + RADIUS * Math.cos(rad);
  const y = 50 + RADIUS * Math.sin(rad);
  return { left: `${x}%`, top: `${y}%` };
}

const Smallimage = ({ artists, onSelect, activeId, onMainClick }) => {
  const activeArtist = artists.find((a) => a.id === activeId) || artists[0];
  const surrounding = artists.filter((a) => a.id !== activeArtist?.id).slice(0, 8);

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-center gap-10 py-8 px-4">

      {/* ── LEFT: Orbital circles ── */}
      <div className="relative w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] flex-shrink-0">

        {/* Dashed orbit ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[84%] h-[84%] rounded-full
          border border-dashed border-white/10 z-0" />

        {/* Surrounding small circles */}
        {surrounding.map((artist, i) => {
          const style = getOrbitStyle(ORBIT_ANGLES[i]);
          return (
            <button
              key={artist.id}
              onClick={() => onSelect(artist)}
              style={style}
              className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden
                border-2 border-white/30 hover:border-teal-400
                hover:scale-110 transition-all duration-300
                shadow-md z-10 -translate-x-1/2 -translate-y-1/2"
              title={artist.name}
            >
              <img src={artist.thumbnail} alt={artist.name} className="w-full h-full object-cover" />
            </button>
          );
        })}

        {/* Center big circle */}
        <button
          onClick={onMainClick}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-52 h-52 sm:w-64 sm:h-64
            rounded-full overflow-hidden
            border-4 border-teal-400/70 hover:border-teal-400
            shadow-[0_0_50px_rgba(45,212,191,0.3)]
            hover:shadow-[0_0_80px_rgba(45,212,191,0.5)]
            transition-all duration-500 z-20 group"
          title={`Explore ${activeArtist?.name}`}
        >
          <img
            src={activeArtist?.thumbnail}
            alt={activeArtist?.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center
            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-xs font-bold tracking-widest uppercase text-center px-2 leading-snug">
              {activeArtist?.name}
            </p>
          </div>
        </button>
      </div>

      {/* ── RIGHT: Artist info panel ── */}
      <div className="flex flex-col gap-5 max-w-xs w-full">

        {/* Decorative line + label */}
        <div className="flex items-center gap-3">
          <span className="w-8 h-[2px] bg-teal-400 rounded-full" />
          <span className="text-xs tracking-[0.3em] uppercase text-teal-400">Featured Artist</span>
        </div>

        {/* Name */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
          {activeArtist?.name}
        </h2>

        {/* Divider */}
        <div className="w-12 h-[2px] bg-teal-400/40 rounded-full" />

        {/* Info rows */}
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-gray-500 mb-1">Specialty</p>
            <p className="text-sm text-gray-200">{activeArtist?.type}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-gray-500 mb-1">Origin</p>
            <p className="text-sm text-gray-200">{activeArtist?.country}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-gray-500 mb-1">Total Artworks</p>
            <p className="text-sm text-gray-200">{activeArtist?.totalnoart}</p>
          </div>
        </div>

        {/* Explore button */}
        <button
          onClick={onMainClick}
          className="mt-2 w-fit px-8 py-3 rounded-full border border-teal-400 text-teal-400
            text-sm tracking-[0.2em] uppercase font-medium
            hover:bg-teal-400 hover:text-black
            transition-all duration-300"
        >
          Explore the Artist
        </button>
      </div>

    </div>
  );
};

export default Smallimage;









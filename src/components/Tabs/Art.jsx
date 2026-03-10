import React from "react";

const Art = ({ artist }) => {
  if (!artist) return null;

  return (
    <div className="columns-2 sm:columns-3 md:columns-3" data-aos="fade-up">
      {artist.paintings.map((painting, i) => (
        <div
          key={i}
          className="mb-6 break-inside-avoid rounded-lg overflow-hidden bg-transparent shadow-xl hover:shadow-2xl"
        >
          <img
            src={painting.image}
            alt={painting.title}
            className="w-full h-auto object-cover rounded-lg "
          />
          <div className="p-1 sm:p-1 flex items-center justify-between ">
            <h2 className="text-[0.5rem] sm:text-sm font-medium">{painting.title}</h2>
            <p className="text-[0.5rem] sm:text-xs text-gray-500">{painting.artist}</p>
          </div>
          <div className="p-1 sm:p-1 flex items-center justify-between">
             <p className="text-[0.5rem] sm:text-xs text-gray-400">
              {painting.type} – {painting.size}
            </p>
            <p className="text-[0.5rem] sm:text-xs text-gray-400 font-semibold mt-1">
              ${painting.price}</p>
           </div>
        </div>
      ))}
    </div>



  );
};

export default Art;
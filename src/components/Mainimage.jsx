import React from 'react'
import { artists } from '../data/artists'

const Mainimage = ({ artist }) => {
  if (!artist) return null;

  return (
    <section className="w-full max-w-md mx-auto" data-aos="fade-up">
      {/* Main Image */}
      <img
        src={artist.mainImage}
        alt={artist.name}
        className="w-full h-[350px] md:h-[450px] object-cover rounded-xl"
      />

      {/* Artist Info Below Image */}
      <div className=" text-gray-300 text-[0.5rem] sm:text-sm flex flex-col items-center justify-center">
        <h2 className="text-xs md:text-xl font-bold">{artist.name}</h2>
        <p><span className="font-semibold"></span> {artist.country}</p>
        <p><span className="font-semibold"></span> {artist.type}</p>
        <p><span className="font-semibold">Total Artworks:</span> {artist.totalnoart}</p>
      </div>
    </section>
  )
}

export default Mainimage

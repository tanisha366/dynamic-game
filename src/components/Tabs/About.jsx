import React from 'react'

const About = ({ artist }) => {
  return (
    <>
     <div data-aos="fade-right">
      <p className='text-xl sm:text-2xl '>{artist.name}</p>
      <p className='text-xs sm:text-xl'>{artist.country}.....</p>
        <p className="text-gray-400 text-[0.9rem] sm:text-[1rem]">{artist.description}</p>
        <p className="text-gray-400 text-[0.9rem] sm:text-[1rem]">{artist.descr}</p>

        
    </div>
    </>
  )
}

export default About

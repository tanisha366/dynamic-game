import React from "react";

const Exhibition = ({ artist }) => {
  return (
    <div className="space-y-4" data-aos="fade-left">

      <h2 className="text-white font-semibold text-md sm:text-lg">
        Education
      </h2>

      {artist?.exhibition?.map((edu, index) => (
        <div
          key={index}
          className="border-b border-slate-600 pb-3 text-gray-300"
        >
          <p className="font-medium text-sm sm:text-xl text-white">{edu.degree}</p>
          <p className="font-medium  text-[0.6rem] sm:text-[1rem] text-gray-300">{edu.college}</p>
          <p className="font-medium  text-[0.6rem] sm:text-[1rem] text-gray-300">{edu.university}</p>
          <p className=" text-[0.6rem] sm:text-[1rem] text-gray-400">{edu.year}</p>
        </div>
      ))}

    </div>
  );
};

export default Exhibition;

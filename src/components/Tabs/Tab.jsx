import { useState } from "react";
import About from "./About";
import Art from "./Art";
import Exhibition from "./Exhibition";

const Tabs = ({ artist }) => {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="bg-slate-800 rounded-xl p-4 h-[520px] flex flex-col">
      {/* Buttons */}
      <div className="flex gap-2 mb-4 shrink-0">
        {/* Always show About */}
        <button
          onClick={() => setActiveTab("about")}
          className={`h-8  w-20 items-center  rounded-lg text-sm ${
            activeTab === "about"
              ? "bg-teal-500 text-black"
              : "bg-slate-700 text-gray-300"
          }`}
        >
          About
        </button>

        {/* Show Art button only if paintings exist */}
        {artist.paintings && artist.paintings.length > 0 && (
          <button
            onClick={() => setActiveTab("art")}
            className={`h-8  w-20 items-center  rounded-lg text-sm ${
              activeTab === "art"
                ? "bg-teal-400 text-black"
                : "bg-slate-700 text-gray-300"
            }`}
          >
            Art
          </button>
        )}

        {/* Show Exhibition button only if exhibition exists */}
        {/* {artist.exhibition && artist.exhibition.trim() !== "" && ( */}
      {Array.isArray(artist.exhibition) && artist.exhibition.length > 0 && (
  <button
    onClick={() => setActiveTab("exhibition")}
    className={`h-8 w-24 rounded-lg text-sm ${
      activeTab === "exhibition"
        ? "bg-teal-400 text-black"
        : "bg-slate-700 text-gray-300"
    }`}
  >
    Exhibition
  </button>
)}

      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pr-1">
        {activeTab === "about" && <About artist={artist} />}
        {activeTab === "art" && artist.paintings && artist.paintings.length > 0 && (
          <Art artist={artist} />
        )}
        {/* {activeTab === "exhibition" &&
          artist.exhibition &&
          artist.exhibition.trim() !== "" && <Exhibition artist={artist}
           />} */}
 {activeTab === "exhibition" &&
  Array.isArray(artist.exhibition) &&
  artist.exhibition.length > 0 && (
    <Exhibition artist={artist} />
  )}


      </div>
    </div>
  );
};

export default Tabs;

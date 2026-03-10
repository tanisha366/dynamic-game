
import React, { useRef, useState } from "react";
import { artists as artistsData } from "../data/artists";
import Search from "./Search";
import Mainimage from "./Mainimage";
import Tab from "./Tabs/Tab";
import Smallimage from "./Smallimage";

const Home = () => {
  const [filters, setFilters] = useState({
    artist: "",
    country: null,
    type: ""
  });

  const [artists] = useState(artistsData);
  const [filteredArtists, setFilteredArtists] = useState(artistsData);
  const [activeArtist, setActiveArtist] = useState(artistsData[0]);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [view, setView] = useState("grid"); // "grid" | "detail"

  const smallRef = useRef(null);
  const mainRef = useRef(null);

const handleSearch = () => {
  // ⛔ strict condition
  if (!filters.artist || !filters.country) return;

  setHasSearched(true);
  setLoading(true);
  setNoData(false);

  setTimeout(() => {
    let result = artists;

    if (filters.artist) {
      result = result.filter((a) =>
        a.name.toLowerCase().includes(filters.artist.toLowerCase())
      );
    }

    if (filters.country) {
      result = result.filter(
        (a) =>
          a.country.toLowerCase() ===
          filters.country.name.common.toLowerCase()
      );
    }

    if (filters.type) {
      result = result.filter((a) => a.type === filters.type);
    }

    setLoading(false);

    if (!result.length) {
      setFilteredArtists([]);
      setNoData(true);
      return;
    }

    setFilteredArtists(result);
    setView("grid");

    // ✅ scroll ONLY now
    setTimeout(() => {
      smallRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  }, 600);
};


  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="animate-spin h-12 w-12 border-4 border-teal-400 border-t-transparent rounded-full" />
        </div>
      )}

      <div className="min-h-screen max-w-7xl mx-auto bg-[#1e232a] p-6 rounded-2xl flex flex-col gap-8">

        <Search
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          artists={artists}
        />

        {/* Detail View */}
        {view === "detail" && (
          <div ref={mainRef} className="flex flex-col gap-4">
            <button
              onClick={() => setView("grid")}
              className="flex items-center gap-2 w-fit text-teal-400 hover:text-teal-300 transition-colors text-sm font-medium"
            >
              ← Back to Artists
            </button>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-[360px]">
                <Mainimage artist={activeArtist} />
              </div>
              <div className="flex-1">
                <Tab artist={activeArtist} />
              </div>
            </div>
          </div>
        )}

        {/* Grid View */}
        {view === "grid" && filteredArtists.length > 0 && (
          <div ref={smallRef}>
            <div className="mb-8">
              <p className="text-xs tracking-[0.4em] uppercase text-teal-400 mb-2">Our Collection</p>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                Featured <span className="text-teal-400">Artists</span>
              </h1>
            </div>
            <Smallimage
              artists={filteredArtists}
              activeId={activeArtist?.id}
              onSelect={(artist) => {
                setActiveArtist(artist);
              }}
              onMainClick={() => {
                setView("detail");
                setTimeout(() => {
                  mainRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            />
          </div>
        )}

        {noData && (
          <div className="text-center text-gray-400 py-10">
            No data found
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
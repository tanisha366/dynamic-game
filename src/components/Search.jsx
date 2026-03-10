
import React, { useEffect, useRef, useState } from "react";

/* 🔹 Debounce Hook */
const useDebounce = (value, delay = 500) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const Search = ({ filters, setFilters, onSearch, artists }) => {
  const [countries, setCountries] = useState([]);
  const [countryQuery, setCountryQuery] = useState("");
  const [artistSuggestions, setArtistSuggestions] = useState([]);
  const [openCountry, setOpenCountry] = useState(false);
  const [showArtistSuggestions, setShowArtistSuggestions] = useState(false);

  const countryRef = useRef(null);
  const debouncedArtist = useDebounce(filters.artist, 500);

  /* 🌍 Fetch countries */
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,cca3,flags")
      .then((r) => r.json())
      .then(setCountries);
  }, []);

  /* 🔍 Auto search */
  useEffect(() => {
    if (debouncedArtist && filters.country) {
      onSearch();
    }
  }, [debouncedArtist, filters.country, filters.type]);

  /* 👤 Artist Suggestions */
useEffect(() => {
  if (!filters.artist) {
    setArtistSuggestions([]);
    return;
  }
  const matches = artists.filter((a) =>
    a.name.toLowerCase().includes(filters.artist.toLowerCase())
  );
  setArtistSuggestions(matches.slice(0, 5));
}, [filters.artist, artists]);


  /* ❌ Close country dropdown on outside click */
  useEffect(() => {
    const handleClick = (e) => {
      if (countryRef.current && !countryRef.current.contains(e.target)) {
        setOpenCountry(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredCountries = countries.filter((c) =>
    c.name.common.toLowerCase().includes(countryQuery.toLowerCase())
  );

  return (
    <section>
      <div className="flex flex-col md:flex-row gap-4">

        {/* 🔍 Artist Input */}

{/* 🔍 Artist Input */}
<div className="flex-1 relative">
  <input
    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none"
    placeholder="Search artist name"
    value={filters.artist}
    onChange={(e) => {
      setFilters({ ...filters, artist: e.target.value });
      setShowArtistSuggestions(true); // open suggestions while typing
    }}
    onFocus={() => {
      if (filters.artist) setShowArtistSuggestions(true); // open on click
    }}
  />

  {showArtistSuggestions && artistSuggestions.length > 0 && (
    <ul className="absolute z-20 w-full bg-gray-900 mt-2 rounded-lg shadow-lg">
      {artistSuggestions.map((a) => (
        <li
          key={a.id}
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
          onClick={() => {
            setFilters({ ...filters, artist: a.name });
            setShowArtistSuggestions(false); // ✅ close after click
          }}
        >
          {a.name}
        </li>
      ))}
    </ul>
  )}
</div>


        {/* 🌍 Country Select + Search in single input */}
        <div className="flex-1 relative" ref={countryRef}>
          <input
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none cursor-pointer"
            placeholder={filters.country ? filters.country.name.common : "Select country"}
           value={countryQuery}
            onClick={() => setOpenCountry((prev) => !prev)}
            onChange={(e) => {
              setCountryQuery(e.target.value);
              setOpenCountry(true); // open dropdown when typing
            }}
          />
          {openCountry && (
            <ul className="absolute z-20 w-full bg-gray-900 mt-1 rounded-lg max-h-60 overflow-y-auto shadow-lg">
              {filteredCountries.map((c) => (
                <li
                  key={c.cca3}
                  className="px-4 py-2 flex gap-2 items-center hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    setFilters({ ...filters, country: c });
                    setCountryQuery("");
                    setOpenCountry(false); // ✅ close after selection
                  }}
                >
                  <img src={c.flags.png} className="w-6 h-4" />
                  {c.name.common}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🎨 Category */}
        <select
          className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg cursor-pointer"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">Select art type</option>
          <option value="Painting">Painting</option>
          <option value="Drawing">Drawing</option>
          <option value="Art">Art</option>
        </select>
      </div>
    </section>
  );
};

export default Search;

import React, { useState, useEffect, useRef } from 'react';
import { data } from './data';



const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(null); // 'artwork' | 'artist' | null
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobileItem, setExpandedMobileItem] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onHash = () => {
      setCurrentPath(window.location.hash.slice(1) || '/');
      setMenuOpen(null);
      setMobileOpen(false);
      setExpandedMobileItem(null);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (menuOpen || mobileOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, mobileOpen]);

  const isActive = (p) => currentPath === p;

  /* NavLink Component */
  const NavLink = ({ href, label, path, type }) => (
    <button
      onMouseEnter={() => type && setMenuOpen(type)}
      onClick={() => !type && (window.location.hash = href)}
      className={`group relative py-2 px-1 text-[10px] sm:text-[11px] font-aigle uppercase tracking-[0.12em] sm:tracking-[0.15em] font-semibold transition-all duration-300
        ${isActive(path) || menuOpen === type ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'}`}
    >
      {label}
      <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#C5A059] transition-all duration-500
        ${isActive(path) || menuOpen === type ? 'w-full' : 'w-0 group-hover:w-full'}`} />
    </button>
  );

  return (
    <>
      {/* ╔═════════════════════════════════════════╗
          ║  MAIN FLOATING NAVBAR                   ║
          ╚═════════════════════════════════════════╝ */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-3 sm:px-8 py-3 sm:py-6
        ${scrolled ? 'translate-y-0' : 'translate-y-2'}`}>

        <nav className={`max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-10 h-14 sm:h-20
          transition-all duration-500 rounded-full
          ${scrolled
            ? 'bg-[#F5F2ED] shadow-[0_15px_40px_rgba(0,0,0,0.15)] border border-white/50'
            : 'bg-[#F5F2ED]/90 backdrop-blur-md shadow-xl'
          }`}
        >
          {/* Logo - Dark Yellow/Gold */}
          <div className="flex-shrink-0">
            <a href="#/" className="block">
              <img src="/logo.png" alt="Zigguratss" className="h-7 sm:h-10 w-auto sepia saturate-[400%] hue-rotate-[350deg] brightness-[0.9] contrast-[1.1] rendering-pixelated" style={{ imageRendering: 'auto' }} />
            </a>
          </div>

          {/* Desktop Nav - adjusted gap for tablet/desktop */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <NavLink href="#/" label="Home" path="/" />
            <NavLink href="#/artwork" label="Artwork" type="artwork" />
            <NavLink href="#/artists" label="Artists" type="artist" />
            <NavLink href="#/about" label="About" path="/about" />
            <NavLink href="#/blog" label="Blog" path="/blog" />
            <NavLink href="#/contact" label="Contact" path="/contact" />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Bar - Expanding Design */}
            <div ref={searchRef}
              className={`relative flex items-center transition-all duration-500 overflow-hidden ${isSearchOpen ? 'w-24 min-[400px]:w-32 sm:w-48' : 'w-8 sm:w-10'}`}
            >
              <input
                type="text"
                placeholder="Search collections..."
                className={`w-full bg-white/40 border border-[#1A1A1A]/10 rounded-full
                  py-1.5 pl-3 pr-8 text-xs sm:text-sm focus:outline-none focus:border-[#C5A059]/40
                  transition-all duration-300
                  ${isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
              />
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="absolute right-0 p-2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            <div className="h-4 w-px bg-[#1A1A1A]/10 hidden sm:block mx-1" />

            <button className="p-2 text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            <button className="p-2 text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#C5A059] rounded-full border-2 border-[#F5F2ED]" />
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full ml-1"
            >
              <span className={`w-4 h-0.5 bg-[#1A1A1A] transition-all ${mobileOpen ? 'rotate-45 translate-y-1' : ''}`} />
              <span className={`w-4 h-0.5 bg-[#1A1A1A] transition-all ${mobileOpen ? '-rotate-45 -translate-y-1' : ''}`} />
            </button>
          </div>
        </nav>
      </div>

      {/* ╔═════════════════════════════════════════╗
          ║  FULL-SCREEN CURTAIN MENU               ║
          ╚═════════════════════════════════════════╝ */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-700 flex
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className={`absolute inset-0 bg-[#1A1A1A]/95 backdrop-blur-xl transition-transform duration-700 ease-in-out
          ${menuOpen ? 'translate-y-0' : '-translate-y-full'}`} />

        <div className="relative w-full h-full flex flex-col pointer-events-auto">
          <div className="h-24 sm:h-32 flex items-center justify-end px-6 sm:px-12 md:px-20">
            <button
              onClick={() => setMenuOpen(null)}
              className="group flex items-center gap-3 text-white/40 hover:text-white transition-all"
            >
              <span className="text-[10px] uppercase tracking-[0.4em]">Close</span>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:rotate-90 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" />
                </svg>
              </div>
            </button>
          </div>

          <div className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="col-span-full lg:col-span-4 self-center">
              <p className="text-[#C5A059] text-[10px] uppercase tracking-[0.5em] font-bold mb-8">
                {menuOpen === 'artwork' ? 'Curated Collection' : 'Archive'}
              </p>
              <div className="flex flex-col gap-5">
                {(menuOpen === 'artwork' ? data.artwork.categories : data.artists.categories).map((cat, i) => (
                  <a
                    key={cat}
                    href={menuOpen === 'artwork' ? '#/artwork' : '#/artist'}
                    className="text-xl xl:text-xl font-serif text-white/50 hover:text-white transition-all"
                  >
                    {cat}
                  </a>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex col-span-full lg:col-span-5 gap-x-12 self-center lg:border-l border-white/5 lg:pl-16 h-2/3 items-start">
              {menuOpen === 'artwork' ? (
                <>
                  <div className="flex-1 flex flex-col gap-12">
                    <div>
                      <h4 className="text-white/20 text-[9px] uppercase tracking-[0.3em] font-bold mb-5">Category</h4>
                      <ul className="flex flex-col gap-2.5">
                        {data.artwork.filters.Category.slice(0, 5).map(item => (
                          <li key={item}><a href="#" className="text-white/40 hover:text-[#C5A059] text-sm transition-colors">{item}</a></li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white/20 text-[9px] uppercase tracking-[0.3em] font-bold mb-5">Medium</h4>
                      <ul className="flex flex-col gap-2.5">
                        {data.artwork.filters.Medium.slice(0, 5).map(item => (
                          <li key={item}><a href="#" className="text-white/40 hover:text-[#C5A059] text-sm transition-colors">{item}</a></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white/20 text-[9px] uppercase tracking-[0.3em] font-bold mb-5">Style</h4>
                    <ul className="flex flex-col gap-2.5">
                      {data.artwork.filters.Style.slice(0, 5).map(item => (
                        <li key={item}><a href="#" className="text-white/40 hover:text-[#C5A059] text-sm transition-colors">{item}</a></li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-x-8 gap-y-12 w-full">
                  {Object.entries(data.artists.groups).slice(0, 4).map(([name, items]) => (
                    <div key={name}>
                      <h4 className="text-white/20 text-[9px] uppercase tracking-[0.3em] font-bold mb-4">{name}</h4>
                      <ul className="flex flex-col gap-2">
                        {items.slice(0, 5).map(item => (
                          <li key={item}><a href="#" className="text-white/40 hover:text-[#C5A059] text-sm transition-colors">{item}</a></li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden lg:block col-span-3 self-center">
              <div className="aspect-[3/4] rounded-sm overflow-hidden relative group">
                <img
                  src={menuOpen === 'artwork' ? data.artwork.featured.image : data.artists.profiles[0].image}
                  alt="Featured"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent opacity-60" />
              </div>
              <a href="#/artwork" className="mt-8 flex items-center gap-4 text-[#C5A059] text-[10px] uppercase tracking-[0.3em] font-bold hover:text-white transition-colors">
                <span>See Everything</span>
                <div className="h-px w-20 bg-current" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-500
        ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-[#F5F2ED]" />
        <div className="relative h-full flex flex-col p-6 sm:p-8">
          <div className="flex justify-between items-center mb-10 sm:mb-16">
            <img src="/logo.png" className="h-7 sm:h-8 w-auto sepia saturate-[400%] hue-rotate-[350deg] brightness-[0.9] contrast-[1.1]" alt="logo" />
            <button onClick={() => setMobileOpen(false)} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-black/10 rounded-full text-black">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" /></svg>
            </button>
          </div>
          <nav className="flex flex-col gap-4 mt-8 pb-10">
            {['Home', 'Artwork', 'Artists', 'About', 'Blog', 'Contact'].map((item, idx) => {
              const isDropdown = item === 'Artwork' || item === 'Artists';
              const dropdownData = isDropdown ? (item === 'Artwork' ? data.artwork.categories : data.artists.categories) : [];
              const isExpanded = expandedMobileItem === item;

              return (
                <div key={item} className="flex flex-col border-b border-black/5 py-1">
                  <div
                    className="group flex items-center justify-between py-3 cursor-pointer"
                    onClick={() => {
                      if (isDropdown) {
                        setExpandedMobileItem(isExpanded ? null : item);
                      } else {
                        window.location.hash = `#/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`;
                        setMobileOpen(false);
                      }
                    }}
                  >
                    <span className="text-xl sm:text-2xl lg:text-3xl font-serif text-black/60 group-hover:text-black transition-all">
                      {item}
                    </span>
                    {isDropdown ? (
                      <svg
                        className={`w-6 h-6 text-black/40 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-black' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    ) : (
                      <span className="text-[#C5A059] opacity-0 group-hover:opacity-100 transition-all font-mono text-sm tracking-widest">
                        0{idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Dropdown Content */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="flex flex-col gap-3 pl-4 pt-2 pb-4">
                      {dropdownData.map((subItem) => (
                        <a
                          key={subItem}
                          href={`#/${item.toLowerCase()}`}
                          onClick={() => setMobileOpen(false)}
                          className="text-base sm:text-lg font-serif text-black/50 hover:text-[#C5A059] transition-colors"
                        >
                          {subItem}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;

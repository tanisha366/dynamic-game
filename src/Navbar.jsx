import React, { useState, useEffect, useRef } from 'react';
import { data } from './data';

/* ─────────────────────────────────────
   NAVBAR
───────────────────────────────────── */
const Navbar = () => {
  const [activeMega, setActiveMega] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpand, setMobileExpand] = useState(null); // 'artwork' | 'artist' | null
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');
  const searchRef = useRef(null);

  /* sync path */
  useEffect(() => {
    const onHash = () => {
      setCurrentPath(window.location.hash.slice(1) || '/');
      setMobileOpen(false);
      setMobileExpand(null);
      setActiveMega(null);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  /* close search on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* close mobile menu on resize ≥ lg */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  /* desktop hover */
  const onEnter = (type) => { if (window.innerWidth >= 1024) setActiveMega(type); };
  const onLeave = () => { if (window.innerWidth >= 1024) setActiveMega(null); };

  const isActive = (p) => currentPath === p;

  const navLink = (href, label, path) => (
    <a
      href={href}
      className={`text-gray-200/85 hover:text-premium-gold transition-colors ${isActive(path) ? 'text-premium-gold' : ''}`}
    >
      {label}
    </a>
  );

  /* ── Render ── */
  return (
    <>
      {/* ══════════ TOP BAR ══════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass mega-gradient border-b border-white/10 flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 md:px-10">

        {/* ── Hamburger (mobile / tablet) ── */}
        <button
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden flex flex-col justify-center gap-[5px] w-8 h-8 focus:outline-none flex-shrink-0"
        >
          <span className={`block h-0.5 bg-premium-gold rounded transition-all duration-300 origin-center
            ${mobileOpen ? 'w-6 rotate-45 translate-y-[7px]' : 'w-6'}`} />
          <span className={`block h-0.5 bg-premium-gold rounded transition-all duration-300
            ${mobileOpen ? 'w-0 opacity-0' : 'w-6'}`} />
          <span className={`block h-0.5 bg-premium-gold rounded transition-all duration-300 origin-center
            ${mobileOpen ? 'w-6 -rotate-45 -translate-y-[7px]' : 'w-6'}`} />
        </button>

        {/* ── Logo (centred on mobile, left on desktop) ── */}
        <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:left-auto lg:translate-x-0">
          <a href="#/" onClick={() => { setMobileOpen(false); setMobileExpand(null); }}>
            <img src="/logo.png" alt="Zigguratss Logo" className="h-10 sm:h-12 w-auto object-contain" />
          </a>
        </div>

        {/* ── Desktop nav links ── */}
        <ul className="hidden lg:flex items-center gap-6 xl:gap-8 list-none m-0 p-0
                       text-[12px] xl:text-[13px] font-lato uppercase tracking-widest text-gray-200/85">
          <li>{navLink('#/', 'Home', '/')}</li>

          <li onMouseEnter={() => onEnter('artwork')}>
            <button
              onClick={() => setActiveMega(p => p === 'artwork' ? null : 'artwork')}
              className={`flex items-center gap-1 text-gray-200/85 hover:text-premium-gold transition-colors outline-none uppercase tracking-widest
                ${isActive('/artwork') ? 'text-premium-gold' : ''}`}
            >
              Artwork
            </button>
          </li>

          <li onMouseEnter={() => onEnter('artist')}>
            <button
              onClick={() => setActiveMega(p => p === 'artist' ? null : 'artist')}
              className={`flex items-center gap-1 text-gray-200/85 hover:text-premium-gold transition-colors outline-none uppercase tracking-widest
                ${isActive('/artist') ? 'text-premium-gold' : ''}`}
            >
              Artists
            </button>
          </li>

          <li>{navLink('#/about', 'About', '/about')}</li>
          <li>{navLink('#/blog', 'Blog', '/blog')}</li>
          <li>{navLink('#/contact', 'Contact', '/contact')}</li>
        </ul>

        {/* ── Right icons ── */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Search */}
          <div ref={searchRef}
            className={`relative flex items-center transition-all duration-300 overflow-hidden
              ${isSearchOpen ? 'w-32 sm:w-48 md:w-64' : 'w-8 sm:w-9'}`}
          >
            <input
              type="text"
              placeholder="Search collections..."
              className={`w-full bg-black/40 backdrop-blur border border-white/10 rounded-full
                py-1.5 pl-3 pr-8 text-xs sm:text-sm text-gray-100 placeholder-gray-500
                focus:outline-none focus:ring-1 focus:ring-premium-gold/35
                transition-all duration-300
                ${isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            />
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
              className="absolute right-0 p-1.5 text-premium-gold hover:scale-110 transition-transform"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* User */}
          <button aria-label="Account" className="p-1.5 sm:p-2 text-premium-gold hover:scale-110 transition-transform">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          {/* Cart */}
          <button aria-label="Cart" className="p-1.5 sm:p-2 text-premium-gold hover:scale-110 transition-transform">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
        </div>
      </nav>

      {/* ══════════ DESKTOP MEGA MENU ══════════ */}
      <div
        onMouseEnter={() => onEnter(activeMega)}
        onMouseLeave={onLeave}
        className={`hidden lg:block fixed left-0 right-0 top-16 sm:top-20 z-40 mega-gradient
          border-white/10 shadow-2xl transition-all duration-500 overflow-hidden
          ${activeMega ? 'max-h-[580px] opacity-100 border-b border-t' : 'max-h-0 opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto px-6 xl:px-10 py-10 flex gap-10 xl:gap-16">

          {/* ── Artwork mega ── */}
          {activeMega === 'artwork' && (
            <>
              <div className="w-36 xl:w-44 flex-shrink-0">
                <h3 className="text-[10px] uppercase tracking-widest text-premium-gold font-bold mb-5">Collections</h3>
                <ul className="flex flex-col gap-2.5">
                  {data.artwork.categories.map(cat => (
                    <li key={cat}>
                      <a href="#/artwork" className="text-gray-300 hover:text-premium-gold hover:translate-x-1
                         transition-all inline-block font-lato text-base xl:text-lg">{cat}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-1 grid grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8 border-l border-r border-white/10 px-8 xl:px-12">
                {Object.entries(data.artwork.filters).map(([name, items]) => (
                  <div key={name}>
                    <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">{name}</h3>
                    <ul className="flex flex-col gap-1.5">
                      {items.map(item => (
                        <li key={item}>
                          <a href="#/artwork" className="text-gray-200 hover:text-premium-gold transition-colors text-sm xl:text-[15px]">{item}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="w-44 xl:w-56 flex flex-col items-center flex-shrink-0">
                <img src={data.artwork.featured.image} alt="Featured"
                  className="w-full h-36 xl:h-48 object-cover rounded shadow-lg mb-4 hover:scale-105 transition-transform duration-500" />
                <span className="text-premium-gold tracking-tighter text-xl xl:text-2xl font-meow text-center">{data.artwork.featured.title}</span>
                <a href="#/artwork" className="mt-4 px-5 py-2 bg-premium-gold text-white text-[10px] uppercase tracking-widest hover:bg-black transition-colors rounded">
                  Explore All
                </a>
              </div>
            </>
          )}

          {/* ── Artist mega ── */}
          {activeMega === 'artist' && (
            <>
              <div className="w-36 xl:w-44 flex-shrink-0">
                <h3 className="text-[10px] uppercase tracking-widest text-premium-gold font-bold mb-5">Disciplines</h3>
                <ul className="flex flex-col gap-2.5">
                  {data.artists.categories.map(cat => (
                    <li key={cat}>
                      <a href="#/artist" className="text-gray-300 hover:text-premium-gold hover:translate-x-1
                         transition-all inline-block font-serif text-base xl:text-lg">{cat}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-1 grid grid-cols-2 xl:grid-cols-4 gap-4 border-l border-white/10 pl-8 xl:pl-12 pr-8 xl:pr-12 overflow-y-auto max-h-[320px]">
                {Object.entries(data.artists.groups).map(([name, artists]) => (
                  <div key={name}>
                    <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">{name}</h3>
                    <ul className="flex flex-col gap-1.5">
                      {artists.map(artist => (
                        <li key={artist}>
                          <a href="#/artist" className="text-gray-200 hover:text-premium-gold transition-colors text-[13px] xl:text-[14px]">{artist}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="w-44 xl:w-52 grid grid-cols-2 gap-3 flex-shrink-0 content-start">
                {data.artists.profiles.slice(0, 4).map(profile => (
                  <div key={profile.name} className="group cursor-pointer">
                    <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-full overflow-hidden border-2 border-premium-gold/10 mx-auto group-hover:border-premium-gold transition-colors">
                      <img src={profile.image} alt={profile.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <p className="text-[9px] xl:text-[10px] text-center mt-1.5 font-bold uppercase tracking-tighter text-gray-400 group-hover:text-premium-gold">{profile.name}</p>
                  </div>
                ))}
                <div className="col-span-2 text-center mt-3 border-t border-white/10 pt-3">
                  <a href="#/artist" className="text-[10px] uppercase tracking-widest font-bold text-premium-gold hover:underline">View All Artists</a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ══════════ MOBILE / TABLET DRAWER ══════════ */}
      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`lg:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-sm transition-opacity duration-300
          ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer panel */}
      <div className={`lg:hidden fixed top-16 sm:top-20 left-0 right-0 bottom-0 z-40 bg-premium-dark flex flex-col
        transition-transform duration-400 ease-in-out
        ${mobileOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        {/* Mobile search */}
        <div className="px-5 sm:px-8 pt-5 pb-4 border-b border-white/10 flex-shrink-0">
          <label className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 focus-within:border-premium-gold/50 transition-colors">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search collections…"
              className="bg-transparent flex-1 text-sm focus:outline-none text-gray-100 placeholder-gray-500" />
          </label>
        </div>

        {/* Nav list */}
        <nav className="flex-1 overflow-y-auto overscroll-contain">
          <ul className="divide-y divide-white/10 list-none m-0 p-0">

            {/* Home */}
            <li>
              <a href="#/" onClick={() => setMobileOpen(false)}
                className={`flex items-center px-5 sm:px-8 h-14 text-[13px] font-bold uppercase tracking-[0.15em]
                  ${isActive('/') ? 'text-premium-gold' : 'text-gray-200'} hover:text-premium-gold hover:bg-white/5 transition-colors`}
              >
                Home
              </a>
            </li>

            {/* Artwork accordion */}
            <li>
              <button
                onClick={() => setMobileExpand(p => p === 'artwork' ? null : 'artwork')}
                className={`w-full flex items-center justify-between px-5 sm:px-8 h-14 text-[13px] font-bold uppercase tracking-[0.15em]
                  ${mobileExpand === 'artwork' ? 'text-premium-gold bg-premium-gold/10' : 'text-gray-200'} hover:text-premium-gold hover:bg-white/5 transition-colors`}
              >
                Artwork
                <svg className={`w-4 h-4 transition-transform duration-300 ${mobileExpand === 'artwork' ? 'rotate-180 text-premium-gold' : 'text-gray-400'}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`grid bg-white/5 transition-[grid-template-rows] duration-300 ease-out
                ${mobileExpand === 'artwork' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="px-5 sm:px-8 py-3 max-h-[42vh] overflow-y-auto">
                    <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5">
                  {data.artwork.categories.map(cat => (
                    <a key={cat} href="#/artwork" onClick={() => setMobileOpen(false)}
                      className="block py-1 text-sm font-serif text-gray-300 hover:text-premium-gold transition-colors">
                      {cat}
                    </a>
                  ))}
                    </div>
                  </div>
                </div>
              </div>
            </li>

            {/* Artists accordion */}
            <li>
              <button
                onClick={() => setMobileExpand(p => p === 'artist' ? null : 'artist')}
                className={`w-full flex items-center justify-between px-5 sm:px-8 h-14 text-[13px] font-bold uppercase tracking-[0.15em]
                  ${mobileExpand === 'artist' ? 'text-premium-gold bg-premium-gold/10' : 'text-gray-200'} hover:text-premium-gold hover:bg-white/5 transition-colors`}
              >
                Artists
                <svg className={`w-4 h-4 transition-transform duration-300 ${mobileExpand === 'artist' ? 'rotate-180 text-premium-gold' : 'text-gray-400'}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`grid bg-white/5 transition-[grid-template-rows] duration-300 ease-out
                ${mobileExpand === 'artist' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="px-5 sm:px-8 py-3 max-h-[42vh] overflow-y-auto">
                    <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5">
                  {data.artists.categories.map(cat => (
                    <a key={cat} href="#/artist" onClick={() => setMobileOpen(false)}
                      className="block py-1 text-sm font-serif text-gray-300 hover:text-premium-gold transition-colors">
                      {cat}
                    </a>
                  ))}
                    </div>
                  </div>
                </div>
              </div>
            </li>

            {/* Simple links */}
            {[
              { href: '#/about', label: 'About', path: '/about' },
              { href: '#/blog', label: 'Blog', path: '/blog' },
              { href: '#/contact', label: 'Contact', path: '/contact' },
            ].map(({ href, label, path }) => (
              <li key={path}>
                <a href={href} onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-5 sm:px-8 h-14 text-[13px] font-bold uppercase tracking-[0.15em]
                    ${isActive(path) ? 'text-premium-gold' : 'text-gray-200'} hover:text-premium-gold hover:bg-white/5 transition-colors`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom CTA */}
        <div className="flex-shrink-0 px-5 sm:px-8 py-6 border-t border-white/10 bg-premium-dark">
          <a href="#/artwork" onClick={() => setMobileOpen(false)}
            className="block w-full text-center py-3.5 bg-premium-gold text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded hover:bg-black transition-colors">
            Explore Gallery
          </a>
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────
   APP
───────────────────────────────────── */
const App = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
    </div>
  );
};

export default App;

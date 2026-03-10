import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ShoppingBag, Compass } from "lucide-react";

// --- AUTHENTIC CURATED ARTWORKS ---
const BASE_ARTWORKS = [
  { id: "A01", type: "Portrait", title: "Mona Lisa", artist: "Leonardo da Vinci", price: "Invaluable", desc: "The most famous portrait in the world, defined by sfumato and her enigmatic smile.", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg" },
  { id: "A02", type: "Landscape", title: "The Starry Night", artist: "Vincent van Gogh", price: "Invaluable", desc: "A masterful post-impressionist vision of the night sky over Saint-Rémy-de-Provence.", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1200px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg" },
  { id: "A03", type: "Portrait", title: "Girl with a Pearl Earring", artist: "Johannes Vermeer", price: "$85,000,000", desc: "A tronie representing a stylized facial expression, famous for its luminous pearl.", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg" },
  { id: "A04", type: "Landscape", title: "The Great Wave", artist: "Katsushika Hokusai", price: "$1,500,000", desc: "An iconic woodblock print depicting a rogue wave threatening boats off Kanagawa.", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/1200px-Great_Wave_off_Kanagawa2.jpg" },
  { id: "A05", type: "Portrait", title: "The Kiss", artist: "Gustav Klimt", price: "$135,000,000", desc: "An opulent, Byzantine-inspired depiction of lovers enveloped in gold leaf.", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/800px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg" },
  { id: "A06", type: "Landscape", title: "Wanderer above the Sea of Fog", artist: "Caspar David Friedrich", price: "Invaluable", desc: "The quintessential masterpiece of Romanticism, evoking awe and reflection.", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg/800px-Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg" },
  { id: "A07", type: "Portrait", title: "The Scream", artist: "Edvard Munch", price: "$119,900,000", desc: "A radical expressionist piece capturing the existential dread of modern life.", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/800px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg" },
  { id: "A08", type: "Landscape", title: "The Night Watch", artist: "Rembrandt", price: "Invaluable", desc: "Famous for its colossal scale and brilliant use of light and shadow (chiaroscuro).", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/The_Night_Watch_-_HD.jpg/1200px-The_Night_Watch_-_HD.jpg" },
  { id: "A09", type: "Portrait", title: "The Birth of Venus", artist: "Sandro Botticelli", price: "Invaluable", desc: "Depicts the goddess Venus arriving at the shore after her birth, fully grown.", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1200px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg" },
  { id: "A10", type: "Landscape", title: "Impression, Sunrise", artist: "Claude Monet", price: "$35,000,000", desc: "The painting that gave its name to the entire Impressionist movement.", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Monet_-_Impression%2C_Sunrise.jpg/1200px-Monet_-_Impression%2C_Sunrise.jpg" },
  { id: "A11", type: "Portrait", title: "David (Detail)", artist: "Michelangelo", price: "Invaluable", desc: "A masterpiece of Renaissance sculpture, symbolizing strength and youthful beauty.", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Michelangelo%27s_David_-_right_view_2.jpg/800px-Michelangelo%27s_David_-_right_view_2.jpg" },
  { id: "A12", type: "Landscape", title: "Cafe Terrace at Night", artist: "Vincent van Gogh", price: "Invaluable", desc: "The first painting where Van Gogh used his iconic starry background.", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Van_Gogh_-_Terrasse_des_Caf%C3%A9s_an_der_Place_du_Forum_in_Arles_am_Abend1.jpeg/800px-Van_Gogh_-_Terrasse_des_Caf%C3%A9s_an_der_Place_du_Forum_in_Arles_am_Abend1.jpeg" },
  { id: "A13", type: "Portrait", title: "The Swing", artist: "Jean-Honoré Fragonard", price: "$22,000,000", desc: "The masterpiece of the Rococo era, full of delicate colors and playful intent.", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Fragonard%2C_The_Swing.jpg/800px-Fragonard%2C_The_Swing.jpg" },
  { id: "A14", type: "Landscape", title: "Liberty Leading the People", artist: "Eugène Delacroix", price: "Invaluable", desc: "Commemorating the July Revolution of 1830, blending history with allegory.", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Eug%C3%A8ne_Delacroix_-_Le_28_Juillet._La_Libert%C3%A9_guidant_le_peuple.jpg/1200px-Eug%C3%A8ne_Delacroix_-_Le_28_Juillet._La_Libert%C3%A9_guidant_le_peuple.jpg" },
  { id: "A15", type: "Portrait", title: "The Milkmaid", artist: "Johannes Vermeer", price: "Invaluable", desc: "A masterful depiction of everyday domestic life, renowned for its luminous, rich colors.", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project.jpg/800px-Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project.jpg" }
];

// Double the array to 30 items for a massive, deep gallery
const ARTWORKS = [...BASE_ARTWORKS, ...BASE_ARTWORKS.map(art => ({ ...art, id: `${art.id}-V2` }))];

export default function ArtCollection() {
  const containerRef = useRef(null);

  // 1. Maintain STRICTLY 5 distinct columns for all screens
  const col1 = ARTWORKS.filter((_, i) => i % 5 === 0);
  const col2 = ARTWORKS.filter((_, i) => i % 5 === 1);
  const col3 = ARTWORKS.filter((_, i) => i % 5 === 2);
  const col4 = ARTWORKS.filter((_, i) => i % 5 === 3);
  const col5 = ARTWORKS.filter((_, i) => i % 5 === 4);

  // 2. Track scroll progress
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  // 3. REFINED 5-Column Parallax Math (Gentle, distinct, non-aggressive speeds)
  const rawY1 = useTransform(scrollYProgress, [0, 1], [0, -150]); // Slow up
  const rawY2 = useTransform(scrollYProgress, [0, 1], [0, 100]);  // Very slow down
  const rawY3 = useTransform(scrollYProgress, [0, 1], [0, -50]);  // Center (Anchored, barely moves up)
  const rawY4 = useTransform(scrollYProgress, [0, 1], [0, 150]);  // Slow down
  const rawY5 = useTransform(scrollYProgress, [0, 1], [0, -200]); // Moderate up

  const springConfig = { damping: 20, stiffness: 50, mass: 0.5 };
  const y1 = useSpring(rawY1, springConfig);
  const y2 = useSpring(rawY2, springConfig);
  const y3 = useSpring(rawY3, springConfig);
  const y4 = useSpring(rawY4, springConfig);
  const y5 = useSpring(rawY5, springConfig);

  return (
    // THE COMPASS WRAPPER
    <div className="relative w-screen h-screen bg-gradient-to-br from-[#e0be6a] via-[#8e7915] to-black text-white font-sans selection:bg-amber-400/30 overflow-hidden">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
        .compass-canvas::-webkit-scrollbar { display: none; }
        .compass-canvas { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- TOP STICKY FILTERS (The Glass Capsule) --- */}
      {/* Centralized, frosted pill shape for primary categories */}
      {/* Added horizontal scrolling for mobile so the 8 categories don't break the layout */}
      <div className="absolute top-20 md:top-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 md:gap-6 px-6 md:px-8 py-3 md:py-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-[7px] md:text-[9px] tracking-[3px] uppercase font-medium text-white/50 pointer-events-auto w-max max-w-[90vw] overflow-x-auto [&::-webkit-scrollbar]:hidden">
        
        <span className="text-amber-400 cursor-pointer flex items-center gap-2 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> All Art
        </span>
        <span className="w-px h-3 bg-white/20 shrink-0"></span>
        
        <span className="hover:text-white transition-colors cursor-pointer shrink-0">Painting</span>
        <span className="w-px h-3 bg-white/20 shrink-0"></span>
        
        <span className="hover:text-white transition-colors cursor-pointer shrink-0">Prints</span>
        <span className="w-px h-3 bg-white/20 shrink-0"></span>
        
        <span className="hover:text-white transition-colors cursor-pointer shrink-0">Photography</span>
        <span className="w-px h-3 bg-white/20 shrink-0"></span>
        
        <span className="hover:text-white transition-colors cursor-pointer shrink-0">Sculpture</span>
        <span className="w-px h-3 bg-white/20 shrink-0"></span>
        
        <span className="hover:text-white transition-colors cursor-pointer shrink-0">Drawing</span>
        <span className="w-px h-3 bg-white/20 shrink-0"></span>
        
        <span className="hover:text-white transition-colors cursor-pointer shrink-0">Collage</span>
        <span className="w-px h-3 bg-white/20 shrink-0"></span>
        
        <span className="hover:text-white transition-colors cursor-pointer shrink-0">Inspiration</span>

      </div>

      {/* --- LEFT STICKY FILTERS (The Glass Sidebar) --- */}
      {/* Sophisticated frosted panel with elegant typography accents */}
      <div className="hidden lg:flex flex-col gap-6 absolute left-8 top-1/2 -translate-y-1/2 z-40 w-48 p-8 rounded-sm bg-black/40 backdrop-blur-xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] pointer-events-auto">
        
        {/* Orientation Filter (Moved from Top) */}
        <div>
          <h4 className="text-white text-[9px] tracking-[4px] uppercase font-bold mb-4 flex items-center gap-3 border-b border-white/10 pb-3">
             <span className="w-3 h-[1px] bg-amber-400"></span> Orientation
          </h4>
          <div className="flex flex-col gap-3 text-[8px] tracking-[2px] text-white/40 pl-6 uppercase">
            <span className="text-amber-400 cursor-pointer transition-colors">Any</span>
            <span className="hover:text-white cursor-pointer transition-colors">Portrait</span>
            <span className="hover:text-white cursor-pointer transition-colors">Landscape</span>
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <h4 className="text-white text-[9px] tracking-[4px] uppercase font-bold mb-4 flex items-center gap-3 border-b border-white/10 pb-3">
             <span className="w-3 h-[1px] bg-amber-400"></span> Price
          </h4>
          <div className="flex flex-col gap-3 text-[8px] tracking-[2px] text-white/40 pl-6 uppercase">
            <span className="hover:text-white cursor-pointer transition-colors">Under $1M</span>
            <span className="hover:text-white cursor-pointer transition-colors">$1M - $50M</span>
            <span className="hover:text-white cursor-pointer transition-colors">Museum Grade</span>
          </div>
        </div>

        {/* Size Filter */}
        <div>
          <h4 className="text-white text-[9px] tracking-[4px] uppercase font-bold mb-4 flex items-center gap-3 border-b border-white/10 pb-3">
             <span className="w-3 h-[1px] bg-amber-400"></span> Size
          </h4>
          <div className="flex flex-col gap-3 text-[8px] tracking-[2px] text-white/40 pl-6 uppercase">
            <span className="hover:text-white cursor-pointer transition-colors">Standard</span>
            <span className="hover:text-white cursor-pointer transition-colors">Oversized</span>
          </div>
        </div>

      </div>

      {/* --- THE COMPASS CANVAS --- */}
      <div 
        ref={containerRef} 
        className="compass-canvas w-full h-full overflow-auto cursor-grab active:cursor-grabbing"
      >
        <div className="w-[300vw] sm:w-[200vw] lg:w-[120vw] h-fit px-[2vw] pt-[15vh] pb-[5vh] lg:pb-[10vh] flex justify-center">
          
          {/* STRICT 5-COLUMN GRID ON ALL SCREENS */}
          {/* Added lg:pl-64 to safely push the starting artwork to the right of the glass sidebar */}
          <div className="grid grid-cols-5 gap-3 sm:gap-3 lg:gap-3 items-start w-full max-w-[3000px] lg:pl-64">
            
            {/* COLUMN 1 */}
            <motion.div style={{ y: y1 }} className="flex flex-col gap-3 sm:gap-3 lg:gap-3 mt-[10%] lg:mt-[5%]">
              {col1.map((art) => <ArtCard key={art.id} art={art} />)}
            </motion.div>

            {/* COLUMN 2 */}
            <motion.div style={{ y: y2 }} className="flex flex-col gap-3 sm:gap-3 lg:gap-3 -mt-[15%] lg:-mt-[5%]">
              {col2.map((art) => <ArtCard key={art.id} art={art} />)}
            </motion.div>

            {/* COLUMN 3: Title + Images */}
            <motion.div style={{ y: y3 }} className="flex flex-col gap-3 sm:gap-3 lg:gap-3">
              
              <div className="text-center mb-16 lg:mb-32 pt-[5%] lg:pt-[10%] shrink-0 drop-shadow-2xl">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif italic font-light tracking-tight text-white mb-2 sm:mb-4 px-2 break-words">
                  The Collection
                </h1>
                <p className="text-[10px] sm:text-[7px] lg:text-[9px] tracking-[3px] uppercase text-black font-medium">
                  Scroll To Explore
                </p>
              </div>

              {col3.map((art) => <ArtCard key={art.id} art={art} />)}
            </motion.div>

            {/* COLUMN 4 */}
            <motion.div style={{ y: y4 }} className="flex flex-col gap-3 sm:gap-3 lg:gap-3 -mt-[10%] lg:-mt-[2%]">
              {col4.map((art) => <ArtCard key={art.id} art={art} />)}
            </motion.div>

            {/* COLUMN 5 */}
            <motion.div style={{ y: y5 }} className="flex flex-col gap-3 sm:gap-3 lg:gap-3 mt-[15%] lg:mt-[8%]">
              {col5.map((art) => <ArtCard key={art.id} art={art} />)}
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
// --- ARTWORK CARD COMPONENT ---
const ArtCard = ({ art }) => {
  // Dynamically assign realistic dimensions if they aren't provided in the data
  const dimensions = art.type === "Landscape" ? "40 × 30 IN" : "24 × 36 IN";

  return (
    <div className="w-full flex flex-col group cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_rgba(0,0,0,1)] shadow-[0_15px_40px_rgba(0,0,0,0.8)] bg-[#0a0a0a] border border-white/5">
      
      {/* 3D FRAME & MATTE SECTION */}
      {/* TIGHTENED: Reduced padding here for a thinner frame */}
      <div className="w-full bg-[#beb2b2] p-1.5 md:p-2.5 border-b border-white/5 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
        {/* Inner border gives the physical edge of the canvas/print */}
        <div className="relative overflow-hidden border border-black shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
          <img 
            src={art.img} 
            alt={art.title} 
            className={`w-full h-auto object-cover transform transition-transform duration-[2s] ease-[0.25,0.46,0.45,0.94] group-hover:scale-105 ${
              art.type === "Landscape" ? "aspect-[4/3] lg:aspect-[3/2]" : "aspect-[4/5] lg:aspect-[2/3]"
            }`}
            loading="lazy"
          />
        </div>
      </div>
      
      {/* PERMANENT INFO SECTION */}
      {/* TIGHTENED: Reduced overall container padding */}
      <div className="flex flex-col p-3 md:p-4 flex-grow justify-between">
        
        {/* Title & Artist */}
        {/* TIGHTENED: Reduced bottom margin */}
        <div className="mb-1 md:mb-1">
          <h3 className="text-sm md:text-lg lg:text-xl font-serif italic text-white drop-shadow-sm line-clamp-1 mb-0.5">
            {art.title}
          </h3>
          <p className="text-amber-400 text-[6px] md:text-[8px] tracking-[2px] uppercase font-medium">
            By {art.artist}
          </p>
        </div>

        {/* Technical Specs (Type & Dimensions) */}
        {/* TIGHTENED: Reduced vertical padding and bottom margin */}
        <div className="flex justify-between items-center py-1.5 md:py-2 border-t border-b border-white/10 mb-3 md:mb-4 text-[5px] md:text-[7px] tracking-[2px] uppercase text-white/50">
           <span>{art.type}</span>
           <span>{dimensions}</span>
        </div>
        
        {/* Price & Action Button */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[10px] md:text-xs font-medium tracking-widest text-white">
            {art.price}
          </span>
          {/* TIGHTENED: Made the button slightly thinner */}
          <button className="bg-white text-black py-1.5 px-3 md:py-2 md:px-4 text-[6px] md:text-[8px] tracking-[2px] uppercase font-bold flex items-center gap-1.5 hover:bg-amber-400 transition-colors shadow-md">
            <ShoppingBag size={10} className="lg:w-[12px] lg:h-[12px]"/> Add
          </button>
        </div>

      </div>
    </div>
  );
};
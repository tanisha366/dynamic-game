import { Routes, Route } from "react-router-dom"; 
import Main from "./pages/main";
import SplashCursor from "./components/splash";
import ArtCollection from "./pages/ArtworkProductsPage";
import BlurSlider from "./pages/Slider";
import DesignEmbracedScroll from "./components/artworkcat";
import ArtistPage from "./components/ournewartists";
import Mostviewart from "./Mostviewart";



function App() {
  return (
    <>
      <SplashCursor />
      <Routes>
        {/* Default route (Home) */}
        <Route path="/" element={<Main />} />
        
        <Route path="/artworks" element={<ArtCollection />} />
        <Route path="/slider" element={<BlurSlider />} />
         <Route path="/mostviewart" element={<Mostviewart />} />
        <Route path="/categories" element={<DesignEmbracedScroll />} />
      </Routes>
    </>
  );
}

export default App;
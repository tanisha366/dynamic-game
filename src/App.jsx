import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedArtists from './components/FeaturedArtists'
import ArtworkGallery from './components/ArtworkGallery'
import CollectionShowcase from './components/CollectionShowcase'
import CuratedCollections from './components/CuratedCollections'
import Subscribe from './components/Subscribe'
import Footer from './components/Footer'

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <FeaturedArtists />
      <ArtworkGallery />
      <CollectionShowcase />
      <CuratedCollections />
      <Subscribe />
      <Footer />
    </div>
  )
}

export default App

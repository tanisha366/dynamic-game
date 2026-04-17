import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Share2 } from 'lucide-react'
import './ArtworkGallery.css'

export default function ArtworkGallery() {
  const [selectedId, setSelectedId] = useState(null)
  const [filter, setFilter] = useState('all')

  const artworks = [
    { id: 1, title: 'Nebula Dreams', artist: 'Elena Rossini', price: '$2,450', category: 'abstract' },
    { id: 2, title: 'Digital Horizon', artist: 'Marcus Chen', price: '$3,200', category: 'digital' },
    { id: 3, title: 'Abstract Flow', artist: 'Sophia Nakamura', price: '$1,850', category: 'abstract' },
    { id: 4, title: 'Nature\'s Call', artist: 'James Patterson', price: '$2,100', category: 'photography' },
    { id: 5, title: 'Contemporary Voice', artist: 'Amara Okafor', price: '$2,800', category: 'painting' },
    { id: 6, title: 'Urban Canvas', artist: 'Viktor Sokolov', price: '$1,950', category: 'digital' },
    { id: 7, title: 'Ethereal Moments', artist: 'Elena Rossini', price: '$2,650', category: 'abstract' },
    { id: 8, title: 'Chromatic Journey', artist: 'Marcus Chen', price: '$3,100', category: 'digital' },
  ]

  const categories = ['all', 'abstract', 'digital', 'photography', 'painting']

  const filteredArtworks = filter === 'all' ? artworks : artworks.filter(art => art.category === filter)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  }

  return (
    <section className="artwork-gallery">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="gradient-text">Curated Artworks</h2>
          <p>Handpicked selections from emerging and established artists</p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="filter-buttons"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Artworks Grid */}
        <motion.div
          className="artworks-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <AnimatePresence mode="popLayout">
            {filteredArtworks.map((artwork, idx) => (
              <motion.div
                key={artwork.id}
                className="artwork-item"
                variants={itemVariants}
                layout
                onClick={() => setSelectedId(artwork.id)}
              >
                <div
                  className="artwork-image"
                  style={{
                    background: `linear-gradient(135deg, hsl(${artwork.id * 45}, 70%, 50%), hsl(${artwork.id * 45 + 45}, 70%, 60%))`,
                  }}
                >
                  <motion.div className="overlay" whileHover={{ opacity: 1 }}>
                    <div className="overlay-content">
                      <motion.button
                        className="btn-view"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        View Details
                      </motion.button>
                      <div className="overlay-actions">
                        <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                          <Heart size={20} />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                          <Share2 size={20} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <div className="artwork-info">
                  <h4>{artwork.title}</h4>
                  <p className="artist-name">{artwork.artist}</p>
                  <div className="artwork-footer">
                    <span className="price">{artwork.price}</span>
                    <span className="category">{artwork.category}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal Detail View */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedId(null)}>
                ✕
              </button>
              {artworks.map(
                (art) =>
                  art.id === selectedId && (
                    <div key={art.id} className="modal-body">
                      <div
                        className="modal-image"
                        style={{
                          background: `linear-gradient(135deg, hsl(${art.id * 45}, 70%, 50%), hsl(${art.id * 45 + 45}, 70%, 60%))`,
                        }}
                      />
                      <div className="modal-info">
                        <h2>{art.title}</h2>
                        <p className="modal-artist">{art.artist}</p>
                        <p className="modal-price">{art.price}</p>
                        <motion.button
                          className="btn-buy"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Add to Cart
                        </motion.button>
                      </div>
                    </div>
                  ),
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { Star } from 'lucide-react'
import './CollectionShowcase.css'

export default function CollectionShowcase() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.collection-card', {
        scrollTrigger: {
          trigger: '.collection-showcase',
          start: 'top 60%',
        },
        duration: 1,
        y: 100,
        opacity: 0,
        stagger: 0.2,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const collections = [
    {
      id: 1,
      name: 'Contemporary Masters',
      artworks: 142,
      value: '$2.5M',
      curator: 'Premium Collection',
    },
    {
      id: 2,
      name: 'Digital Frontiers',
      artworks: 89,
      value: '$1.8M',
      curator: 'Tech Art Pioneers',
    },
    {
      id: 3,
      name: 'Emerging Voices',
      artworks: 256,
      value: '$890K',
      curator: 'New Talents',
    },
  ]

  return (
    <section className="collection-showcase" ref={sectionRef}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="gradient-text">Curated Collections</h2>
          <p>Explore expertly curated selections of exceptional artworks</p>
        </motion.div>

        <div className="collections-showcase">
          {collections.map((coll, idx) => (
            <motion.div
              key={coll.id}
              className="collection-card"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <div
                className="collection-banner"
                style={{
                  background: `linear-gradient(135deg, hsl(${idx * 120}, 70%, 50%), hsl(${idx * 120 + 45}, 70%, 60%))`,
                }}
              >
                <div className="collection-overlay">
                  <motion.button
                    className="btn-explore-coll"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore Collection
                  </motion.button>
                </div>
              </div>
              <div className="collection-info">
                <div className="collection-header">
                  <h3>{coll.name}</h3>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#a855f7" color="#a855f7" />
                    ))}
                  </div>
                </div>
                <p className="curator">{coll.curator}</p>
                <div className="collection-stats">
                  <div className="stat">
                    <span className="label">Artworks</span>
                    <span className="value">{coll.artworks}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Collection Value</span>
                    <span className="value">{coll.value}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

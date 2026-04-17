import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './FeaturedArtists.css'

gsap.registerPlugin(ScrollTrigger)

export default function FeaturedArtists() {
  const sectionRef = useRef(null)

  const artists = [
    { id: 1, name: 'Elena Rossini', specialty: 'Abstract Expressionism', followers: '12.5K' },
    { id: 2, name: 'Marcus Chen', specialty: 'Digital Art', followers: '18.2K' },
    { id: 3, name: 'Sophia Nakamura', specialty: 'Contemporary Sculpture', followers: '9.8K' },
    { id: 4, name: 'James Patterson', specialty: 'Photography', followers: '25.1K' },
    { id: 5, name: 'Amara Okafor', specialty: 'Fine Art Painting', followers: '14.7K' },
    { id: 6, name: 'Viktor Sokolov', specialty: 'Mixed Media', followers: '11.3K' },
  ]

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.artist-card')
    if (!cards) return

    cards.forEach((card, idx) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        delay: idx * 0.1,
      })
    })
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="featured-artists" ref={sectionRef}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="gradient-text">Featured Artists</h2>
          <p>Discover extraordinary talents shaping the art world today</p>
        </motion.div>

        <motion.div
          className="artists-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {artists.map((artist) => (
            <motion.div
              key={artist.id}
              className="artist-card"
              variants={cardVariants}
              whileHover={{ y: -10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="artist-avatar">
                <div
                  className="avatar-placeholder"
                  style={{
                    background: `linear-gradient(135deg, hsl(${artist.id * 60}, 70%, 60%), hsl(${artist.id * 60 + 30}, 70%, 60%))`,
                  }}
                />
              </div>
              <h3>{artist.name}</h3>
              <p className="specialty">{artist.specialty}</p>
              <div className="followers">
                <span className="count">{artist.followers}</span>
                <span className="label">followers</span>
              </div>
              <motion.button
                className="btn-follow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Follow
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

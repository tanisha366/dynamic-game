import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ArrowRight, Sparkles } from 'lucide-react'
import './Hero.css'

export default function Hero() {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger animation for title
      gsap.from('.hero-title', {
        duration: 1.2,
        y: 100,
        opacity: 0,
        stagger: 0.1,
      })

      // Animate subtitle
      gsap.from('.hero-subtitle', {
        duration: 1,
        y: 50,
        opacity: 0,
        delay: 0.4,
      })

      // CTA buttons
      gsap.from('.hero-cta', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        delay: 0.6,
        stagger: 0.1,
      })

      // Image floating animation
      gsap.to(imageRef.current, {
        duration: 3,
        y: -20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // Floating particles
      const particles = document.querySelectorAll('.particle')
      particles.forEach((particle, idx) => {
        gsap.to(particle, {
          duration: gsap.utils.random(3, 5),
          y: gsap.utils.random(-50, 50),
          x: gsap.utils.random(-50, 50),
          opacity: gsap.utils.random(0.2, 0.8),
          repeat: -1,
          yoyo: true,
          delay: idx * 0.2,
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" ref={containerRef}>
      <div className="hero-container">
        {/* Left Content */}
        <motion.div className="hero-content" ref={textRef}>
          <motion.span
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles size={16} /> Discover Exceptional Art
          </motion.span>

          <h1 className="hero-title">
            <span>Curated</span>
            <span>Masterpieces</span>
            <span>from Global Artists</span>
          </h1>

          <p className="hero-subtitle">
            Explore extraordinary artwork, connect with talented artists, and build your
            collection with pieces that inspire and captivate.
          </p>

          <div className="hero-cta">
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Exploring <ArrowRight size={18} />
            </motion.button>
            <motion.button
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Collections
            </motion.button>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <motion.div
              className="stat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="stat-value">50K+</div>
              <div className="stat-label">Artworks</div>
            </motion.div>
            <motion.div
              className="stat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <div className="stat-value">2K+</div>
              <div className="stat-label">Artists</div>
            </motion.div>
            <motion.div
              className="stat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div className="stat-value">100+</div>
              <div className="stat-label">Countries</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right - Featured Image */}
        <motion.div className="hero-image" ref={imageRef}>
          <div className="image-card">
            <div
              className="image-placeholder"
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)',
              }}
            />
            <div className="image-info">
              <h4>Featured Collection</h4>
              <p>Modern Abstract Expressions</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Animated Background Particles */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`particle particle-${i}`} />
      ))}

      {/* Gradient Orbs */}
      <div className="glow-orb orb-1" />
      <div className="glow-orb orb-2" />
    </section>
  )
}

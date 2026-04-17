import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Zap } from 'lucide-react'
import './CuratedCollections.css'

export default function CuratedCollections() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Trending Now',
      description: 'Discover the hottest artworks and rising stars in the art world',
      items: ['Digital Art', 'Photography', 'Sculptures'],
    },
    {
      icon: Users,
      title: 'Curator Picks',
      description: 'Hand-selected recommendations from expert art curators',
      items: ['Modern Masters', 'Contemporary', 'Emerging Artists'],
    },
    {
      icon: Zap,
      title: 'Flash Sales',
      description: 'Limited-time offers on exceptional pieces from top creators',
      items: ['50% Off', 'New Releases', 'Exclusive Drops'],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="curated-collections">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="gradient-text">Why Collect with ArtVerse?</h2>
          <p>Everything you need to build and manage your art collection</p>
        </motion.div>

        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                className="feature-card"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="feature-icon">
                  <Icon size={40} color="#a855f7" />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-items">
                  {feature.items.map((item, i) => (
                    <div key={i} className="feature-item">
                      <span className="dot" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

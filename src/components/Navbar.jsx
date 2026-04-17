import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false)

  const navItems = ['Discover', 'Artists', 'Collections', 'About', 'Contact']

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <motion.div
          className="logo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="gradient-text" style={{ fontSize: '24px', fontWeight: 'bold' }}>
            ArtVerse
          </span>
        </motion.div>

        {/* Desktop Menu */}
        <div className="nav-menu-desktop">
          {navItems.map((item, idx) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ color: '#a855f7' }}
            >
              {item}
            </motion.a>
          ))}
        </div>

        {/* Search & CTA */}
        <div className="nav-actions">
          <motion.input
            type="text"
            placeholder="Search artwork..."
            className="search-input"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          />
          <motion.button
            className="btn-explore"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore
          </motion.button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="menu-toggle" onClick={() => setShowMenu(!showMenu)}>
          {showMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <motion.div
          className="mobile-menu"
          variants={menuVariants}
          initial="hidden"
          animate="visible"
        >
          {navItems.map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              variants={itemVariants}
              onClick={() => setShowMenu(false)}
              className="mobile-nav-item"
            >
              {item}
            </motion.a>
          ))}
        </motion.div>
      )}
    </nav>
  )
}

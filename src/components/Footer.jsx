import React from 'react'
import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Linkedin, ArrowUp } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerSections = [
    {
      title: 'Explore',
      links: ['Browse Art', 'Discover Artists', 'Collections', 'Trending', 'New Releases'],
    },
    {
      title: 'Learn',
      links: ['Art Guide', 'Artist Stories', 'Market Insights', 'Blog', 'Resources'],
    },
    {
      title: 'Account',
      links: ['My Collection', 'Wishlist', 'Orders', 'Settings', 'Help'],
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact', 'Careers'],
    },
  ]

  const socialLinks = [
    { icon: Facebook, label: 'Facebook' },
    { icon: Twitter, label: 'Twitter' },
    { icon: Instagram, label: 'Instagram' },
    { icon: Linkedin, label: 'LinkedIn' },
  ]

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <footer className="footer">
      <div className="container">
        {/* Main Footer Content */}
        <motion.div
          className="footer-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand Section */}
          <motion.div className="footer-section" variants={itemVariants}>
            <h3 className="gradient-text" style={{ fontSize: '24px', marginBottom: '15px' }}>
              ArtVerse
            </h3>
            <p>Connecting artists and collectors through the power of exceptional art.</p>
            <div className="social-links">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href="#"
                    whileHover={{ scale: 1.2, color: '#a855f7' }}
                    title={social.label}
                  >
                    <Icon size={20} />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <motion.div key={section.title} className="footer-section" variants={itemVariants}>
              <h4>{section.title}</h4>
              <ul>
                {section.links.map((link) => (
                  <li key={link}>
                    <motion.a href="#" whileHover={{ x: 5, color: '#a855f7' }}>
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Footer Bottom */}
        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p>&copy; 2024 ArtVerse. All rights reserved.</p>
          <motion.button
            className="scroll-top-btn"
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp size={20} />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  )
}

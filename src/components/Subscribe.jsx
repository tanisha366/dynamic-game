import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Check } from 'lucide-react'
import './Subscribe.css'

export default function Subscribe() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setTimeout(() => {
        setEmail('')
        setSubmitted(false)
      }, 3000)
    }
  }

  return (
    <section className="subscribe">
      <div className="subscribe-container">
        <motion.div
          className="subscribe-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="gradient-text">Stay in the Loop</h2>
          <p>Get weekly updates on new artworks, artist features, and exclusive offers</p>

          <motion.form className="subscribe-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <Mail size={20} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <motion.button
              type="submit"
              className={`btn-subscribe ${submitted ? 'success' : ''}`}
              whileHover={{ scale: submitted ? 1 : 1.05 }}
              whileTap={{ scale: submitted ? 1 : 0.95 }}
              disabled={submitted}
            >
              {submitted ? (
                <>
                  <Check size={18} /> Subscribed!
                </>
              ) : (
                'Subscribe'
              )}
            </motion.button>
          </motion.form>

          <p className="form-note">No spam, just art inspiration. Unsubscribe anytime.</p>
        </motion.div>

        {/* Background Elements */}
        <div className="subscribe-glow glow-1" />
        <div className="subscribe-glow glow-2" />
      </div>
    </section>
  )
}

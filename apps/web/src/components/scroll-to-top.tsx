'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft01Icon } from '@/lib/icons'
import { useScrollPosition } from '@/hooks/use-scroll-position'

export function ScrollToTop() {
  const { y } = useScrollPosition()
  const show = y > 300

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 rounded-full bg-primary p-3 text-primary-foreground shadow-lg hover:bg-primary/90"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft01Icon className="h-5 w-5 rotate-90" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon } from '@/lib/icons'

interface AccordionContextType {
  openItems: string[]
  toggleItem: (value: string) => void
  type: 'single' | 'multiple'
}

const AccordionContext = createContext<AccordionContextType | null>(null)

function useAccordion() {
  const context = useContext(AccordionContext)
  if (!context) throw new Error('Accordion components must be used within Accordion')
  return context
}

interface AccordionProps {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  children: ReactNode
  className?: string
}

export function Accordion({
  type = 'single',
  defaultValue,
  children,
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(
    Array.isArray(defaultValue)
      ? defaultValue
      : defaultValue
      ? [defaultValue]
      : []
  )

  const toggleItem = (value: string) => {
    setOpenItems((prev) => {
      if (type === 'single') {
        return prev.includes(value) ? [] : [value]
      }
      return prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    })
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={cn('space-y-2', className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  value: string
  children: ReactNode
  className?: string
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  return <div className={cn('border-b', className)}>{children}</div>
}

interface AccordionTriggerProps {
  children: ReactNode
  value: string
  className?: string
}

export function AccordionTrigger({
  children,
  value,
  className,
}: AccordionTriggerProps) {
  const { openItems, toggleItem } = useAccordion()
  const isOpen = openItems.includes(value)

  return (
    <button
      onClick={() => toggleItem(value)}
      className={cn(
        'flex w-full items-center justify-between py-4 text-left font-medium transition-colors hover:text-foreground',
        className
      )}
    >
      {children}
      <ChevronDownIcon
        className={cn(
          'h-4 w-4 transition-transform duration-200',
          isOpen && 'rotate-180'
        )}
      />
    </button>
  )
}

interface AccordionContentProps {
  children: ReactNode
  value: string
  className?: string
}

export function AccordionContent({
  children,
  value,
  className,
}: AccordionContentProps) {
  const { openItems } = useAccordion()
  const isOpen = openItems.includes(value)

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className={cn('pb-4 pt-0', className)}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

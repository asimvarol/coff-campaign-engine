'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CheckCircleIcon, AlertCircleIcon, InfoCircleIcon, CancelCircleIcon } from '@hugeicons/react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((type: ToastType, message: string, duration = 3000) => {
    const id = Math.random().toString(36).substring(7)
    const toast: Toast = { id, type, message, duration }
    
    setToasts((prev) => [...prev, toast])

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast }: { toast: Toast }) {
  const icons = {
    success: CheckCircleIcon,
    error: CancelCircleIcon,
    info: InfoCircleIcon,
    warning: AlertCircleIcon,
  }

  const colors = {
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    error: 'bg-red-500/10 text-red-500 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  }

  const Icon = icons[toast.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm ${colors[toast.type]}`}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <p className="text-sm font-medium">{toast.message}</p>
    </motion.div>
  )
}

'use client'

import React from 'react'
import { ToastContext, useToastState } from '@/lib/toast'
import { ToastContainer } from '@/components/ui/Toast'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastState = useToastState()

  return (
    <ToastContext.Provider value={toastState}>
      {children}
      <ToastContainer toasts={toastState.toasts} onRemove={toastState.removeToast} />
    </ToastContext.Provider>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from './ui/Modal'
import { Input } from './ui/Input'
import { Textarea } from './ui/Textarea'
import { Button } from './ui/Button'
import { Task } from '@/types/task'

export interface EditTaskModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onSave: (taskId: number, data: { title: string; description: string }) => Promise<void>
}

export function EditTaskModal({ task, isOpen, onClose, onSave }: EditTaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setError('')
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    if (!task) return

    setLoading(true)
    try {
      await onSave(task.id, { title, description })
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.detail?.error?.message || 'Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Task"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            Save Changes
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          maxLength={200}
          required
          autoFocus
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description (optional)"
          maxLength={1000}
          rows={4}
        />
      </form>
    </Modal>
  )
}

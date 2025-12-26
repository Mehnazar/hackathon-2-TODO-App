'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Card } from './ui/Card'
import { Input } from './ui/Input'
import { Textarea } from './ui/Textarea'
import { Button } from './ui/Button'

interface AddTaskFormProps {
  onAdd: (title: string, description: string) => Promise<void>
}

export default function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    setLoading(true)
    try {
      await onAdd(title, description)
      setTitle('')
      setDescription('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Add New Task</h2>

        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          placeholder="What needs to be done?"
        />

        <Textarea
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
          rows={3}
          placeholder="Add more details..."
        />

        <Button
          type="submit"
          disabled={loading || !title.trim()}
          loading={loading}
          fullWidth
          icon={!loading && <Plus className="w-5 h-5" />}
        >
          {!loading && 'Add Task'}
        </Button>
      </form>
    </Card>
  )
}

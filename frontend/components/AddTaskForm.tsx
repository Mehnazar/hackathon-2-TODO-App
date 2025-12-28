'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from './ui/Input'
import { Textarea } from './ui/Textarea'
import { Button } from './ui/Button'
import CategorySelector from './CategorySelector'
import DueDatePicker from './DueDatePicker'
import { TaskPriority } from '@/types/task'

interface AddTaskFormProps {
  onAdd: (title: string, description: string, priority: TaskPriority, dueDate?: string, category?: string) => Promise<void>
}

export default function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    setLoading(true)
    try {
      await onAdd(title, description, priority, dueDate || undefined, category || undefined)
      // Reset form
      setTitle('')
      setDescription('')
      setPriority('medium')
      setDueDate('')
      setCategory('')
      setExpanded(false)
      titleInputRef.current?.focus()
    } finally {
      setLoading(false)
    }
  }

  // Focus title input when expanded
  useEffect(() => {
    if (expanded) {
      titleInputRef.current?.focus()
    }
  }, [expanded])

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <form onSubmit={handleSubmit} className="p-5">
        {/* Quick Add Section - Always Visible */}
        <div className="flex gap-3">
          <Input
            ref={titleInputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => !expanded && setExpanded(true)}
            placeholder="Add a new task... (Press Enter to expand)"
            className="flex-1"
            maxLength={200}
          />
          <Button
            type="submit"
            disabled={loading || !title.trim()}
            loading={loading}
            icon={!loading && <Plus className="w-5 h-5" />}
            className="px-6"
          >
            {!loading && 'Add'}
          </Button>
        </div>

        {/* Expanded Section - Hidden by default */}
        {expanded && (
          <div className="mt-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <Textarea
              label="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="Add more details..."
            />

        {/* Priority Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority Level
          </label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`
                  flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all border
                  ${priority === p
                    ? p === 'high'
                      ? 'bg-red-500 text-white border-red-500'
                      : p === 'medium'
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

            <DueDatePicker value={dueDate} onChange={setDueDate} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category (optional)
              </label>
              <CategorySelector value={category} onChange={setCategory} />
            </div>

            {/* Collapse Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
                Hide details
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

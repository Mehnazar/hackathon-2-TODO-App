'use client'

import { Circle, CheckCircle2, Edit2, Trash2 } from 'lucide-react'
import { Task } from '@/types/task'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'

interface TaskItemProps {
  task: Task
  onToggle: (taskId: number) => Promise<void>
  onDelete: (taskId: number) => Promise<void>
  onEdit?: (task: Task) => void
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString()
  }

  return (
    <Card hover className="transition-all duration-200">
      <div className="flex items-start gap-4">
        {/* Completion Toggle Icon */}
        <button
          onClick={() => onToggle(task.id)}
          className="flex-shrink-0 mt-1 text-gray-400 hover:text-teal-600 transition-colors"
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`text-lg font-medium ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {task.title}
            </h3>
            <Badge variant={task.completed ? 'success' : 'info'}>
              {task.completed ? 'Completed' : 'Active'}
            </Badge>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 mb-2 break-words">
              {task.description}
            </p>
          )}

          <p className="text-xs text-gray-400">
            Created {formatDate(task.created_at)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 flex gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              icon={<Edit2 className="w-4 h-4" />}
              aria-label="Edit task"
            />
          )}

          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(task.id)}
            icon={<Trash2 className="w-4 h-4" />}
            aria-label="Delete task"
          />
        </div>
      </div>
    </Card>
  )
}

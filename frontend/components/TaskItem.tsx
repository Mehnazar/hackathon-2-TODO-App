'use client'

import { Circle, CheckCircle2, Edit2, Trash2, Clock } from 'lucide-react'
import { Task } from '@/types/task'
import { Button } from './ui/Button'
import PriorityBadge from './PriorityBadge'
import CategoryBadge from './CategoryBadge'
import DueDateDisplay from './DueDateDisplay'

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
    <div
      className={`
        group relative bg-white rounded-xl p-5
        border transition-all duration-300 ease-in-out hover:shadow-lg
        ${task.completed ? 'border-gray-200 bg-gray-50/50' : 'border-gray-200 hover:border-blue-400 hover:-translate-y-0.5'}
      `}
    >
      {/* Priority Indicator Bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all ${
          task.priority === 'high'
            ? 'bg-red-500'
            : task.priority === 'medium'
            ? 'bg-amber-500'
            : 'bg-blue-500'
        }`}
      />

      <div className="flex items-start gap-4">
        {/* Completion Toggle */}
        <button
          onClick={() => onToggle(task.id)}
          className="flex-shrink-0 mt-0.5 transition-all duration-200 hover:scale-110 active:scale-95 group/checkbox"
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-500 animate-in fade-in zoom-in duration-300" />
          ) : (
            <Circle className="w-6 h-6 text-gray-300 group-hover/checkbox:text-blue-500 group-hover/checkbox:scale-110 transition-all" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Badges */}
          <div className="mb-3">
            <h3
              className={`text-base font-semibold mb-2.5 ${
                task.completed ? 'line-through text-gray-400' : 'text-gray-900'
              }`}
            >
              {task.title}
            </h3>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={task.priority} size="sm" />
              {task.category && <CategoryBadge category={task.category} size="sm" />}
              {task.due_date && (
                <DueDateDisplay dueDate={task.due_date} completed={task.completed} size="sm" />
              )}
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className={`text-sm mb-3 break-words leading-relaxed ${
              task.completed ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}

          {/* Footer - Created At */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Created {formatDate(task.created_at)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-600 hover:text-blue-600"
              aria-label="Edit task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onDelete(task.id)}
            className="p-2 rounded-lg hover:bg-red-50 active:bg-red-100 transition-colors text-gray-600 hover:text-red-600"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

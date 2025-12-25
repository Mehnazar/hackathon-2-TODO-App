'use client'

import type { Task } from '@/types/task'

interface TaskItemProps {
  task: Task
  onToggle: (taskId: number) => void
  onDelete: (taskId: number) => void
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />

      <div className="flex-1 min-w-0">
        <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className={`text-sm mt-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
            {task.description}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-2">
          Created {new Date(task.created_at).toLocaleString()}
        </p>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
      >
        Delete
      </button>
    </div>
  )
}

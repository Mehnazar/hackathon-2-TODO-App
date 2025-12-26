'use client'

import React from 'react'
import { cn } from '@/lib/cn'

export type FilterType = 'all' | 'active' | 'completed'

export interface TaskFiltersProps {
  activeFilter: FilterType
  taskCounts: {
    all: number
    active: number
    completed: number
  }
  onFilterChange: (filter: FilterType) => void
}

export function TaskFilters({ activeFilter, taskCounts, onFilterChange }: TaskFiltersProps) {
  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' }
  ]

  return (
    <div className="flex gap-2">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.key
        const count = taskCounts[filter.key]

        return (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-all duration-200',
              isActive
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-2 border-teal-600 shadow-md'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
            )}
          >
            {filter.label} ({count})
          </button>
        )
      })}
    </div>
  )
}

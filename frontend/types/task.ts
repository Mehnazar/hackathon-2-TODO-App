/**
 * Task type definitions
 */

export interface Task {
  id: number
  user_id: string
  title: string
  description: string
  completed: boolean
  created_at: string // ISO 8601 with Z suffix
  updated_at: string // ISO 8601 with Z suffix
}

export interface CreateTaskRequest {
  title: string
  description?: string
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  completed?: boolean
}

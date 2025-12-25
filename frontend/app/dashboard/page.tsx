'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'
import { taskAPI } from '@/lib/api'
import type { Task } from '@/types/task'
import TaskItem from '@/components/TaskItem'
import AddTaskForm from '@/components/AddTaskForm'

export default function DashboardPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check authentication
    if (!auth.isAuthenticated()) {
      router.push('/login')
      return
    }

    const userData = auth.getUser()
    setUser(userData)

    // Load tasks
    loadTasks(userData.id)
  }, [router])

  const loadTasks = async (userId: string) => {
    try {
      setLoading(true)
      setError('')
      const tasksData = await taskAPI.getTasks(userId)
      setTasks(tasksData)
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Failed to load tasks'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (title: string, description: string) => {
    if (!user) return

    try {
      setError('')
      const newTask = await taskAPI.createTask(user.id, { title, description })
      setTasks([newTask, ...tasks])
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Failed to create task'
      setError(message)
      throw err
    }
  }

  const handleToggleTask = async (taskId: number) => {
    if (!user) return

    try {
      setError('')
      const updatedTask = await taskAPI.toggleComplete(user.id, taskId)
      setTasks(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ))
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Failed to update task'
      setError(message)
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (!user) return

    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      setError('')
      await taskAPI.deleteTask(user.id, taskId)
      setTasks(tasks.filter(task => task.id !== taskId))
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Failed to delete task'
      setError(message)
    }
  }

  const handleLogout = () => {
    auth.logout()
    router.push('/login')
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Evolution of Todo</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user?.name} ({user?.email})
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h2>
          <p className="text-gray-600">
            {completedCount} of {totalCount} tasks completed
          </p>
        </div>

        <div className="space-y-8">
          <AddTaskForm onAdd={handleAddTask} />

          <div className="space-y-4">
            {loading && tasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No tasks yet. Add your first task above!</p>
              </div>
            ) : (
              tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

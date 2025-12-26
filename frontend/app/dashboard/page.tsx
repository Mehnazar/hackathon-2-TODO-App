'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { CheckSquare, User, LogOut, Filter as FilterIcon } from 'lucide-react'
import { auth } from '@/lib/auth'
import { taskAPI } from '@/lib/api'
import { useToast } from '@/hooks/useToast'
import type { Task } from '@/types/task'
import TaskItem from '@/components/TaskItem'
import AddTaskForm from '@/components/AddTaskForm'
import { TaskSearch } from '@/components/TaskSearch'
import { TaskFilters, type FilterType } from '@/components/TaskFilters'
import { EditTaskModal } from '@/components/EditTaskModal'
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'
import { EmptyState } from '@/components/EmptyState'
import { TaskItemSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'

export default function DashboardPage() {
  const router = useRouter()
  const toast = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  // Modal state
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<{ id: number; title: string } | null>(null)

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
      const tasksData = await taskAPI.getTasks(userId)
      setTasks(tasksData)
    } catch (err: any) {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (title: string, description: string) => {
    if (!user) return

    try {
      const newTask = await taskAPI.createTask(user.id, { title, description })
      setTasks([newTask, ...tasks])
      toast.success('Task created successfully!')
    } catch (err: any) {
      toast.error('Failed to create task')
      throw err
    }
  }

  const handleToggleTask = async (taskId: number) => {
    if (!user) return

    try {
      const updatedTask = await taskAPI.toggleComplete(user.id, taskId)
      setTasks(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ))
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task marked as active')
    } catch (err: any) {
      toast.error('Failed to update task')
    }
  }

  const handleEditTask = async (taskId: number, data: { title: string; description: string }) => {
    if (!user) return

    try {
      const updatedTask = await taskAPI.updateTask(user.id, taskId, data)
      setTasks(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ))
      toast.success('Task updated successfully!')
    } catch (err: any) {
      toast.error('Failed to update task')
      throw err
    }
  }

  const handleDeleteTask = async () => {
    if (!user || !deletingTask) return

    try {
      await taskAPI.deleteTask(user.id, deletingTask.id)
      setTasks(tasks.filter(task => task.id !== deletingTask.id))
      toast.success('Task deleted successfully')
    } catch (err: any) {
      toast.error('Failed to delete task')
      throw err
    }
  }

  const handleLogout = () => {
    auth.logout()
    router.push('/login')
  }

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    let result = tasks

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        task =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      )
    }

    // Apply completion filter
    if (activeFilter === 'active') {
      result = result.filter(task => !task.completed)
    } else if (activeFilter === 'completed') {
      result = result.filter(task => task.completed)
    }

    return result
  }, [tasks, searchQuery, activeFilter])

  // Task counts for filter tabs
  const taskCounts = useMemo(() => ({
    all: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length
  }), [tasks])

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-teal-600" />
              <h1 className="text-2xl font-bold text-gray-900">Evolution of Todo</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.name} ({user?.email})</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                icon={<LogOut className="w-4 h-4" />}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h2>
          <p className="text-gray-600">
            {completedCount} of {totalCount} tasks completed
          </p>
        </div>

        {/* Search Bar */}
        {tasks.length > 0 && (
          <div className="mb-6">
            <TaskSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search tasks..."
            />
          </div>
        )}

        {/* Filter Tabs */}
        {tasks.length > 0 && (
          <div className="mb-6">
            <TaskFilters
              activeFilter={activeFilter}
              taskCounts={taskCounts}
              onFilterChange={setActiveFilter}
            />
          </div>
        )}

        {/* Add Task Form */}
        <div className="mb-8">
          <AddTaskForm onAdd={handleAddTask} />
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {loading && tasks.length === 0 ? (
            // Skeleton loading
            <>
              <TaskItemSkeleton />
              <TaskItemSkeleton />
              <TaskItemSkeleton />
            </>
          ) : filteredTasks.length === 0 ? (
            // Empty state
            tasks.length === 0 ? (
              <EmptyState
                icon={<CheckSquare className="w-16 h-16" />}
                title="No tasks yet"
                description="Create your first task to get started with organizing your work!"
              />
            ) : searchQuery ? (
              <EmptyState
                icon={<FilterIcon className="w-16 h-16" />}
                title="No tasks found"
                description="Try adjusting your search query or filters"
                action={{
                  label: 'Clear Search',
                  onClick: () => setSearchQuery('')
                }}
              />
            ) : (
              <EmptyState
                icon={<CheckSquare className="w-16 h-16" />}
                title={activeFilter === 'active' ? 'No active tasks' : 'No completed tasks'}
                description={
                  activeFilter === 'active'
                    ? 'All your tasks are completed! Great work!'
                    : 'Start completing tasks to see them here'
                }
                action={{
                  label: 'Show All Tasks',
                  onClick: () => setActiveFilter('all')
                }}
              />
            )
          ) : (
            // Task items
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={(taskId) => {
                  const taskToDelete = tasks.find(t => t.id === taskId)
                  if (taskToDelete) {
                    setDeletingTask({ id: taskId, title: taskToDelete.title })
                  }
                }}
                onEdit={setEditingTask}
              />
            ))
          )}
        </div>
      </main>

      {/* Edit Task Modal */}
      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleEditTask}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteTask}
        taskTitle={deletingTask?.title || ''}
      />
    </div>
  )
}

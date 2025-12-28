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
import TaskStats from '@/components/TaskStats'

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

  const handleAddTask = async (
    title: string,
    description: string,
    priority: 'low' | 'medium' | 'high',
    dueDate?: string,
    category?: string
  ) => {
    if (!user) return

    try {
      const newTask = await taskAPI.createTask(user.id, {
        title,
        description,
        priority,
        due_date: dueDate,
        category
      })
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

  const handleEditTask = async (
    taskId: number,
    data: {
      title: string
      description: string
      priority: 'low' | 'medium' | 'high'
      due_date?: string
      category?: string
    }
  ) => {
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Evolution of Todo
                </h1>
                <p className="text-xs text-gray-500">AI-Native Task Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                icon={<LogOut className="w-4 h-4" />}
                className="hover:bg-gray-100 text-gray-700"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                My Tasks
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {completedCount} of {totalCount} tasks completed {completedCount > 0 && `(${Math.round((completedCount / totalCount) * 100)}%)`}
              </p>
            </div>
          </div>
        </div>

        {/* Task Statistics */}
        {tasks.length > 0 && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <TaskStats tasks={tasks} />
          </div>
        )}

        {/* Add Task Form - Always Visible */}
        <div className="mb-8">
          <AddTaskForm onAdd={handleAddTask} />
        </div>

        {/* Search and Filters */}
        {tasks.length > 0 && (
          <div className="mb-6 space-y-4">
            <TaskSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search tasks by title or description..."
            />
            <TaskFilters
              activeFilter={activeFilter}
              taskCounts={taskCounts}
              onFilterChange={setActiveFilter}
            />
          </div>
        )}

        {/* Task Grid */}
        <div>
          {loading && tasks.length === 0 ? (
            // Skeleton loading
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TaskItemSkeleton />
              <TaskItemSkeleton />
              <TaskItemSkeleton />
            </div>
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
            // Task grid with staggered animation
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {filteredTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TaskItem
                    task={task}
                    onToggle={handleToggleTask}
                    onDelete={async (taskId) => {
                      const taskToDelete = tasks.find(t => t.id === taskId)
                      if (taskToDelete) {
                        setDeletingTask({ id: taskId, title: taskToDelete.title })
                      }
                    }}
                    onEdit={setEditingTask}
                  />
                </div>
              ))}
            </div>
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

import { Task } from '@/types/task'
import { CheckCircle2, Circle, AlertCircle, TrendingUp } from 'lucide-react'
import { isPast } from 'date-fns'

interface TaskStatsProps {
  tasks: Task[]
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  // Calculate statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length
  const activeTasks = totalTasks - completedTasks
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Overdue tasks (not completed and past due date)
  const overdueTasks = tasks.filter(t => !t.completed && t.due_date && isPast(new Date(t.due_date))).length

  // Priority breakdown
  const highPriority = tasks.filter(t => !t.completed && t.priority === 'high').length
  const mediumPriority = tasks.filter(t => !t.completed && t.priority === 'medium').length
  const lowPriority = tasks.filter(t => !t.completed && t.priority === 'low').length

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: Circle,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      label: 'Active',
      value: activeTasks,
      icon: TrendingUp,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
    {
      label: 'Overdue',
      value: overdueTasks,
      icon: AlertCircle,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className={`${stat.bgColor} rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${stat.textColor}`} />
              </div>
              <div className={`text-3xl font-bold ${stat.textColor} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Completion Rate Bar */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Completion Rate</h3>
          <span className="text-2xl font-bold text-blue-600">
            {completionRate}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Priority Breakdown */}
      {activeTasks > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Tasks by Priority</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-gray-700">High Priority</span>
              </div>
              <span className="text-sm font-bold text-red-700">{highPriority}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-sm font-medium text-gray-700">Medium Priority</span>
              </div>
              <span className="text-sm font-bold text-amber-700">{mediumPriority}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-700">Low Priority</span>
              </div>
              <span className="text-sm font-bold text-blue-700">{lowPriority}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

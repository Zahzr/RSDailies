/**
 * TaskDashboard Component
 * Main UI component displaying tasks, stats, and controls
 */

import React from 'react'
import { useTaskContext } from '../context/TaskContext'
import { useProfileContext } from '../context/ProfileContext'
import { useTimer } from '../hooks/useTimer'
import { TIMEFRAMES } from '../../engine'

export function TaskDashboard() {
  const { tasks, toggleTask, toggleHideTask, getTotalProfit, getCompletionPercentage, getTasksByResetType } =
    useTaskContext()
  const { currentProfile, profiles, switchProfile } = useProfileContext()
  const dailyTimer = useTimer('daily')
  const weeklyTimer = useTimer('weekly')
  const monthlyTimer = useTimer('monthly')

  const dailyTasks = getTasksByResetType('daily')
  const weeklyTasks = getTasksByResetType('weekly')
  const monthlyTasks = getTasksByResetType('monthly')

  const dailyProfit = getTotalProfit('daily')
  const weeklyProfit = getTotalProfit('weekly')
  const monthlyProfit = getTotalProfit('monthly')

  const dailyCompletion = getCompletionPercentage('daily')
  const weeklyCompletion = getCompletionPercentage('weekly')
  const monthlyCompletion = getCompletionPercentage('monthly')

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Dailyscape</h1>
        <p className="text-gray-600">RuneScape 3 Daily Task Tracker</p>
      </div>

      {/* Profile Selector */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">Profile:</label>
        <select
          value={currentProfile}
          onChange={(e) => switchProfile(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          {profiles.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Timers & Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard title="Daily" time={dailyTimer.formattedTime} profit={dailyProfit} completion={dailyCompletion} />
        <StatCard title="Weekly" time={weeklyTimer.formattedTime} profit={weeklyProfit} completion={weeklyCompletion} />
        <StatCard
          title="Monthly"
          time={monthlyTimer.formattedTime}
          profit={monthlyProfit}
          completion={monthlyCompletion}
        />
      </div>

      {/* Task Lists */}
      <div className="grid grid-cols-3 gap-6">
        <TaskList title="Daily Tasks" tasks={dailyTasks} onToggle={toggleTask} onHide={toggleHideTask} />
        <TaskList title="Weekly Tasks" tasks={weeklyTasks} onToggle={toggleTask} onHide={toggleHideTask} />
        <TaskList title="Monthly Tasks" tasks={monthlyTasks} onToggle={toggleTask} onHide={toggleHideTask} />
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  time: string
  profit: number
  completion: number
}

function StatCard({ title, time, profit, completion }: StatCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="text-sm text-gray-600">
        <div className="mb-2">⏱️ {time}</div>
        <div className="mb-2">💰 {profit.toLocaleString()} GP</div>
        <div className="mb-2">✓ {completion.toFixed(1)}%</div>
      </div>
    </div>
  )
}

interface TaskListProps {
  title: string
  tasks: any[]
  onToggle: (slug: string) => void
  onHide: (slug: string) => void
}

function TaskList({ title, tasks, onToggle, onHide }: TaskListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.slug} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => onToggle(task.slug)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className={task.isCompleted ? 'line-through text-gray-400' : ''}>{task.name}</span>
            <span className="ml-auto text-xs text-gray-500">{task.profitGp.toLocaleString()} GP</span>
            {!task.isHidden && (
              <button onClick={() => onHide(task.slug)} className="ml-2 text-xs text-red-500 hover:text-red-700">
                Hide
              </button>
            )}
          </div>
        ))}
        {tasks.length === 0 && <p className="text-gray-400 text-sm">No tasks in this category</p>}
      </div>
    </div>
  )
}

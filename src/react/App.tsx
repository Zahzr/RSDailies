/**
 * Main App Component
 * Orchestrates all contexts and providers
 */

import React from 'react'
import { TaskContextProvider } from './context/TaskContext'
import { ProfileContextProvider } from './context/ProfileContext'
import { TaskDashboard } from './components/TaskDashboard'

export function App() {
  return (
    <ProfileContextProvider>
      <TaskContextProvider>
        <div className="min-h-screen bg-gray-50">
          <TaskDashboard />
        </div>
      </TaskContextProvider>
    </ProfileContextProvider>
  )
}

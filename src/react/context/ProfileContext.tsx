/**
 * ProfileContext - React Context for multi-profile management
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { ProfileName } from '../../engine'

interface ProfileContextType {
  currentProfile: ProfileName
  profiles: ProfileName[]
  switchProfile: (name: ProfileName) => void
  createProfile: (name: ProfileName) => void
  deleteProfile: (name: ProfileName) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

interface ProfileContextProviderProps {
  children: ReactNode
}

export function ProfileContextProvider({ children }: ProfileContextProviderProps) {
  const [currentProfile, setCurrentProfile] = useState<ProfileName>('default')
  const [profiles, setProfiles] = useState<ProfileName[]>(['default'])

  const switchProfile = useCallback((name: ProfileName) => {
    if (profiles.includes(name)) {
      setCurrentProfile(name)
    }
  }, [profiles])

  const createProfile = useCallback((name: ProfileName) => {
    if (!profiles.includes(name)) {
      setProfiles((prev) => [...prev, name])
      setCurrentProfile(name)
    }
  }, [profiles])

  const deleteProfile = useCallback((name: ProfileName) => {
    if (name !== 'default' && profiles.length > 1) {
      setProfiles((prev) => prev.filter((p) => p !== name))
      if (currentProfile === name) {
        setCurrentProfile('default')
      }
    }
  }, [currentProfile, profiles])

  return (
    <ProfileContext.Provider value={{ currentProfile, profiles, switchProfile, createProfile, deleteProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfileContext(): ProfileContextType {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfileContext must be used within ProfileContextProvider')
  }
  return context
}

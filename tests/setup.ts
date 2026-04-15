import '@testing-library/jest-dom'

// Mock localStorage for tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0,
}
global.localStorage = localStorageMock as any

// Mock Web Notifications API
global.Notification = {
  permission: 'denied' as NotificationPermission,
  requestPermission: jest.fn(async () => 'denied' as const),
} as any

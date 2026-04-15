/**
 * Notifications Interface & Web Notifications Implementation Tests
 */

import { WebNotificationAdapter } from '@engine/notifications'

// Mock Web Notifications API for tests
const mockNotification = jest.fn() as any
mockNotification.permission = 'granted'
mockNotification.requestPermission = jest.fn()
global.Notification = mockNotification

describe('Web Notification Adapter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(mockNotification as any).permission = 'granted'
  })

  describe('requestPermission', () => {
    it('should request notification permission from browser', async () => {
      ;(global.Notification as any).requestPermission = jest.fn().mockResolvedValue('granted')

      const adapter = new WebNotificationAdapter()
      const permission = await adapter.requestPermission()

      expect(permission).toBe('granted')
      expect(Notification.requestPermission).toHaveBeenCalled()
    })

    it('should handle permission denied', async () => {
      ;(global.Notification as any).requestPermission = jest.fn().mockResolvedValue('denied')

      const adapter = new WebNotificationAdapter()
      const permission = await adapter.requestPermission()

      expect(permission).toBe('denied')
    })

    it('should handle default permission response', async () => {
      ;(global.Notification as any).requestPermission = jest.fn().mockResolvedValue('default')

      const adapter = new WebNotificationAdapter()
      const permission = await adapter.requestPermission()

      expect(permission).toBe('default')
    })
  })

  describe('hasPermission', () => {
    it('should return true when permission is granted', () => {
      ;(global.Notification as any).permission = 'granted'
      const adapter = new WebNotificationAdapter()
      expect(adapter.hasPermission()).toBe(true)
    })

    it('should return false when permission is denied', () => {
      ;(global.Notification as any).permission = 'denied'
      const adapter = new WebNotificationAdapter()
      expect(adapter.hasPermission()).toBe(false)
    })

    it('should return false for default permission', () => {
      ;(global.Notification as any).permission = 'default'
      const adapter = new WebNotificationAdapter()
      expect(adapter.hasPermission()).toBe(false)
    })
  })

  describe('send', () => {
    it('should send notification with title and message', async () => {
      ;(global.Notification as any).permission = 'granted'
      const adapter = new WebNotificationAdapter()

      await adapter.send('Task Complete', 'You completed Herb Run')

      expect(Notification).toHaveBeenCalledWith('Task Complete', {
        body: 'You completed Herb Run',
        icon: expect.any(String),
      })
    })

    it('should include icon in notification', async () => {
      ;(global.Notification as any).permission = 'granted'
      const adapter = new WebNotificationAdapter()

      await adapter.send('Reset!', 'Daily tasks reset')

      const call = (mockNotification).mock.calls[0]
      expect(call[1]).toHaveProperty('icon')
    })

    it('should include tag for notification grouping', async () => {
      ;(global.Notification as any).permission = 'granted'
      const adapter = new WebNotificationAdapter()

      await adapter.send('Task', 'Herb Run', 'herb-run')

      const call = (mockNotification).mock.calls[0]
      expect(call[1]).toHaveProperty('tag', 'herb-run')
    })

    it('should throw when no permission granted', async () => {
      ;(global.Notification as any).permission = 'denied'
      const adapter = new WebNotificationAdapter()

      await expect(adapter.send('Blocked', 'No permission')).rejects.toThrow()
    })

    it('should handle notification close event', async () => {
      ;(global.Notification as any).permission = 'granted'
      const notificationInstance = { close: jest.fn(), onclick: jest.fn() }
      mockNotification.mockImplementation(() => notificationInstance)

      const adapter = new WebNotificationAdapter()
      await adapter.send('Test', 'Message')

      // Verify notification was created
      expect(mockNotification).toHaveBeenCalled()
    })
  })

  describe('cleanup', () => {
    it('should close all active notifications', async () => {
      ;(global.Notification as any).permission = 'granted'
      const mockNotification1 = { close: jest.fn() }
      const mockNotification2 = { close: jest.fn() }

      let callCount = 0
      ;(global.Notification as any).mockImplementation(() => {
        callCount++
        return callCount === 1 ? mockNotification1 : mockNotification2
      })

      const adapter = new WebNotificationAdapter()
      await adapter.send('Notif 1', 'Message 1')
      await adapter.send('Notif 2', 'Message 2')
      await adapter.cleanup()

      expect(mockNotification1.close).toHaveBeenCalled()
      expect(mockNotification2.close).toHaveBeenCalled()
    })

    it('should handle cleanup on empty notification list', async () => {
      const adapter = new WebNotificationAdapter()
      await expect(adapter.cleanup()).resolves.not.toThrow()
    })
  })

  describe('Edge Cases', () => {
    it('should handle browser without Notification support', () => {
      const oldNotification = global.Notification
      ;(global as any).Notification = undefined

      expect(() => {
        new WebNotificationAdapter()
      }).not.toThrow()

      global.Notification = oldNotification
    })

    it('should sanitize notification messages', async () => {
      ;(global.Notification as any).permission = 'granted'
      const adapter = new WebNotificationAdapter()

      const maliciousMessage = '<script>alert("xss")</script>'
      await adapter.send('Title', maliciousMessage)

      const call = mockNotification.mock.calls[0]
      expect(call[1].body).not.toContain('<script>')
    })
  })
})

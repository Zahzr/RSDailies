/**
 * Notifications Engine - Interface & Web Implementation
 * 
 * Handles browser notifications for task resets, reminders, and milestones.
 */

export type NotificationPermission = 'granted' | 'denied' | 'default'

/**
 * Notification adapter interface for pluggable implementations.
 */
export interface INotificationAdapter {
  /**
   * Request browser notification permission from user
   */
  requestPermission(): Promise<NotificationPermission>

  /**
   * Check if notification permission is granted
   */
  hasPermission(): boolean

  /**
   * Send a notification to the user
   */
  send(title: string, message: string, tag?: string): Promise<void>

  /**
   * Close all active notifications
   */
  cleanup(): Promise<void>
}

/**
 * Web Notifications API adapter implementation
 */
export class WebNotificationAdapter implements INotificationAdapter {
  private activeNotifications: Notification[] = []

  constructor() {
    // Check if browser supports Notifications API
    if (!('Notification' in window)) {
      console.warn('This browser does not support Web Notifications')
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied'
    }

    const permission = await Notification.requestPermission()
    return permission as NotificationPermission
  }

  hasPermission(): boolean {
    if (!('Notification' in window)) {
      return false
    }

    return Notification.permission === 'granted'
  }

  async send(title: string, message: string, tag?: string): Promise<void> {
    if (!this.hasPermission()) {
      throw new Error('Notification permission not granted')
    }

    const notification = new Notification(title, {
      body: this.sanitizeMessage(message),
      icon: this.getIconUrl(),
      tag: tag || undefined,
    })

    this.activeNotifications.push(notification)

    // Auto-cleanup after 5 seconds
    setTimeout(() => {
      notification.close()
      this.activeNotifications = this.activeNotifications.filter((n) => n !== notification)
    }, 5000)
  }

  async cleanup(): Promise<void> {
    this.activeNotifications.forEach((notification) => {
      notification.close()
    })
    this.activeNotifications = []
  }

  /**
   * Sanitize message to prevent XSS
   */
  private sanitizeMessage(message: string): string {
    const div = document.createElement('div')
    div.textContent = message
    return div.innerHTML
  }

  /**
   * Get notification icon URL
   */
  private getIconUrl(): string {
    // Return path to app icon (placeholder)
    return 'assets/icon-192x192.png'
  }
}

/**
 * Null notification adapter for environments without notifications
 */
export class NullNotificationAdapter implements INotificationAdapter {
  async requestPermission(): Promise<NotificationPermission> {
    return 'denied'
  }

  hasPermission(): boolean {
    return false
  }

  async send(): Promise<void> {
    // No-op
  }

  async cleanup(): Promise<void> {
    // No-op
  }
}

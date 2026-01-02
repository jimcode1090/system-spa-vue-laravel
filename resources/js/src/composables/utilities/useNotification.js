import { ref } from 'vue'

/**
 * Notification/Toast System
 *
 * Simple notification system that can be replaced with a library
 * like vue-toastification, Notyf, or custom implementation
 */

const notifications = ref([])
let notificationId = 0

export function useNotification() {
    /**
     * Show a notification
     *
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     * @param {number} duration - Duration in milliseconds (0 = no auto-hide)
     */
    const notify = (message, type = 'info', duration = 5000) => {
        const id = notificationId++
        const notification = {
            id,
            message,
            type,
            visible: true
        }

        notifications.value.push(notification)

        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id)
            }, duration)
        }

        return id
    }

    /**
     * Show success notification
     */
    const success = (message, duration = 5000) => {
        return notify(message, 'success', duration)
    }

    /**
     * Show error notification
     */
    const error = (message, duration = 7000) => {
        return notify(message, 'error', duration)
    }

    /**
     * Show warning notification
     */
    const warning = (message, duration = 6000) => {
        return notify(message, 'warning', duration)
    }

    /**
     * Show info notification
     */
    const info = (message, duration = 5000) => {
        return notify(message, 'info', duration)
    }

    /**
     * Remove notification
     */
    const removeNotification = (id) => {
        const index = notifications.value.findIndex(n => n.id === id)
        if (index > -1) {
            notifications.value.splice(index, 1)
        }
    }

    /**
     * Clear all notifications
     */
    const clearAll = () => {
        notifications.value = []
    }

    /**
     * Simple alert fallback (can be replaced with toast library)
     */
    const simpleAlert = (message, type = 'info') => {
        // You can replace this with SweetAlert2, vue-toastification, etc.
        alert(message)
    }

    return {
        notifications,
        notify,
        success,
        error,
        warning,
        info,
        removeNotification,
        clearAll,
        simpleAlert
    }
}

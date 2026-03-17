import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
    id: string;
    type: 'complaint_assigned' | 'status_update' | 'alert' | 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    timestamp: string; // ISO string for storage
    read: boolean;
    data?: unknown;
}

interface NotificationStore {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    addNotification: (n: Notification) => void;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    clearAll: () => void;
    removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>()(
    persist(
        (set, get) => ({
            notifications: [],
            unreadCount: 0,
            isLoading: false,

            addNotification: (notification) => {
                set((state) => ({
                    notifications: [notification, ...state.notifications],
                    unreadCount: state.unreadCount + (notification.read ? 0 : 1)
                }));
            },

            markAsRead: async (id) => {
                // In a real app this would call an API first
                set((state) => ({
                    notifications: state.notifications.map(n =>
                        n.id === id ? { ...n, read: true } : n
                    ),
                    unreadCount: Math.max(0, state.unreadCount - 1)
                }));
            },

            markAllAsRead: async () => {
                // In a real app this would call an API first
                set((state) => ({
                    notifications: state.notifications.map(n => ({ ...n, read: true })),
                    unreadCount: 0
                }));
            },

            clearAll: () => set({ notifications: [], unreadCount: 0 }),

            removeNotification: (id) => {
                const state = get();
                const notification = state.notifications.find(n => n.id === id);
                const wasUnread = notification && !notification.read;

                set((state) => ({
                    notifications: state.notifications.filter(n => n.id !== id),
                    unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
                }));
            },
        }),
        { name: 'doctic-notification-storage' }
    )
);

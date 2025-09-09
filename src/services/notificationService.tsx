// services/notificationService.tsx
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export const setupNotifications = async () => {
  await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    }
  });
};

export const scheduleReminder = async (event: { 
  id: string; 
  title: string; 
  reminderTime?: string;
  description?: string;
}) => {
  if (!event.reminderTime) return;
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Reminder: ${event.title}`,
      body: event.description || '',
      data: { eventId: event.id },
    },
    trigger: {
      date: new Date(event.reminderTime)
    },
  });
};
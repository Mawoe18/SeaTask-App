import AsyncStorage from '@react-native-async-storage/async-storage';

const EVENTS_KEY = '@SeaTasks:events';

// Define the CalendarEvent interface to match your calendar component
interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  type: 'note' | 'reminder';
  startTime?: string;
  endTime?: string;
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
  repeatEndDate?: string;
  createdAt: string;
  reminderTime?: string;
}

export async function getEvents(): Promise<Record<string, CalendarEvent[]>> {
  try {
    const json = await AsyncStorage.getItem(EVENTS_KEY);
    return json ? JSON.parse(json) : {};
  } catch (error) {
    throw new Error('Failed to load events');
  }
}

export async function saveEvent(event: CalendarEvent): Promise<void> {
  try {
    const events = await getEvents();
    const dateEvents = events[event.date] || [];
    events[event.date] = [...dateEvents, event];
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    throw new Error('Failed to save event');
  }
}

export async function updateEvent(updatedEvent: CalendarEvent): Promise<void> {
  try {
    const events = await getEvents();
    if (!events[updatedEvent.date]) {
      events[updatedEvent.date] = [];
    }
    events[updatedEvent.date] = events[updatedEvent.date].map(e => 
      e.id === updatedEvent.id ? updatedEvent : e
    );
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    throw new Error('Failed to update event');
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    const events = await getEvents();
    Object.keys(events).forEach(date => {
      events[date] = events[date].filter(e => e.id !== id);
      if (events[date].length === 0) delete events[date];
    });
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    throw new Error('Failed to delete event');
  }
}

export async function fetchHolidays(country: string, year: number): Promise<Record<string, { date: string; name: string }>> {
  try {
    // Example implementation using a public holidays API
    // You can replace this with any holidays API you prefer
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);
    
    if (!response.ok) {
      console.warn('Failed to fetch holidays, returning empty object');
      return {};
    }
    
    const holidays = await response.json();
    const holidayMap: Record<string, { date: string; name: string }> = {};
    
    holidays.forEach((holiday: any) => {
      holidayMap[holiday.date] = {
        date: holiday.date,
        name: holiday.name || holiday.localName
      };
    });
    
    return holidayMap;
  } catch (error) {
    console.warn('Error fetching holidays:', error);
    return {};
  }
}

export async function shareCalendar(email?: string): Promise<void> {
  try {
    const events = await getEvents();
    const calendarData = JSON.stringify(events, null, 2);
    
    if (email) {
      // In a real app, you would send this via email API
      console.log(`Sharing calendar with ${email}:`, calendarData);
      // Example: await sendEmailWithAttachment(email, calendarData);
    } else {
      // For now, just copy to clipboard or show sharing options
      // You can implement native sharing here
      console.log('Calendar data ready for sharing:', calendarData);
    }
  } catch (error) {
    throw new Error('Failed to share calendar');
  }
}

export async function importCalendar(data: string): Promise<void> {
  try {
    const importedEvents = JSON.parse(data) as Record<string, CalendarEvent[]>;
    
    // Validate the imported data structure
    if (typeof importedEvents !== 'object' || importedEvents === null) {
      throw new Error('Invalid calendar data format');
    }
    
    // Validate each event has required properties
    Object.values(importedEvents).flat().forEach(event => {
      if (!event.id || !event.date || !event.title || !event.type) {
        throw new Error('Invalid event data in imported calendar');
      }
    });
    
    // Get existing events
    const existingEvents = await getEvents();
    
    // Merge imported events with existing ones
    Object.keys(importedEvents).forEach(date => {
      if (existingEvents[date]) {
        // Check for duplicate IDs and generate new ones if needed
        const existingIds = existingEvents[date].map(e => e.id);
        importedEvents[date] = importedEvents[date].map(event => {
          if (existingIds.includes(event.id)) {
            return { ...event, id: `${event.id}_imported_${Date.now()}` };
          }
          return event;
        });
        
        existingEvents[date] = [...existingEvents[date], ...importedEvents[date]];
      } else {
        existingEvents[date] = importedEvents[date];
      }
    });
    
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(existingEvents));
  } catch (error) {
    throw new Error('Failed to import calendar: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

// Helper function to export calendar data
export async function exportCalendar(): Promise<string> {
  try {
    const events = await getEvents();
    return JSON.stringify(events, null, 2);
  } catch (error) {
    throw new Error('Failed to export calendar');
  }
}

// Helper function to clear all events (useful for testing)
export async function clearAllEvents(): Promise<void> {
  try {
    await AsyncStorage.removeItem(EVENTS_KEY);
  } catch (error) {
    throw new Error('Failed to clear events');
  }
}
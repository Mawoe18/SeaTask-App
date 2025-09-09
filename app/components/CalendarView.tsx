import { Calendar } from 'react-native-calendars';

interface CalendarViewProps {
  events: Record<string, Event[]>;
  holidays: Record<string, { date: string; name: string }>;
  onDayPress: (day: { dateString: string }) => void;
}

export default function CalendarView({ events, holidays, onDayPress }: CalendarViewProps) {
  const getMarkedDates = () => {
    const marked: Record<string, any> = {};
    
    Object.keys(holidays).forEach(date => {
      marked[date] = { dotColor: 'red', marked: true };
    });
    
    Object.keys(events).forEach(date => {
      marked[date] = { ...marked[date], dotColor: 'blue', marked: true };
    });

    return marked;
  };

  return (
    <Calendar
      onDayPress={onDayPress}
      markedDates={getMarkedDates()}
    />
  );
}
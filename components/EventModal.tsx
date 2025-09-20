// Fixed EventModal.tsx
// - Improved modal structure for better rendering
// - Added proper keyboard handling
// - Enhanced form validation with better UX
// - Fixed picker component integration
// - Added loading states for better feedback

import { useState, useEffect, useRef } from 'react';
import { 
  Modal, 
  TextInput, 
  View, 
  Text, 
  Switch, 
  Alert, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

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

interface EventModalProps {
  visible: boolean;
  date: string;
  event?: CalendarEvent | null;
  onAddEvent: (eventData: Omit<CalendarEvent, 'id' | 'createdAt'>) => void;
  onUpdateEvent: (updatedEvent: CalendarEvent) => void;
  onClose: () => void;
}

export default function EventModal({ visible, date, event, onAddEvent, onUpdateEvent, onClose }: EventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'note' | 'reminder'>('note');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 60 * 60 * 1000));
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [repeatEndDate, setRepeatEndDate] = useState(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000));
  const [allDay, setAllDay] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showRepeatEndPicker, setShowRepeatEndPicker] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const titleRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        titleRef.current?.focus();
      }, 300);
    }
  }, [visible]);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setType(event.type);
      setStartTime(event.startTime ? new Date(event.startTime) : new Date());
      setEndTime(event.endTime ? new Date(event.endTime) : new Date());
      setRepeat(event.repeat || 'none');
      setRepeatEndDate(event.repeatEndDate ? new Date(event.repeatEndDate) : new Date());
      setAllDay(!event.startTime);
    } else {
      resetForm();
    }
  }, [event, visible]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('note');
    const now = new Date();
    setStartTime(now);
    setEndTime(new Date(now.getTime() + 60 * 60 * 1000));
    setRepeat('none');
    setRepeatEndDate(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000));
    setAllDay(false);
    setError('');
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      setIsLoading(false);
      return;
    }

    if (!allDay && endTime <= startTime) {
      setError('End time must be after start time');
      setIsLoading(false);
      return;
    }

    if (repeat !== 'none' && repeatEndDate <= new Date(date)) {
      setError('Repeat end date must be after start date');
      setIsLoading(false);
      return;
    }

    try {
      const eventData: Omit<CalendarEvent, 'id' | 'createdAt'> = {
        date,
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        startTime: allDay ? undefined : startTime.toISOString(),
        endTime: allDay ? undefined : endTime.toISOString(),
        repeat,
        repeatEndDate: repeat !== 'none' ? repeatEndDate.toISOString() : undefined,
        reminderTime: type === 'reminder' ? (allDay ? new Date(date).toISOString() : startTime.toISOString()) : undefined,
      };

      if (event) {
        onUpdateEvent({ ...event, ...eventData });
      } else {
        onAddEvent(eventData);
      }
      
      resetForm();
    } catch (error) {
      setError('Failed to save event. Please try again.');
      console.error('Error saving event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return; // Prevent closing while saving
    resetForm();
    onClose();
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {event ? 'Edit' : 'Add'} Event
          </Text>
          <Text style={styles.headerSubtitle}>{date}</Text>
          {!isLoading && (
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              ref={titleRef}
              placeholder="Enter event title"
              value={title}
              onChangeText={setTitle}
              style={[styles.textInput, error && !title.trim() && styles.inputError]}
              editable={!isLoading}
              returnKeyType="next"
            />
          </View>
          
          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              placeholder="Add details (optional)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              style={[styles.textInput, styles.multilineInput]}
              textAlignVertical="top"
              editable={!isLoading}
            />
          </View>
          
          {/* Event Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Event Type</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity 
                style={[styles.typeButton, type === 'note' && styles.activeType]} 
                onPress={() => !isLoading && setType('note')}
                disabled={isLoading}
              >
                <Text style={[styles.typeText, type === 'note' && styles.activeTypeText]}>
                  📝 Note
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeButton, type === 'reminder' && styles.activeType]} 
                onPress={() => !isLoading && setType('reminder')}
                disabled={isLoading}
              >
                <Text style={[styles.typeText, type === 'reminder' && styles.activeTypeText]}>
                  ⏰ Reminder
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* All Day Toggle */}
          <View style={styles.inputGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>All Day Event</Text>
              <Switch 
                value={allDay} 
                onValueChange={setAllDay} 
                trackColor={{ false: '#e0e0e0', true: '#007bff' }}
                thumbColor={allDay ? '#ffffff' : '#f4f3f4'}
                disabled={isLoading}
              />
            </View>
          </View>
          
          {/* Time Inputs */}
          {!allDay && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Start Time</Text>
                <TouchableOpacity 
                  style={styles.timeButton} 
                  onPress={() => !isLoading && setShowStartPicker(true)}
                  disabled={isLoading}
                >
                  <Text style={styles.timeText}>
                    🕐 {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>End Time</Text>
                <TouchableOpacity 
                  style={styles.timeButton} 
                  onPress={() => !isLoading && setShowEndPicker(true)}
                  disabled={isLoading}
                >
                  <Text style={styles.timeText}>
                    🕐 {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          
          {/* Repeat Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Repeat</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={repeat}
                onValueChange={(itemValue) => !isLoading && setRepeat(itemValue)}
                style={styles.picker}
                enabled={!isLoading}
              >
                <Picker.Item label="🚫 No Repeat" value="none" />
                <Picker.Item label="📅 Daily" value="daily" />
                <Picker.Item label="📅 Weekly" value="weekly" />
                <Picker.Item label="📅 Monthly" value="monthly" />
              </Picker>
            </View>
          </View>
          
          {/* Repeat End Date */}
          {repeat !== 'none' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Repeat Until</Text>
              <TouchableOpacity 
                style={styles.timeButton} 
                onPress={() => !isLoading && setShowRepeatEndPicker(true)}
                disabled={isLoading}
              >
                <Text style={styles.timeText}>
                  📅 {repeatEndDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]} 
            onPress={handleClose}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.saveButton, isLoading && styles.buttonDisabled]} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.saveButtonText}>Saving...</Text>
              </View>
            ) : (
              <Text style={styles.saveButtonText}>
                {event ? 'Update' : 'Save'} Event
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Date/Time Pickers */}
        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="default"
            onChange={(_, selectedTime) => {
              setShowStartPicker(false);
              if (selectedTime) {
                setStartTime(selectedTime);
                // Auto-adjust end time if it's before start time
                if (selectedTime >= endTime) {
                  setEndTime(new Date(selectedTime.getTime() + 60 * 60 * 1000));
                }
              }
            }}
          />
        )}
        
        {showEndPicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="default"
            minimumDate={startTime}
            onChange={(_, selectedTime) => {
              setShowEndPicker(false);
              if (selectedTime) {
                setEndTime(selectedTime);
              }
            }}
          />
        )}
        
        {showRepeatEndPicker && (
          <DateTimePicker
            value={repeatEndDate}
            mode="date"
            display="default"
            minimumDate={new Date(date)}
            onChange={(_, selectedDate) => {
              setShowRepeatEndPicker(false);
              if (selectedDate) {
                setRepeatEndDate(selectedDate);
              }
            }}
          />
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007bff',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  errorContainer: {
    backgroundColor: '#fee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontWeight: '500',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#333',
  },
  inputError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fef7f7',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeType: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007bff',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTypeText: {
    color: '#007bff',
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  timeButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
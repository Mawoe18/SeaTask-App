// // Fixed Calendar/index.tsx
// // - Fixed FAB positioning to prevent interference with BottomSheet
// // - Added proper modal state management to prevent conflicts
// // - Fixed Share/Import button functionality
// // - Improved error handling and state cleanup

// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// import BottomSheet from '@gorhom/bottom-sheet';
// import { addDays, addMonths, addWeeks, formatISO, isAfter, isBefore, parseISO } from 'date-fns';
// import { useRouter } from 'expo-router';
// import { useEffect, useRef, useState, useCallback } from 'react';
// import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { Calendar } from 'react-native-calendars';
// import EventModal from '../../components/EventModal';
// import ShareCalendarModal from '../../components/ShareCalendarModal';
// import { deleteEvent, fetchHolidays, getEvents, importCalendar, saveEvent, shareCalendar, updateEvent } from '../../src/services/calendarService';

// interface CalendarEvent {
//   id: string;
//   date: string;
//   title: string;
//   description?: string;
//   type: 'note' | 'reminder';
//   startTime?: string;
//   endTime?: string;
//   repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
//   repeatEndDate?: string;
//   createdAt: string;
//   reminderTime?: string;
// }

// export default function CalendarScreen() {
//   const router = useRouter();
//   const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
//   const [events, setEvents] = useState<Record<string, CalendarEvent[]>>({});
//   const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
//   const [showEventModal, setShowEventModal] = useState<boolean>(false);
//   const [showShareModal, setShowShareModal] = useState<boolean>(false);
//   const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
//   const [holidays, setHolidays] = useState<Record<string, { date: string; name: string }>>({});
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
//   const [filterType, setFilterType] = useState<'all' | 'note' | 'reminder' | 'repeating'>('all');
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const bottomSheetRef = useRef<BottomSheet>(null);

//   const handleBottomSheetChange = useCallback((index: number) => {
//     if (index >= 0) {
//       if (showEventModal) setShowEventModal(false);
//       if (showShareModal) setShowShareModal(false);
//     }
//   }, [showEventModal, showShareModal]);


//   useEffect(() => {
//     loadCalendarData();
//   }, []);

//   const loadCalendarData = async () => {
//     try {
//       setIsLoading(true);
//       const countryCode = 'US';
//       const year = new Date().getFullYear();
//       setHolidays(await fetchHolidays(countryCode, year));
//       const loadedEvents = await getEvents();
//       setEvents(loadedEvents);
//       setAllEvents(Object.values(loadedEvents).flat().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
//     } catch (error) {
//       console.error('Error loading calendar data:', error);
//       Alert.alert('Error', 'Failed to load calendar data. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getOccurrenceDates = (event: CalendarEvent): string[] => {
//     if (event.repeat === 'none' || !event.repeatEndDate) return [event.date];

//     const start = parseISO(event.date);
//     const end = parseISO(event.repeatEndDate);
//     const dates: string[] = [event.date];
//     let current = start;

//     while (isBefore(current, end)) {
//       if (event.repeat === 'daily') current = addDays(current, 1);
//       else if (event.repeat === 'weekly') current = addWeeks(current, 1);
//       else if (event.repeat === 'monthly') current = addMonths(current, 1);

//       if (isAfter(current, end)) break;
//       dates.push(formatISO(current, { representation: 'date' }));
//     }
//     return dates;
//   };

//   const doesEventOccurOnDate = (event: CalendarEvent, targetDate: string): boolean => {
//     if (event.repeat === 'none') return event.date === targetDate;
//     if (!event.repeatEndDate) return false;

//     const occurrences = getOccurrenceDates(event);
//     return occurrences.includes(targetDate);
//   };

//   const getEventsForDate = (date: string): CalendarEvent[] => {
//     return allEvents.filter(event => doesEventOccurOnDate(event, date));
//   };

//   const handleDayPress = (day: { dateString: string }) => {
//     // Close any existing modals first
//     if (showEventModal) setShowEventModal(false);
//     if (showShareModal) setShowShareModal(false);

//     setSelectedDate(day.dateString);
//     setTimeout(() => {
//       bottomSheetRef.current?.snapToIndex(0);
//     }, 100);
//   };

//   const handleAddEventClick = () => {
//     // Close bottom sheet first
//     bottomSheetRef.current?.close();

//     // Clear any editing state
//     setEditingEvent(null);

//     // Small delay to ensure bottom sheet closes first
//     setTimeout(() => {
//       setShowEventModal(true);
//     }, 200);
//   };

//   const handleShareImportClick = () => {
//     // Close bottom sheet if open
//     bottomSheetRef.current?.close();

//     // Close event modal if open
//     if (showEventModal) setShowEventModal(false);

//     // Small delay to prevent modal conflicts
//     setTimeout(() => {
//       setShowShareModal(true);
//     }, 200);
//   };

//   const handleAddEvent = async (eventData: Omit<CalendarEvent, 'id' | 'createdAt'>) => {
//     try {
//       setIsLoading(true);
//       const newEvent: CalendarEvent = {
//         ...eventData,
//         id: Date.now().toString(),
//         createdAt: new Date().toISOString()
//       };

//       await saveEvent(newEvent);
//       await loadCalendarData();
//       setShowEventModal(false);
//       setSelectedDate(newEvent.date);

//       // Small delay before opening bottom sheet
//       setTimeout(() => {
//         bottomSheetRef.current?.snapToIndex(0);
//       }, 300);
//     } catch (error) {
//       console.error('Error adding event:', error);
//       Alert.alert('Error', 'Failed to add event. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleUpdateEvent = async (updatedEvent: CalendarEvent) => {
//     try {
//       setIsLoading(true);
//       await updateEvent(updatedEvent);
//       await loadCalendarData();
//       setShowEventModal(false);
//       setEditingEvent(null);
//     } catch (error) {
//       console.error('Error updating event:', error);
//       Alert.alert('Error', 'Failed to update event. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteEvent = async (eventId: string) => {
//     Alert.alert(
//       'Delete Event',
//       'Are you sure you want to delete this event?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           onPress: async () => {
//             try {
//               setIsLoading(true);
//               await deleteEvent(eventId);
//               await loadCalendarData();
//             } catch (error) {
//               console.error('Error deleting event:', error);
//               Alert.alert('Error', 'Failed to delete event. Please try again.');
//             } finally {
//               setIsLoading(false);
//             }
//           },
//           style: 'destructive',
//         },
//       ]
//     );
//   };

//   const handleShareCalendar = async (email?: string) => {
//     try {
//       setIsLoading(true);
//       await shareCalendar(email);
//       Alert.alert('Success', 'Calendar shared successfully');
//       setShowShareModal(false);
//     } catch (error) {
//       console.error('Error sharing calendar:', error);
//       Alert.alert('Error', 'Failed to share calendar');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleImportCalendar = async (jsonData: string) => {
//     try {
//       setIsLoading(true);
//       await importCalendar(jsonData);
//       Alert.alert('Success', 'Calendar imported successfully');
//       setShowShareModal(false);
//       await loadCalendarData();
//     } catch (error) {
//       console.error('Error importing calendar:', error);
//       Alert.alert('Error', 'Failed to import calendar');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getMarkedDates = () => {
//     const marked: Record<string, any> = {};

//     Object.keys(holidays).forEach(date => {
//       marked[date] = {
//         dotColor: 'red',
//         marked: true,
//         customStyles: { container: { backgroundColor: '#fffbeb' } }
//       };
//     });

//     allEvents.forEach(event => {
//       const dates = getOccurrenceDates(event);
//       dates.forEach(date => {
//         if (!marked[date]) marked[date] = { marked: true };
//         marked[date].dotColor = event.type === 'reminder' ? 'blue' : 'green';
//       });
//     });

//     return marked;
//   };

//   const filteredEvents = allEvents.filter(event => {
//     const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       event.description?.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesFilter = filterType === 'all' ||
//       (filterType === 'note' && event.type === 'note') ||
//       (filterType === 'reminder' && event.type === 'reminder') ||
//       (filterType === 'repeating' && event.repeat !== 'none');
//     return matchesSearch && matchesFilter;
//   });

//   const renderEventItem = ({ item }: { item: CalendarEvent }) => (
//     <View style={styles.eventCard}>
//       <Text style={styles.eventTitle}>
//         {item.title} {item.repeat !== 'none' ? `(Repeating: ${item.repeat})` : ''}
//       </Text>
//       {item.description && (
//         <Text style={styles.eventDescription}>
//           {item.description}
//         </Text>
//       )}
//       {item.startTime && item.endTime && (
//         <Text style={styles.eventTime}>
//           {new Date(item.startTime).toLocaleTimeString()} - {new Date(item.endTime).toLocaleTimeString()}
//         </Text>
//       )}
//       <View style={styles.eventFooter}>
//         <Text style={[styles.eventType, { color: item.type === 'reminder' ? '#007bff' : '#28a745' }]}>
//           {item.type.toUpperCase()}
//         </Text>
//         <View style={styles.eventActions}>
//           <TouchableOpacity onPress={() => {
//             bottomSheetRef.current?.close();
//             setEditingEvent(item);
//             setTimeout(() => {
//               setShowEventModal(true);
//             }, 200);
//           }}>
//             <Text style={styles.editText}>Edit</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => handleDeleteEvent(item.id)}>
//             <Text style={styles.deleteText}>Delete</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <View className="flex-1 bg-gray-50">
//       <View className="bg-blue-600 py-10 px-4 rounded-b-3xl shadow-sm">
//         <Text className="text-white text-xl font-bold text-center">Calendar</Text>
//       </View>

//       <View className="flex-1 px-4 pt-4">
//         <View className="flex-row justify-around mb-4 bg-white p-2 rounded-lg shadow">
//           <TouchableOpacity
//             onPress={() => setViewMode('month')}
//             style={[styles.viewButton, viewMode === 'month' && styles.activeViewButton]}
//             disabled={isLoading}
//           >
//             <Text style={[styles.viewButtonText, viewMode === 'month' && styles.activeViewButtonText]}>Month</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => setViewMode('list')}
//             style={[styles.viewButton, viewMode === 'list' && styles.activeViewButton]}
//             disabled={isLoading}
//           >
//             <Text style={[styles.viewButtonText, viewMode === 'list' && styles.activeViewButtonText]}>List</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={handleShareImportClick}
//             style={styles.viewButton}
//             disabled={isLoading}
//           >
//             <Text style={styles.viewButtonText}>Share/Import</Text>
//           </TouchableOpacity>
//         </View>

//         {viewMode === 'month' ? (
//           <Calendar
//             current={selectedDate}
//             onDayPress={handleDayPress}
//             markedDates={getMarkedDates()}
//             theme={{
//               todayTextColor: '#2563eb',
//               selectedDayBackgroundColor: '#007bff',
//               arrowColor: '#007bff',
//             }}
//             style={{ borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 }}
//           />
//         ) : (
//           <>
//             <TextInput
//               placeholder="Search events..."
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               style={styles.searchInput}
//               editable={!isLoading}
//             />
//             <View className="flex-row justify-around mb-4 bg-white p-2 rounded-lg shadow">
//               <TouchableOpacity
//                 onPress={() => setFilterType('all')}
//                 style={[styles.filterButton, filterType === 'all' && styles.activeFilter]}
//                 disabled={isLoading}
//               >
//                 <Text style={[styles.filterText, filterType === 'all' && styles.activeFilterText]}>All</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => setFilterType('note')}
//                 style={[styles.filterButton, filterType === 'note' && styles.activeFilter]}
//                 disabled={isLoading}
//               >
//                 <Text style={[styles.filterText, filterType === 'note' && styles.activeFilterText]}>Notes</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => setFilterType('reminder')}
//                 style={[styles.filterButton, filterType === 'reminder' && styles.activeFilter]}
//                 disabled={isLoading}
//               >
//                 <Text style={[styles.filterText, filterType === 'reminder' && styles.activeFilterText]}>Reminders</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => setFilterType('repeating')}
//                 style={[styles.filterButton, filterType === 'repeating' && styles.activeFilter]}
//                 disabled={isLoading}
//               >
//                 <Text style={[styles.filterText, filterType === 'repeating' && styles.activeFilterText]}>Repeating</Text>
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={filteredEvents}
//               keyExtractor={item => item.id}
//               renderItem={renderEventItem}
//               ListFooterComponent={
//                 <TouchableOpacity
//                   style={[styles.addButtonInList, isLoading && styles.buttonDisabled]}
//                   onPress={() => {
//                     setSelectedDate(new Date().toISOString().split('T')[0]);
//                     setEditingEvent(null);
//                     setShowEventModal(true);
//                   }}
//                   disabled={isLoading}
//                 >
//                   <Text style={styles.addButtonText}>Add New Event</Text>
//                 </TouchableOpacity>
//               }
//             />
//           </>
//         )}
//       </View>

//       {/* FAB - Moved higher to avoid footer collision */}
//       <TouchableOpacity
//         style={[styles.fab, isLoading && styles.buttonDisabled]}
//         onPress={handleAddEventClick}
//         disabled={isLoading}
//       >
//         <MaterialIcons name="add" size={24} color="white" />
//       </TouchableOpacity>

//       {/* Footer Navigation */}
//       <View className="absolute bottom-0 w-full flex-row justify-around bg-blue-600 px-8 py-4 rounded-t-3xl shadow-sm">
//         <TouchableOpacity className="items-center" onPress={() => router.push('/')}>
//           <MaterialIcons name="home" size={26} color="white" />
//           <Text className="text-white text-xs mt-1 font-sans">Home</Text>
//         </TouchableOpacity>
//         <TouchableOpacity className="items-center" onPress={() => router.push('/work-order')}>
//           <MaterialIcons name="assignment" size={26} color="white" />
//           <Text className="text-white text-xs mt-1 font-sans">Work Order</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Bottom Sheet */}
//       <BottomSheet
//         ref={bottomSheetRef}
//         snapPoints={['50%', '90%']}
//         index={-1}
//         enablePanDownToClose={true}
//         handleStyle={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
//         onChange={handleBottomSheetChange}  // Use the callback
//       >
//         <View style={{ padding: 20, backgroundColor: '#fff' }}>
//           <Text style={styles.bottomSheetTitle}>
//             Events for {selectedDate}
//           </Text>
//           <FlatList
//             data={getEventsForDate(selectedDate)}
//             keyExtractor={item => item.id}
//             renderItem={renderEventItem}
//             showsVerticalScrollIndicator={false}
//           />
//           <TouchableOpacity
//             style={[styles.addButton, isLoading && styles.buttonDisabled]}
//             onPress={handleAddEventClick}
//             disabled={isLoading}
//           >
//             <Text style={styles.addButtonText}>Add New Event</Text>
//           </TouchableOpacity>
//         </View>
//       </BottomSheet>

//       {/* Event Modal */}
//       <EventModal
//         visible={showEventModal}
//         date={selectedDate}
//         event={editingEvent}
//         onAddEvent={handleAddEvent}
//         onUpdateEvent={handleUpdateEvent}
//         onClose={() => {
//           setShowEventModal(false);
//           setEditingEvent(null);
//         }}
//       />

//       {/* Share Calendar Modal */}
//       <ShareCalendarModal
//         visible={showShareModal}
//         onShare={handleShareCalendar}
//         onImport={handleImportCalendar}
//         onClose={() => setShowShareModal(false)}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   eventCard: {
//     backgroundColor: '#ffffff',
//     padding: 16,
//     marginBottom: 12,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//     borderLeftWidth: 4,
//   },
//   eventTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   eventDescription: {
//     color: '#6c757d',
//     marginBottom: 8,
//     fontSize: 14,
//   },
//   eventTime: {
//     fontSize: 12,
//     color: '#6c757d',
//     marginBottom: 8,
//   },
//   eventFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   eventType: {
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   eventActions: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   editText: {
//     color: '#007bff',
//     fontWeight: '500',
//   },
//   deleteText: {
//     color: '#dc3545',
//     fontWeight: '500',
//   },
//   searchInput: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 12,
//     backgroundColor: '#fff',
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//   },
//   viewButton: {
//     padding: 8,
//     borderRadius: 8,
//   },
//   activeViewButton: {
//     backgroundColor: '#007bff',
//   },
//   viewButtonText: {
//     color: '#333',
//     fontWeight: '500',
//   },
//   activeViewButtonText: {
//     color: '#fff',
//   },
//   filterButton: {
//     padding: 8,
//     borderRadius: 8,
//   },
//   activeFilter: {
//     backgroundColor: '#007bff',
//   },
//   filterText: {
//     color: '#333',
//     fontWeight: '500',
//   },
//   activeFilterText: {
//     color: '#fff',
//   },
//   addButton: {
//     backgroundColor: '#007bff',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginTop: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   addButtonInList: {
//     backgroundColor: '#28a745',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginVertical: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   addButtonText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   fab: {
//     position: 'absolute',
//     bottom: 100, // Moved higher to avoid footer collision
//     right: 20,
//     backgroundColor: '#007bff',
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//     zIndex: 1000, // Ensure it's above other elements
//   },
//   bottomSheetTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     color: '#333',
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
// });




// app/calendar/index.tsx (temporary minimal version)
import React from 'react';
import { View, Text } from 'react-native';

export default function CalendarScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Calendar Screen - Testing</Text>
    </View>
  );
}
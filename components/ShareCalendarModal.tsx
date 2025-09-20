// Fixed ShareCalendarModal.tsx
// - Fixed jumbled UI by using proper modal structure
// - Removed flex: 1 that was causing layout issues
// - Simplified layout structure for better rendering
// - Added proper modal backdrop handling
// - Fixed container sizing and positioning

import { useState } from 'react';
import { 
  Modal, 
  TextInput, 
  Alert, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

interface ShareCalendarModalProps {
  visible: boolean;
  onShare: (email?: string) => Promise<void>;
  onImport: (data: string) => Promise<void>;
  onClose: () => void;
}

export default function ShareCalendarModal({ visible, onShare, onImport, onClose }: ShareCalendarModalProps) {
  const [email, setEmail] = useState('');
  const [importData, setImportData] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async () => {
    if (email && !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    
    try {
      setIsLoading(true);
      await onShare(email || undefined);
      setEmail('');
    } catch (error) {
      Alert.alert('Share Failed', 'Failed to share calendar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      Alert.alert('No Data', 'Please paste calendar data to import');
      return;
    }
    
    try {
      setIsLoading(true);
      await onImport(importData.trim());
      setImportData('');
    } catch (error) {
      Alert.alert('Import Failed', 'Failed to import calendar data. Please check the format and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setImportData('');
    setIsLoading(false);
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
          <Text style={styles.title}>Share & Import Calendar</Text>
          <TouchableOpacity 
            onPress={handleClose} 
            style={styles.closeButton}
            disabled={isLoading}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Share Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📤 Share Calendar</Text>
            </View>
            <Text style={styles.description}>
              Export your calendar data to share with others. Optionally send via email.
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address (Optional)</Text>
              <TextInput 
                placeholder="Enter email address" 
                value={email} 
                onChangeText={setEmail}
                style={styles.textInput}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.shareButton, isLoading && styles.buttonDisabled]} 
              onPress={handleShare}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="white" size="small" />
                  <Text style={styles.loadingText}>Sharing...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Share Calendar</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Import Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📥 Import Calendar</Text>
            </View>
            <Text style={styles.description}>
              Paste calendar data (JSON format) to import events. This will merge with existing events.
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Calendar Data</Text>
              <TextInput 
                placeholder="Paste calendar JSON data here..."
                value={importData} 
                onChangeText={setImportData}
                multiline
                numberOfLines={6}
                style={[styles.textInput, styles.multilineInput]}
                textAlignVertical="top"
                editable={!isLoading}
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.importButton, isLoading && styles.buttonDisabled]} 
              onPress={handleImport}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="white" size="small" />
                  <Text style={styles.loadingText}>Importing...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Import Calendar</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton, isLoading && styles.buttonDisabled]} 
            onPress={handleClose}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#007bff',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
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
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  actionButton: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: '#28a745',
  },
  importButton: {
    backgroundColor: '#007bff',
  },
  divider: {
    height: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
});
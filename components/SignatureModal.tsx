import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Signature from 'react-native-signature-canvas';

interface SignatureModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (signature: string) => void;
  onClear: () => void;
  // NEW: Add these as optional props
  onClearCustomerSignature?: () => void;
  onClearSeatecSignature?: () => void;
  signatureType?: 'customer' | 'seatec'; // Optional type identifier
}

export default function SignatureModal({ 
  visible, 
  onClose, 
  onSave, 
  onClear, // Keep original clear prop
  // New props with default values
  onClearCustomerSignature = () => {}, 
  onClearSeatecSignature = () => {},
  signatureType 
}: SignatureModalProps) {
  const signatureRef = React.useRef<any>(null);

  // Enhanced clear handler that works with both old and new implementations
  const handleClear = () => {
    signatureRef.current?.clearSignature();
    // First try the original onClear if it exists
    if (onClear) {
      onClear();
    }
    // Then handle the new signature-specific clears
    else if (signatureType === 'customer') {
      onClearCustomerSignature();
    } 
    else if (signatureType === 'seatec') {
      onClearSeatecSignature();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>
          {signatureType ? 
            `${signatureType === 'customer' ? 'Customer' : 'SEATEC'} Signature` 
            : 'Please Sign Below'}
        </Text>
        
        <View style={styles.signatureContainer}>
          <Signature
            ref={signatureRef}
            onOK={onSave}
            onEmpty={() => {}}
            descriptionText=""
            clearText=""
            confirmText=""
            webStyle={`
              .m-signature-pad {
                box-shadow: none;
                border: none;
                margin: 0;
                padding: 0;
                width: 100%;
                background-color: white;
              }
              body, html {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                background-color: white;
              }
              .m-signature-pad--body {
                border: none;
                background-color: white;
              }
              .m-signature-pad--body canvas {
                background-color: white;
                border: none;
                width: 100% !important;
                height: 100% !important;
              }
              /* Make signature lines bolder */
              canvas {
                background-color: white;
              }
            `}
            backgroundColor="white"
            penColor="#2483C5"
            minWidth={2} // Minimum stroke width for bolder lines
            maxWidth={4} // Maximum stroke width
            dotSize={2} // Size of dots when tapping
            throttle={16} // Smoother drawing
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.clearButton]}
            onPress={handleClear}
          >
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.saveButton]}
            onPress={() => signatureRef.current?.readSignature()}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Add instructions for better signatures */}
        <Text style={styles.instructionText}>
          Tip: Draw slowly and press firmly for a clearer signature
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  signatureContainer: {
    flex: 1,
    borderWidth: 2, // Thicker border for better visibility
    borderColor: '#333', // Darker border
    marginBottom: 20,
    backgroundColor: 'white',
    minHeight: 200, // Ensure minimum height for signature area
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10, // Reduced margin
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: '#f44336', // Red
  },
  clearButton: {
    backgroundColor: '#ff9800', // Orange
  },
  saveButton: {
    backgroundColor: '#4caf50', // Green
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  instructionText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
});
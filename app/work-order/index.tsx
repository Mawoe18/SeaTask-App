import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';
import { Link } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SignatureModal from '../../components/SignatureModal';
import { generateWorkOrderPDF } from '../../src/pdfTemplates/workOrderTemplate';
import { PDF_DIRECTORY, createPdfDirectory } from '../index';

export default function WorkOrderForm() {
    const [formData, setFormData] = useState({
        customerName: '',
        equipmentModel: '',
        customModel: '',
        location: '',
        natureComplaint: '',
        customComplaint: '',
        workDone1: '',
        workDone2: '',
        workDone3: '',
        workDone4: '',
        representativeName: '',
        representativePosition: '',
        hoursSpent: '',
        repDate: '',
        techPersonnel1: '',
        techPersonnel2: '',
        techPersonnel3: '',
        material1: '',
        material2: '',
        material3: '',
        material4: '',
        customerRemarks: '',
        custRepName: '',
        custRepPosition: '',
        custRepContact: '',
        custRepDate: '',
        signature: ''
    });

    const [signature, setSignature] = useState<string | null>(null);
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [signatureError, setSignatureError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [pdfPath, setPdfPath] = useState<string | null>(null);

    const handleSignatureSave = (signature: string) => {
        setSignature(signature);
        setFormData({ ...formData, signature });
        setShowSignatureModal(false);
    };

    const handleClearSignature = () => {
        setSignature(null);
        setFormData({ ...formData, signature: '' });
    };

    const handleSubmit = async () => {
        console.log('[WorkOrder] Submit button clicked');
        setSignatureError('');

        if (!signature) {
            console.warn('[WorkOrder] Validation failed - missing signature');
            setSignatureError('Customer signature is required');
            Alert.alert('Error', 'Customer signature is required');
            return;
        }

        setIsLoading(true);
        console.log('[WorkOrder] Starting PDF generation process');

        try {
            // Ensure PDF directory exists, fall back to documentDirectory if creation fails
            const dirCreated = await createPdfDirectory();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `WorkOrder_${formData.customerName || 'Customer'}_${timestamp}.pdf`;
            const filePath = dirCreated ? `${PDF_DIRECTORY}${fileName}` : `${FileSystem.documentDirectory}${fileName}`;

            console.log('[WorkOrder] Generating PDF at path:', filePath);
            
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('PDF generation timeout - process took too long')), 30000)
            );

            await Promise.race([
                generateWorkOrderPDF(formData, filePath),
                timeoutPromise
            ]);
            
            console.log('[WorkOrder] PDF generated successfully');

            const fileInfo = await FileSystem.getInfoAsync(filePath);
            if (!fileInfo.exists) {
                throw new Error('PDF file was not created');
            }

            console.log('[WorkOrder] File size:', fileInfo.size, 'bytes');

            setPdfPath(filePath);
            setShowSuccessModal(true);

        } catch (error) {
            console.error('[WorkOrder] PDF generation failed:', error);
            let errorMessage = 'Failed to generate the PDF. Please try again.';
            if (error.message.includes('timeout')) {
                errorMessage = 'PDF generation is taking too long. Please try again or contact support.';
            }
            Alert.alert('Error', errorMessage);
        } finally {
            console.log('[WorkOrder] Process completed');
            setIsLoading(false);
        }
    };

    const handleEmailPdf = async () => {
        try {
            const isAvailable = await MailComposer.isAvailableAsync();
            if (!isAvailable) {
                Alert.alert('Error', 'No email client is available on this device');
                return;
            }

            await MailComposer.composeAsync({
                recipients: ['mawoe.noagbe@seatectelecom.com','elias.adams@seatectelecom.com','emmanuella.aidoo-gyamfi@seatectelecom.com'], // Hardcoded recipient
                subject: `Work Order - ${formData.customerName || 'Customer'}`,
                body: 'Please find the attached work order PDF',
                attachments: pdfPath ? [pdfPath] : [],
            });
            console.log('[WorkOrder] Email client opened');
            if (pdfPath) {
                await FileSystem.deleteAsync(pdfPath);
                console.log('[WorkOrder] PDF deleted after emailing');
                setPdfPath(null);
                setShowSuccessModal(false);
            }
        } catch (error) {
            console.error('[WorkOrder] Error opening email client:', error);
            Alert.alert('Error', 'Failed to open email client');
        }
    };

    const handlePreviewPdf = async () => {
        if (pdfPath) {
            try {
                await Sharing.shareAsync(pdfPath, {
                    mimeType: 'application/pdf',
                });
                console.log('[WorkOrder] PDF preview opened');
                await FileSystem.deleteAsync(pdfPath);
                console.log('[WorkOrder] PDF deleted after preview');
                setPdfPath(null);
                setShowSuccessModal(false);
            } catch (error) {
                console.error('[WorkOrder] Error previewing PDF:', error);
                Alert.alert('Error', 'Failed to preview PDF');
            }
        } else {
            Alert.alert('Error', 'No PDF available to preview');
        }
    };

    return (
        <View className="flex-1">
            <View className="bg-blue-600 py-10 px-4 rounded-b-3xl shadow-sm">
                <Text className="text-white text-2xl font-bold text-center font-sans">Seatec</Text>
            </View>

            <ScrollView
                className="flex-1 px-4"
                contentContainerStyle={{
                    paddingTop: 24,
                    paddingBottom: 100
                }}>
                <Text className="text-xl font-bold mb-6">CUSTOMER'S WORK ORDER FORM</Text>

                <View className="mb-6">
                    <Text className="font-semibold mb-2">NAME OF CUSTOMER:</Text>
                    <TextInput
                        className="border border-gray-300 p-3 rounded mb-4 bg-white"
                        placeholder="Enter customer name"
                        value={formData.customerName}
                        onChangeText={(text) => setFormData({ ...formData, customerName: text })}
                    />

                    <Text className="font-semibold mb-2">EQUIPMENT MODEL:</Text>
                    <View className="border border-gray-300 rounded mb-4 bg-white">
                        <Picker
                            selectedValue={formData.equipmentModel}
                            onValueChange={(value) => setFormData({ ...formData, equipmentModel: value })}
                            style={{ height: 50, width: '100%' }}
                        >
                            <Picker.Item label="Select equipment model..." value="" />
                            <Picker.Item label="OXO" value="OXO" />
                            <Picker.Item label="OXE" value="OXE" />
                            <Picker.Item label="CCTV" value="CCTV" />
                            <Picker.Item label="UCM6301" value="UCM6301" />
                            <Picker.Item label="Other" value="Other" />
                        </Picker>
                    </View>

                    {formData.equipmentModel === 'Other' && (
                        <TextInput
                            className="border border-gray-300 p-3 rounded mb-4 bg-white"
                            placeholder="Specify equipment model"
                            value={formData.customModel}
                            onChangeText={(text) => setFormData({ ...formData, customModel: text })}
                        />
                    )}

                    <Text className="font-semibold mb-2">NATURE OF COMPLAINT:</Text>
                    <View className="border border-gray-300 rounded mb-4 bg-white">
                        <Picker
                            selectedValue={formData.natureComplaint}
                            onValueChange={(value) => setFormData({ ...formData, natureComplaint: value })}
                            style={{ height: 50, width: '100%' }}
                        >
                            <Picker.Item label="Select nature of complaint..." value="" />
                            <Picker.Item label="Fault Rectification" value="Fault Rectification" />
                            <Picker.Item label="Phone Deployment" value="Phone Deployment" />
                            <Picker.Item label="External Lines Down" value="External Lines Down" />
                            <Picker.Item label="User Not Up" value="User Not Up" />
                            <Picker.Item label="Miscellaneous" value="Miscellaneous" />
                            <Picker.Item label="Other" value="Other" />
                        </Picker>
                    </View>

                    {formData.natureComplaint === 'Other' && (
                        <TextInput
                            className="border border-gray-300 p-3 rounded mb-4 bg-white"
                            placeholder="Specify nature of complaint"
                            value={formData.customComplaint}
                            onChangeText={(text) => setFormData({ ...formData, customComplaint: text })}
                        />
                    )}
                </View>

                <View className="mb-6">
                    <Text className="font-semibold mb-2">NATURE OF WORK DONE (Optional):</Text>
                    {[1, 2, 3, 4].map((num) => (
                        <TextInput
                            key={num}
                            className="border border-gray-300 p-3 rounded mb-2 bg-white"
                            placeholder={`Work done ${num}`}
                            value={formData[`workDone${num}`]}
                            onChangeText={(text) => setFormData({ ...formData, [`workDone${num}`]: text })}
                        />
                    ))}
                </View>

                <View className="mb-6">
                    <Text className="font-semibold mb-2">SEATEC'S REPRESENTATIVE:</Text>
                    <TextInput
                        className="border border-gray-300 p-3 rounded mb-2 bg-white"
                        placeholder="Full name"
                        value={formData.representativeName}
                        onChangeText={(text) => setFormData({ ...formData, representativeName: text })}
                    />
                    <TextInput
                        className="border border-gray-300 p-3 rounded mb-2 bg-white"
                        placeholder="Position"
                        value={formData.representativePosition}
                        onChangeText={(text) => setFormData({ ...formData, representativePosition: text })}
                    />
                    <TextInput
                        className="border border-gray-300 p-3 rounded mb-2 bg-white"
                        placeholder="Hours spent on job"
                        value={formData.hoursSpent}
                        onChangeText={(text) => setFormData({ ...formData, hoursSpent: text })}
                    />
                    <TextInput
                        className="border border-gray-300 p-3 rounded mb-4 bg-white"
                        placeholder="Date (DD/MM/YYYY)"
                        value={formData.repDate}
                        onChangeText={(text) => setFormData({ ...formData, repDate: text })}
                    />
                </View>

                <View className="mb-6">
                    <Text className="font-semibold mb-2">OTHER TECHNICAL PERSONNEL:</Text>
                    {[1, 2, 3].map((num) => (
                        <TextInput
                            key={num}
                            className="border border-gray-300 p-3 rounded mb-2 bg-white"
                            placeholder={`Technician ${num} name`}
                            value={formData[`techPersonnel${num}`]}
                            onChangeText={(text) => setFormData({ ...formData, [`techPersonnel${num}`]: text })}
                        />
                    ))}
                </View>

                <View className="mb-6">
                    <Text className="font-semibold mb-2">MATERIALS USED:</Text>
                    {[1, 2, 3, 4].map((num) => (
                        <TextInput
                            key={num}
                            className="border border-gray-300 p-3 rounded mb-2 bg-white"
                            placeholder={`Material ${num}`}
                            value={formData[`material${num}`]}
                            onChangeText={(text) => setFormData({ ...formData, [`material${num}`]: text })}
                        />
                    ))}
                </View>

                <View className="mb-6">
                    <Text className="font-semibold mb-2">CUSTOMER'S REMARKS:</Text>
                    <TextInput
                        className="border border-gray-300 p-3 rounded mb-4 bg-white h-24"
                        textAlignVertical="top"
                        placeholder="Enter remarks"
                        multiline
                        value={formData.customerRemarks}
                        onChangeText={(text) => setFormData({ ...formData, customerRemarks: text })}
                    />
                </View>

                <View className="mb-6">
                    <Text className="font-semibold mb-2">CUSTOMER REPRESENTATIVE:</Text>
                    <TextInput
                        className="border border-gray-300 p-3 rounded mb-2 bg-white"
                        placeholder="Full name"
                        value={formData.custRepName}
                        onChangeText={(text) => setFormData({ ...formData, custRepName: text })}
                    />
                    <TextInput
                        className="border border-gray-300 p-3 rounded mb-2 bg-white"
                        placeholder="Position"
                        value={formData.custRepPosition}
                        onChangeText={(text) => setFormData({ ...formData, custRepPosition: text })}
                    />
                    <TextInput
                        className="border border-gray-300 p-3 rounded mb-2 bg-white"
                        placeholder="Contact"
                        value={formData.custRepContact}
                        onChangeText={(text) => setFormData({ ...formData, custRepContact: text })}
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        className="border border-gray-300 p-3 rounded mb-4 bg-white"
                        placeholder="Date (DD/MM/YYYY)"
                        value={formData.custRepDate}
                        onChangeText={(text) => setFormData({ ...formData, custRepDate: text })}
                    />

                    <Text className="font-semibold mb-2">SIGNATURE:</Text>
                    {signature ? (
                        <>
                            <View className="h-32 border border-gray-300 bg-white mb-2 justify-center">
                                <Image
                                    source={{ uri: signature }}
                                    style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                                />
                            </View>
                            <View className="flex-row space-x-2">
                                <TouchableOpacity
                                    className="bg-red-500 py-2 px-4 rounded"
                                    onPress={handleClearSignature}
                                >
                                    <Text className="text-white">Clear</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="bg-blue-500 py-2 px-4 rounded"
                                    onPress={() => setShowSignatureModal(true)}
                                >
                                    <Text className="text-white">Change</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <TouchableOpacity
                            className="h-32 border border-gray-300 bg-white justify-center items-center"
                            onPress={() => setShowSignatureModal(true)}
                        >
                            <Text className="text-gray-500">Tap to sign</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    className={`py-3 px-6 rounded-lg mb-16 ${isLoading ? 'bg-blue-400' : 'bg-blue-600'}`}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <View className="flex-row items-center justify-center">
                            <ActivityIndicator size="small" color="white" />
                            <Text className="text-white ml-2 font-bold">GENERATING PDF...</Text>
                        </View>
                    ) : (
                        <Text className="text-white text-center font-bold">SUBMIT WORK ORDER</Text>
                    )}
                </TouchableOpacity>

                {signatureError && (
                    <Text className="text-red-500 text-sm mb-4 text-center">{signatureError}</Text>
                )}

                <SignatureModal
                    visible={showSignatureModal}
                    onClose={() => setShowSignatureModal(false)}
                    onSave={handleSignatureSave}
                    onClear={handleClearSignature}
                />

                <Modal
                    visible={showSuccessModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowSuccessModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Success</Text>
                            <Text style={styles.modalMessage}>PDF generated successfully!</Text>
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={handlePreviewPdf}
                                >
                                    <Text style={styles.modalButtonText}>Preview PDF</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={handleEmailPdf}
                                >
                                    <Text style={styles.modalButtonText}>Email PDF</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={async () => {
                                        console.log('[WorkOrder] User chose to save PDF');
                                        try {
                                            if (pdfPath) {
                                                await Sharing.shareAsync(pdfPath, {
                                                    dialogTitle: 'Save Work Order PDF',
                                                    mimeType: 'application/pdf',
                                                });
                                                console.log('[WorkOrder] PDF save dialog shown');
                                                await FileSystem.deleteAsync(pdfPath);
                                                console.log('[WorkOrder] PDF deleted after saving');
                                                setPdfPath(null);
                                                setShowSuccessModal(false);
                                            }
                                        } catch (saveError) {
                                            console.error('[WorkOrder] Error saving PDF:', saveError);
                                            Alert.alert('Error', 'Failed to save PDF');
                                        }
                                    }}
                                >
                                    <Text style={styles.modalButtonText}>Save As...</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.closeButton]}
                                    onPress={() => setShowSuccessModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {isLoading && (
                    <View className="absolute inset-0 bg-black/30 justify-center items-center">
                        <View className="bg-white p-6 rounded-lg w-3/4">
                            <ActivityIndicator size="large" color="#2563eb" />
                            <Text className="mt-4 text-gray-700 text-center font-medium">
                                Preparing your work order document...
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            <View className="absolute bottom-0 w-full flex-row justify-around bg-blue-600 px-8 py-4 rounded-t-3xl shadow-sm">
                <Link href="/" asChild>
                    <TouchableOpacity className="items-center">
                        <MaterialIcons name="home" size={26} color="white" />
                        <Text className="text-white text-xs mt-1 font-sans">Home</Text>
                    </TouchableOpacity>
                </Link>
                <Link href="/calendar" asChild>
                    <TouchableOpacity className="items-center">
                        <MaterialIcons name="calendar-today" size={26} color="white" />
                        <Text className="text-white text-xs mt-1 font-sans">Calendar</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtonContainer: {
        width: '100%',
        gap: 10,
    },
    modalButton: {
        backgroundColor: '#2563eb',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#6b7280',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
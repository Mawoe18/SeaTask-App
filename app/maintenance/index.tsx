import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';
import { Link } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SignatureModal from '../../components/SignatureModal';
import { generateAlcatelMaintenancePDF } from '../../src/pdfTemplates/alcatelMaintenanceTemplate';
import { generateCCTVMaintenancePDF } from '../../src/pdfTemplates/cctvMaintenanceTemplate';
import { generateGrandstreamMaintenancePDF } from '../../src/pdfTemplates/grandstreamMaintenanceTemplate';
import { generateUCCMaintenancePDF } from '../../src/pdfTemplates/uccMaintenanceTemplate'; // You will need to create this PDF template file
import { PDF_DIRECTORY, createPdfDirectory } from '../index';
import type { UCCFormData } from './UCCForm';
import UCCForm from './UCCForm';

// Export interfaces for use in other files like UCCForm.tsx
export interface BaseMaintenanceFormData {
    customerName: string;
    officeLocation: string;
    quarterYear?: string; // Optional for Alcatel/Grandstream
    periodType?: string; // Optional for CCTV/UCC
    subPeriod?: string; // Optional for CCTV/UCC
    year?: string; // Optional for CCTV/UCC
    hoursSpent: string;
    customerRepName: string;
    customerDate: string;
    customerPosition: string;
    seatecRepName: string;
    seatecDate: string;
    seatecPosition: string;
    customerSignature: string;
    seatecSignature: string;
}

export interface AlcatelFormData extends BaseMaintenanceFormData {
    systemModel: string;
    release: string;
    maintenanceItems: Record<string, { equipped?: string; remark: 'done' | 'not_done' | 'na' | '' }>;
    systemApps: {
        voiceMail: 'done' | 'not_done' | 'na' | '';
        callAccounting: 'done' | 'not_done' | 'na' | '';
        autoAttendant: 'done' | 'not_done' | 'na' | '';
        callCentre: 'done' | 'not_done' | 'na' | '';
    };
    extensionLines: {
        voip: string;
        ipSoftphone: string;
        digital: string;
        analogue: string;
        connected: string;
        working: string;
        faulty: string;
        faultyNumbers: string;
        diagnosis: string;
    };
}

export interface GrandstreamFormData extends BaseMaintenanceFormData {
    systemModel: string;
    release: string;
    maintenanceItems: Record<string, { equipped?: string; remark: 'done' | 'not_done' | 'na' | '' }>;
    systemApps: {
        voiceMail: 'done' | 'not_done' | 'na' | '';
        callAccounting: 'done' | 'not_done' | 'na' | '';
        autoAttendant: 'done' | 'not_done' | 'na' | '';
        callCentre: 'done' | 'not_done' | 'na' | '';
    };
    extensionLines: {
        wifiIpPhone: string;
        wifiCordlessPhone: string;
        connected: string;
        working: string;
        faulty: string;
        faultyNumbers: string;
        diagnosis: string;
    };
}

export interface CCTVFormData extends BaseMaintenanceFormData {
    cctvModel: string;
    periodType: string; // Required for CCTV
    subPeriod: string; // Required for CCTV
    year: string; // Required for CCTV
    maintenanceItems: Record<string, 'done' | 'not_done' | 'na' | ''>;
    addOnFeatures: {
        audio: 'done' | 'not_done' | 'na' | '';
        ptz: 'done' | 'not_done' | 'na' | '';
        smartAnalytics: 'done' | 'not_done' | 'na' | '';
    };
    cameraStatus: {
        poe: string;
        nonPoe: string;
        total: string;
        dome: { working: string; faulty: string; total: string };
        bullet: { working: string; faulty: string; total: string };
        ptz: { working: string; faulty: string; total: string };
        camera360: { working: string; faulty: string; total: string };
    };
    specialRemarks: string;
}

export type FormData = AlcatelFormData | GrandstreamFormData | CCTVFormData | UCCFormData;

export interface FormComponentProps {
    formData: FormData;
    onFieldChange: (field: string, value: any, category?: string, subField?: string) => void; // Changed value to any
    customerSignature: string | null;
    seatecSignature: string | null;
    onShowCustomerSignatureModal: () => void;
    onShowSeatecSignatureModal: () => void;
    onClearCustomerSignature: () => void;
    onClearSeatecSignature: () => void;
}
// Form initialization functions
const initializeAlcatelForm = (): AlcatelFormData => ({
    customerName: '',
    officeLocation: '',
    quarterYear: '',
    periodType: '', // Optional
    subPeriod: '', // Optional
    year: '',
    systemModel: '',
    release: '',
    maintenanceItems: {
        'item_1': { remark: '' },
        'item_2': { remark: '' },
        'item_3': { remark: '' },
        'item_4': { remark: '' },
        'item_5': { remark: '' },
        'item_6': { remark: '' },
        'item_7': { equipped: '', remark: '' },
        'item_8': { equipped: '', remark: '' },
        'item_9': { equipped: '', remark: '' },
        'item_10': { remark: '' },
        'item_11': { remark: '' }
    },
    systemApps: {
        voiceMail: '',
        callAccounting: '',
        autoAttendant: '',
        callCentre: ''
    },
    extensionLines: {
        voip: '',
        ipSoftphone: '',
        digital: '',
        analogue: '',
        connected: '',
        working: '',
        faulty: '',
        faultyNumbers: '',
        diagnosis: ''
    },
    hoursSpent: '',
    customerRepName: '',
    customerDate: '',
    customerPosition: '',
    seatecRepName: '',
    seatecDate: '',
    seatecPosition: '',
    customerSignature: '',
    seatecSignature: ''
});

const initializeGrandstreamForm = (): GrandstreamFormData => ({
    customerName: '',
    officeLocation: '',
    quarterYear: '',
    periodType: '', // Optional
    subPeriod: '', // Optional
    year: '',
    systemModel: '',
    release: '',
    maintenanceItems: {
        'item_1': { remark: '' },
        'item_2': { remark: '' },
        'item_3': { remark: '' },
        'item_4': { remark: '' },
        'item_5': { remark: '' },
        'item_6': { remark: '' },
        'item_7': { remark: '' },
        'item_8': { equipped: '', remark: '' },
        'item_9': { equipped: '', remark: '' },
        'item_10': { remark: '' },
        'item_11': { remark: '' }
    },
    systemApps: {
        voiceMail: '',
        callAccounting: '',
        autoAttendant: '',
        callCentre: ''
    },
    extensionLines: {
        wifiIpPhone: '',
        wifiCordlessPhone: '',
        connected: '',
        working: '',
        faulty: '',
        faultyNumbers: '',
        diagnosis: ''
    },
    hoursSpent: '',
    customerRepName: '',
    customerDate: '',
    customerPosition: '',
    seatecRepName: '',
    seatecDate: '',
    seatecPosition: '',
    customerSignature: '',
    seatecSignature: ''
});

const initializeCCTVForm = (): CCTVFormData => ({
    customerName: '',
    officeLocation: '',
    periodType: '',
    subPeriod: '',
    year: '',
    cctvModel: '',
    maintenanceItems: {
        'item_1': '',
        'item_2': '',
        'item_3': '',
        'item_4': '',
        'item_5': '',
        'item_6': '',
        'item_7': '',
        'item_8': '',
        'item_9': '',
        'item_10': '',
        'item_11': '',
        'item_12': '',
        'item_13': ''
    },
    addOnFeatures: {
        audio: '',
        ptz: '',
        smartAnalytics: ''
    },
    cameraStatus: {
        poe: '',
        nonPoe: '',
        total: '',
        dome: { working: '', faulty: '', total: '' },
        bullet: { working: '', faulty: '', total: '' },
        ptz: { working: '', faulty: '', total: '' },
        camera360: { working: '', faulty: '', total: '' }
    },
    hoursSpent: '',
    specialRemarks: '',
    customerRepName: '',
    customerDate: '',
    customerPosition: '',
    seatecRepName: '',
    seatecDate: '',
    seatecPosition: '',
    customerSignature: '',
    seatecSignature: ''
});

const initializeUCCForm = (): UCCFormData => ({
    customerName: '',
    officeLocation: '',
    periodType: '',
    subPeriod: '',
    year: '',
    sectionATasks: {
        coreSwitch: '',
        accessSwitches: '',
        wiredDataPoints: '',
        patchPanels: '',
        networkCabinets: '',
        wiFiAccessPoints: '',
        rackManagement: '',
        systemUpgradeChecks: '',
        inspectMounting: '',
    },
    networkStatus: {
        wiredPorts: { total: '', working: '', faulty: '' },
        wirelessAP: { total: '', working: '', faulty: '' },
    },
    sectionBTasks: {
        nvrRecording: '',
        nvrDiskHealth: '',
        nvrDateSync: '',
        nvrFirmware: '',
        nvrCleanFan: '',
        ipLiveFeed: '',
        ipCleanLens: '',
        ipInspectCabling: '',
        ipMotionDetection: '',
        ipPoe: '',
    },
    cameraStatus: {
        dome: '',
        bullet: '',
        ptz: '',
        working: '',
        faulty: '',
    },
    diskStatus: {
        hdd: '',
        ssd: '',
        working: '',
        faulty: '',
    },
    sectionCTasks: {
        dstvAlignment: '',
        dstvCleanSurface: '',
        dstvInspectLNB: '',
        decoderBooting: '',
        decoderChannels: '',
        decoderFirmware: '',
        decoderHdmi: '',
        cablingCoaxial: '',
        cablingWaterIngress: '',
    },
    decoderStatus: {
        total: '',
        working: '',
        faulty: '',
    },
    sectionDTasks: {
        displayClarity: '',
        displayFunctionality: '',
        displayInputs: '',
        displayVC: '',
        displayClean: '',
        audioMics: '',
        audioPerformance: '',
        audioSpeakers: '',
        audioDsp: '',
        controlPanel: '',
        controlTouch: '',
        controlPresets: '',
        controlNetwork: '',
        connectPorts: '',
        connectCallSystems: '',
        connectCabling: '',
        connectFirmware: '',
    },
    diagnosisReport: '',
    hoursSpent: '',
    customerRepName: '',
    customerDate: '',
    customerPosition: '',
    customerContact: '',
    seatecRepName: '',
    seatecDate: '',
    seatecPosition: '',
    customerSignature: '',
    seatecSignature: ''
});

const MaintenanceFormSystem = () => {
    const [selectedForm, setSelectedForm] = useState<string>('');
    const [formData, setFormData] = useState<FormData>({} as FormData);
    const [isLoading, setIsLoading] = useState(false);
    const [customerSignature, setCustomerSignature] = useState<string | null>(null);
    const [seatecSignature, setSeatecSignature] = useState<string | null>(null);
    const [showCustomerSignatureModal, setShowCustomerSignatureModal] = useState<boolean>(false);
    const [showSeatecSignatureModal, setShowSeatecSignatureModal] = useState<boolean>(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [pdfPath, setPdfPath] = useState<string | null>(null);

    // Initialize form data based on selected form type
    useEffect(() => {
        switch (selectedForm) {
            case 'alcatel':
                setFormData(initializeAlcatelForm());
                break;
            case 'grandstream':
                setFormData(initializeGrandstreamForm());
                break;
            case 'cctv':
                setFormData(initializeCCTVForm());
                break;
            case 'ucc':
                setFormData(initializeUCCForm());
                break;
            default:
                setFormData({} as FormData);
        }
        // Reset signatures and PDF path when form type changes
        setCustomerSignature(null);
        setSeatecSignature(null);
        setPdfPath(null);
        setShowSuccessModal(false);
    }, [selectedForm]);

    // Optimized field change handler with proper type safety
    const handleFieldChange = useCallback((field: string, value: string, category?: string, subField?: string) => {
        setFormData(prevData => {
            if (!prevData || Object.keys(prevData).length === 0) return prevData;

            if (category && subField) {
                // Handle nested fields like cameraStatus.dome.working
                return {
                    ...prevData,
                    [category]: {
                        ...(prevData[category as keyof FormData] as any),
                        [subField]: {
                            ...((prevData[category as keyof FormData] as any)?.[subField] || {}),
                            [field]: value
                        }
                    }
                };
            } else if (category) {
                // Handle category fields like maintenanceItems, systemApps, etc.
                return {
                    ...prevData,
                    [category]: {
                        ...(prevData[category as keyof FormData] as any),
                        [field]: value
                    }
                };
            } else {
                // Handle top-level fields
                return {
                    ...prevData,
                    [field]: value
                };
            }
        });
    }, []);

    // Validate form data before submission
    // In validateFormData:
    const validateFormData = (data: FormData, customerSig: string | null, seatecSig: string | null): string | null => {
        if (!data.customerName.trim()) return 'Customer name is required';
        if (!data.officeLocation.trim()) return 'Office location is required';

        // // Period validation for forms with periodType (CCTV and UCC)
        // if ('periodType' in data) {
        //     if (!data.periodType.trim()) return 'Period type is required';
        //     if (!data.subPeriod.trim()) return 'Sub period is required';
        //     if (!data.year.trim()) return 'Year is required';
        // } else {
        //     // Quarter/Year for Alcatel and Grandstream
        //     if (!data.quarterYear?.trim()) return 'Quarter/Year is required';
        // }

        if (!data.customerRepName.trim()) return 'Customer representative name is required';
        if (!data.customerDate.trim()) return 'Customer date is required';
        if (!data.customerPosition.trim()) return 'Customer position is required';
        if (!data.seatecRepName.trim()) return 'SEATEC representative name is required';
        if (!data.seatecDate.trim()) return 'SEATEC date is required';
        if (!data.seatecPosition.trim()) return 'SEATEC position is required';
        if (!customerSig) return 'Customer signature is required';
        if (!seatecSig) return 'SEATEC signature is required';

        // Form-specific validation
        if ('systemModel' in data && !data.systemModel.trim()) {
            return 'System model is required';
        }
        if ('cctvModel' in data && !data.cctvModel.trim()) {
            return 'CCTV model is required';
        }
        // Optional: for UCC
        if ('diagnosisReport' in data) {
            // If you want to require it: if (!data.diagnosisReport.trim()) return 'Diagnosis report is required';
        }

        return null;
    };

    const handleSubmit = async () => {
        console.log('[MaintenanceForm] Submit button clicked');
        setIsLoading(true);

        try {
            // Validate form data
            const validationError = validateFormData(formData, customerSignature, seatecSignature);
            if (validationError) {
                console.warn('[MaintenanceForm] Validation failed:', validationError);
                Alert.alert('Validation Error', validationError);
                return;
            }

            // Prepare export data with signatures
            const exportFormData = {
                ...formData,
                customerSignature: customerSignature!,
                seatecSignature: seatecSignature!,
            };

            // Ensure PDF directory exists, fall back to documentDirectory if creation fails
            const dirCreated = await createPdfDirectory();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `${selectedForm.charAt(0).toUpperCase() + selectedForm.slice(1)}_Maintenance_${formData.customerName || 'Customer'}_${timestamp}.pdf`;
            const filePath = dirCreated ? `${PDF_DIRECTORY}${fileName}` : `${FileSystem.documentDirectory}${fileName}`;

            console.log('[MaintenanceForm] Generating PDF at path:', filePath);

            // Add timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('PDF generation timeout - process took too long')), 60000)
            );

            // Generate PDF with timeout
            await Promise.race([
                (async () => {
                    switch (selectedForm) {
                        case 'alcatel':
                            await generateAlcatelMaintenancePDF(exportFormData as AlcatelFormData, filePath);
                            break;
                        case 'grandstream':
                            await generateGrandstreamMaintenancePDF(exportFormData as GrandstreamFormData, filePath);
                            break;
                        case 'cctv':
                            await generateCCTVMaintenancePDF(exportFormData as CCTVFormData, filePath);
                            break;
                        case 'ucc':
                            await generateUCCMaintenancePDF(exportFormData as UCCFormData, filePath);
                            break;
                        default:
                            throw new Error('Invalid form type');
                    }
                })(),
                timeoutPromise
            ]);

            // Verify file was created
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            if (!fileInfo.exists) {
                throw new Error('PDF file was not created');
            }

            console.log('[MaintenanceForm] PDF generated successfully, file size:', fileInfo.size, 'bytes');
            setPdfPath(filePath);
            setShowSuccessModal(true);

        } catch (error) {
            console.error('[MaintenanceForm] PDF Generation failed:', error);
            let errorMessage = 'Failed to generate the PDF. Please try again.';
            if (error.message.includes('timeout')) {
                errorMessage = 'PDF generation is taking too long. Please try again or contact support.';
            }
            Alert.alert('Error', errorMessage);
        } finally {
            console.log('[MaintenanceForm] Process completed');
            setIsLoading(false);
        }
    };

    const handlePreviewPdf = async () => {
        if (pdfPath) {
            try {
                await Sharing.shareAsync(pdfPath, {
                    mimeType: 'application/pdf',
                });
                console.log('[MaintenanceForm] PDF preview opened');
                setPdfPath(null);
                setShowSuccessModal(false);
            } catch (error) {
                console.error('[MaintenanceForm] Error previewing PDF:', error);
                Alert.alert('Error', 'Failed to preview PDF');
            }
        } else {
            Alert.alert('Error', 'No PDF available to preview');
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
                recipients: ['support@seatectelecom.com',],
                subject: `Maintenance Report - ${formData.customerName || 'Customer'} - ${selectedForm.charAt(0).toUpperCase() + selectedForm.slice(1)}`,
                body: 'Please find the attached routine maintenance report PDF.',
                attachments: pdfPath ? [pdfPath] : [],
            });
            console.log('[MaintenanceForm] Email client opened');
            setPdfPath(null);
            setShowSuccessModal(false);
        } catch (error) {
            console.error('[MaintenanceForm] Error opening email client:', error);
            Alert.alert('Error', 'Failed to open email client');
        }
    };

    const handleSavePdf = async () => {
        if (pdfPath) {
            try {
                await Sharing.shareAsync(pdfPath, {
                    dialogTitle: 'Save Maintenance PDF',
                    mimeType: 'application/pdf',
                });
                console.log('[MaintenanceForm] PDF save dialog shown');
                setPdfPath(null);
                setShowSuccessModal(false);
            } catch (error) {
                console.error('[MaintenanceForm] Error saving PDF:', error);
                Alert.alert('Error', 'Failed to save PDF');
            }
        } else {
            Alert.alert('Error', 'No PDF available to save');
        }
    };
    const renderForm = () => {
        if (!selectedForm || Object.keys(formData).length === 0) {
            return (
                <Text className="text-center py-10 text-gray-500">
                    Please select a form type from the dropdown above
                </Text>
            );
        }

        const commonProps = {
            formData,
            onFieldChange: handleFieldChange,
            customerSignature,
            seatecSignature,
            onShowCustomerSignatureModal: () => setShowCustomerSignatureModal(true),
            onShowSeatecSignatureModal: () => setShowSeatecSignatureModal(true),
            onClearCustomerSignature: () => setCustomerSignature(null),
            onClearSeatecSignature: () => setSeatecSignature(null)
        };

        switch (selectedForm) {
            case 'alcatel':
                return <AlcatelForm {...commonProps} />;
            case 'grandstream':
                return <GrandstreamForm {...commonProps} />;
            case 'cctv':
                return <CCTVForm {...commonProps} />;
            case 'ucc':
                return <UCCForm {...commonProps} />;
            default:
                return null;
        }
    };

    return (
        <View className="flex-1 bg-gray-100">
            {/* Header */}
            <View className="bg-blue-700 py-12 px-6 rounded-b-3xl shadow-lg">
                <Text className="text-white text-2xl font-extrabold text-center">Routine Maintenance Form</Text>
            </View>

            {/* Form Selection */}
            <View className="p-6">
                <View className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
                    <Picker
                        selectedValue={selectedForm}
                        onValueChange={(itemValue: string) => setSelectedForm(itemValue)}
                        dropdownIconColor="#2563eb"
                    >
                        <Picker.Item label="Select Your Routine Form" value="" />
                        <Picker.Item label="Alcatel Lucent Telephone System" value="alcatel" />
                        <Picker.Item label="Grandstream Telephone System" value="grandstream" />
                        <Picker.Item label="CCTV System" value="cctv" />
                        <Picker.Item label="UCC Service and Routine Maintenance" value="ucc" />
                    </Picker>
                </View>
            </View>

            {/* Form Content */}
            <ScrollView
                className="flex-1 px-6"
                contentContainerStyle={{ paddingBottom: 200 }}
                keyboardShouldPersistTaps="handled"
            >
                {renderForm()}

                {/* Submit Button */}
                {selectedForm && Object.keys(formData).length > 0 && (
                    <TouchableOpacity
                        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color="#ffffff" />
                                <Text style={[styles.submitButtonText, styles.loadingText]}>
                                    Generating PDF...
                                </Text>
                            </View>
                        ) : (
                            <Text style={styles.submitButtonText}>Submit & Generate PDF</Text>
                        )}
                    </TouchableOpacity>
                )}
            </ScrollView>

            {/* Success Modal */}
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
                                onPress={handleSavePdf}
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

            {/* Fixed Footer */}
            <View className="absolute bottom-0 w-full flex-row justify-around bg-blue-700 px-10 py-5 rounded-t-3xl shadow-lg">
                <Link href="/" asChild>
                    <TouchableOpacity className="items-center">
                        <MaterialIcons name="home" size={28} color="white" />
                        <Text className="text-white text-sm mt-1 font-medium">Home</Text>
                    </TouchableOpacity>
                </Link>
                <Link href="/work-order" asChild>
                    <TouchableOpacity className="items-center">
                        <MaterialIcons name="assignment" size={28} color="white" />
                        <Text className="text-white text-sm mt-1 font-medium">Work Order</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            {/* Customer Signature Modal */}
            <SignatureModal
                visible={showCustomerSignatureModal}
                onClose={() => setShowCustomerSignatureModal(false)}
                onSave={(signature: string) => {
                    setCustomerSignature(signature);
                    setShowCustomerSignatureModal(false);
                }}
                onClear={() => setCustomerSignature(null)}
                signatureType="customer"
            />

            {/* SEATEC Signature Modal */}
            <SignatureModal
                visible={showSeatecSignatureModal}
                onClose={() => setShowSeatecSignatureModal(false)}
                onSave={(signature: string) => {
                    setSeatecSignature(signature);
                    setShowSeatecSignatureModal(false);
                }}
                onClear={() => setSeatecSignature(null)}
                signatureType="seatec"
            />

            {/* Full-screen Loading Overlay */}
            {isLoading && (
                <View className="absolute inset-0 bg-black/40 justify-center items-center">
                    <View className="bg-white p-8 rounded-2xl w-4/5 shadow-2xl">
                        <ActivityIndicator size="large" color="#2563eb" />
                        <Text className="mt-6 text-gray-800 text-center font-semibold text-lg">
                            Preparing your maintenance document...
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};


// Enhanced Alcatel Form Component
const AlcatelForm = ({
    formData,
    onFieldChange,
    customerSignature,
    seatecSignature,
    onShowCustomerSignatureModal,
    onShowSeatecSignatureModal,
    onClearCustomerSignature,
    onClearSeatecSignature
}: FormComponentProps) => {
    const alcatelData = formData as AlcatelFormData;

    const maintenanceItems = [
        { id: 'item_1', description: 'System Backup', hasEquipped: false },
        { id: 'item_2', description: 'Switch off the system/Restart', hasEquipped: false },
        { id: 'item_3', description: 'Remove, Clean, Re-assemble all Electronic Boards / Operator Console', hasEquipped: false },
        { id: 'item_4', description: 'Test / Diagnosis of Phones', hasEquipped: false },
        { id: 'item_5', description: 'Check Rectifier / Automatic Power Back-up', hasEquipped: false },
        { id: 'item_6', description: 'Check condition of Power CPU Board', hasEquipped: false },
        { id: 'item_7', description: 'Check condition of SIP trunk lines', hasEquipped: true },
        { id: 'item_8', description: 'Check condition of analogue trunk lines', hasEquipped: true },
        { id: 'item_9', description: 'Check condition of ISDN trunks (T0/T2)', hasEquipped: true },
        { id: 'item_10', description: 'Check tie-line / Option Boards when applicable', hasEquipped: false },
        { id: 'item_11', description: 'Check System Programming / Applications', hasEquipped: false },
    ];

    const systemModels = [
        { label: 'OmniPCX Office (OXO)', value: 'OXO' },
        { label: 'OmniPCX Enterprise (OXE)', value: 'OXE' },
    ];

    const systemApps = [
        { key: 'voiceMail', label: 'Voice Mail Status' },
        { key: 'callAccounting', label: 'Call Accounting Status' },
        { key: 'autoAttendant', label: 'Auto Attendant' },
        { key: 'callCentre', label: 'Call Centre' }
    ];

    const extensionTypes = [
        { key: 'voip', label: 'VoIP' },
        { key: 'ipSoftphone', label: 'IP Softphone' },
        { key: 'digital', label: 'Digital' },
        { key: 'analogue', label: 'Analogue' }
    ];

    const handleMaintenanceItemChange = (itemId: string, field: 'equipped' | 'remark', value: string) => {
        onFieldChange(field, value, 'maintenanceItems', itemId);
    };

    return (
        <View className="bg-white rounded-2xl p-6 shadow-md mb-6">
            {/* Customer Information */}
            <Text className="text-xl font-bold mb-4 text-gray-800">Customer Information</Text>

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">Customer Name *</Text>
                <TextInput
                    value={alcatelData.customerName}
                    onChangeText={(text) => onFieldChange('customerName', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Enter customer name"
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">Office Location *</Text>
                <TextInput
                    value={alcatelData.officeLocation}
                    onChangeText={(text) => onFieldChange('officeLocation', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Enter office location"
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">Quarter ,Year *</Text>
                <TextInput
                    value={alcatelData.quarterYear}
                    onChangeText={(text) => onFieldChange('quarterYear', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="E.g., 1st,2025"
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">System Model *</Text>
                <View className="border border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
                    <Picker
                        selectedValue={alcatelData.systemModel}
                        onValueChange={(value: string) => onFieldChange('systemModel', value)}
                    >
                        <Picker.Item label="Select System Model" value="" />
                        {systemModels.map((model) => (
                            <Picker.Item key={model.value} label={model.label} value={model.value} />
                        ))}
                    </Picker>
                </View>
            </View>

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">Release</Text>
                <TextInput
                    value={alcatelData.release}
                    onChangeText={(text) => onFieldChange('release', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Enter release"
                />
            </View>

            {/* Maintenance Items */}
            <Text className="text-xl font-bold mb-4 text-gray-800">A. Maintenance Items</Text>
            {maintenanceItems.map((item) => (
                <View key={item.id} className="mb-3 p-3 bg-gray-50 rounded-lg shadow-sm">
                    <Text className="text-gray-700 mb-2">{item.description}</Text>
                    <View className="flex-row items-center">
                        {item.hasEquipped && (
                            <View className="flex-1 mr-2">
                                <Text className="mb-1 text-sm text-gray-600">Equipped</Text>
                                <TextInput
                                    value={alcatelData.maintenanceItems[item.id]?.equipped || ''}
                                    onChangeText={(text) => handleMaintenanceItemChange(item.id, 'equipped', text)}
                                    className="border border-gray-300 p-2 rounded-md bg-white"
                                    placeholder="Enter"
                                />
                            </View>
                        )}
                        <View className="w-32 border border-gray-200 rounded-lg bg-white overflow-hidden">
                            <Picker
                                selectedValue={alcatelData.maintenanceItems[item.id]?.remark || ''}
                                onValueChange={(value) => handleMaintenanceItemChange(item.id, 'remark', value)}
                            >
                                <Picker.Item label="Select" value="" />
                                <Picker.Item label="Checked" value="checked" />
                                <Picker.Item label="Not Checked" value="not_checked" />
                                <Picker.Item label="N/A" value="na" />
                            </Picker>
                        </View>
                    </View>
                </View>
            ))}

            {/* System Applications */}
            <Text className="text-xl font-bold mb-4 text-gray-800">System Applications</Text>
            {systemApps.map((app) => (
                <View key={app.key} className="flex-row justify-between items-center mb-3 p-3 bg-gray-50 rounded-lg shadow-sm">
                    <Text className="flex-1 text-gray-700">{app.label}</Text>
                    <View className="w-32 border border-gray-200 rounded-lg bg-white overflow-hidden">
                        <Picker
                            selectedValue={alcatelData.systemApps?.[app.key as keyof typeof alcatelData.systemApps] || ''}
                            onValueChange={(value) => onFieldChange(app.key, value, 'systemApps')}
                        >
                            <Picker.Item label="Select" value="" />
                            <Picker.Item label="Checked" value="Checked" />
                            <Picker.Item label="Not Checked" value="not_checked" />
                            <Picker.Item label="N/A" value="na" />
                        </Picker>
                    </View>
                </View>
            ))}

            {/* Extension Lines */}
            <Text className="text-xl font-bold mb-4 text-gray-800">B. Extension Lines</Text>
            <View className="mb-4">
                <Text className="mb-2 font-semibold text-gray-700">Equipped</Text>
                <View className="flex-row flex-wrap -mx-1">
                    {extensionTypes.map((type) => (
                        <View key={type.key} className="w-1/2 p-1">
                            <Text className="text-sm text-gray-600 mb-1">{type.label}</Text>
                            <TextInput
                                value={alcatelData.extensionLines?.[type.key as keyof typeof alcatelData.extensionLines] || ''}
                                onChangeText={(text) => onFieldChange(type.key, text, 'extensionLines')}
                                className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                                placeholder="Count"
                                keyboardType="numeric"
                            />
                        </View>
                    ))}
                </View>
            </View>

            <View className="mb-4">
                <Text className="mb-2 font-semibold text-gray-700">i) Connected / Working / Faulty</Text>
                <View className="flex-row space-x-2">
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">Connected</Text>
                        <TextInput
                            value={alcatelData.extensionLines.connected}
                            onChangeText={(text) => onFieldChange('connected', text, 'extensionLines')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">Working</Text>
                        <TextInput
                            value={alcatelData.extensionLines.working}
                            onChangeText={(text) => onFieldChange('working', text, 'extensionLines')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">Faulty</Text>
                        <TextInput
                            value={alcatelData.extensionLines.faulty}
                            onChangeText={(text) => onFieldChange('faulty', text, 'extensionLines')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                </View>
            </View>

            <View className="mb-4">
                <Text className="mb-2 font-semibold text-gray-700">ii) List of faulty Extension numbers</Text>
                <TextInput
                    value={alcatelData.extensionLines.faultyNumbers}
                    onChangeText={(text) => onFieldChange('faultyNumbers', text, 'extensionLines')}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50 h-24"
                    placeholder="Enter numbers separated by commas"
                    multiline
                />
            </View>

            <View className="mb-4">
                <Text className="mb-2 font-semibold text-gray-700">iii) Diagnosis Report</Text>
                <TextInput
                    value={alcatelData.extensionLines.diagnosis}
                    onChangeText={(text) => onFieldChange('diagnosis', text, 'extensionLines')}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50 h-32"
                    placeholder="Enter diagnosis details"
                    multiline
                />
            </View>

            {/* Hours Spent */}
            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">C. Hours Spent on the Job *</Text>
                <TextInput
                    value={alcatelData.hoursSpent}
                    onChangeText={(text) => onFieldChange('hoursSpent', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Enter hours spent"
                />
            </View>

            {/* Signature Section */}
            <Text className="text-xl font-bold mb-4 text-gray-800">Signatures</Text>
            <View className="flex-row justify-between space-x-4">
                {/* Customer Section */}
                <View className="flex-1 bg-gray-50 p-4 rounded-lg shadow-sm">
                    <Text className="font-bold mb-2 text-gray-800">Customer Representative *</Text>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Date *</Text>
                        <TextInput
                            value={alcatelData.customerDate}
                            onChangeText={(text) => onFieldChange('customerDate', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="YYYY-MM-DD"
                        />
                    </View>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Full Name *</Text>
                        <TextInput
                            value={alcatelData.customerRepName}
                            onChangeText={(text) => onFieldChange('customerRepName', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="Enter full name"
                        />
                    </View>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Position *</Text>
                        <TextInput
                            value={alcatelData.customerPosition}
                            onChangeText={(text) => onFieldChange('customerPosition', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="Enter position"
                        />
                    </View>
                    <TouchableOpacity
                        className="h-32 border-2 border-dashed border-gray-400 rounded-lg justify-center items-center bg-white mt-2"
                        onPress={onShowCustomerSignatureModal}
                    >
                        {customerSignature ? (
                            <Image
                                source={{ uri: customerSignature }}
                                className="w-full h-full rounded-lg"
                                resizeMode="contain"
                            />
                        ) : (
                            <View className="items-center">
                                <MaterialIcons name="edit" size={24} color="#2563eb" />
                                <Text className="text-blue-600 mt-2 text-sm font-medium">Tap to sign</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    {customerSignature && (
                        <TouchableOpacity
                            className="bg-red-500 py-1 px-3 rounded-md mt-2 self-start"
                            onPress={onClearCustomerSignature}
                        >
                            <Text className="text-white text-xs font-medium">Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* SEATEC Section */}
                <View className="flex-1 bg-gray-50 p-4 rounded-lg shadow-sm">
                    <Text className="font-bold mb-2 text-gray-800">SEATEC Representative *</Text>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Date *</Text>
                        <TextInput
                            value={alcatelData.seatecDate}
                            onChangeText={(text) => onFieldChange('seatecDate', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="YYYY-MM-DD"
                        />
                    </View>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Tech. Personnel *</Text>
                        <TextInput
                            value={alcatelData.seatecRepName}
                            onChangeText={(text) => onFieldChange('seatecRepName', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="Enter name"
                        />
                    </View>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Position *</Text>
                        <TextInput
                            value={alcatelData.seatecPosition}
                            onChangeText={(text) => onFieldChange('seatecPosition', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="Enter position"
                        />
                    </View>
                    <TouchableOpacity
                        className="h-32 border-2 border-dashed border-gray-400 rounded-lg justify-center items-center bg-white mt-2"
                        onPress={onShowSeatecSignatureModal}
                    >
                        {seatecSignature ? (
                            <Image
                                source={{ uri: seatecSignature }}
                                className="w-full h-full rounded-lg"
                                resizeMode="contain"
                            />
                        ) : (
                            <View className="items-center">
                                <MaterialIcons name="edit" size={24} color="#2563eb" />
                                <Text className="text-blue-600 mt-2 text-sm font-medium">Tap to sign</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    {seatecSignature && (
                        <TouchableOpacity
                            className="bg-red-500 py-1 px-3 rounded-md mt-2 self-start"
                            onPress={onClearSeatecSignature}
                        >
                            <Text className="text-white text-xs font-medium">Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};


const GrandstreamForm = ({
    formData,
    onFieldChange,
    customerSignature,
    seatecSignature,
    onShowCustomerSignatureModal,
    onShowSeatecSignatureModal,
    onClearCustomerSignature,
    onClearSeatecSignature
}: FormComponentProps) => {
    const grandstreamData = formData as GrandstreamFormData;

    const maintenanceItems = [
        { id: 'item_1', description: 'System Backup', hasEquipped: false },
        { id: 'item_2', description: 'System Restart', hasEquipped: false },
        { id: 'item_3', description: 'Clean Operator Console / User Phones', hasEquipped: false },
        { id: 'item_4', description: 'Test / Diagnosis of Phones', hasEquipped: false },
        { id: 'item_5', description: 'Check Automatic Power Back-up', hasEquipped: false },
        { id: 'item_6', description: 'Check the condition of IP PBX', hasEquipped: false },
        { id: 'item_7', description: 'Check the condition of GSM – SIP Gateway', hasEquipped: false },
        { id: 'item_8', description: 'Check condition of analogue trunk lines', hasEquipped: true },
        { id: 'item_9', description: 'Check condition of SIP Trunk lines', hasEquipped: true },
        { id: 'item_10', description: 'Check all Indoor and Outdoor Wi-Fi Access Points', hasEquipped: false },
        { id: 'item_11', description: 'Check System Programming / Applications', hasEquipped: false },
    ];

    const systemModels = [
        { label: 'UCM6301 IP PBX', value: 'UCM6301' },
        { label: 'UCM6202 IP PBX', value: 'UCM6202' },
    ];

    const systemApps = [
        { key: 'voiceMail', label: 'Voice Mail Status' },
        { key: 'callAccounting', label: 'Call Accounting Status' },
        { key: 'autoAttendant', label: 'Auto Attendant' },
        { key: 'callCentre', label: 'Call Centre' }
    ];

    // Fixed maintenance item change handler
    const handleMaintenanceItemChange = (itemId: string, field: 'equipped' | 'remark', value: string) => {
        // Ensure we have a proper structure
        const currentMaintenanceItems = grandstreamData.maintenanceItems || {};
        const currentItem = currentMaintenanceItems[itemId] || {};

        // Create the updated item
        const updatedItem = {
            ...currentItem,
            [field]: value
        };

        // Create the updated maintenanceItems object
        const updatedMaintenanceItems = {
            ...currentMaintenanceItems,
            [itemId]: updatedItem
        };

        // Use the correct onFieldChange signature - assuming it takes (fieldName, value, parentField?)
        // Based on your other usage patterns, it seems like nested objects might need special handling
        onFieldChange('maintenanceItems', updatedMaintenanceItems);
    };

    // Helper function to handle nested object updates
    const handleNestedFieldChange = (parentField: string, childField: string, value: string) => {
        const currentParentData = (grandstreamData as any)[parentField] || {};
        const updatedParentData = {
            ...currentParentData,
            [childField]: value
        };
        onFieldChange(parentField, updatedParentData);
    };

    return (
        <View className="bg-white rounded-2xl p-6 shadow-md mb-6">
            {/* Customer Information */}
            <Text className="text-xl font-bold mb-4 text-gray-800">Customer Information</Text>

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">Customer Name *</Text>
                <TextInput
                    value={grandstreamData.customerName || ''}
                    onChangeText={(text) => onFieldChange('customerName', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Enter customer name"
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">Office Location *</Text>
                <TextInput
                    value={grandstreamData.officeLocation || ''}
                    onChangeText={(text) => onFieldChange('officeLocation', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Enter office location"
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">Quarter, Year *</Text>
                <TextInput
                    value={grandstreamData.quarterYear || ''}
                    onChangeText={(text) => onFieldChange('quarterYear', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="E.g.,1st, 2024"
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">System Model *</Text>
                <View className="border border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
                    <Picker
                        selectedValue={grandstreamData.systemModel || ''}
                        onValueChange={(value: string) => onFieldChange('systemModel', value)}
                    >
                        <Picker.Item label="Select System Model" value="" />
                        {systemModels.map((model) => (
                            <Picker.Item key={model.value} label={model.label} value={model.value} />
                        ))}
                    </Picker>
                </View>
            </View>

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">Release</Text>
                <TextInput
                    value={grandstreamData.release || ''}
                    onChangeText={(text) => onFieldChange('release', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Enter release"
                />
            </View>

            {/* Maintenance Items */}
            <Text className="text-xl font-bold mb-4 text-gray-800">A. Maintenance Items</Text>
            {maintenanceItems.map((item) => {
                const itemNumber = parseInt(item.id.replace('item_', ''));

                // Safely get current values
                const currentItem = grandstreamData.maintenanceItems?.[item.id] || {};
                const equippedValue = currentItem.equipped || '';
                const remarkValue = currentItem.remark || '';

                return (
                    <View key={item.id} className="mb-3 p-3 bg-gray-50 rounded-lg shadow-sm">
                        <Text className="text-gray-700 mb-2">{itemNumber}. {item.description}</Text>
                        <View className="flex-row items-center">
                            {item.hasEquipped && (
                                <View className="flex-1 mr-2">
                                    <Text className="mb-1 text-sm text-gray-600">Equipped</Text>
                                    <TextInput
                                        value={equippedValue}
                                        onChangeText={(text) => handleMaintenanceItemChange(item.id, 'equipped', text)}
                                        className="border border-gray-300 p-2 rounded-md bg-white"
                                        placeholder="Enter"
                                    />
                                </View>
                            )}
                            <View className="w-32 border border-gray-200 rounded-lg bg-white overflow-hidden">
                                <Picker
                                    selectedValue={remarkValue}
                                    onValueChange={(value: string) => handleMaintenanceItemChange(item.id, 'remark', value)}
                                >
                                    <Picker.Item label="Select" value="" />
                                    <Picker.Item label="Checked" value="checked" />
                                    <Picker.Item label="Not Checked" value="not_checked" />
                                    <Picker.Item label="N/A" value="na" />
                                </Picker>
                            </View>
                        </View>
                    </View>
                );
            })}

            {/* System Applications */}
            <Text className="text-xl font-bold mb-4 text-gray-800">System Applications</Text>
            {systemApps.map((app) => (
                <View key={app.key} className="flex-row justify-between items-center mb-3 p-3 bg-gray-50 rounded-lg shadow-sm">
                    <Text className="flex-1 text-gray-700">{app.label}</Text>
                    <View className="w-32 border border-gray-200 rounded-lg bg-white overflow-hidden">
                        <Picker
                            selectedValue={grandstreamData.systemApps?.[app.key as keyof typeof grandstreamData.systemApps] || ''}
                            onValueChange={(value: string) => handleNestedFieldChange('systemApps', app.key, value)}
                        >
                            <Picker.Item label="Select" value="" />
                            <Picker.Item label="Checked" value="checked" />
                            <Picker.Item label="Not Checked" value="not_checked" />
                            <Picker.Item label="N/A" value="na" />
                        </Picker>
                    </View>
                </View>
            ))}

            {/* Extension Lines */}
            <Text className="text-xl font-bold mb-4 text-gray-800">B. Extension Lines</Text>
            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">Equipped Wi-Fi IP Phone</Text>
                <TextInput
                    value={grandstreamData.extensionLines?.wifiIpPhone || ''}
                    onChangeText={(text) => handleNestedFieldChange('extensionLines', 'wifiIpPhone', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Enter count"
                    keyboardType="numeric"
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">Equipped Wi-Fi Cordless Phone</Text>
                <TextInput
                    value={grandstreamData.extensionLines?.wifiCordlessPhone || ''}
                    onChangeText={(text) => handleNestedFieldChange('extensionLines', 'wifiCordlessPhone', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Enter count"
                    keyboardType="numeric"
                />
            </View>

            <View className="flex-row space-x-2 mb-4">
                <View className="flex-1">
                    <Text className="mb-1 font-semibold text-gray-700">Connected</Text>
                    <TextInput
                        value={grandstreamData.extensionLines?.connected || ''}
                        onChangeText={(text) => handleNestedFieldChange('extensionLines', 'connected', text)}
                        className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                        placeholder="Count"
                        keyboardType="numeric"
                    />
                </View>
                <View className="flex-1">
                    <Text className="mb-1 font-semibold text-gray-700">Working</Text>
                    <TextInput
                        value={grandstreamData.extensionLines?.working || ''}
                        onChangeText={(text) => handleNestedFieldChange('extensionLines', 'working', text)}
                        className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                        placeholder="Count"
                        keyboardType="numeric"
                    />
                </View>
                <View className="flex-1">
                    <Text className="mb-1 font-semibold text-gray-700">Faulty</Text>
                    <TextInput
                        value={grandstreamData.extensionLines?.faulty || ''}
                        onChangeText={(text) => handleNestedFieldChange('extensionLines', 'faulty', text)}
                        className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                        placeholder="Count"
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">List of Faulty Extension Numbers</Text>
                <TextInput
                    value={grandstreamData.extensionLines?.faultyNumbers || ''}
                    onChangeText={(text) => handleNestedFieldChange('extensionLines', 'faultyNumbers', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50 h-24"
                    placeholder="Enter numbers separated by commas"
                    multiline
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">Diagnosis Report</Text>
                <TextInput
                    value={grandstreamData.extensionLines?.diagnosis || ''}
                    onChangeText={(text) => handleNestedFieldChange('extensionLines', 'diagnosis', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50 h-32"
                    placeholder="Enter diagnosis details"
                    multiline
                />
            </View>

            {/* Hours Spent */}
            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">C. Hours Spent on the Job *</Text>
                <TextInput
                    value={grandstreamData.hoursSpent || ''}
                    onChangeText={(text) => onFieldChange('hoursSpent', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Enter hours spent"
                />
            </View>

            {/* Signature Section */}
            <Text className="text-xl font-bold mb-4 text-gray-800">Signatures</Text>
            <View className="flex-row justify-between space-x-4">
                {/* Customer Section */}
                <View className="flex-1 bg-gray-50 p-4 rounded-lg shadow-sm">
                    <Text className="font-bold mb-2 text-gray-800">Customer Representative *</Text>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Date *</Text>
                        <TextInput
                            value={grandstreamData.customerDate || ''}
                            onChangeText={(text) => onFieldChange('customerDate', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="YYYY-MM-DD"
                        />
                    </View>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Full Name *</Text>
                        <TextInput
                            value={grandstreamData.customerRepName || ''}
                            onChangeText={(text) => onFieldChange('customerRepName', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="Enter full name"
                        />
                    </View>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Position *</Text>
                        <TextInput
                            value={grandstreamData.customerPosition || ''}
                            onChangeText={(text) => onFieldChange('customerPosition', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="Enter position"
                        />
                    </View>
                    <TouchableOpacity
                        className="h-32 border-2 border-dashed border-gray-400 rounded-lg justify-center items-center bg-white mt-2"
                        onPress={onShowCustomerSignatureModal}
                    >
                        {customerSignature ? (
                            <Image
                                source={{ uri: customerSignature }}
                                className="w-full h-full rounded-lg"
                                resizeMode="contain"
                            />
                        ) : (
                            <View className="items-center">
                                <MaterialIcons name="edit" size={24} color="#2563eb" />
                                <Text className="text-blue-600 mt-2 text-sm font-medium">Tap to sign</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    {customerSignature && (
                        <TouchableOpacity
                            className="bg-red-500 py-1 px-3 rounded-md mt-2 self-start"
                            onPress={onClearCustomerSignature}
                        >
                            <Text className="text-white text-xs font-medium">Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* SEATEC Section */}
                <View className="flex-1 bg-gray-50 p-4 rounded-lg shadow-sm">
                    <Text className="font-bold mb-2 text-gray-800">SEATEC Representative *</Text>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Date *</Text>
                        <TextInput
                            value={grandstreamData.seatecDate || ''}
                            onChangeText={(text) => onFieldChange('seatecDate', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="YYYY-MM-DD"
                        />
                    </View>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Tech. Personnel *</Text>
                        <TextInput
                            value={grandstreamData.seatecRepName || ''}
                            onChangeText={(text) => onFieldChange('seatecRepName', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="Enter name"
                        />
                    </View>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Position *</Text>
                        <TextInput
                            value={grandstreamData.seatecPosition || ''}
                            onChangeText={(text) => onFieldChange('seatecPosition', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="Enter position"
                        />
                    </View>
                    <TouchableOpacity
                        className="h-32 border-2 border-dashed border-gray-400 rounded-lg justify-center items-center bg-white mt-2"
                        onPress={onShowSeatecSignatureModal}
                    >
                        {seatecSignature ? (
                            <Image
                                source={{ uri: seatecSignature }}
                                className="w-full h-full rounded-lg"
                                resizeMode="contain"
                            />
                        ) : (
                            <View className="items-center">
                                <MaterialIcons name="edit" size={24} color="#2563eb" />
                                <Text className="text-blue-600 mt-2 text-sm font-medium">Tap to sign</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    {seatecSignature && (
                        <TouchableOpacity
                            className="bg-red-500 py-1 px-3 rounded-md mt-2 self-start"
                            onPress={onClearSeatecSignature}
                        >
                            <Text className="text-white text-xs font-medium">Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};


const CCTVForm = ({
    formData,
    onFieldChange,
    customerSignature,
    seatecSignature,
    onShowCustomerSignatureModal,
    onShowSeatecSignatureModal,
    onClearCustomerSignature,
    onClearSeatecSignature
}: FormComponentProps) => {
    const cctvData = formData as CCTVFormData;

    const maintenanceItems = [
        { id: 'item_1', description: 'Switch off whole system' },
        { id: 'item_2', description: 'Disconnect and clean Hard disk' },
        { id: 'item_3', description: 'Clean and re-assemble NVR' },
        { id: 'item_4', description: 'Cleaning of cameras' },
        { id: 'item_5', description: 'Check hard disk' },
        { id: 'item_6', description: 'Check remote and mouse' },
        { id: 'item_7', description: 'Check camera connections, angles and focus' },
        { id: 'item_8', description: 'Check recording duration, resolution and streams' },
        { id: 'item_9', description: 'Check VMS software – viewing and playback' },
        { id: 'item_10', description: 'Check Internet connection to NVR' },
        { id: 'item_11', description: 'Check PoE switch' },
        { id: 'item_12', description: 'Check power backup' },
        { id: 'item_13', description: 'Check add-on features' },
    ];

    const addOnFeatures = [
        { key: 'audio', label: 'Audio' },
        { key: 'ptz', label: 'Pan, Tilt and zoom' },
        { key: 'smartAnalytics', label: 'Smart Analytics' }
    ];

    const cameraTypes = [
    { type: 'dome', label: 'Dome Camera' },
    { type: 'bullet', label: 'Bullet Camera' },
    { type: 'ptz', label: 'PTZ Camera' },
    { type: 'camera360', label: '360 Camera' }
] as const;

    let subOptions: string[] = [];
    if (cctvData.periodType === 'Month') {
        subOptions = Array.from({ length: 12 }, (_, i) => `${i + 1}th`);
    } else if (cctvData.periodType === 'Quarterly') {
        subOptions = ['1st', '2nd', '3rd', '4th'];
    } else if (cctvData.periodType === 'Tri-annual') {
        subOptions = ['1st', '2nd', '3rd'];
    } else if (cctvData.periodType === 'Bi-annual') {
        subOptions = ['1st', '2nd'];
    }

    return (
        <View className="bg-white rounded-2xl p-6 shadow-md mb-6">
            {/* Customer Information */}
            <Text className="text-xl font-bold mb-4 text-gray-800">Customer Information</Text>

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">Customer Name *</Text>
                <TextInput
                    value={cctvData.customerName}
                    onChangeText={(text) => onFieldChange('customerName', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Enter customer name"
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">Office Location *</Text>
                <TextInput
                    value={cctvData.officeLocation}
                    onChangeText={(text) => onFieldChange('officeLocation', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Enter office location"
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">Period Type *</Text>
                <View className="border border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
                    <Picker
                        selectedValue={cctvData.periodType}
                        onValueChange={(value: string) => {
                            onFieldChange('periodType', value);
                            onFieldChange('subPeriod', '');
                        }}
                    >
                        <Picker.Item label="Select Period Type" value="" />
                        <Picker.Item label="Month" value="Month" />
                        <Picker.Item label="Quarterly" value="Quarterly" />
                        <Picker.Item label="Tri-annual" value="Tri-annual" />
                        <Picker.Item label="Bi-annual" value="Bi-annual" />
                    </Picker>
                </View>
            </View>

            {cctvData.periodType && (
                <View className="mb-4">
                    <Text className="mb-1 font-semibold text-gray-700">Sub Period *</Text>
                    <View className="border border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
                        <Picker
                            selectedValue={cctvData.subPeriod}
                            onValueChange={(value: string) => onFieldChange('subPeriod', value)}
                        >
                            <Picker.Item label="Select Sub Period" value="" />
                            {subOptions.map((opt) => (
                                <Picker.Item key={opt} label={opt} value={opt} />
                            ))}
                        </Picker>
                    </View>
                </View>
            )}

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">Year *</Text>
                <TextInput
                    value={cctvData.year}
                    onChangeText={(text) => onFieldChange('year', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Enter year, e.g., 2025"
                    keyboardType="numeric"
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">CCTV Model *</Text>
                <TextInput
                    value={cctvData.cctvModel}
                    onChangeText={(text) => onFieldChange('cctvModel', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Enter CCTV model"
                />
            </View>

            {/* Maintenance Items */}
            <Text className="text-xl font-bold mb-4 text-gray-800">A. Maintenance Items</Text>
            {maintenanceItems.map((item) => (
                <View key={item.id} className="flex-row justify-between items-center mb-3 p-3 bg-gray-50 rounded-lg shadow-sm">
                    <Text className="flex-1 text-gray-700">{item.id}. {item.description}</Text>
                    <View className="w-32 border border-gray-200 rounded-lg bg-white overflow-hidden">
                        <Picker
                            selectedValue={cctvData.maintenanceItems?.[item.id] || ''}
                            onValueChange={(value) => onFieldChange(item.id, value, 'maintenanceItems')}
                        >
                            <Picker.Item label="Select" value="" />
                            <Picker.Item label="Done" value="done" />
                            <Picker.Item label="Not Done" value="not_done" />
                            <Picker.Item label="N/A" value="na" />
                        </Picker>
                    </View>
                </View>
            ))}

            {/* Add-on Features */}
            <Text className="text-xl font-bold mb-4 text-gray-800">Add-on Features</Text>
            {addOnFeatures.map((feature) => (
                <View key={feature.key} className="flex-row justify-between items-center mb-3 p-3 bg-gray-50 rounded-lg shadow-sm">
                    <Text className="flex-1 text-gray-700 pl-4">• {feature.label}</Text>
                    <View className="w-32 border border-gray-200 rounded-lg bg-white overflow-hidden">
                        <Picker
                            selectedValue={cctvData.addOnFeatures?.[feature.key as keyof typeof cctvData.addOnFeatures] || ''}
                            onValueChange={(value) => onFieldChange(feature.key, value, 'addOnFeatures')}
                        >
                            <Picker.Item label="Select" value="" />
                            <Picker.Item label="Done" value="done" />
                            <Picker.Item label="Not Done" value="not_done" />
                            <Picker.Item label="N/A" value="na" />
                        </Picker>
                    </View>
                </View>
            ))}

            {/* Connected Cameras */}
            <Text className="text-xl font-bold mb-4 text-gray-800">14. Connected Cameras</Text>

            <View className="flex-row space-x-2 mb-4">
                <View className="flex-1">
                    <Text className="mb-1 font-semibold text-gray-700">POE</Text>
                    <TextInput
                        value={cctvData.cameraStatus?.poe || ''}
                        onChangeText={(text) => onFieldChange('poe', text, 'cameraStatus')}
                        className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                        placeholder="Count"
                        keyboardType="numeric"
                    />
                </View>
                <View className="flex-1">
                    <Text className="mb-1 font-semibold text-gray-700">Non POE</Text>
                    <TextInput
                        value={cctvData.cameraStatus?.nonPoe || ''}
                        onChangeText={(text) => onFieldChange('nonPoe', text, 'cameraStatus')}
                        className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                        placeholder="Count"
                        keyboardType="numeric"
                    />
                </View>
                <View className="flex-1">
                    <Text className="mb-1 font-semibold text-gray-700">Total</Text>
                    <TextInput
                        value={cctvData.cameraStatus?.total || ''}
                        onChangeText={(text) => onFieldChange('total', text, 'cameraStatus')}
                        className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                        placeholder="Count"
                        keyboardType="numeric"
                    />
                </View>
            </View>

            {/* Camera Status Table */}
            <Text className="text-xl font-bold mb-4 text-gray-800">Camera Status</Text>
            <View className="border border-gray-300 rounded-lg overflow-hidden mb-6">
                {/* Table Header */}
                <View className="flex-row bg-blue-50">
                    <View className="flex-1 p-3 border-r border-gray-300">
                        <Text className="font-bold text-gray-800">Camera Type</Text>
                    </View>
                    <View className="flex-1 p-3 border-r border-gray-300">
                        <Text className="font-bold text-gray-800 text-center">Working</Text>
                    </View>
                    <View className="flex-1 p-3 border-r border-gray-300">
                        <Text className="font-bold text-gray-800 text-center">Faulty</Text>
                    </View>
                    <View className="flex-1 p-3">
                        <Text className="font-bold text-gray-800 text-center">Total</Text>
                    </View>
                </View>

                {/* Table Rows */}
                {cameraTypes.map((camera) => (
                    <View key={camera.type} className="flex-row border-t border-gray-300">
                        <View className="flex-1 p-3 border-r border-gray-300">
                            <Text className="text-gray-700">{camera.label}</Text>
                        </View>
                        <View className="flex-1 p-3 border-r border-gray-300">
                            <TextInput
                                value={cctvData.cameraStatus?.[camera.type as keyof typeof cctvData.cameraStatus]?.working || ''}
                                onChangeText={(text) => onFieldChange('working', text, 'cameraStatus', camera.type)}
                                className="text-center text-gray-700"
                                keyboardType="numeric"
                            />
                        </View>
                        <View className="flex-1 p-3 border-r border-gray-300">
                            <TextInput
                                value={cctvData.cameraStatus?.[camera.type as keyof typeof cctvData.cameraStatus]?.faulty || ''}
                                onChangeText={(text) => onFieldChange('faulty', text, 'cameraStatus', camera.type)}
                                className="text-center text-gray-700"
                                keyboardType="numeric"
                            />
                        </View>
                        <View className="flex-1 p-3">
                            <TextInput
                                value={cctvData.cameraStatus?.[camera.type as keyof typeof cctvData.cameraStatus]?.total || ''}
                                onChangeText={(text) => onFieldChange('total', text, 'cameraStatus', camera.type)}
                                className="text-center text-gray-700"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                ))}
            </View>

            {/* Hours Spent */}
            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">15. Hours Spent on the Job *</Text>
                <TextInput
                    value={cctvData.hoursSpent}
                    onChangeText={(text) => onFieldChange('hoursSpent', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Enter hours spent"
                />
            </View>

            {/* Special Remarks */}
            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">B. Any Special Remarks</Text>
                <TextInput
                    value={cctvData.specialRemarks}
                    onChangeText={(text) => onFieldChange('specialRemarks', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50 h-32"
                    placeholder="Enter any special remarks"
                    multiline
                />
            </View>

            {/* Signature Section */}
            <Text className="text-xl font-bold mb-4 text-gray-800">Signatures</Text>
            <View className="flex-row justify-between space-x-4">
                {/* Customer Section */}
                <View className="flex-1 bg-gray-50 p-4 rounded-lg shadow-sm">
                    <Text className="font-bold mb-2 text-gray-800">Customer Representative *</Text>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Date *</Text>
                        <TextInput
                            value={cctvData.customerDate}
                            onChangeText={(text) => onFieldChange('customerDate', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="YYYY-MM-DD"
                        />
                    </View>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Full Name *</Text>
                        <TextInput
                            value={cctvData.customerRepName}
                            onChangeText={(text) => onFieldChange('customerRepName', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="Enter full name"
                        />
                    </View>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Position *</Text>
                        <TextInput
                            value={cctvData.customerPosition}
                            onChangeText={(text) => onFieldChange('customerPosition', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="Enter position"
                        />
                    </View>
                    <TouchableOpacity
                        className="h-32 border-2 border-dashed border-gray-400 rounded-lg justify-center items-center bg-white mt-2"
                        onPress={onShowCustomerSignatureModal}
                    >
                        {customerSignature ? (
                            <Image
                                source={{ uri: customerSignature }}
                                className="w-full h-full rounded-lg"
                                resizeMode="contain"
                            />
                        ) : (
                            <View className="items-center">
                                <MaterialIcons name="edit" size={24} color="#2563eb" />
                                <Text className="text-blue-600 mt-2 text-sm font-medium">Tap to sign</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    {customerSignature && (
                        <TouchableOpacity
                            className="bg-red-500 py-1 px-3 rounded-md mt-2 self-start"
                            onPress={onClearCustomerSignature}
                        >
                            <Text className="text-white text-xs font-medium">Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* SEATEC Section */}
                <View className="flex-1 bg-gray-50 p-4 rounded-lg shadow-sm">
                    <Text className="font-bold mb-2 text-gray-800">SEATEC Representative *</Text>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Date *</Text>
                        <TextInput
                            value={cctvData.seatecDate}
                            onChangeText={(text) => onFieldChange('seatecDate', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="YYYY-MM-DD"
                        />
                    </View>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Technical Personnel *</Text>
                        <TextInput
                            value={cctvData.seatecRepName}
                            onChangeText={(text) => onFieldChange('seatecRepName', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="Enter name"
                        />
                    </View>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Position *</Text>
                        <TextInput
                            value={cctvData.seatecPosition}
                            onChangeText={(text) => onFieldChange('seatecPosition', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="Enter position"
                        />
                    </View>
                    <TouchableOpacity
                        className="h-32 border-2 border-dashed border-gray-400 rounded-lg justify-center items-center bg-white mt-2"
                        onPress={onShowSeatecSignatureModal}
                    >
                        {seatecSignature ? (
                            <Image
                                source={{ uri: seatecSignature }}
                                className="w-full h-full rounded-lg"
                                resizeMode="contain"
                            />
                        ) : (
                            <View className="items-center">
                                <MaterialIcons name="edit" size={24} color="#2563eb" />
                                <Text className="text-blue-600 mt-2 text-sm font-medium">Tap to sign</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    {seatecSignature && (
                        <TouchableOpacity
                            className="bg-red-500 py-1 px-3 rounded-md mt-2 self-start"
                            onPress={onClearSeatecSignature}
                        >
                            <Text className="text-white text-xs font-medium">Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    submitButton: {
        backgroundColor: '#2563eb',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    submitButtonDisabled: {
        backgroundColor: '#93c5fd',
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        padding: 24,
        borderRadius: 16,
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
        marginBottom: 16,
    },
    modalMessage: {
        fontSize: 16,
        color: '#4b5563',
        textAlign: 'center',
        marginBottom: 24,
    },
    modalButtonContainer: {
        flexDirection: 'column',
        gap: 12,
    },
    modalButton: {
        backgroundColor: '#2563eb',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
    closeButton: {
        backgroundColor: '#6b7280',
    },
});



export default MaintenanceFormSystem;





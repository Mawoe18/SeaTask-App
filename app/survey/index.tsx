// Survey/index.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Link } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import SignatureModal from '../../components/SignatureModal';
import CCTVSurveyForm from './CCTVSurveyForm';
import CybersecuritySurveyForm from './CybersecuritySurveyForm';
import StructuredCablingSurveyForm from './StructuredCablingSurveyForm';
import TelephonySurveyForm from './TelephonySurveyForm';
import VideoConferenceSurveyForm from './VideoConferenceSurveyForm';

// Define types for better TypeScript support
export interface FormData {
    [key: string]: string | boolean | string[];
}

export interface FormComponentProps {
    formData: FormData;
    onFieldChange: (field: string, value: any) => void;
    customerSignature: string | null;
    seatecSignature: string | null;
    onShowCustomerSignatureModal: () => void;
    onShowSeatecSignatureModal: () => void;
    onClearCustomerSignature: () => void;
    onClearSeatecSignature: () => void;
}

const SurveyChecklistScreen = () => {
    const [selectedSurvey, setSelectedSurvey] = useState<string>('');
    const [formData, setFormData] = useState<FormData>({});
    const [customerSignature, setCustomerSignature] = useState<string | null>(null);
    const [seatecSignature, setSeatecSignature] = useState<string | null>(null);
    const [showCustomerSignatureModal, setShowCustomerSignatureModal] = useState<boolean>(false);
    const [showSeatecSignatureModal, setShowSeatecSignatureModal] = useState<boolean>(false);

    
    const handleFieldChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const toggleCheckbox = (field: string, value: string) => {
        const currentValues = Array.isArray(formData[field]) ? (formData[field] as string[]) : [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        handleFieldChange(field, newValues);
    };

    const renderForm = () => {
        switch (selectedSurvey) {
            case 'telephony':
                return (
                    <TelephonySurveyForm
                        formData={formData}
                        onFieldChange={handleFieldChange}
                        toggleCheckbox={toggleCheckbox}
                        customerSignature={customerSignature}
                        seatecSignature={seatecSignature}
                        onShowCustomerSignatureModal={() => setShowCustomerSignatureModal(true)}
                        onShowSeatecSignatureModal={() => setShowSeatecSignatureModal(true)}
                        onClearCustomerSignature={() => setCustomerSignature(null)}
                        onClearSeatecSignature={() => setSeatecSignature(null)}
                    />
                );
            case 'cctv':
                return (
                    <CCTVSurveyForm
                        formData={formData}
                        onFieldChange={handleFieldChange}
                        toggleCheckbox={toggleCheckbox}
                        customerSignature={customerSignature}
                        seatecSignature={seatecSignature}
                        onShowCustomerSignatureModal={() => setShowCustomerSignatureModal(true)}
                        onShowSeatecSignatureModal={() => setShowSeatecSignatureModal(true)}
                        onClearCustomerSignature={() => setCustomerSignature(null)}
                        onClearSeatecSignature={() => setSeatecSignature(null)}
                    />
                );
            case 'cybersecurity':
                return (
                    <CybersecuritySurveyForm
                        formData={formData}
                        onFieldChange={handleFieldChange}
                        toggleCheckbox={toggleCheckbox}
                        customerSignature={customerSignature}
                        seatecSignature={seatecSignature}
                        onShowCustomerSignatureModal={() => setShowCustomerSignatureModal(true)}
                        onShowSeatecSignatureModal={() => setShowSeatecSignatureModal(true)}
                        onClearCustomerSignature={() => setCustomerSignature(null)}
                        onClearSeatecSignature={() => setSeatecSignature(null)}
                    />
                );
            case 'cabling':
                return (
                    <StructuredCablingSurveyForm
                        formData={formData}
                        onFieldChange={handleFieldChange}
                        toggleCheckbox={toggleCheckbox}
                        customerSignature={customerSignature}
                        seatecSignature={seatecSignature}
                        onShowCustomerSignatureModal={() => setShowCustomerSignatureModal(true)}
                        onShowSeatecSignatureModal={() => setShowSeatecSignatureModal(true)}
                        onClearCustomerSignature={() => setCustomerSignature(null)}
                        onClearSeatecSignature={() => setSeatecSignature(null)}
                    />
                );
            case 'videoconf':
                return (
                    <VideoConferenceSurveyForm
                        formData={formData}
                        onFieldChange={handleFieldChange}
                        toggleCheckbox={toggleCheckbox}
                        customerSignature={customerSignature}
                        seatecSignature={seatecSignature}
                        onShowCustomerSignatureModal={() => setShowCustomerSignatureModal(true)}
                        onShowSeatecSignatureModal={() => setShowSeatecSignatureModal(true)}
                        onClearCustomerSignature={() => setCustomerSignature(null)}
                        onClearSeatecSignature={() => setSeatecSignature(null)}
                    />
                );
            default:
                return <Text className="text-center py-10 text-gray-500">Please select a survey type from the dropdown</Text>;
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-blue-600 py-10 px-4 rounded-b-3xl shadow-sm">
                <Text className="text-white text-xl font-bold text-center">Survey Checklist</Text>
            </View>

            {/* Survey Selection */}
            <View className="p-4">
                <View className="border border-gray-300 rounded-lg bg-white">
                    <Picker
                        selectedValue={selectedSurvey}
                        onValueChange={(itemValue: string) => {
                            setSelectedSurvey(itemValue);
                            setFormData({});
                            setCustomerSignature(null);
                            setSeatecSignature(null);
                        }}
                        dropdownIconColor="#3b82f6"
                    >
                        <Picker.Item label="Select Survey Type" value="" />
                        <Picker.Item label="VoIP Telephony Survey" value="telephony" />
                        <Picker.Item label="CCTV Survey" value="cctv" />
                        <Picker.Item label="Cybersecurity Survey" value="cybersecurity" />
                        <Picker.Item label="Structured Cabling Survey" value="cabling" />
                        <Picker.Item label="Video Conference Survey" value="videoconf" />
                    </Picker>
                </View>
            </View>

            {/* Form Content with bottom padding */}
            <ScrollView
                className="flex-1 px-4"
                contentContainerStyle={{ paddingBottom: 180 }}
            >
                {renderForm()}

            </ScrollView>

            {/* Fixed Footer */}
            <View className="absolute bottom-0 w-full flex-row justify-around bg-blue-600 px-8 py-4 rounded-t-3xl shadow-sm">
                <Link href="/" asChild>
                    <TouchableOpacity className="items-center">
                        <MaterialIcons name="home" size={26} color="white" />
                        <Text className="text-white text-xs mt-1 font-sans">Home</Text>
                    </TouchableOpacity>
                </Link>
                <Link href="/work-order" asChild>
                    <TouchableOpacity className="items-center">
                        <MaterialIcons name="assignment" size={26} color="white" />
                        <Text className="text-white text-xs mt-1 font-sans">Work Order</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            {/* Signature Modals */}
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
        </View>
    );
};

export default SurveyChecklistScreen;
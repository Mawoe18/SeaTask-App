// Survey/CybersecuritySurveyForm.tsx
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FormComponentProps, FormData } from './index';

const CybersecuritySurveyForm = ({ 
    formData, 
    onFieldChange, 
    toggleCheckbox,
    customerSignature, 
    seatecSignature, 
    onShowCustomerSignatureModal, 
    onShowSeatecSignatureModal,
    onClearCustomerSignature,
    onClearSeatecSignature 
}: FormComponentProps & { toggleCheckbox: (field: string, value: string) => void }) => {
    const securityQuestions = [
        "Is your network protected by a firewall?",
        "Are network devices secured with encryption and strong passwords?",
        "Do you use segmentation to separate sensitive traffic?",
        "Is your wireless network secured with WPA3 or WPA2 encryption?",
        "Do you have antivirus and endpoint protection on all devices?",
        "Are all software and systems regularly updated with security patches?",
        "Are you using multi-factor authentication (MFA) for sensitive systems?",
        "Do you have a system to monitor your network for unusual activity?",
        "How quickly can you detect and respond to security incidents?",
        "Would you benefit from 24/7 network and endpoint monitoring?",
        "Do you have an incident response plan in place?",
        "Are employees trained on cybersecurity incident response?",
        "Have you conducted a recent vulnerability assessment?",
        "Are you using a Security Information and Event Management (SIEM) tool?",
        "Do you need help meeting compliance requirements?",
        "Would you be interested in FortiSIEM as a service?",
        "Do you have a data backup and disaster recovery plan?",
        "Is your sensitive data encrypted (both in transit and at rest)?",
        "Do you require help in securing your remote workforce(VPN,Endpoint Security)?"
    ];

    return (
        <View className="bg-white rounded-lg p-4 shadow-sm">
            {/* General Information */}
            <Text className="text-lg font-bold mb-2">GENERAL INFORMATION</Text>
            <View className="mb-4">
                <Text className="mb-1">Organization Name:</Text>
                <TextInput
                    value={typeof formData.organizationName === 'string' ? formData.organizationName : ''}
                    onChangeText={(text) => onFieldChange('organizationName', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter organization name"
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1">Contact Person:</Text>
                <TextInput
                    value={typeof formData.contactPerson === 'string' ? formData.contactPerson : ''}
                    onChangeText={(text) => onFieldChange('contactPerson', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter contact person"
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1">Industry/Sector:</Text>
                <TextInput
                    value={typeof formData.industry === 'string' ? formData.industry : ''}
                    onChangeText={(text) => onFieldChange('industry', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter industry/sector"
                />
            </View>

            {/* Cybersecurity Assessment */}
            <Text className="text-lg font-bold mt-4 mb-2">CYBERSECURITY ASSESSMENT</Text>
            {securityQuestions.map((question, index) => (
                <View key={index} className="mb-4">
                    <Text className="mb-2">{index + 1}. {question}</Text>
                    <View className="flex-row justify-around">
                        {['Yes', 'No', 'Partial', 'Need Help'].map((option) => (
                            <TouchableOpacity
                                key={option}
                                className={`p-2 border rounded-lg ${formData[`q${index}`] === option.toLowerCase() ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                                onPress={() => onFieldChange(`q${index}`, option.toLowerCase())}
                            >
                                <Text>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            ))}

            {/* Signatures */}
            <View className="mt-6">
                <Text className="text-lg font-bold mb-2">SIGNATURES</Text>
                <View className="flex-row justify-between">
                    <View className="w-1/2 pr-2">
                        <Text className="mb-1">CUSTOMER REPRESENTATIVE</Text>
                        <TextInput
                            value={typeof formData.customerRepName === 'string' ? formData.customerRepName : ''}
                            onChangeText={(text) => onFieldChange('customerRepName', text)}
                            className="border border-gray-300 p-2 rounded mb-2"
                            placeholder="Full Name"
                        />
                        <TouchableOpacity
                            className="h-32 border-2 border-dashed border-gray-400 rounded-lg justify-center items-center bg-gray-100"
                            onPress={onShowCustomerSignatureModal}
                        >
                            {customerSignature ? (
                                <Image source={{ uri: customerSignature }} className="w-full h-full rounded-lg" />
                            ) : (
                                <View className="items-center">
                                    <MaterialIcons name="edit" size={24} color="#3b82f6" />
                                    <Text className="text-blue-600 mt-2">Tap to sign</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        {customerSignature && (
                            <TouchableOpacity
                                className="bg-red-500 py-2 px-4 rounded mt-2 self-start"
                                onPress={onClearCustomerSignature}
                            >
                                <Text className="text-white">Clear Signature</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View className="w-1/2 pl-2">
                        <Text className="mb-1">SEATEC REPRESENTATIVE</Text>
                        <TextInput
                            value={typeof formData.seatecRepName === 'string' ? formData.seatecRepName : ''}
                            onChangeText={(text) => onFieldChange('seatecRepName', text)}
                            className="border border-gray-300 p-2 rounded mb-2"
                            placeholder="Tech. Personnel"
                        />
                        <TouchableOpacity
                            className="h-32 border-2 border-dashed border-gray-400 rounded-lg justify-center items-center bg-gray-100"
                            onPress={onShowSeatecSignatureModal}
                        >
                            {seatecSignature ? (
                                <Image source={{ uri: seatecSignature }} className="w-full h-full rounded-lg" />
                            ) : (
                                <View className="items-center">
                                    <MaterialIcons name="edit" size={24} color="#3b82f6" />
                                    <Text className="text-blue-600 mt-2">Tap to sign</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        {seatecSignature && (
                            <TouchableOpacity
                                className="bg-red-500 py-2 px-4 rounded mt-2 self-start"
                                onPress={onClearSeatecSignature}
                            >
                                <Text className="text-white">Clear Signature</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

export default CybersecuritySurveyForm;
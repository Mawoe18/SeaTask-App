// Survey/VideoConferenceSurveyForm.tsx
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FormComponentProps, FormData } from './index';

const VideoConferenceSurveyForm = ({ 
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
    return (
        <View className="bg-white rounded-lg p-4 shadow-sm">
            {/* General Information */}
            <Text className="text-lg font-bold mb-2">GENERAL INFORMATION</Text>
            <View className="mb-4">
                <Text className="mb-1">Customer Name:</Text>
                <TextInput
                    value={typeof formData.customerName === 'string' ? formData.customerName : ''}
                    onChangeText={(text) => onFieldChange('customerName', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter customer name"
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
                <Text className="mb-1">Date of Survey:</Text>
                <TextInput
                    value={typeof formData.surveyDate === 'string' ? formData.surveyDate : ''}
                    onChangeText={(text) => onFieldChange('surveyDate', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter date (DD/MM/YYYY)"
                />
            </View>

            {/* Room Specifications */}
            <Text className="text-lg font-bold mt-4 mb-2">ROOM SPECIFICATIONS</Text>
            <View className="mb-4">
                <Text className="mb-1">Room Size (Dimensions):</Text>
                <TextInput
                    value={typeof formData.roomSize === 'string' ? formData.roomSize : ''}
                    onChangeText={(text) => onFieldChange('roomSize', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter dimensions (L x W x H)"
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1">Ceiling Type:</Text>
                <TextInput
                    value={typeof formData.ceilingType === 'string' ? formData.ceilingType : ''}
                    onChangeText={(text) => onFieldChange('ceilingType', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter ceiling type"
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1">Wall Type:</Text>
                <TextInput
                    value={typeof formData.wallType === 'string' ? formData.wallType : ''}
                    onChangeText={(text) => onFieldChange('wallType', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter wall type"
                />
            </View>

            {/* Technical Requirements */}
            <Text className="text-lg font-bold mt-4 mb-2">TECHNICAL REQUIREMENTS</Text>
            <View className="mb-4">
                <Text className="mb-1">Conferencing Platform:</Text>
                <View className="flex-row flex-wrap">
                    {['Zoom', 'Teams', 'Google Meet', 'Webex', 'Other'].map((platform) => (
                        <TouchableOpacity
                            key={platform}
                            className={`p-2 m-1 border rounded-lg ${(Array.isArray(formData.platforms) ? formData.platforms : []).includes(platform) ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                            onPress={() => toggleCheckbox('platforms', platform)}
                        >
                            <Text>{platform}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View className="mb-4">
                <Text className="mb-1">Devices to be Integrated:</Text>
                <View className="flex-row flex-wrap">
                    {['Display Screen', 'ClickShare', 'Interactive Screen', 'Speakers', 'Conference Phone', 'Tablets/PC'].map((device) => (
                        <TouchableOpacity
                            key={device}
                            className={`p-2 m-1 border rounded-lg ${(Array.isArray(formData.devices) ? formData.devices : []).includes(device) ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                            onPress={() => toggleCheckbox('devices', device)}
                        >
                            <Text>{device}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View className="mb-4">
                <Text className="mb-1">Internet Source & Capacity:</Text>
                <TextInput
                    value={typeof formData.internetInfo === 'string' ? formData.internetInfo : ''}
                    onChangeText={(text) => onFieldChange('internetInfo', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter internet details"
                />
            </View>

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

export default VideoConferenceSurveyForm;
// Survey/StructuredCablingSurveyForm.tsx
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FormComponentProps, FormData } from './index';

const StructuredCablingSurveyForm = ({ 
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
            {/* Project Information */}
            <Text className="text-lg font-bold mb-2">PROJECT INFORMATION</Text>
            <View className="mb-4">
                <Text className="mb-1">Project Name:</Text>
                <TextInput
                    value={typeof formData.projectName === 'string' ? formData.projectName : ''}
                    onChangeText={(text) => onFieldChange('projectName', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter project name"
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1">Location:</Text>
                <TextInput
                    value={typeof formData.location === 'string' ? formData.location : ''}
                    onChangeText={(text) => onFieldChange('location', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter location"
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1">Survey Conducted By:</Text>
                <TextInput
                    value={typeof formData.surveyConductedBy === 'string' ? formData.surveyConductedBy : ''}
                    onChangeText={(text) => onFieldChange('surveyConductedBy', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter name"
                />
            </View>

            {/* Site Overview */}
            <Text className="text-lg font-bold mt-4 mb-2">SITE OVERVIEW</Text>
            <View className="mb-4">
                <Text className="mb-1">Building/Floor Plan Available:</Text>
                <View className="flex-row">
                    {['Yes', 'No'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            className={`flex-1 p-2 border rounded-lg mr-2 ${formData.floorPlanAvailable === option.toLowerCase() ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                            onPress={() => onFieldChange('floorPlanAvailable', option.toLowerCase())}
                        >
                            <Text className="text-center">{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View className="mb-4">
                <Text className="mb-1">Construction Type:</Text>
                <View className="flex-row">
                    {['New Construction', 'Existing Building'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            className={`flex-1 p-2 border rounded-lg mr-2 ${formData.constructionType === option.toLowerCase() ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                            onPress={() => onFieldChange('constructionType', option.toLowerCase())}
                        >
                            <Text className="text-center">{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Cabling Requirements */}
            <Text className="text-lg font-bold mt-4 mb-2">CABLING REQUIREMENTS</Text>
            <View className="mb-4">
                <Text className="mb-1">Network Requirements:</Text>
                <View className="flex-row flex-wrap">
                    {['Data', 'Voice', 'Video', 'CCTV', 'Other'].map((req) => (
                        <TouchableOpacity
                            key={req}
                            className={`p-2 m-1 border rounded-lg ${(Array.isArray(formData.networkRequirements) ? formData.networkRequirements : []).includes(req) ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                            onPress={() => toggleCheckbox('networkRequirements', req)}
                        >
                            <Text>{req}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View className="mb-4">
                <Text className="mb-1">Cable Types:</Text>
                <View className="flex-row flex-wrap">
                    {['Cat5e', 'Cat6', 'Cat6e', 'Cat7', 'Fiber Optic'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            className={`p-2 m-1 border rounded-lg ${(Array.isArray(formData.cableTypes) ? formData.cableTypes : []).includes(type) ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                            onPress={() => toggleCheckbox('cableTypes', type)}
                        >
                            <Text>{type}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View className="mb-4">
                <Text className="mb-1">Estimated Number of Workstations:</Text>
                <TextInput
                    value={typeof formData.workstationCount === 'string' ? formData.workstationCount : ''}
                    onChangeText={(text) => onFieldChange('workstationCount', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter number"
                    keyboardType="numeric"
                />
            </View>

            {/* Equipment Room Details */}
            <Text className="text-lg font-bold mt-4 mb-2">EQUIPMENT ROOM DETAILS</Text>
            <View className="mb-4">
                <Text className="mb-1">Server Room/Telecom Closet Location:</Text>
                <TextInput
                    value={typeof formData.serverRoomLocation === 'string' ? formData.serverRoomLocation : ''}
                    onChangeText={(text) => onFieldChange('serverRoomLocation', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter location"
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1">Available Space:</Text>
                <View className="flex-row">
                    {['Adequate', 'Insufficient'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            className={`flex-1 p-2 border rounded-lg mr-2 ${formData.spaceAvailability === option.toLowerCase() ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                            onPress={() => onFieldChange('spaceAvailability', option.toLowerCase())}
                        >
                            <Text className="text-center">{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
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

export default StructuredCablingSurveyForm;
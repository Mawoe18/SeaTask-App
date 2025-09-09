import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { FormComponentProps, FormData } from './index';

const CCTVSurveyForm = ({ 
    formData, 
    onFieldChange, 
    toggleCheckbox,
    seatecSignature, 
    onShowSeatecSignatureModal, 
    onClearSeatecSignature 
}: FormComponentProps & { toggleCheckbox: (field: string, value: string) => void }) => {
    const exportFormData = () => {
        const exportData = {
            organizationName: formData.organizationName || '',
            location: formData.location || '',
            natureOfBusiness: formData.natureOfBusiness || '',
            intendedUse: formData.intendedUse || '',
            floorPlanRequest: formData.floorPlanRequest || '',
            existingCablingInfrastructure: formData.existingCablingInfrastructure || '',
            cablingDescription: formData.cablingDescription || '',
            ductPresence: formData.ductPresence || false,
            laidPipes: formData.laidPipes || false,
            trunking: formData.trunking || false,
            existingNetworkInfrastructure: formData.existingNetworkInfrastructure || '',
            networkDescription: formData.networkDescription || '',
            cabinetSpace: formData.cabinetSpace || '',
            networkScalability: formData.networkScalability || '',
            numberOfBuildings: formData.numberOfBuildings || '',
            buildingsNetworked: formData.buildingsNetworked || '',
            fullCoverage: formData.fullCoverage || '',
            areasToCover: formData.areasToCover || '',
            fieldOfViewDescription: formData.fieldOfViewDescription || '',
            mountingSurfaces: formData.mountingSurfaces || '',
            ceilingHeight: formData.ceilingHeight || '',
            obstacles: formData.obstacles || '',
            preferredFeatures: formData.preferredFeatures || '',
            destructiveFactors: formData.destructiveFactors || '',
            existingEquipmentRoom: formData.existingEquipmentRoom || '',
            rackSpaceAvailable: formData.rackSpaceAvailable || '',
            equipmentLocationDescription: formData.equipmentLocationDescription || '',
            monitoredFromEquipmentRoom: formData.monitoredFromEquipmentRoom || '',
            preferredMonitoringLocation: formData.preferredMonitoringLocation || '',
            powerDataAvailability: formData.powerDataAvailability || '',
            preferredDisplayType: formData.preferredDisplayType || '',
            videoRetentionDuration: formData.videoRetentionDuration || '',
            seatecRepNameSig: formData.seatecRepNameSig || ''
        };
        // This data can be passed to a PDF generation function or saved to a file
        console.log(JSON.stringify(exportData, null, 2));
        // Add your PDF generation logic here, e.g., using a library like react-native-pdf-lib
    };

    return (
        <View className="bg-white rounded-lg p-4 shadow-sm">
            {/* General Information */}
            <Text className="text-lg font-bold mb-2">GENERAL INFORMATION</Text>
            <View className="mb-4">
                <Text className="mb-1">Name of Organization:</Text>
                <TextInput
                    value={typeof formData.organizationName === 'string' ? formData.organizationName : ''}
                    onChangeText={(text) => onFieldChange('organizationName', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter organization name"
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
                <Text className="mb-1">Nature of Business:</Text>
                <TextInput
                    value={typeof formData.natureOfBusiness === 'string' ? formData.natureOfBusiness : ''}
                    onChangeText={(text) => onFieldChange('natureOfBusiness', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter nature of business"
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Briefly Describe the Intended Use of the Solution to the Customer:</Text>
                <TextInput
                    value={typeof formData.intendedUse === 'string' ? formData.intendedUse : ''}
                    onChangeText={(text) => onFieldChange('intendedUse', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe intended use"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Request for Floor Plan:</Text>
                <TextInput
                    value={typeof formData.floorPlanRequest === 'string' ? formData.floorPlanRequest : ''}
                    onChangeText={(text) => onFieldChange('floorPlanRequest', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter floor plan details or request"
                />
            </View>

            {/* Cabling and Network Infrastructure */}
            <Text className="text-lg font-bold mt-4 mb-2">CABLING AND NETWORK INFRASTRUCTURE</Text>
            <View className="mb-4">
                <Text className="mb-1">Is there an Existing Cabling Infrastructure?</Text>
                <View className="flex-row">
                    {['Yes', 'No'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            className={`flex-1 p-2 border rounded-lg mr-2 ${formData.existingCablingInfrastructure === option.toLowerCase() ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                            onPress={() => onFieldChange('existingCablingInfrastructure', option.toLowerCase())}
                        >
                            <Text className="text-center">{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            {formData.existingCablingInfrastructure === 'yes' && (
                <View className="mb-4">
                    <Text className="mb-1">Inspect and Describe Cabling Infrastructure with Detail:</Text>
                    <TextInput
                        value={typeof formData.cablingDescription === 'string' ? formData.cablingDescription : ''}
                        onChangeText={(text) => onFieldChange('cablingDescription', text)}
                        className="border border-gray-300 p-2 rounded h-20"
                        placeholder="Describe cabling infrastructure"
                        multiline
                    />
                </View>
            )}
            <View className="mb-4">
                <Text className="mb-1">Things to Check for (but not limited to):</Text>
                <View>
                    {['Presence of a duct for all floors', 'Laid pipes (conduit, Duct)', 'Trunking'].map((item) => (
                        <View key={item} className="flex-row items-center mb-2">
                            <TouchableOpacity
                                className={`w-6 h-6 border rounded mr-2 ${formData[item.replace(/\s/g, '').toLowerCase()] ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}
                                onPress={() => onFieldChange(item.replace(/\s/g, '').toLowerCase(), !formData[item.replace(/\s/g, '').toLowerCase()])}
                            >
                                {formData[item.replace(/\s/g, '').toLowerCase()] && <MaterialIcons name="check" size={18} color="white" />}
                            </TouchableOpacity>
                            <Text>{item}</Text>
                        </View>
                    ))}
                </View>
            </View>
            <View className="mb-4">
                <Text className="mb-1">Is there an Existing Network Infrastructure (LAN/WLAN)?</Text>
                <View className="flex-row">
                    {['Yes', 'No'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            className={`flex-1 p-2 border rounded-lg mr-2 ${formData.existingNetworkInfrastructure === option.toLowerCase() ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                            onPress={() => onFieldChange('existingNetworkInfrastructure', option.toLowerCase())}
                        >
                            <Text className="text-center">{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            {formData.existingNetworkInfrastructure === 'yes' && (
                <View className="mb-4">
                    <Text className="mb-1">Inspect and Describe Network Infrastructure:</Text>
                    <TextInput
                        value={typeof formData.networkDescription === 'string' ? formData.networkDescription : ''}
                        onChangeText={(text) => onFieldChange('networkDescription', text)}
                        className="border border-gray-300 p-2 rounded h-20"
                        placeholder="Describe network infrastructure"
                        multiline
                    />
                </View>
            )}
            <View className="mb-4">
                <Text className="mb-1">Things to Check for (but not limited to):</Text>
                <View>
                    {['Space in Cabinet', 'Scalability of network infract (other solutions)'].map((item) => (
                        <View key={item} className="flex-row items-center mb-2">
                            <TouchableOpacity
                                className={`w-6 h-6 border rounded mr-2 ${formData[item.replace(/\s/g, '').toLowerCase()] ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}
                                onPress={() => onFieldChange(item.replace(/\s/g, '').toLowerCase(), !formData[item.replace(/\s/g, '').toLowerCase()])}
                            >
                                {formData[item.replace(/\s/g, '').toLowerCase()] && <MaterialIcons name="check" size={18} color="white" />}
                            </TouchableOpacity>
                            <Text>{item}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Camera Requirements */}
            <Text className="text-lg font-bold mt-4 mb-2">CAMERA REQUIREMENTS</Text>
            <View className="mb-4">
                <Text className="mb-1">State Number of Buildings:</Text>
                <TextInput
                    value={typeof formData.numberOfBuildings === 'string' ? formData.numberOfBuildings : ''}
                    onChangeText={(text) => onFieldChange('numberOfBuildings', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter number of buildings"
                    keyboardType="numeric"
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Are the Buildings Networked Together?</Text>
                <TextInput
                    value={typeof formData.buildingsNetworked === 'string' ? formData.buildingsNetworked : ''}
                    onChangeText={(text) => onFieldChange('buildingsNetworked', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter details"
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Should all Areas, Including Exterior of Building Have Camera / CCTV Coverage?</Text>
                <View className="flex-row">
                    {['Yes', 'No'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            className={`flex-1 p-2 border rounded-lg mr-2 ${formData.fullCoverage === option.toLowerCase() ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                            onPress={() => onFieldChange('fullCoverage', option.toLowerCase())}
                        >
                            <Text className="text-center">{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            {formData.fullCoverage === 'no' && (
                <View className="mb-4">
                    <Text className="mb-1">Please Indicate General Areas to be Covered (Indoor or Outdoor):</Text>
                    <TextInput
                        value={typeof formData.areasToCover === 'string' ? formData.areasToCover : ''}
                        onChangeText={(text) => onFieldChange('areasToCover', text)}
                        className="border border-gray-300 p-2 rounded h-20"
                        placeholder="Describe areas to cover"
                        multiline
                    />
                </View>
            )}
            <View className="mb-4">
                <Text className="mb-1">Describe Field of View Coverage and Shape (Length x Breadth x Height), and Provide Rough Sketches and Pictures:</Text>
                <TextInput
                    value={typeof formData.fieldOfViewDescription === 'string' ? formData.fieldOfViewDescription : ''}
                    onChangeText={(text) => onFieldChange('fieldOfViewDescription', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe field of view"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Describe the Mounting Surfaces like Pole, Ceiling and Wall (Metal, Wood, Glass), Limits the Height and Diameter:</Text>
                <TextInput
                    value={typeof formData.mountingSurfaces === 'string' ? formData.mountingSurfaces : ''}
                    onChangeText={(text) => onFieldChange('mountingSurfaces', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe mounting surfaces"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">If Ceiling, State the Height Above the Ground Level:</Text>
                <TextInput
                    value={typeof formData.ceilingHeight === 'string' ? formData.ceilingHeight : ''}
                    onChangeText={(text) => onFieldChange('ceilingHeight', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter ceiling height"
                />
            </View>

            {/* Additional Factors */}
            <Text className="text-lg font-bold mt-4 mb-2">ADDITIONAL FACTORS</Text>
            <View className="mb-4">
                <Text className="mb-1">State Possible Obstacles that Can Interfere with the Field or Quality of View (Presence of a Pillar, Mirrors, Beam of Light):</Text>
                <TextInput
                    value={typeof formData.obstacles === 'string' ? formData.obstacles : ''}
                    onChangeText={(text) => onFieldChange('obstacles', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe possible obstacles"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">State the Specific Features Preferred by the Customer for Each Area (Hidden, Fixed, PTZ, 360, Smart Analytics, Audio etc.):</Text>
                <TextInput
                    value={typeof formData.preferredFeatures === 'string' ? formData.preferredFeatures : ''}
                    onChangeText={(text) => onFieldChange('preferredFeatures', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe preferred features"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">State Possible Destructive/Deteriorating Factors Components Might be Exposed to (Rain, Sun, Heat, Dust, Chemical Substances, Vandalism, etc):</Text>
                <TextInput
                    value={typeof formData.destructiveFactors === 'string' ? formData.destructiveFactors : ''}
                    onChangeText={(text) => onFieldChange('destructiveFactors', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe destructive factors"
                    multiline
                />
            </View>

            {/* Equipment and Monitoring */}
            <Text className="text-lg font-bold mt-4 mb-2">EQUIPMENT AND MONITORING</Text>
            <View className="mb-4">
                <Text className="mb-1">Is there an Existing Equipment/Server Room and a Rack Unit?</Text>
                <View className="flex-row">
                    {['Yes', 'No'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            className={`flex-1 p-2 border rounded-lg mr-2 ${formData.existingEquipmentRoom === option.toLowerCase() ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                            onPress={() => onFieldChange('existingEquipmentRoom', option.toLowerCase())}
                        >
                            <Text className="text-center">{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            {formData.existingEquipmentRoom === 'yes' && (
                <View className="mb-4">
                    <Text className="mb-1">State Rack Space Available:</Text>
                    <TextInput
                        value={typeof formData.rackSpaceAvailable === 'string' ? formData.rackSpaceAvailable : ''}
                        onChangeText={(text) => onFieldChange('rackSpaceAvailable', text)}
                        className="border border-gray-300 p-2 rounded"
                        placeholder="Enter rack space"
                    />
                </View>
            )}
            {formData.existingEquipmentRoom === 'no' && (
                <View className="mb-4">
                    <Text className="mb-1">Describe Possible Location for the Equipment (Switches, NVR and Other Components):</Text>
                    <TextInput
                        value={typeof formData.equipmentLocationDescription === 'string' ? formData.equipmentLocationDescription : ''}
                        onChangeText={(text) => onFieldChange('equipmentLocationDescription', text)}
                        className="border border-gray-300 p-2 rounded h-20"
                        placeholder="Describe equipment location"
                        multiline
                    />
                </View>
            )}
            <View className="mb-4">
                <Text className="mb-1">Would the Surveillance be Monitored from the Equipment/Server Room?</Text>
                <View className="flex-row">
                    {['Yes', 'No'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            className={`flex-1 p-2 border rounded-lg mr-2 ${formData.monitoredFromEquipmentRoom === option.toLowerCase() ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                            onPress={() => onFieldChange('monitoredFromEquipmentRoom', option.toLowerCase())}
                        >
                            <Text className="text-center">{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            {formData.monitoredFromEquipmentRoom === 'no' && (
                <View className="mb-4">
                    <Text className="mb-1">State Preferred Location(s) for Monitoring and Check for Availability of Power and Data Outlets:</Text>
                    <TextInput
                        value={typeof formData.preferredMonitoringLocation === 'string' ? formData.preferredMonitoringLocation : ''}
                        onChangeText={(text) => onFieldChange('preferredMonitoringLocation', text)}
                        className="border border-gray-300 p-2 rounded h-20"
                        placeholder="Describe preferred monitoring location"
                        multiline
                    />
                </View>
            )}
            <View className="mb-4">
                <Text className="mb-1">State Preferred Type of Display, Size and Number Screens (Video Wall, Television, etc):</Text>
                <TextInput
                    value={typeof formData.preferredDisplayType === 'string' ? formData.preferredDisplayType : ''}
                    onChangeText={(text) => onFieldChange('preferredDisplayType', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe preferred display type"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">State Duration of Video Retention/Storage:</Text>
                <TextInput
                    value={typeof formData.videoRetentionDuration === 'string' ? formData.videoRetentionDuration : ''}
                    onChangeText={(text) => onFieldChange('videoRetentionDuration', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter video retention duration"
                />
            </View>

            {/* Signatures */}
            <View className="mt-6">
                <Text className="text-lg font-bold mb-2">SIGNATURES</Text>
                <View className="w-1/2 pl-2">
                    <Text className="mb-1">SEATEC REPRESENTATIVE</Text>
                    <TextInput
                        value={typeof formData.seatecRepNameSig === 'string' ? formData.seatecRepNameSig : ''}
                        onChangeText={(text) => onFieldChange('seatecRepNameSig', text)}
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

            {/* Export Button */}
            <TouchableOpacity
                onPress={exportFormData}
                className="bg-green-600 py-3 px-6 rounded-lg items-center mt-6"
            >
                <Text className="text-white text-lg font-bold">Export to PDF</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CCTVSurveyForm;
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { FormComponentProps, FormData } from './index';

const TelephonySurveyForm = ({ 
    formData, 
    onFieldChange, 
    toggleCheckbox,
    seatecSignature, 
    onShowSeatecSignatureModal, 
    onClearSeatecSignature
}: FormComponentProps & { toggleCheckbox: (field: string, value: string) => void }) => {
    const exportFormData = () => {
        const exportData = {
            seatecRepName: formData.seatecRepName || '',
            position: formData.position || '',
            customerCompanyName: formData.customerCompanyName || '',
            customerAddress: formData.customerAddress || '',
            natureOfBusiness: formData.natureOfBusiness || '',
            representativeName: formData.representativeName || '',
            phoneNo: formData.phoneNo || '',
            dateOfSurvey: formData.dateOfSurvey || '',
            purposeOfSurvey: formData.purposeOfSurvey || '',
            networkArchitectureOverview: formData.networkArchitectureOverview || '',
            poeAvailabilityAssessment: formData.poeAvailabilityAssessment || '',
            vlanConfiguration: formData.vlanConfiguration || '',
            cablingInfrastructureType: formData.cablingInfrastructureType || '',
            ipAddressingScheme: formData.ipAddressingScheme || '',
            internetConnectivity: formData.internetConnectivity || '',
            firewallCapabilities: formData.firewallCapabilities || '',
            telephonySolutionType: formData.telephonySolutionType || [],
            totalUsersExtensions: formData.totalUsersExtensions || '',
            userRoles: formData.userRoles || '',
            existingTelephonyAssessment: formData.existingTelephonyAssessment || '',
            preferredPhoneTypes: formData.preferredPhoneTypes || '',
            addReq_Voicemail: formData.addReq_Voicemail || false,
            addReq_AutoAttendantIVR: formData.addReq_AutoAttendantIVR || false,
            addReq_CallForwarding: formData.addReq_CallForwarding || false,
            addReq_CallRecording: formData.addReq_CallRecording || false,
            addReq_PagingIntercom: formData.addReq_PagingIntercom || false,
            addReq_IntegrationwithSecurityCRMHelpdeskSystems: formData.addReq_IntegrationwithSecurityCRMHelpdeskSystems || false,
            externalTrunkRequirements: formData.externalTrunkRequirements || '',
            electricalSocketsAvailability: formData.electricalSocketsAvailability || '',
            powerBackup: formData.powerBackup || '',
            coolingVentilation: formData.coolingVentilation || '',
            rackCabinetsAvailability: formData.rackCabinetsAvailability || '',
            phoneLocationsMapping: formData.phoneLocationsMapping || '',
            cablingOutletsCondition: formData.cablingOutletsCondition || '',
            wifiCoverageAssessment: formData.wifiCoverageAssessment || '',
            cablePathways: formData.cablePathways || '',
            distanceEndpointsSwitches: formData.distanceEndpointsSwitches || '',
            pingLatencyTesting: formData.pingLatencyTesting || '',
            testIpPhonesRegistration: formData.testIpPhonesRegistration || '',
            internalCallTesting: formData.internalCallTesting || '',
            externalCallTesting: formData.externalCallTesting || '',
            mosEstimation: formData.mosEstimation || '',
            doc_PhotographicEvidenceofNetworkCabinetsPatchPanelsandEquipment: formData.doc_PhotographicEvidenceofNetworkCabinetsPatchPanelsandEquipment || false,
            doc_FloorPlanAnnotationsIndicatingRackandPhoneLocations: formData.doc_FloorPlanAnnotationsIndicatingRackandPhoneLocations || false,
            doc_InventoryofExistingIPPhonesorAnalogDevices: formData.doc_InventoryofExistingIPPhonesorAnalogDevices || false,
            doc_NotesonExistingSystemChallengesUserFeedbackorKnownIssues: formData.doc_NotesonExistingSystemChallengesUserFeedbackorKnownIssues || false,
            doc_LicensingRequirementsSIPTrunksPBXSubscriptionsFeatureLicenses: formData.doc_LicensingRequirementsSIPTrunksPBXSubscriptionsFeatureLicenses || false,
            proposedPbxModel: formData.proposedPbxModel || '',
            suggestedIpPhones: formData.suggestedIpPhones || '',
            networkEquipmentRequirements: formData.networkEquipmentRequirements || '',
            structuredCablingAdjustments: formData.structuredCablingAdjustments || '',
            vlanQosEnhancements: formData.vlanQosEnhancements || '',
            draftIpAddressingScheme: formData.draftIpAddressingScheme || '',
            userTrainingPlans: formData.userTrainingPlans || '',
            observations: formData.observations || '',
            recommendations: formData.recommendations || '',
            seatecRepNameSig: formData.seatecRepNameSig || ''
        };
        // This data can be passed to a PDF generation function or saved to a file
        console.log(JSON.stringify(exportData, null, 2));
        // Add your PDF generation logic here, e.g., using a library like react-native-pdf-lib
    };

    return (
        <ScrollView className="bg-white rounded-lg p-4 shadow-sm" contentContainerStyle={{ paddingBottom: 180 }}>
            {/* General Information */}
            <Text className="text-lg font-bold mb-2">GENERAL INFORMATION</Text>
            <View className="mb-4">
                <Text className="mb-1">Name of Seatec Representative:</Text>
                <TextInput
                    value={typeof formData.seatecRepName === 'string' ? formData.seatecRepName : ''}
                    onChangeText={(text) => onFieldChange('seatecRepName', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter Seatec representative name"
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Position:</Text>
                <TextInput
                    value={typeof formData.position === 'string' ? formData.position : ''}
                    onChangeText={(text) => onFieldChange('position', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter position"
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Name of Customer's Company:</Text>
                <TextInput
                    value={typeof formData.customerCompanyName === 'string' ? formData.customerCompanyName : ''}
                    onChangeText={(text) => onFieldChange('customerCompanyName', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter customer company name"
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Customer Address:</Text>
                <TextInput
                    value={typeof formData.customerAddress === 'string' ? formData.customerAddress : ''}
                    onChangeText={(text) => onFieldChange('customerAddress', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Enter customer address"
                    multiline
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
                <Text className="mb-1">Representative Name:</Text>
                <TextInput
                    value={typeof formData.representativeName === 'string' ? formData.representativeName : ''}
                    onChangeText={(text) => onFieldChange('representativeName', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter representative name"
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Phone No.:</Text>
                <TextInput
                    value={typeof formData.phoneNo === 'string' ? formData.phoneNo : ''}
                    onChangeText={(text) => onFieldChange('phoneNo', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Date of Survey:</Text>
                <TextInput
                    value={typeof formData.dateOfSurvey === 'string' ? formData.dateOfSurvey : ''}
                    onChangeText={(text) => onFieldChange('dateOfSurvey', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter date of survey"
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Purpose of Survey:</Text>
                <TextInput
                    value={typeof formData.purposeOfSurvey === 'string' ? formData.purposeOfSurvey : ''}
                    onChangeText={(text) => onFieldChange('purposeOfSurvey', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Enter purpose of survey"
                    multiline
                />
            </View>

            {/* Network Infrastructure Assessment */}
            <Text className="text-lg font-bold mt-4 mb-2">NETWORK INFRASTRUCTURE ASSESSMENT</Text>
            <View className="mb-4">
                <Text className="mb-1">Overview of Existing Network Architecture (LAN/WAN Topology):</Text>
                <TextInput
                    value={typeof formData.networkArchitectureOverview === 'string' ? formData.networkArchitectureOverview : ''}
                    onChangeText={(text) => onFieldChange('networkArchitectureOverview', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe LAN/WAN topology"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Assessment of PoE Availability:</Text>
                <View className="border border-gray-300 rounded">
                    <Picker
                        selectedValue={typeof formData.poeAvailabilityAssessment === 'string' ? formData.poeAvailabilityAssessment : ''}
                        onValueChange={(value: string) => onFieldChange('poeAvailabilityAssessment', value)}
                    >
                        <Picker.Item label="Select option" value="" />
                        <Picker.Item label="Available" value="available" />
                        <Picker.Item label="Not Available" value="not_available" />
                        <Picker.Item label="Partial" value="partial" />
                    </Picker>
                </View>
            </View>
            <View className="mb-4">
                <Text className="mb-1">VLAN Configuration for Voice and Data Separation:</Text>
                <TextInput
                    value={typeof formData.vlanConfiguration === 'string' ? formData.vlanConfiguration : ''}
                    onChangeText={(text) => onFieldChange('vlanConfiguration', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe VLAN configuration"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Cabling Infrastructure Type (Cat5e, Cat6, BA, Fiber):</Text>
                <TextInput
                    value={typeof formData.cablingInfrastructureType === 'string' ? formData.cablingInfrastructureType : ''}
                    onChangeText={(text) => onFieldChange('cablingInfrastructureType', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter cabling type"
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">IP Addressing Scheme:</Text>
                <TextInput
                    value={typeof formData.ipAddressingScheme === 'string' ? formData.ipAddressingScheme : ''}
                    onChangeText={(text) => onFieldChange('ipAddressingScheme', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter IP addressing scheme"
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Internet Connectivity - Bandwidth, Uptime, SP Detail:</Text>
                <TextInput
                    value={typeof formData.internetConnectivity === 'string' ? formData.internetConnectivity : ''}
                    onChangeText={(text) => onFieldChange('internetConnectivity', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe internet connectivity details"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Firewall Capabilities (SIP ALG Handling, NAT Traversal):</Text>
                <TextInput
                    value={typeof formData.firewallCapabilities === 'string' ? formData.firewallCapabilities : ''}
                    onChangeText={(text) => onFieldChange('firewallCapabilities', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe firewall capabilities"
                    multiline
                />
            </View>

            {/* Telephony System Requirements */}
            <Text className="text-lg font-bold mt-4 mb-2">TELEPHONY SYSTEM REQUIREMENTS</Text>
            <View className="mb-4">
                <Text className="mb-1">Required Type of Telephony Solution (On-Premises IP PBX/Hosted VoIP/Hybrid):</Text>
                <View className="flex-row flex-wrap">
                    {['On-Premises IP PBX', 'Hosted VoIP', 'Hybrid'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            className={`p-2 m-1 border rounded-lg ${(Array.isArray(formData.telephonySolutionType) ? formData.telephonySolutionType : []).includes(type) ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                            onPress={() => toggleCheckbox('telephonySolutionType', type)}
                        >
                            <Text>{type}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View className="mb-4">
                <Text className="mb-1">Total Number of Users/Extensions:</Text>
                <TextInput
                    value={typeof formData.totalUsersExtensions === 'string' ? formData.totalUsersExtensions : ''}
                    onChangeText={(text) => onFieldChange('totalUsersExtensions', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter total number"
                    keyboardType="numeric"
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">User Roles (Reception, Management, Call Center, Remote Workers, etc.):</Text>
                <TextInput
                    value={typeof formData.userRoles === 'string' ? formData.userRoles : ''}
                    onChangeText={(text) => onFieldChange('userRoles', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe user roles"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Assessment of Existing Telephony System (if applicable):</Text>
                <TextInput
                    value={typeof formData.existingTelephonyAssessment === 'string' ? formData.existingTelephonyAssessment : ''}
                    onChangeText={(text) => onFieldChange('existingTelephonyAssessment', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe existing telephony system"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Preferred Existing Phone Types (Desk Phones (Wired/Wireless), DECT, Softphones):</Text>
                <TextInput
                    value={typeof formData.preferredPhoneTypes === 'string' ? formData.preferredPhoneTypes : ''}
                    onChangeText={(text) => onFieldChange('preferredPhoneTypes', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe preferred phone types"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Additional Requirements:</Text>
                <View>
                    {['Voicemail', 'Auto Attendant (IVR)', 'Call Forwarding', 'Call Recording', 'Paging/Intercom', 'Integration with Security/CRM/Helpdesk Systems'].map((req) => (
                        <View key={req} className="flex-row items-center mb-2">
                            <TouchableOpacity
                                className={`w-6 h-6 border rounded mr-2 ${formData[`addReq_${req.replace(/\s/g, '')}`] ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}
                                onPress={() => onFieldChange(`addReq_${req.replace(/\s/g, '')}`, !formData[`addReq_${req.replace(/\s/g, '')}`])}
                            >
                                {formData[`addReq_${req.replace(/\s/g, '')}`] && <MaterialIcons name="check" size={18} color="white" />}
                            </TouchableOpacity>
                            <Text>{req}</Text>
                        </View>
                    ))}
                </View>
            </View>
            <View className="mb-4">
                <Text className="mb-1">External Line/Trunk Requirements (SIP Trunks, ISDN, E1/T1, FXO/FXS):</Text>
                <TextInput
                    value={typeof formData.externalTrunkRequirements === 'string' ? formData.externalTrunkRequirements : ''}
                    onChangeText={(text) => onFieldChange('externalTrunkRequirements', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe external line/trunk requirements"
                    multiline
                />
            </View>

            {/* Power & Environmental Considerations */}
            <Text className="text-lg font-bold mt-4 mb-2">POWER & ENVIRONMENTAL CONSIDERATIONS</Text>
            <View className="mb-4">
                <Text className="mb-1">Availability of Electrical Sockets at Phone Installation Points:</Text>
                <View className="flex-row">
                    {['Yes', 'No'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            className={`flex-1 p-2 border rounded-lg mr-2 ${formData.electricalSocketsAvailability === option.toLowerCase() ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                            onPress={() => onFieldChange('electricalSocketsAvailability', option.toLowerCase())}
                        >
                            <Text className="text-center">{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View className="mb-4">
                <Text className="mb-1">Power Backup/UPS for Network and Telephony Equipment:</Text>
                <View className="flex-row">
                    {['Yes', 'No'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            className={`flex-1 p-2 border rounded-lg mr-2 ${formData.powerBackup === option.toLowerCase() ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                            onPress={() => onFieldChange('powerBackup', option.toLowerCase())}
                        >
                            <Text className="text-center">{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View className="mb-4">
                <Text className="mb-1">Cooling and Ventilation for Network/Server Rooms:</Text>
                <View className="flex-row">
                    {['Yes', 'No'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            className={`flex-1 p-2 border rounded-lg mr-2 ${formData.coolingVentilation === option.toLowerCase() ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                            onPress={() => onFieldChange('coolingVentilation', option.toLowerCase())}
                        >
                            <Text className="text-center">{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View className="mb-4">
                <Text className="mb-1">Availability of Rack Cabinets for PBX, Gateways, and Switches:</Text>
                <View className="flex-row">
                    {['Yes', 'No'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            className={`flex-1 p-2 border rounded-lg mr-2 ${formData.rackCabinetsAvailability === option.toLowerCase() ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                            onPress={() => onFieldChange('rackCabinetsAvailability', option.toLowerCase())}
                        >
                            <Text className="text-center">{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Physical Infrastructure Assessment */}
            <Text className="text-lg font-bold mt-4 mb-2">PHYSICAL INFRASTRUCTURE ASSESSMENT</Text>
            <View className="mb-4">
                <Text className="mb-1">Mapping of Proposed Phone Locations by Department/Area:</Text>
                <TextInput
                    value={typeof formData.phoneLocationsMapping === 'string' ? formData.phoneLocationsMapping : ''}
                    onChangeText={(text) => onFieldChange('phoneLocationsMapping', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe phone locations mapping"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Condition and Availability of Structured Cabling Outlets:</Text>
                <TextInput
                    value={typeof formData.cablingOutletsCondition === 'string' ? formData.cablingOutletsCondition : ''}
                    onChangeText={(text) => onFieldChange('cablingOutletsCondition', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe condition and availability"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Wi-Fi Coverage Assessment (for Wireless Phones or Softphones if Applicable):</Text>
                <TextInput
                    value={typeof formData.wifiCoverageAssessment === 'string' ? formData.wifiCoverageAssessment : ''}
                    onChangeText={(text) => onFieldChange('wifiCoverageAssessment', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe Wi-Fi coverage assessment"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Cable Pathways and Trunking Infrastructure:</Text>
                <TextInput
                    value={typeof formData.cablePathways === 'string' ? formData.cablePathways : ''}
                    onChangeText={(text) => onFieldChange('cablePathways', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe cable pathways and trunking"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Distance Between Endpoints and Switches (Cable Run Feasibility):</Text>
                <TextInput
                    value={typeof formData.distanceEndpointsSwitches === 'string' ? formData.distanceEndpointsSwitches : ''}
                    onChangeText={(text) => onFieldChange('distanceEndpointsSwitches', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe distance and feasibility"
                    multiline
                />
            </View>

            {/* Network and Voice Quality Testing */}
            <Text className="text-lg font-bold mt-4 mb-2">NETWORK AND VOICE QUALITY TESTING</Text>
            <View className="mb-4">
                <Text className="mb-1">Ping, Latency, Jitter, and Packet Loss Testing:</Text>
                <TextInput
                    value={typeof formData.pingLatencyTesting === 'string' ? formData.pingLatencyTesting : ''}
                    onChangeText={(text) => onFieldChange('pingLatencyTesting', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe testing results"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Registration of Test IP Phones and SIP Parameters, etc.:</Text>
                <TextInput
                    value={typeof formData.testIpPhonesRegistration === 'string' ? formData.testIpPhonesRegistration : ''}
                    onChangeText={(text) => onFieldChange('testIpPhonesRegistration', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe registration and parameters"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Internal Call Testing (Extension to Extension):</Text>
                <TextInput
                    value={typeof formData.internalCallTesting === 'string' ? formData.internalCallTesting : ''}
                    onChangeText={(text) => onFieldChange('internalCallTesting', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter results (e.g., Good)"
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">External Call Testing (SIP/FXO Trunks):</Text>
                <TextInput
                    value={typeof formData.externalCallTesting === 'string' ? formData.externalCallTesting : ''}
                    onChangeText={(text) => onFieldChange('externalCallTesting', text)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Enter results (e.g., Good)"
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Estimation of Mean Opinion Score (MOS) or Voice Quality Assessment:</Text>
                <TextInput
                    value={typeof formData.mosEstimation === 'string' ? formData.mosEstimation : ''}
                    onChangeText={(text) => onFieldChange('mosEstimation', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe MOS or voice quality assessment"
                    multiline
                />
            </View>

            {/* Documentation and Records */}
            <Text className="text-lg font-bold mt-4 mb-2">DOCUMENTATION AND RECORDS</Text>
            <View className="mb-4">
                {['Photographic Evidence of Network Cabinets, Patch Panels, and Equipment', 'Floor Plan Annotations Indicating Rack and Phone Locations', 'Inventory of Existing IP Phones or Analog Devices', 'Notes on Existing System Challenges, User Feedback, or Known Issues', 'Licensing Requirements (SIP Trunks, PBX Subscriptions, Feature Licenses)'].map((doc) => (
                    <View key={doc} className="flex-row items-center mb-2">
                        <TouchableOpacity
                            className={`w-6 h-6 border rounded mr-2 ${formData[`doc_${doc.replace(/\s/g, '')}`] ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}
                            onPress={() => onFieldChange(`doc_${doc.replace(/\s/g, '')}`, !formData[`doc_${doc.replace(/\s/g, '')}`])}
                        >
                            {formData[`doc_${doc.replace(/\s/g, '')}`] && <MaterialIcons name="check" size={18} color="white" />}
                        </TouchableOpacity>
                        <Text>{doc}</Text>
                    </View>
                ))}
            </View>

            {/* Recommendations and Next Steps */}
            <Text className="text-lg font-bold mt-4 mb-2">RECOMMENDATIONS AND NEXT STEPS</Text>
            <View className="mb-4">
                <Text className="mb-1">Proposed PBX Model and Deployment Architecture:</Text>
                <TextInput
                    value={typeof formData.proposedPbxModel === 'string' ? formData.proposedPbxModel : ''}
                    onChangeText={(text) => onFieldChange('proposedPbxModel', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe proposed PBX model and architecture"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Suggested Number and Type of IP Phones:</Text>
                <TextInput
                    value={typeof formData.suggestedIpPhones === 'string' ? formData.suggestedIpPhones : ''}
                    onChangeText={(text) => onFieldChange('suggestedIpPhones', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe suggested IP phones"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Network Equipment Requirements (PoE Switches, Routers, SFPs, Media Converters):</Text>
                <TextInput
                    value={typeof formData.networkEquipmentRequirements === 'string' ? formData.networkEquipmentRequirements : ''}
                    onChangeText={(text) => onFieldChange('networkEquipmentRequirements', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe network equipment requirements"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Structured Cabling Adjustments (Where required):</Text>
                <TextInput
                    value={typeof formData.structuredCablingAdjustments === 'string' ? formData.structuredCablingAdjustments : ''}
                    onChangeText={(text) => onFieldChange('structuredCablingAdjustments', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe structured cabling adjustments"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">VLAN and QoS Configuration Enhancements:</Text>
                <TextInput
                    value={typeof formData.vlanQosEnhancements === 'string' ? formData.vlanQosEnhancements : ''}
                    onChangeText={(text) => onFieldChange('vlanQosEnhancements', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe VLAN and QoS enhancements"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Draft IP Addressing Scheme for VoIP Devices:</Text>
                <TextInput
                    value={typeof formData.draftIpAddressingScheme === 'string' ? formData.draftIpAddressingScheme : ''}
                    onChangeText={(text) => onFieldChange('draftIpAddressingScheme', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe draft IP addressing scheme"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">User Training, Documentation, and Ongoing Support Plans:</Text>
                <TextInput
                    value={typeof formData.userTrainingPlans === 'string' ? formData.userTrainingPlans : ''}
                    onChangeText={(text) => onFieldChange('userTrainingPlans', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Describe user training and support plans"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Observations:</Text>
                <TextInput
                    value={typeof formData.observations === 'string' ? formData.observations : ''}
                    onChangeText={(text) => onFieldChange('observations', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Enter observations"
                    multiline
                />
            </View>
            <View className="mb-4">
                <Text className="mb-1">Recommendations:</Text>
                <TextInput
                    value={typeof formData.recommendations === 'string' ? formData.recommendations : ''}
                    onChangeText={(text) => onFieldChange('recommendations', text)}
                    className="border border-gray-300 p-2 rounded h-20"
                    placeholder="Enter recommendations"
                    multiline
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
        </ScrollView>
    );
};

export default TelephonySurveyForm;
// UCCForm.tsx
import { Picker } from '@react-native-picker/picker';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Fixed import
import { BaseMaintenanceFormData, FormComponentProps } from './index'; // Import from index.tsx

export interface UCCFormData extends BaseMaintenanceFormData {
    periodType: string;
    subPeriod: string;
    year: string;
    sectionATasks: Record<string, string>;
    networkStatus: {
        wiredPorts: { total: string; working: string; faulty: string };
        wirelessAP: { total: string; working: string; faulty: string };
    };
    sectionBTasks: Record<string, string>;
    cameraStatus: {
        dome: string;
        bullet: string;
        ptz: string;
        working: string;
        faulty: string;
    };
    diskStatus: {
        hdd: string;
        ssd: string;
        working: string;
        faulty: string;
    };
    sectionCTasks: Record<string, string>;
    decoderStatus: {
        total: string;
        working: string;
        faulty: string;
    };
    sectionDTasks: Record<string, string>;
    diagnosisReport: string;
    customerContact: string; // Optional as per PDF
}

const UCCForm = ({
    formData,
    onFieldChange,
    customerSignature,
    seatecSignature,
    onShowCustomerSignatureModal,
    onShowSeatecSignatureModal,
    onClearCustomerSignature,
    onClearSeatecSignature
}: FormComponentProps) => {
    const uccData = (formData || {}) as UCCFormData; // Fallback to empty object
    const safeOnFieldChange = onFieldChange || (() => { }); // Fallback to no-op function

    const sectionATasks = [
        { id: 'coreSwitch', description: 'Check LED indicators for port/link/activity status' },
        { id: 'accessSwitches', description: 'Check all network switches for uptime, port activity, and temperature' },
        { id: 'wiredDataPoints', description: 'Test connectivity on random data points' },
        { id: 'patchPanels', description: 'Check for error/discard packets on interfaces' },
        { id: 'networkCabinets', description: 'Clean ports, air vents and fans for dust or oxidation' },
        { id: 'wiFiAccessPoints', description: 'Check Wi-Fi signal coverage and performance' },
        { id: 'rackManagement', description: 'Ensure proper labeling and cable management in rack' },
        { id: 'systemUpgradeChecks', description: 'Check for firmware updates or patching needs' },
        { id: 'inspectMounting', description: 'Inspect Mounting and Cabling for Physical Integrity' },
    ];

    const sectionBNVRTasks = [
        { id: 'nvrRecording', description: 'Verify recording for all camera channels' },
        { id: 'nvrDiskHealth', description: 'Check Disk(s) health and available storage space' },
        { id: 'nvrDateSync', description: 'Confirm date/time synchronization' },
        { id: 'nvrFirmware', description: 'Update firmware and backup configuration' },
        { id: 'nvrCleanFan', description: 'Clean fan and inspect for overheating' },
    ];

    const sectionBIPCameraTasks = [
        { id: 'ipLiveFeed', description: 'Check live video feed and Image clarity' },
        { id: 'ipCleanLens', description: 'Clean camera lens and check for obstructions' },
        { id: 'ipInspectCabling', description: 'Inspect Cabling and RJ45 connectors' },
        { id: 'ipMotionDetection', description: 'Confirm motion detection or event triggers' },
        { id: 'ipPoe', description: 'Validate PoE functionality or power supply status' },
    ];

    const sectionCDSTVDishTasks = [
        { id: 'dstvAlignment', description: 'Inspect alignment and mounting stability' },
        { id: 'dstvCleanSurface', description: 'Clean surface and check for rust or Corrosion' },
        { id: 'dstvInspectLNB', description: 'Inspect dish alignment and LNB' },
    ];

    const sectionCDecoderTasks = [
        { id: 'decoderBooting', description: 'Confirm decoder is booting and operating correctly' },
        { id: 'decoderChannels', description: 'Confirm all channels are accessible and decoder responsive' },
        { id: 'decoderFirmware', description: 'Check for firmware updates and Signal Quality' },
        { id: 'decoderHdmi', description: 'Inspect HDMI/AV output and remote-control functionality' },
    ];

    const sectionCCablingTasks = [
        { id: 'cablingCoaxial', description: 'Inspect coaxial connections and F-connectors' },
        { id: 'cablingWaterIngress', description: 'Check for water ingress or wear on exposed cabling' },
    ];

    const sectionDDisplayTasks = [
        { id: 'displayClarity', description: 'Test screen/projector Image clarity and brightness' },
        { id: 'displayFunctionality', description: 'Test display projection/TV functionality' },
        { id: 'displayInputs', description: 'Check input sources (HDMI, VGA, Wireless Casting)' },
        { id: 'displayVC', description: 'Test video conferencing platform (Zoom, Teams, etc.)' },
        { id: 'displayClean', description: 'Clean display surface and filters' },
    ];

    const sectionDAudioTasks = [
        { id: 'audioMics', description: 'Check microphones (wired/wireless)' },
        { id: 'audioPerformance', description: 'Inspect microphone and speaker performance' },
        { id: 'audioSpeakers', description: 'Test ceiling/panel speakers and mixer levels' },
        { id: 'audioDsp', description: 'Verify DSP processing and mute controls' },
    ];

    const sectionDControlTasks = [
        { id: 'controlPanel', description: 'Verify control panel or touchpad functions properly' },
        { id: 'controlTouch', description: 'Test touch panel or remote-control interface' },
        { id: 'controlPresets', description: 'Confirm programmed presets and switching automation' },
        { id: 'controlNetwork', description: 'Validate network connectivity (IP-based Control)' },
    ];

    const sectionDConnectivityTasks = [
        { id: 'connectPorts', description: 'Check all input ports and connectivity with laptops' },
        { id: 'connectCallSystems', description: 'Test conference call systems (VC platforms, USB integration)' },
        { id: 'connectCabling', description: 'Inspect cabling and patch points (HD-BaseT, Audio links)' },
        { id: 'connectFirmware', description: 'Confirm firmware is up to date on all equipment' },
    ];

    let subOptions: string[] = [];
    if (uccData.periodType === 'Month') {
        subOptions = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
    } else if (uccData.periodType === 'Quarter') {
        subOptions = ['1st', '2nd', '3rd', '4th'];
    } else if (uccData.periodType === 'Bi-annual') {
        subOptions = ['1st', '2nd'];
    }

    // Function to get unique dropdown options based on task description
    const getDropdownOptions = (description: string) => {
        if (description.toLowerCase().includes('clean')) {
            return ['', 'Cleaned', 'Not Cleaned', 'N/A'];
        } else if (description.toLowerCase().includes('check') || description.toLowerCase().includes('test') || description.toLowerCase().includes('inspect') || description.toLowerCase().includes('verify') || description.toLowerCase().includes('confirm') || description.toLowerCase().includes('validate')) {
            return ['', 'Checked', 'Not Checked', 'Tested', 'Not Tested', 'Done', 'Not Done', 'N/A'];
        } else if (description.toLowerCase().includes('update') || description.toLowerCase().includes('ensure')) {
            return ['', 'Done', 'Not Done', 'N/A'];
        } else {
            return ['', 'Done', 'Not Done', 'N/A']; // Default
        }
    };

    return (
        <View className="bg-white rounded-2xl p-6 shadow-md mb-6">
            {/* Customer Information */}
            <Text className="text-xl font-bold mb-4 text-gray-800">Customer Information</Text>

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">Customer Name *</Text>
                <TextInput
                    value={uccData.customerName}
                    onChangeText={(text) => onFieldChange('customerName', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Enter customer name"
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">Office Location *</Text>
                <TextInput
                    value={uccData.officeLocation}
                    onChangeText={(text) => onFieldChange('officeLocation', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Enter office location"
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">Maintenance Frequency *</Text>
                <View className="border border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
                    <Picker
                        selectedValue={uccData.periodType}
                        onValueChange={(value: string) => {
                            onFieldChange('periodType', value);
                            onFieldChange('subPeriod', '');
                        }}
                    >
                        <Picker.Item label="Select Frequency" value="" />
                        <Picker.Item label="Monthly" value="Month" />
                        <Picker.Item label="Quarterly" value="Quarter" />
                        <Picker.Item label="Bi-annual" value="Bi-annual" />
                    </Picker>
                </View>
            </View>

            {uccData.periodType && (
                <View className="mb-4">
                    <Text className="mb-1 font-semibold text-gray-700">Period *</Text>
                    <View className="border border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
                        <Picker
                            selectedValue={uccData.subPeriod}
                            onValueChange={(value: string) => onFieldChange('subPeriod', value)}
                        >
                            <Picker.Item label="Select Period" value="" />
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
                    value={uccData.year}
                    onChangeText={(text) => onFieldChange('year', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Enter year, e.g., 2025"
                    keyboardType="numeric"
                />
            </View>

            {/* Section A: LAN/WAN Infrastructure */}
            <Text className="text-xl font-bold mb-4 text-gray-800">Section A: LAN/WAN Infrastructure</Text>
            {sectionATasks.map((task) => (
                <View key={task.id} className="mb-3 p-3 bg-gray-50 rounded-lg shadow-sm">
                    <Text className="text-gray-700 mb-2">{task.description}</Text>
                    <View className="border border-gray-300 rounded-lg bg-white overflow-hidden">
                        <Picker
                            selectedValue={uccData.sectionATasks?.[task.id] || ''}
                            onValueChange={(value) => onFieldChange(task.id, value, 'sectionATasks')}
                        >
                            {getDropdownOptions(task.description).map((opt) => (
                                <Picker.Item key={opt} label={opt} value={opt} />
                            ))}
                        </Picker>
                    </View>
                </View>
            ))}

            <View className="mb-4">
                <Text className="mb-2 font-semibold text-gray-700">Total No. of Wired Data Ports</Text>
                <View className="flex-row space-x-2">
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">Total</Text>
                        <TextInput
                            value={uccData.networkStatus?.wiredPorts?.total || ''}
                            onChangeText={(text) => onFieldChange('total', text, 'networkStatus', 'wiredPorts')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">Working</Text>
                        <TextInput
                            value={uccData.networkStatus?.wiredPorts?.working || ''}
                            onChangeText={(text) => onFieldChange('working', text, 'networkStatus', 'wiredPorts')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">Faulty</Text>
                        <TextInput
                            value={uccData.networkStatus?.wiredPorts?.faulty || ''}
                            onChangeText={(text) => onFieldChange('faulty', text, 'networkStatus', 'wiredPorts')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                </View>
            </View>

            <View className="mb-4">
                <Text className="mb-2 font-semibold text-gray-700">Total No. of Wireless Access Points</Text>
                <View className="flex-row space-x-2">
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">Total</Text>
                        <TextInput
                            value={uccData.networkStatus?.wirelessAP?.total || ''}
                            onChangeText={(text) => onFieldChange('total', text, 'networkStatus', 'wirelessAP')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">Working</Text>
                        <TextInput
                            value={uccData.networkStatus?.wirelessAP?.working || ''}
                            onChangeText={(text) => onFieldChange('working', text, 'networkStatus', 'wirelessAP')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">Faulty</Text>
                        <TextInput
                            value={uccData.networkStatus?.wirelessAP?.faulty || ''}
                            onChangeText={(text) => onFieldChange('faulty', text, 'networkStatus', 'wirelessAP')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                </View>
            </View>

            {/* Section B: CCTV - IP Surveillance System */}
            <Text className="text-xl font-bold mb-4 text-gray-800">Section B: CCTV - IP Surveillance System</Text>
            <Text className="text-lg font-semibold mb-2 text-gray-800">NVR</Text>
            {sectionBNVRTasks.map((task) => (
                <View key={task.id} className="mb-3 p-3 bg-gray-50 rounded-lg shadow-sm">
                    <Text className="text-gray-700 mb-2">{task.description}</Text>
                    <View className="border border-gray-300 rounded-lg bg-white overflow-hidden">
                        <Picker
                            selectedValue={uccData.sectionBTasks?.[task.id] || ''}
                            onValueChange={(value) => onFieldChange(task.id, value, 'sectionBTasks')}
                        >
                            {getDropdownOptions(task.description).map((opt) => (
                                <Picker.Item key={opt} label={opt} value={opt} />
                            ))}
                        </Picker>
                    </View>
                </View>
            ))}

            <Text className="text-lg font-semibold mb-2 text-gray-800">IP Cameras</Text>
            {sectionBIPCameraTasks.map((task) => (
                <View key={task.id} className="mb-3 p-3 bg-gray-50 rounded-lg shadow-sm">
                    <Text className="text-gray-700 mb-2">{task.description}</Text>
                    <View className="border border-gray-300 rounded-lg bg-white overflow-hidden">
                        <Picker
                            selectedValue={uccData.sectionBTasks?.[task.id] || ''}
                            onValueChange={(value) => onFieldChange(task.id, value, 'sectionBTasks')}
                        >
                            {getDropdownOptions(task.description).map((opt) => (
                                <Picker.Item key={opt} label={opt} value={opt} />
                            ))}
                        </Picker>
                    </View>
                </View>
            ))}

            <View className="mb-4">
                <Text className="mb-2 font-semibold text-gray-700">Total No. of IP Camera</Text>
                <View className="flex-row space-x-2">
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">Dome</Text>
                        <TextInput
                            value={uccData.cameraStatus?.dome || ''}
                            onChangeText={(text) => onFieldChange('dome', text, 'cameraStatus')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">Bullet</Text>
                        <TextInput
                            value={uccData.cameraStatus?.bullet || ''}
                            onChangeText={(text) => onFieldChange('bullet', text, 'cameraStatus')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">PTZ</Text>
                        <TextInput
                            value={uccData.cameraStatus?.ptz || ''}
                            onChangeText={(text) => onFieldChange('ptz', text, 'cameraStatus')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                </View>
                <View className="flex-row space-x-2 mt-2">
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">Working</Text>
                        <TextInput
                            value={uccData.cameraStatus?.working || ''}
                            onChangeText={(text) => onFieldChange('working', text, 'cameraStatus')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">Faulty</Text>
                        <TextInput
                            value={uccData.cameraStatus?.faulty || ''}
                            onChangeText={(text) => onFieldChange('faulty', text, 'cameraStatus')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                </View>
            </View>

            <View className="mb-4">
                <Text className="mb-2 font-semibold text-gray-700">Total No. of Disk Storage</Text>
                <View className="flex-row space-x-2">
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">HDD</Text>
                        <TextInput
                            value={uccData.diskStatus?.hdd || ''}
                            onChangeText={(text) => onFieldChange('hdd', text, 'diskStatus')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">SSD</Text>
                        <TextInput
                            value={uccData.diskStatus?.ssd || ''}
                            onChangeText={(text) => onFieldChange('ssd', text, 'diskStatus')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                </View>
                <View className="flex-row space-x-2 mt-2">
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">Working</Text>
                        <TextInput
                            value={uccData.diskStatus?.working || ''}
                            onChangeText={(text) => onFieldChange('working', text, 'diskStatus')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">Faulty</Text>
                        <TextInput
                            value={uccData.diskStatus?.faulty || ''}
                            onChangeText={(text) => onFieldChange('faulty', text, 'diskStatus')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                </View>
            </View>

            {/* Section C: DSTV System */}
            <Text className="text-xl font-bold mb-4 text-gray-800">Section C: DSTV System (Decoders, Dish, Cabling)</Text>
            <Text className="text-lg font-semibold mb-2 text-gray-800">DSTV Dish</Text>
            {sectionCDSTVDishTasks.map((task) => (
                <View key={task.id} className="mb-3 p-3 bg-gray-50 rounded-lg shadow-sm">
                    <Text className="text-gray-700 mb-2">{task.description}</Text>
                    <View className="border border-gray-300 rounded-lg bg-white overflow-hidden">
                        <Picker
                            selectedValue={uccData.sectionCTasks?.[task.id] || ''}
                            onValueChange={(value) => onFieldChange(task.id, value, 'sectionCTasks')}
                        >
                            {getDropdownOptions(task.description).map((opt) => (
                                <Picker.Item key={opt} label={opt} value={opt} />
                            ))}
                        </Picker>
                    </View>
                </View>
            ))}

            <Text className="text-lg font-semibold mb-2 text-gray-800">Decoder</Text>
            {sectionCDecoderTasks.map((task) => (
                <View key={task.id} className="mb-3 p-3 bg-gray-50 rounded-lg shadow-sm">
                    <Text className="text-gray-700 mb-2">{task.description}</Text>
                    <View className="border border-gray-300 rounded-lg bg-white overflow-hidden">
                        <Picker
                            selectedValue={uccData.sectionCTasks?.[task.id] || ''}
                            onValueChange={(value) => onFieldChange(task.id, value, 'sectionCTasks')}
                        >
                            {getDropdownOptions(task.description).map((opt) => (
                                <Picker.Item key={opt} label={opt} value={opt} />
                            ))}
                        </Picker>
                    </View>
                </View>
            ))}

            <Text className="text-lg font-semibold mb-2 text-gray-800">Cabling</Text>
            {sectionCCablingTasks.map((task) => (
                <View key={task.id} className="mb-3 p-3 bg-gray-50 rounded-lg shadow-sm">
                    <Text className="text-gray-700 mb-2">{task.description}</Text>
                    <View className="border border-gray-300 rounded-lg bg-white overflow-hidden">
                        <Picker
                            selectedValue={uccData.sectionCTasks?.[task.id] || ''}
                            onValueChange={(value) => onFieldChange(task.id, value, 'sectionCTasks')}
                        >
                            {getDropdownOptions(task.description).map((opt) => (
                                <Picker.Item key={opt} label={opt} value={opt} />
                            ))}
                        </Picker>
                    </View>
                </View>
            ))}

            <View className="mb-4">
                <Text className="mb-2 font-semibold text-gray-700">Total No. of Decoder</Text>
                <View className="flex-row space-x-2">
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">Total</Text>
                        <TextInput
                            value={uccData.decoderStatus?.total || ''}
                            onChangeText={(text) => onFieldChange('total', text, 'decoderStatus')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">Working</Text>
                        <TextInput
                            value={uccData.decoderStatus?.working || ''}
                            onChangeText={(text) => onFieldChange('working', text, 'decoderStatus')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">Faulty</Text>
                        <TextInput
                            value={uccData.decoderStatus?.faulty || ''}
                            onChangeText={(text) => onFieldChange('faulty', text, 'decoderStatus')}
                            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm"
                            placeholder="Count"
                            keyboardType="numeric"
                        />
                    </View>
                </View>
            </View>

            {/* Section D: Conference Room AV System */}
            <Text className="text-xl font-bold mb-4 text-gray-800">Section D: Conference Room AV System (Audio, Display, Control System – for 3 Rooms)</Text>
            <Text className="text-lg font-semibold mb-2 text-gray-800">Display System</Text>
            {sectionDDisplayTasks.map((task) => (
                <View key={task.id} className="mb-3 p-3 bg-gray-50 rounded-lg shadow-sm">
                    <Text className="text-gray-700 mb-2">{task.description}</Text>
                    <View className="border border-gray-300 rounded-lg bg-white overflow-hidden">
                        <Picker
                            selectedValue={uccData.sectionDTasks?.[task.id] || ''}
                            onValueChange={(value) => onFieldChange(task.id, value, 'sectionDTasks')}
                        >
                            {getDropdownOptions(task.description).map((opt) => (
                                <Picker.Item key={opt} label={opt} value={opt} />
                            ))}
                        </Picker>
                    </View>
                </View>
            ))}

            <Text className="text-lg font-semibold mb-2 text-gray-800">Audio System</Text>
            {sectionDAudioTasks.map((task) => (
                <View key={task.id} className="mb-3 p-3 bg-gray-50 rounded-lg shadow-sm">
                    <Text className="text-gray-700 mb-2">{task.description}</Text>
                    <View className="border border-gray-300 rounded-lg bg-white overflow-hidden">
                        <Picker
                            selectedValue={uccData.sectionDTasks?.[task.id] || ''}
                            onValueChange={(value) => onFieldChange(task.id, value, 'sectionDTasks')}
                        >
                            {getDropdownOptions(task.description).map((opt) => (
                                <Picker.Item key={opt} label={opt} value={opt} />
                            ))}
                        </Picker>
                    </View>
                </View>
            ))}

            <Text className="text-lg font-semibold mb-2 text-gray-800">Control System</Text>
            {sectionDControlTasks.map((task) => (
                <View key={task.id} className="mb-3 p-3 bg-gray-50 rounded-lg shadow-sm">
                    <Text className="text-gray-700 mb-2">{task.description}</Text>
                    <View className="border border-gray-300 rounded-lg bg-white overflow-hidden">
                        <Picker
                            selectedValue={uccData.sectionDTasks?.[task.id] || ''}
                            onValueChange={(value) => onFieldChange(task.id, value, 'sectionDTasks')}
                        >
                            {getDropdownOptions(task.description).map((opt) => (
                                <Picker.Item key={opt} label={opt} value={opt} />
                            ))}
                        </Picker>
                    </View>
                </View>
            ))}

            <Text className="text-lg font-semibold mb-2 text-gray-800">Connectivity</Text>
            {sectionDConnectivityTasks.map((task) => (
                <View key={task.id} className="mb-3 p-3 bg-gray-50 rounded-lg shadow-sm">
                    <Text className="text-gray-700 mb-2">{task.description}</Text>
                    <View className="border border-gray-300 rounded-lg bg-white overflow-hidden">
                        <Picker
                            selectedValue={uccData.sectionDTasks?.[task.id] || ''}
                            onValueChange={(value) => onFieldChange(task.id, value, 'sectionDTasks')}
                        >
                            {getDropdownOptions(task.description).map((opt) => (
                                <Picker.Item key={opt} label={opt} value={opt} />
                            ))}
                        </Picker>
                    </View>
                </View>
            ))}

            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">Diagnosis Report (Faulty Cabling / Faulty Device)</Text>
                <TextInput
                    value={uccData.diagnosisReport}
                    onChangeText={(text) => onFieldChange('diagnosisReport', text)}
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50 h-32"
                    placeholder="Enter diagnosis report"
                    multiline
                />
            </View>

            {/* Hours Spent */}
            <View className="mb-4">
                <Text className="mb-1 font-semibold text-gray-700">Hours Spent on the Job *</Text>
                <TextInput
                    value={uccData.hoursSpent}
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
                    <Text className="font-bold mb-2 text-gray-800">E. Customer Representative *</Text>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Date Commenced *</Text>
                        <TextInput
                            value={uccData.customerDate}
                            onChangeText={(text) => onFieldChange('customerDate', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="YYYY-MM-DD"
                        />
                    </View>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Full Name *</Text>
                        <TextInput
                            value={uccData.customerRepName}
                            onChangeText={(text) => onFieldChange('customerRepName', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="Enter full name"
                        />
                    </View>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Position *</Text>
                        <TextInput
                            value={uccData.customerPosition}
                            onChangeText={(text) => onFieldChange('customerPosition', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="Enter position"
                        />
                    </View>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Contact</Text>
                        <TextInput
                            value={uccData.customerContact}
                            onChangeText={(text) => onFieldChange('customerContact', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="Enter contact"
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
                    <Text className="font-bold mb-2 text-gray-800">F. SEATEC Representative *</Text>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Date Completed *</Text>
                        <TextInput
                            value={uccData.seatecDate}
                            onChangeText={(text) => onFieldChange('seatecDate', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="YYYY-MM-DD"
                        />
                    </View>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Tech. Personnel (s) *</Text>
                        <TextInput
                            value={uccData.seatecRepName}
                            onChangeText={(text) => onFieldChange('seatecRepName', text)}
                            className="border border-gray-300 p-2 rounded-md bg-white"
                            placeholder="Enter name(s)"
                        />
                    </View>
                    <View className="mb-3">
                        <Text className="mb-1 font-semibold text-gray-700 text-sm">Position *</Text>
                        <TextInput
                            value={uccData.seatecPosition}
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

export default UCCForm;
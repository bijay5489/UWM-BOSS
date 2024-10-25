import React, {useEffect, useState} from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/navigation/NavigationTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import ThemedText from '@/components/ThemedText';

type GenerateReportNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const GenerateReport: React.FC = () => {
    const navigation = useNavigation<GenerateReportNavigationProp>();

    const [reportType, setReportType] = useState('');
    const [context, setContext] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [rides, setRides] = useState<{ id: number; name: string }[]>([]);
    const [selectedRideId, setSelectedRideId] = useState('');

    // Function to fetch rides for the current rider
    const fetchRides = async () => {
        const riderId = await AsyncStorage.getItem('riderId'); // Assuming you store rider ID in AsyncStorage
        if (!riderId) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/rides/get-by-rider-id/${riderId}/`);
            const data = await response.json();
            // Assuming the API returns a list of rides in the expected format
            setRides(data.map((ride: { id: any; }) => ({ id: ride.id, name: `Ride ID: ${ride.id}` })));
        } catch (error) {
            console.error("Error fetching rides:", error);
        }
    };

    // Fetch rides when the component mounts
    useEffect(() => {
        fetchRides();
    }, []);

    const handleGenerateReport = async () => {
        const reporter = await AsyncStorage.getItem('username');
        if (!reporter || !reportType || !context || !selectedRideId) {
            setErrorMessage('All fields are required.');
            return;
        }

        const reportData = {
            reporter,
            report_type: reportType,
            context,
            ride_id: selectedRideId, // Include the selected ride ID in the report data
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/report/generateReport/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reportData),
            });

            const data = await response.json();

            if (response.status === 201) {
                alert('Report created successfully');
                navigation.goBack();
            } else {
                setErrorMessage(data.message || 'Failed to create report');
            }
        } catch (error) {
            setErrorMessage('An error occurred while submitting the report');
        }
    };

    return (
        <View style={styles.container}>
            <RNPickerSelect
                onValueChange={(value: React.SetStateAction<string>) => setReportType(value)}
                items={[
                    { label: 'Safety Issue', value: 'safety' },
                    { label: 'Service Issue', value: 'service' },
                    { label: 'Delay', value: 'delay' },
                    { label: 'Vehicle Condition', value: 'vehicle' },
                    { label: 'Other', value: 'other' },
                ]}
                placeholder={{ label: 'Select Report Type', value: '' }}
                style={pickerSelectStyles}
            />

            <RNPickerSelect
                onValueChange={(value: React.SetStateAction<string>) => setSelectedRideId(value)}
                items={rides.map(ride => ({ label: ride.name, value: ride.id.toString() }))}
                placeholder={{ label: 'Select Ride', value: '' }}
                style={pickerSelectStyles}
            />

            <TextInput
                placeholder="Enter report details"
                value={context}
                onChangeText={setContext}
                style={styles.input}
                multiline
            />

            {errorMessage && <ThemedText type="error" style={styles.errorText}>{errorMessage}</ThemedText>}

            <TouchableOpacity onPress={handleGenerateReport} style={styles.submitButton}>
                <Text style={styles.submitText}>Submit Report</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: 'white', justifyContent: 'center' },
    inputContainer: { marginBottom: 30 },
    input: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
    },
    errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
    submitButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    submitText: { color: 'white' },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        marginBottom: 15,
    },
    inputAndroid: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        marginBottom: 15,
    },
});

export default GenerateReport;
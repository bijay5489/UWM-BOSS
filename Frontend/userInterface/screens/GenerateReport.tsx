import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '@/components/navigation/NavigationTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomDropdown from '@/components/CustomDropdown';
import ThemedText from '@/components/ThemedText';
import {Ionicons} from "@expo/vector-icons";

type GenerateReportNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const GenerateReport: React.FC = () => {
    const navigation = useNavigation<GenerateReportNavigationProp>();

    const [reportType, setReportType] = useState('');
    const [context, setContext] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [rides, setRides] = useState<{ id: number; name: string }[]>([]);
    const [selectedRideId, setSelectedRideId] = useState('');

    useEffect(() => {
        const fetchRides = async () => {
            const riderId = await AsyncStorage.getItem('riderId');
            if (!riderId) return;

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/rides/get-by-rider-id/${riderId}/`);
                const data = await response.json();
                setRides(data.map((ride: {
                    id: number;
                    driverName: string;
                    pickup_location: string;
                    dropoff_location: string
                }) => ({
                    id: ride.id,
                    name: `Driver: ${ride.driverName} | Pickup: ${ride.pickup_location} | Dropoff: ${ride.dropoff_location}`,
                    driver: ride.driverName,
                    pickup: ride.pickup_location,
                    dropoff: ride.dropoff_location
                })));
            } catch (error) {
                console.error("Error fetching rides:", error);
            }
        };
        fetchRides();
    }, []);

    const handleGenerateReport = async () => {
        const reporter = await AsyncStorage.getItem('username');
        if (!reporter || !reportType || !context || !selectedRideId) {
            setErrorMessage('All fields are required.');
            return;
        }

        const reportData = {reporter, report_type: reportType, context, ride_id: selectedRideId};

        try {
            const response = await fetch('http://127.0.0.1:8000/api/report/generateReport/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
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
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle" size={30} color="black"/>
                </TouchableOpacity>
                <ThemedText type="title" style={styles.headerText}>Generate Report</ThemedText>
            </View>
            <View style={styles.dropdownContainer}>
                <CustomDropdown
                    items={[
                        {label: 'Safety Issue', value: 'safety'},
                        {label: 'Service Issue', value: 'service'},
                        {label: 'Delay', value: 'delay'},
                        {label: 'Vehicle Condition', value: 'vehicle'},
                        {label: 'Other', value: 'other'},
                    ]}
                    selectedValue={reportType}
                    onSelect={setReportType}
                    placeholder="Select Report Type"
                />
            </View>
            <View style={styles.dropdownContainer}>
                <CustomDropdown
                    items={rides.map(ride => ({label: ride.name, value: ride.id.toString()}))}
                    selectedValue={selectedRideId}
                    onSelect={setSelectedRideId}
                    placeholder="Select Ride"
                />
            </View>

            <TextInput
                placeholder="Enter report details"
                value={context}
                onChangeText={setContext}
                style={styles.input}
                multiline
            />

            {errorMessage && <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>}

            <TouchableOpacity onPress={handleGenerateReport} style={styles.submitButton}>
                <Text style={styles.submitText}>Submit Report</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20, backgroundColor: '#f4f4f8', justifyContent: 'center'},
    input: {
        height: 100,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    errorText: {color: 'red', textAlign: 'center', marginBottom: 15, fontWeight: 'bold'},
    submitButton: {
        backgroundColor: '#4a90e2',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {flexDirection: 'row', alignItems: 'center', marginBottom: 20,},
    headerText: {flex: 1, fontSize: 28, textAlign: 'center',},
    submitText: {color: 'white', fontWeight: '600'},
    dropdownContainer: {marginBottom: 20,},
});

export default GenerateReport;

import React, {useCallback, useEffect, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '@/components/navigation/NavigationTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomDropdown from '@/components/CustomDropdown';
import ThemedText from '@/components/ThemedText';
import {Ionicons} from "@expo/vector-icons";
import baseStyles from '../styles/General';
import reportStyles from '../styles/Report';
import settingsStyles from '../styles/Settings'

const styles = { ...baseStyles, ...reportStyles, ...settingsStyles };

type GenerateReportNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Ride = {
    id: string;
    riderName: string;
    driverName: string;
    van: string;
    pickup_location: string;
    dropoff_location: string;
    passengers: string;
    status: string;
    reason: string;
    name: string;
};

const GenerateReport: React.FC = () => {
    const navigation = useNavigation<GenerateReportNavigationProp>();
    const [reportType, setReportType] = useState('');
    const [context, setContext] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [rides, setRides] = useState<Ride[]>([]);
    const [selectedRideId, setSelectedRideId] = useState('');
    const [id, setId] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            const fetchRides = async () => {
                const riderId = await AsyncStorage.getItem('riderId');
                const rideID = await AsyncStorage.getItem('ride_id_report');
                setId(rideID);
                if(rideID) setSelectedRideId(rideID);
                if (!riderId) return;

                try {
                    const response = await fetch(`http://127.0.0.1:8000/api/rides/get-by-rider-id/${riderId}/`);
                    const data = await response.json();
                    setRides(data);
                } catch (error) {
                    console.error("Error fetching rides:", error);
                }
            };
            fetchRides();
        }, [])
    );
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
            {!id && (
                <View style={styles.dropdownContainer}>
                    <CustomDropdown
                        items={rides.map(ride => ({
                            label: `${ride.driverName} \nVan: ${ride.van} \nPickup_Location: ${ride.pickup_location}\nDropoff_Location: ${ride.dropoff_location}`,
                            value: ride.id
                        }))}
                        selectedValue={selectedRideId}
                        onSelect={setSelectedRideId}
                        placeholder="Select Ride"
                    />
                </View>
            )}

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

export default GenerateReport;

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import ThemedText from '../components/ThemedText';
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "@/components/navigation/NavigationTypes";
import {RouteProp, useNavigation} from "@react-navigation/native";

type DisplayRideInfoNavigationProp = StackNavigationProp<RootStackParamList, 'DisplayRideInfo'>;
type DisplayRideInfoProps = { route: RouteProp<RootStackParamList, 'DisplayRideInfo'>; };

const DisplayRideInfo: React.FC<DisplayRideInfoProps> = ({ route }) => {
    const navigation = useNavigation<DisplayRideInfoNavigationProp>();
    const { rideId, driverName } = route.params;
    const [rideInfo, setRideInfo] = useState({
        driver: '',
        pickupLocation: '',
        dropoffLocation: '',
        pickupTime: '',
    });

    useEffect(() => {
        fetchRideInfo();
    }, []);

    const fetchRideInfo = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/rides/get-by-id/${rideId}`);
            const data = await response.json();
            if (response.ok) {
                setRideInfo({
                    driver: driverName,
                    pickupLocation: data.pickup_location,
                    dropoffLocation: data.dropoff_location,
                    pickupTime: data.pickup_time,
                });
            } else {
                showAlert('Error', 'Failed to fetch ride information.');
            }
        } catch (error) {
            showAlert('Error', 'Failed to fetch ride information.');
        }
    };

    const showAlert = (title: string, message: string) => {
        if (Platform.OS === 'web') {
            window.alert(`${title}: ${message}`);
        } else {
            Alert.alert(title, message);
        }
    };

    const handleCancelRide = async () => {
        if (Platform.OS === 'web') {
            if(window.confirm("Are you sure? This action will delete your ride.")){
                cancelRide();
                showAlert("Ride Canceled", "Your ride has been canceled successfully.");
            }
        }
    };

    const cancelRide = async () => {
        try {
            await fetch(`http://127.0.0.1:8000/api/rides/delete/${rideId}`, {
                method: 'DELETE',
            });
            navigation.navigate('RiderDashboard');
        } catch (error) {
            console.error("Error deleting ride:", error);
        }
    };

    const handleMessageDriver = () => {
        // Add messaging logic here
    };

    return (
        <View style={styles.container}>
            <ThemedText style={styles.labelText}>Driver:</ThemedText>
            <ThemedText style={styles.infoText}>{rideInfo.driver}</ThemedText>

            <ThemedText style={styles.labelText}>Pickup Location:</ThemedText>
            <ThemedText style={styles.infoText}>{rideInfo.pickupLocation}</ThemedText>

            <ThemedText style={styles.labelText}>Dropoff Location:</ThemedText>
            <ThemedText style={styles.infoText}>{rideInfo.dropoffLocation}</ThemedText>

            <ThemedText style={styles.labelText}>Pickup Time:</ThemedText>
            <ThemedText style={styles.infoText}>{rideInfo.pickupTime}</ThemedText>

            <TouchableOpacity onPress={handleCancelRide} style={styles.cancelButton}>
            <ThemedText style={styles.buttonText}>Cancel Ride</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleMessageDriver} style={styles.messageButton}>
            <ThemedText style={styles.buttonText}>Message Driver</ThemedText>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    labelText: { fontSize: 16, fontWeight: 'bold', color: '#444', marginTop: 10 },
    infoText: { fontSize: 16, color: 'black', marginBottom: 10 },
    cancelButton: { backgroundColor: 'red', padding: 15, alignItems: 'center', borderRadius: 10, marginTop: 20 },
    messageButton: { backgroundColor: 'blue', padding: 15, alignItems: 'center', borderRadius: 10, marginTop: 10 },
    buttonText: { color: 'white', fontSize: 16 },
});

export default DisplayRideInfo;

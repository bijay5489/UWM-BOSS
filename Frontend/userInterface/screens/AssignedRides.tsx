import React, { useEffect, useState, useCallback } from 'react';
import {View, StyleSheet, TouchableOpacity,} from 'react-native';
import ThemedText from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/navigation/NavigationTypes'; 

type AssignedRidesNavigationProp = StackNavigationProp<RootStackParamList, 'AssignedRides'>;


const API_BASE_URL = 'http://127.0.0.1:8000/api';

const AssignedRides: React.FC = () => {
    const navigation = useNavigation<AssignedRidesNavigationProp>();
    const [ride, setRide] = useState({
        rider: '',
        pickup_location: '',
        dropoff_location: '',
        pickup_time: '',
        num_passengers: 0,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAssignedRides = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (!accessToken) {
                navigation.navigate('Login');
                return;
            }
            const storedUsername = await AsyncStorage.getItem('username');
            const response = await fetch(`${API_BASE_URL}/rides/get-by-driver-id/${storedUsername}/status/in_progress/`);
            const data = await response.json();
            if (response.ok) {
                setRide({
                    rider: data.riderName,
                    pickup_location: data.pickup_location,
                    dropoff_location: data.dropoff_location,
                    pickup_time: data.pickup_time,
                    num_passengers: data.num_passengers,
                });
            } else {
                setRide({
                    rider: '',
                    pickup_location: '',
                    dropoff_location: '',
                    pickup_time: '',
                    num_passengers: 0,
                });
            }
        } catch (err) {
            console.error('Error fetching assigned rides:', err);
        } finally {
            setLoading(false);
        }
    }, [navigation]);

    useEffect(() => {
        fetchAssignedRides();
    }, [fetchAssignedRides]);

    const handleMessageRider = () => {
        // Add messaging logic here
    };

    const handleEndRide = () => {

    }

    return (
        <View style={styles.container}>
            {loading ? (
                <ThemedText>Loading...</ThemedText>
            ) : ride.rider ? (
                <>
                    <ThemedText style={styles.labelText}>Rider:</ThemedText>
                    <ThemedText style={styles.infoText}>{ride.rider}</ThemedText>

                    <ThemedText style={styles.labelText}>Pickup Location:</ThemedText>
                    <ThemedText style={styles.infoText}>{ride.pickup_location}</ThemedText>

                    <ThemedText style={styles.labelText}>Dropoff Location:</ThemedText>
                    <ThemedText style={styles.infoText}>{ride.dropoff_location}</ThemedText>

                    <ThemedText style={styles.labelText}>Pickup Time:</ThemedText>
                    <ThemedText style={styles.infoText}>{ride.pickup_time}</ThemedText>

                    <ThemedText style={styles.labelText}>Number of Passengers:</ThemedText>
                    <ThemedText style={styles.infoText}>{ride.num_passengers}</ThemedText>

                    <TouchableOpacity onPress={handleEndRide} style={styles.endButton}>
                        <ThemedText style={styles.buttonText}>End Ride</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleMessageRider} style={styles.messageButton}>
                        <ThemedText style={styles.buttonText}>Message Rider</ThemedText>
                    </TouchableOpacity>
                </>
            ) : (
                <ThemedText style={styles.infoText}>No current ride.</ThemedText>
            )}

            {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20, backgroundColor: 'white'},
    emptyContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    buttonText: { color: 'white', fontSize: 16 },
    endButton: { backgroundColor: 'red', padding: 15, alignItems: 'center', borderRadius: 10, marginTop: 20 },
    messageButton: { backgroundColor: 'blue', padding: 15, alignItems: 'center', borderRadius: 10, marginTop: 10 },
    errorText: {color: 'red', textAlign: 'center', marginTop: 10},
    labelText: { fontSize: 16, fontWeight: 'bold', color: '#444', marginTop: 10 },
    infoText: { fontSize: 16, color: 'black', marginBottom: 10 },
});

export default AssignedRides;

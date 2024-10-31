import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/navigation/NavigationTypes';
import AsyncStorage from "@react-native-async-storage/async-storage";

type QueueScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Queue'>;
type QueuePositionScreenProps = { route: RouteProp<RootStackParamList, 'Queue'>; };

const QueuePositionScreen: React.FC<QueuePositionScreenProps> = ({ route }) => {
    const navigation = useNavigation<QueueScreenNavigationProp>();
    const { queuePosition, rideId, driverName } = route.params;
    const [currentPosition, setCurrentPosition] = useState(queuePosition);

    // Update queue position
    useEffect(() => {
        const interval = setInterval(() => {
            fetchQueuePosition();
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const fetchQueuePosition = async () => {
        try {
            const riderusername = await AsyncStorage.getItem('username');
            const response = await fetch(`http://127.0.0.1:8000/api/rides/queue-position/${riderusername}`);
            if(response.status === 202){
                window.alert("A driver has been assigned to your ride!")
                navigation.navigate('DisplayRideInfo', {rideId: rideId, driverName: driverName})
            }else if(response.status === 200) {
                const data = await response.json();
                setCurrentPosition(data.queue_position);
            }
        } catch (error) {
            console.error("Error fetching queue position:", error);
        }
    };

    const handleLeaveQueue = () => {
        // Web-compatible confirmation alert
        if (typeof window !== 'undefined' && window.confirm) {
            if (window.confirm("Are you sure? This action will delete your ride.")) {
                deleteRide();
            }
        } else {
            // Mobile-compatible alert
            Alert.alert(
                "Leave Queue",
                "Are you sure? This action will delete your ride.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "OK", onPress: deleteRide }
                ],
                { cancelable: true }
            );
        }
    };

    const deleteRide = async () => {
        try {
            await fetch(`http://127.0.0.1:8000/api/rides/delete/${rideId}`, {
                method: 'DELETE',
            });
            window.alert("Ride Deleted you have left the queue.");
            navigation.navigate('RiderDashboard');
        } catch (error) {
            console.error("Error deleting ride:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.queueText}>Queue Position</Text>
            <Text style={styles.positionText}>{currentPosition}</Text>
            {currentPosition === 1 && (
                <Text style={styles.nextRideText}>
                    Your ride is the next ride, but all our drivers are currently completing other rides.
                </Text>
            )}
            <TouchableOpacity onPress={handleLeaveQueue} style={styles.leaveQueueButton}>
                <Text style={styles.leaveQueueText}>Leave Queue</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    queueText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    positionText: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    leaveQueueButton: {
        backgroundColor: 'blue',
        padding: 15,
        alignItems: 'center',
        borderRadius: 5,
        width: '100%',
    },
    leaveQueueText: {
        color: 'white',
        fontSize: 18,
    },
    nextRideText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginVertical: 20,
    },
});

export default QueuePositionScreen;

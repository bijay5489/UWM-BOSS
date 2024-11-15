import React, {useEffect, useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '@/components/navigation/NavigationTypes';
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from '../styles/Queue';

type QueueScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Queue'>;
type QueuePositionScreenProps = { route: RouteProp<RootStackParamList, 'Queue'>; };

const QueuePositionScreen: React.FC<QueuePositionScreenProps> = ({route}) => {
    const navigation = useNavigation<QueueScreenNavigationProp>();
    const {queuePosition} = route.params;
    const [currentPosition, setCurrentPosition] = useState(queuePosition);
    const [ride_id, setRideId] = useState();

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
            const data = await response.json();
            if (response.status === 202) {
                window.alert("A driver has been assigned to your ride!")
                setRideId(data.ride_id)
                await AsyncStorage.setItem('inProgress', 'true');
                navigation.navigate('DisplayRideInfo', {rideId: data.ride_id, driverName: data.driver})
            } else if (response.status === 200) {
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
                    {text: "Cancel", style: "cancel"},
                    {text: "OK", onPress: deleteRide}
                ],
                {cancelable: true}
            );
        }
    };

    const deleteRide = async () => {
        try {
            await fetch(`http://127.0.0.1:8000/api/rides/delete/${ride_id}`, {
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

export default QueuePositionScreen;

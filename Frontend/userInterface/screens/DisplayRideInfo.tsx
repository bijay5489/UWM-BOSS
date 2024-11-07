import React, { useState, useEffect } from 'react';
import {View, TouchableOpacity, StyleSheet, Alert, Platform, Modal, TextInput} from 'react-native';
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
        const [isModalVisible, setIsModalVisible] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

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
                    pickupTime: new Date(data.pickup_time).toLocaleString(undefined, {dateStyle: 'medium', timeStyle: 'short',}),
                });
            } else {
                console.error('Error', 'Failed to fetch ride information.');
            }
        } catch (error) {
            console.error('Error', 'Failed to fetch ride information.');
        }
    };

    const showAlert = (title: string, message: string) => {
        if (Platform.OS === 'web') {
            window.alert(`${title}: ${message}`);
        } else {
            Alert.alert(title, message);
        }
    };

    const handleCancelRide = () => {
        setIsModalVisible(true); // Show the modal to provide a reason
    };

    const handleConfirmCancel = async () => {
        if (Platform.OS === 'web') {
            if(window.confirm("Are you sure? This action will cancel your ride.")){
                await cancelRide();
                showAlert("Ride Canceled", "Your ride has been canceled successfully.");
            }
        }else{
            await cancelRide();
        }
    };

    const cancelRide = async () => {
        try {
            const updatedInfo = { status: 'cancelled', reason: cancelReason }; // Update the status to "canceled"

            const response = await fetch(`http://127.0.0.1:8000/api/rides/edit/${rideId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedInfo),
            });

            if (response.ok) {
                navigation.navigate('RiderDashboard');
            } else {
                showAlert('Error', 'Failed to cancel ride.');
            }
        } catch (error) {
            console.error("Error canceling ride:", error);
        }
    };

    const handleCancelModal = () => {
        setIsModalVisible(false);
        setCancelReason('');
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

            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={handleCancelModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ThemedText style={styles.modalTitle}>Please provide a reason</ThemedText>
                        <TextInput
                            value={cancelReason}
                            onChangeText={setCancelReason}
                            placeholder="Enter cancellation reason"
                            style={styles.inputBox}
                            multiline
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={handleCancelModal} style={styles.modalButton}>
                                <ThemedText style={styles.buttonText}>Cancel</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleConfirmCancel} style={styles.modalButton}>
                                <ThemedText style={styles.buttonText}>Confirm</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    inputBox: { height: 100, borderColor: '#ddd', borderWidth: 1, borderRadius: 12, padding: 15, marginBottom: 20 },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
    modalButton: { backgroundColor: '#4a90e2', padding: 10, borderRadius: 10, flex: 1, marginHorizontal: 5, alignItems: 'center' },
});

export default DisplayRideInfo;

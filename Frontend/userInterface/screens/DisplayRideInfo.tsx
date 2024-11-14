import React, {useEffect, useState} from 'react';
import {Alert, Modal, Platform, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import ThemedText from '../components/ThemedText';
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "@/components/navigation/NavigationTypes";
import {RouteProp, useNavigation} from "@react-navigation/native";
import CustomDropdown from "@/components/CustomDropdown";
import {Ionicons} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";


type DisplayRideInfoNavigationProp = StackNavigationProp<RootStackParamList, 'DisplayRideInfo'>;
type DisplayRideInfoProps = { route: RouteProp<RootStackParamList, 'DisplayRideInfo'>; };

const DisplayRideInfo: React.FC<DisplayRideInfoProps> = ({route}) => {
    const navigation = useNavigation<DisplayRideInfoNavigationProp>();
    const {rideId, driverName} = route.params;
    const [rideInfo, setRideInfo] = useState({
        driver: '',
        pickupLocation: '',
        dropoffLocation: '',
        pickupTime: '',
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [showTextInput, setShowTextInput] = useState(false);
    const [ride_code, setRide_code] = useState<string | null>(null);

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
                    pickupTime: new Date(data.pickup_time).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                    }),
                });
                setRide_code(await AsyncStorage.getItem('ride_code'))
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
            if (window.confirm("Are you sure? This action will cancel your ride.")) {
                await cancelRide();
                showAlert("Ride Canceled", "Your ride has been canceled successfully.");
            }
        } else {
            await cancelRide();
        }
    };

    const cancelRide = async () => {
        try {
            const updatedInfo = {status: 'cancelled', reason: cancelReason}; // Update the status to "canceled"

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
    const handleSelectReason = (value: React.SetStateAction<string>) => {
        setCancelReason(value);
        if (value === 'other') {
            setCancelReason('');
            setShowTextInput(true);
        } else {
            setShowTextInput(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="title" style={styles.headerText}>Ride Details</ThemedText>
            </View>
            <ThemedText style={styles.labelText}>Driver:</ThemedText>
            <ThemedText style={styles.infoText}>{rideInfo.driver}</ThemedText>

            <ThemedText style={styles.labelText}>Pickup Location:</ThemedText>
            <ThemedText style={styles.infoText}>{rideInfo.pickupLocation}</ThemedText>

            <ThemedText style={styles.labelText}>Dropoff Location:</ThemedText>
            <ThemedText style={styles.infoText}>{rideInfo.dropoffLocation}</ThemedText>

            <ThemedText style={styles.labelText}>Pickup Time:</ThemedText>
            <ThemedText style={styles.infoText}>{rideInfo.pickupTime}</ThemedText>

            <ThemedText style={styles.labelText}>Ride Code: (Provide to the Driver upon ride completion)</ThemedText>
            <ThemedText style={styles.infoText}>{ride_code}</ThemedText>

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
                        <CustomDropdown
                            items={[
                                { label: 'Change of plans', value: 'change_of_plans' },
                                { label: 'Driver delay', value: 'driver_delay' },
                                { label: 'Found alternate transport', value: 'alternate_transport' },
                                { label: 'Other', value: 'other' },
                            ]}
                            selectedValue={cancelReason}
                            onSelect={handleSelectReason}
                            placeholder="Select a reason"
                        />
                        {showTextInput && (
                            <TextInput
                                value={cancelReason} // only use if "other" is selected
                                onChangeText={setCancelReason}
                                placeholder="Enter your reason"
                                style={styles.inputBox}
                                multiline
                            />
                        )}
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
    container: {flex: 1, padding: 20},
    labelText: {fontSize: 16, fontWeight: 'bold', color: '#444', marginTop: 10},
    infoText: {fontSize: 16, color: 'black', marginBottom: 10},
    cancelButton: {backgroundColor: 'red', padding: 15, alignItems: 'center', borderRadius: 10, marginTop: 20},
    messageButton: {backgroundColor: 'blue', padding: 15, alignItems: 'center', borderRadius: 10, marginTop: 10},
    buttonText: {color: 'white', fontSize: 16},
    modalContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'},
    modalContent: {width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10},
    modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
    inputBox: {height: 100, borderColor: '#ddd', borderWidth: 1, borderRadius: 12, padding: 15, marginBottom: 20, marginTop: 10},
    modalActions: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 10},
    modalButton: {
        backgroundColor: '#4a90e2',
        padding: 10,
        borderRadius: 10,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center'
    },
    header: {flexDirection: 'row', alignItems: 'center', marginBottom: 20,},
    headerText: {flex: 1, fontSize: 28, textAlign: 'center',},
});

export default DisplayRideInfo;

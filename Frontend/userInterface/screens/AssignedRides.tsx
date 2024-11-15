import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, Modal, Platform, TextInput, TouchableOpacity, View,} from 'react-native';
import ThemedText from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '@/components/navigation/NavigationTypes';
import {Ionicons} from "@expo/vector-icons";
import baseStyles from '../styles/General';
import rideStyles from '../styles/AssignedRide';

const styles = { ...baseStyles, ...rideStyles };

type AssignedRidesNavigationProp = StackNavigationProp<RootStackParamList, 'AssignedRides'>;


const API_BASE_URL = 'http://127.0.0.1:8000/api';

const AssignedRides: React.FC = () => {
    const navigation = useNavigation<AssignedRidesNavigationProp>();
    const [ride, setRide] = useState({
        id: '',
        rider: '',
        pickup_location: '',
        dropoff_location: '',
        pickup_time: '',
        num_passengers: 0,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [EndCode, setEndCode] = useState(['', '', '', '']);
    const [Message, setMessage] = useState<string | null>(null);
    const inputRefs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ];

    const fetchAssignedRides = useCallback(async () => {
        setLoading(true);
        setErrorMessage(null);
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (!accessToken) {
                navigation.navigate('Login');
                return;
            }
            const storedUsername = await AsyncStorage.getItem('username');
            const response = await fetch(`${API_BASE_URL}/rides/get-by-driver-id/${storedUsername}/status/in_progress/`);
            const data = await response.json();
            if (response.status === 200) {
                setRide({
                    id: data.id,
                    rider: data.riderName,
                    pickup_location: data.pickup_location,
                    dropoff_location: data.dropoff_location,
                    pickup_time: new Date(data.pickup_time).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                    }),
                    num_passengers: data.num_passengers,
                });
            } else {
                setRide({
                    id: '',
                    rider: '',
                    pickup_location: '',
                    dropoff_location: '',
                    pickup_time: '',
                    num_passengers: 0,
                });
            }
        } catch (err) {
            setMessage('Failed to connect. Please check your internet connection.');
        } finally {
            setLoading(false);
        }
    }, [navigation]);

    const endRide = async () => {
        const ride_code = await AsyncStorage.getItem('ride_code');
        const enteredCode = EndCode.join('');
        if (enteredCode != ride_code) {
            setMessage('Invalid Code!');
            return;
        }
        try {
            const updatedInfo = {status: 'completed'};

            const response = await fetch(`http://127.0.0.1:8000/api/rides/edit/${ride.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedInfo),
            });

            const data = await response.json();
            if (response.ok) {
                showAlert('Ride Ended', 'Ride completed successfully!');
                await AsyncStorage.setItem('inProgress', 'false');
                navigation.navigate('DriverDashboard');
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage('Failed to connect. Please check your internet connection.');
        }
    };

    const showAlert = (title: string, message: string) => {
        if (Platform.OS === 'web') {
            window.alert(`${title}: ${message}`);
        } else {
            Alert.alert(title, message);
        }
    };

    useEffect(() => {
        fetchAssignedRides();
    }, [fetchAssignedRides]);

    const handleMessageRider = () => {
        // Add messaging logic here
    };

    const handleEndRide = () => {
        setIsModalVisible(true);
    };

    const handleEndModal = () => {
        setIsModalVisible(false);
        setEndCode(['', '', '', '']);
        setMessage('');
    };
    const handleChangeText = (text: string, index: number) => {
        const newEndCode = [...EndCode];
        newEndCode[index] = text;
        setEndCode(newEndCode);
        if (text && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
        if (!text && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle" size={30} color="black"/>
                </TouchableOpacity>
                <ThemedText type="title" style={styles.headerText}>Current Ride</ThemedText>
            </View>
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

                    <Modal
                        transparent={true}
                        visible={isModalVisible}
                        animationType="fade"
                        onRequestClose={handleEndModal}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <ThemedText style={styles.modalTitle}>Please provide the code from rider</ThemedText>
                                <View style={styles.inputContainer}>
                                    {EndCode.map((digit, index) => (
                                        <TextInput
                                            key={index}
                                            value={digit}
                                            onChangeText={(text) => handleChangeText(text, index)}
                                            keyboardType="numeric"
                                            maxLength={1}
                                            style={styles.inputBox}
                                            ref={inputRefs[index]}
                                            textAlign="center"
                                            autoFocus={index === 0}
                                        />
                                    ))}
                                </View>
                                <View style={styles.modalActions}>
                                    {Message && <ThemedText style={styles.errorText}>{Message}</ThemedText>}
                                    <TouchableOpacity onPress={handleEndModal} style={styles.modalButton}>
                                        <ThemedText style={styles.buttonText}>Cancel</ThemedText>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={endRide} style={styles.modalButton}>
                                        <ThemedText style={styles.buttonText}>Confirm</ThemedText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </>
            ) : (
                <ThemedText style={styles.infoText}>No current ride.</ThemedText>
            )}

            {errorMessage && <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>}
        </View>
    );
};

export default AssignedRides;

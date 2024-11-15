import React, {useCallback, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import ThemedText from '../components/ThemedText';
import ThemedView from '../components/ThemedView';
import Card from '../components/Card';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '@/components/navigation/NavigationTypes';
import {Ionicons} from "@expo/vector-icons";
import styles from '../styles/Dashboard';

type RiderDashboardNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const RiderDashboard: React.FC = () => {
    const navigation = useNavigation<RiderDashboardNavigationProp>();
    const [username, setUsername] = useState<string | null>(null);
    const [inProgress, setInProgress] = useState<boolean>(false);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('accesstoken');
            await AsyncStorage.removeItem('refreshtoken');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error', 'An error occurred while logging out. Please try again.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            const checkLoginStatus = async () => {
                const accessToken = await AsyncStorage.getItem('accessToken');
                const storedUsername = await AsyncStorage.getItem('username'); // Retrieve username from AsyncStorage
                const progressStatus = await AsyncStorage.getItem('inProgress');
                setInProgress(progressStatus === 'true');
                if (!accessToken) {
                    navigation.navigate('Login');
                } else if (storedUsername) {
                    setUsername(storedUsername);
                }
            };
            checkLoginStatus();
        }, [])
    );

    const handleEdit = async () => {
        if (username) {
            navigation.navigate('UserEditInfo', {username});
        } else {
            console.error('Error', 'Username is not available.');
        }
    };

    const handleReport = async () => {
        navigation.navigate('GenerateReport');
    };

    const handleCreateRide = async () => {
        navigation.navigate('CreateRide');
    };

    const handleViewRide = async () => {
        const rideIdString = await AsyncStorage.getItem('ride_id_view');
        const driverName = await AsyncStorage.getItem('ride_driverName');

        const rideId = rideIdString !== null ? parseInt(rideIdString, 10) : null;

        if (rideId !== null && driverName !== null) {
            navigation.navigate('DisplayRideInfo', {rideId, driverName});
        }
    }

    return (
        <ThemedView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <ThemedText type="title" style={styles.title}>UWM Boss</ThemedText>
                    <ThemedText type="subtitle" style={styles.subtitle}>Rider View</ThemedText>
                    {inProgress && (
                        <TouchableOpacity onPress={handleViewRide}>
                            <Ionicons name="car-sport" size={30} color="black"/>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Cards Section */}
            <View style={styles.cardsContainer}>
                <Card
                    title="Request Ride"
                    description="Create a ride request"
                    buttonLabel="Request"
                    onPress={handleCreateRide}
                    iconName="bus"
                />
                <Card
                    title="Edit Information"
                    description="Edit your account information."
                    buttonLabel="Edit"
                    onPress={handleEdit}
                    iconName="person"
                />
                <Card
                    title="Generate Report"
                    description="Generate detailed reports on ride experience."
                    buttonLabel="Go"
                    onPress={handleReport}
                    iconName="document-text"
                />
            </View>

            {/* Log Out Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <ThemedText type="defaultSemiBold" style={styles.logoutText}>Log Out</ThemedText>
            </TouchableOpacity>
        </ThemedView>
    );
};

export default RiderDashboard;

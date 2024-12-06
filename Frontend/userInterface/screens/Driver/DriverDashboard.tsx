import React, {useEffect, useState} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import Card from '@/components/Card';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '@/components/navigation/NavigationTypes';
import styles from '../../styles/Dashboard';

type DriverDashboardNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const DriverDashboard: React.FC = () => {
    const navigation = useNavigation<DriverDashboardNavigationProp>();
    const [username, setUsername] = useState<string | null>(null);
    const [hasNotification, setHasNotification] = useState(false);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('accesstoken');
            await AsyncStorage.removeItem('refreshtoken');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Error', 'An error occurred while logging out. Please try again.');
        }
    };

    useEffect(() => {
        const checkLoginStatus = async () => {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const storedUsername = await AsyncStorage.getItem('username');
            if (!accessToken) {
                navigation.navigate('Login');
            } else if (storedUsername) {
                setUsername(storedUsername);
            }
        };
        const checkInProgressRide = async () => {
            const storedUsername = await AsyncStorage.getItem('username');
            if (storedUsername) {
                const response = await fetch(
                    `https://mohammadalsheikh.pythonanywhere.com/api/rides/get-by-driver-id/${storedUsername}/status/in_progress/`
                );
                if (response.status === 200) {
                    setHasNotification(true);
                } else {
                    setHasNotification(false);
                }
            }
        };

        checkLoginStatus();
        checkInProgressRide();
    }, []);

    const handleEdit = async () => {
        if (username) {
            navigation.navigate('UserEditInfo', {username});
        } else {
            Alert.alert('Error', 'Username is not available.');
        }
    };

    const handleReport = async () => {
        await AsyncStorage.setItem('driver', 'true');
        navigation.navigate('RideHistory');
    };

    const handleCheckRides = async () => {
        navigation.navigate('AssignedRides'); // Navigate to the screen that shows assigned rides
    };

    return (
        <ThemedView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <ThemedText type="title" style={styles.title}>
                        UWM Boss
                    </ThemedText>
                    <ThemedText type="subtitle" style={styles.subtitle}>
                        Driver View
                    </ThemedText>
                </View>
            </View>

            {/* Cards Section */}
            <View style={styles.cardsContainer}>
                <View style={styles.cardWrapper}>
                    <Card
                        title="My Ride"
                        description="View and manage your assigned ride."
                        buttonLabel="Check"
                        onPress={handleCheckRides}
                        iconName="bus"
                    />
                    {hasNotification && (
                        <View style={styles.notificationCircle} />
                    )}
                </View>
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
                <ThemedText type="defaultSemiBold" style={styles.logoutText}>
                    Log Out
                </ThemedText>
            </TouchableOpacity>
        </ThemedView>
    );
};

export default DriverDashboard;

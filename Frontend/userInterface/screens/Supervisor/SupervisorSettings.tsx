import React, {useCallback, useState} from 'react';
import {ActivityIndicator, Alert, TouchableOpacity, View} from 'react-native';
import ThemedText from '../../components/ThemedText';
import ThemedView from '../../components/ThemedView';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '@/components/navigation/NavigationTypes';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import settingsStyles from '../../styles/Settings';
import baseStyles from '../../styles/General';

const styles = { ...baseStyles, ...settingsStyles };

type SettingsNavigationProp = StackNavigationProp<RootStackParamList, 'SupervisorSettings'>;

const SupervisorSettings: React.FC = () => {
    const navigation = useNavigation<SettingsNavigationProp>();
    const [username, setUsername] = useState<string | null>(null);
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone_number: '',
        address: '',
        user_type: '',
    });
    const [loading, setLoading] = useState<boolean>(false);

    const fetchUserDetails = async (username: string) => {
        setLoading(true);
        try {
            const response = await fetch(`https://mohammadalsheikh.pythonanywhere.com/api/manage-users/?username=${username}`);
            const data = await response.json();
            if (response.ok && data.length > 0) {
                const userData = data[0];
                setUser({
                    name: userData.name,
                    email: userData.email,
                    phone_number: userData.phone_number,
                    address: userData.address,
                    user_type: userData.user_type,
                });
            } else {
                console.error('Error', data.error || 'Failed to fetch user details.');
            }
        } catch (error) {
            console.error('Error', 'Failed to fetch user details.');
        } finally {
            setLoading(false);
        }
    };

    const loadUserData = useCallback(async () => {
        const storedUsername = await AsyncStorage.getItem('username');
            if (storedUsername) {
                setUsername(storedUsername);
                fetchUserDetails(storedUsername);
            }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadUserData();
        }, [loadUserData])
    );

    const handleEditAcc = async () => {
        if (username) {
            navigation.navigate('UserEditInfo', {username});
        } else {
            Alert.alert('Error', 'Username is not available.');
        }
    };

    const handleNotifications = () => {
        navigation.navigate('Notifications');
    };

    const getUserType = (type: string) => {
        switch (type) {
            case 'A':
                return 'Admin';
            case 'S':
                return 'Supervisor';
            case 'D':
                return 'Driver';
            case 'R':
                return 'Rider';
            default:
                return 'Unknown';
        }
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle" size={30} color="black"/>
                </TouchableOpacity>
                <ThemedText type="title" style={styles.headerText}>Supervisor Settings</ThemedText>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff"/>
            ) : (
                <>
                    <View style={styles.userInfoContainer}>
                        <View style={styles.userInfoRow}>
                            <Ionicons name="person-outline" size={20} color="#333" style={styles.icon}/>
                            <ThemedText type="default" style={styles.userInfoText}>Name: {user.name}</ThemedText>
                        </View>
                        <View style={styles.userInfoRow}>
                            <Ionicons name="mail-outline" size={20} color="#333" style={styles.icon}/>
                            <ThemedText type="default" style={styles.userInfoText}>Email: {user.email}</ThemedText>
                        </View>
                        <View style={styles.userInfoRow}>
                            <Ionicons name="call-outline" size={20} color="#333" style={styles.icon}/>
                            <ThemedText type="default"
                                        style={styles.userInfoText}>Phone: {user.phone_number}</ThemedText>
                        </View>
                        <View style={styles.userInfoRow}>
                            <Ionicons name="location-outline" size={20} color="#333" style={styles.icon}/>
                            <ThemedText type="default" style={styles.userInfoText}>Address: {user.address}</ThemedText>
                        </View>
                        <View style={styles.userInfoRow}>
                            <Ionicons name="shield-outline" size={20} color="#333" style={styles.icon}/>
                            <ThemedText type="default" style={styles.userInfoText}>User
                                Type: {getUserType(user.user_type)}</ThemedText>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleEditAcc}>
                        <Ionicons name="person-circle-outline" size={24} color="white" style={styles.icon}/>
                        <ThemedText type="defaultSemiBold" style={styles.buttonText}>Edit Account</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleNotifications}>
                        <Ionicons name="notifications-outline" size={24} color="white" style={styles.icon}/>
                        <ThemedText type="defaultSemiBold" style={styles.buttonText}>Notifications</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SupervisorPrivacy')}>
                        <Ionicons name="shield-checkmark-outline" size={24} color="white" style={styles.icon}/>
                        <ThemedText type="defaultSemiBold" style={styles.buttonText}>Privacy & Security</ThemedText>
                    </TouchableOpacity>
                </>
            )}
        </ThemedView>
    );
};

export default SupervisorSettings;

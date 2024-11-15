import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import ThemedText from '../components/ThemedText';
import ThemedView from '../components/ThemedView';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/navigation/NavigationTypes';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";

type SettingsNavigationProp = StackNavigationProp<RootStackParamList, 'SupervisorSettings'>;

const SupervisorSettings: React.FC = () => {
    const navigation = useNavigation<SettingsNavigationProp>();
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsername = async () => {
            const storedUsername = await AsyncStorage.getItem('username');
            if (storedUsername) {
                setUsername(storedUsername);
            }
        };
        fetchUsername();
    }, []);

    const handleEditAcc = async () => {
        if (username) {
            navigation.navigate('UserEditInfo', { username });
        } else {
            Alert.alert('Error', 'Username is not available.');
        }
    };

    const handleNotifications = () => {
        navigation.navigate('Notifications'); // Navigate to Notifications screen
    };

    const handlePrivacySecurity = () => {
        // Placeholder for Privacy & Security functionality
        Alert.alert('Privacy & Security', 'This is a dummy Privacy & Security screen.');
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.headerText}>Supervisor Settings</ThemedText>

            {/* Edit Account Button */}
            <TouchableOpacity style={styles.button} onPress={handleEditAcc}>
                <Ionicons name="person-circle-outline" size={24} color="white" style={styles.icon} />
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>Edit Account</ThemedText>
            </TouchableOpacity>

            {/* Notifications Button */}
            <TouchableOpacity style={styles.button} onPress={handleNotifications}>
                <Ionicons name="notifications-outline" size={24} color="white" style={styles.icon} />
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>Notifications</ThemedText>
            </TouchableOpacity>

            {/* Privacy & Security Button */}
            <TouchableOpacity style={styles.button} onPress={handlePrivacySecurity}>
                <Ionicons name="shield-checkmark-outline" size={24} color="white" style={styles.icon} />
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>Privacy & Security</ThemedText>
            </TouchableOpacity>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: 'white' },
    headerText: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    icon: { marginRight: 10 },
    buttonText: { color: 'white', fontSize: 16 },
});

export default SupervisorSettings;

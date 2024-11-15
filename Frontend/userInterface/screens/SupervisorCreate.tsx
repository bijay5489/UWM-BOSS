import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/components/navigation/NavigationTypes";
import ThemedText from "@/components/ThemedText";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const SupervisorCreate: React.FC = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [emailUsername, setEmailUsername] = useState(''); // Renamed from 'email'
    const [user_type, setUserType] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleCreateAccount = async () => {
        if (!username || !password || !name || !phoneNumber || !address || !emailUsername || !user_type) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        // Basic email username validation (optional but recommended)
        const emailRegex = /^[a-zA-Z0-9._-]+$/;
        if (!emailRegex.test(emailUsername)) {
            setErrorMessage('Invalid email username. Only letters, numbers, dots, underscores, and hyphens are allowed.');
            return;
        }

        const email = `${emailUsername}@uwm.edu`; // Append fixed domain

        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    name,
                    phone_number: phoneNumber,
                    address,
                    email, // Use concatenated email
                    user_type,
                }),
            });
            const data = await response.json();

            if (response.status === 201) {
                Alert.alert('Success', 'User created successfully.');
                navigation.goBack();
            } else {
                if (data.username) {
                    setErrorMessage('Username already exists.');
                } else if (data.email) {
                    setErrorMessage('Email already exists.');
                } else if (data.phone_number) {
                    setErrorMessage('Invalid phone number.');
                } else {
                    setErrorMessage('Registration failed. Please check your inputs.');
                }
            }
        } catch (error) {
            setErrorMessage('Failed to connect. Please check your internet connection.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                autoCapitalize="none" // Prevent automatic capitalization
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <TextInput
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad" // Numeric keyboard for phone numbers
                style={styles.input}
            />
            <TextInput
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
            />

            {/* Email Username Input with Fixed Domain */}
            <View style={styles.emailContainer}>
                <TextInput
                    placeholder="Email Username"
                    value={emailUsername}
                    onChangeText={setEmailUsername}
                    style={[styles.input, { flex: 1 }]} // Flex to occupy available space
                    autoCapitalize="none" // Prevent automatic capitalization
                />
                <Text style={styles.emailSuffix}>@uwm.edu</Text> {/* Fixed domain */}
            </View>

            {errorMessage && <ThemedText type="error" style={styles.errorText}>{errorMessage}</ThemedText>}

            <View style={styles.radioContainer}>
                {['Rider', 'Driver', 'Supervisor'].map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={styles.radioButton}
                        onPress={() => setUserType(type[0])} // Store the first letter for simplicity
                    >
                        <View style={user_type === type[0] ? styles.selectedRadio : styles.unselectedRadio} />
                        <Text>{type}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity onPress={handleCreateAccount} style={styles.createAccountButton}>
                <Text style={styles.createAccountText}>Create Account</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flexGrow: 1, 
        justifyContent: 'center', 
        padding: 20,
        backgroundColor: 'white', // Added background color for better visibility
    },
    input: { 
        height: 50, 
        borderColor: 'gray', 
        borderWidth: 1, 
        marginBottom: 15, 
        paddingHorizontal: 10,
        borderRadius: 5, // Rounded corners for better aesthetics
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    emailSuffix: {
        marginLeft: 10,
        color: 'gray',
        fontSize: 16,
    },
    errorText: { 
        color: 'red', 
        marginBottom: 10,
        textAlign: 'center', // Center the error message
    },
    createAccountButton: { 
        backgroundColor: 'blue', 
        padding: 15, 
        alignItems: 'center',
        borderRadius: 5, // Rounded corners for button
    },
    createAccountText: { 
        color: 'white', 
        fontWeight: 'bold',
    },
    radioContainer: { 
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        marginVertical: 15 
    },
    radioButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginRight: 15 
    },
    selectedRadio: { 
        width: 20, 
        height: 20, 
        borderRadius: 10, 
        backgroundColor: 'blue', 
        marginRight: 10 
    },
    unselectedRadio: { 
        width: 20, 
        height: 20, 
        borderRadius: 10, 
        borderWidth: 1, 
        borderColor: 'gray', 
        marginRight: 10 
    },
});

export default SupervisorCreate;

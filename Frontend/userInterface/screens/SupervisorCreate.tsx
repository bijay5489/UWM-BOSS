import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "@/components/navigation/NavigationTypes";
import ThemedText from "@/components/ThemedText";
import {Ionicons} from "@expo/vector-icons";

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
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle" size={30} color="black"/>
                </TouchableOpacity>
                <ThemedText type="title" style={styles.headerText}>Create Account</ThemedText>
            </View>
            <Text style={styles.label}>Username:</Text>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                placeholderTextColor="gray"
            />
            <Text style={styles.label}>Name:</Text>
            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholderTextColor="gray"
                autoCapitalize="words"
            />
            <Text style={styles.label}>Phone Number:</Text>
            <TextInput
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad" // Numeric keyboard for phone numbers
                style={styles.input}
                placeholderTextColor="gray"
            />
            <Text style={styles.label}>Home Address:</Text>
            <TextInput
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
                placeholderTextColor="gray"
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
            <Text style={styles.label}>Email Address:</Text>
            <TextInput
                placeholder="johndoe@uwm.edu"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholderTextColor="gray"
            />
            <Text style={styles.label}>Password:</Text>
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                placeholderTextColor="gray"
            />

            {errorMessage && <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>}

            <View style={styles.radioContainer}>
                {['Rider', 'Driver', 'Supervisor'].map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={styles.radioButton}
                        onPress={() => setUserType(type[0])}
                    >
                        <View style={styles.radioOuterCircle}>
                            {user_type === type[0] && <View style={styles.radioInnerCircle}/>}
                        </View>
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
    container: {flex: 1, justifyContent: 'center', padding: 20},
    input: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 10
    },
    errorText: {color: 'red', marginBottom: 10},
    createAccountButton: {backgroundColor: 'blue', padding: 15, alignItems: 'center', borderRadius: 10},
    createAccountText: {color: 'white'},
    radioContainer: {flexDirection: 'row', alignItems: 'flex-start', marginVertical: 15, justifyContent: 'center'},
    radioButton: {flexDirection: 'row', alignItems: 'center', marginRight: 15},
    radioOuterCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    radioInnerCircle: {width: 10, height: 10, borderRadius: 5, backgroundColor: 'blue'},
    label: {fontSize: 16, marginBottom: 5, color: 'black'},
    header: {flexDirection: 'row', alignItems: 'center', marginBottom: 20,},
    headerText: {flex: 1, fontSize: 28, textAlign: 'center',},
});

export default SupervisorCreate;

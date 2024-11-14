import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "@/components/navigation/NavigationTypes";
import ThemedText from "@/components/ThemedText";
import {Ionicons} from "@expo/vector-icons";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const CreateAccount: React.FC = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [RePassword, setRePassword] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleCreateAccount = async () => {
        if (!username || !password || !name || !phoneNumber || !address || !email) {
            setErrorMessage('Please fill in all fields.');
            return;
        }
        if (password != RePassword){
            setErrorMessage("Passwords do not match, re-enter your new password.");
            return;
        }

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
                    email,
                }),
            });

            const data = await response.json();

            if (response.status === 201) {
                navigation.navigate('Login');
            } else {
                // Parse the error response and display simplified messages
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
            <Text style={styles.label}>Confirm Password:</Text>
            <TextInput
                placeholder="Re-enter Password"
                value={RePassword}
                onChangeText={setRePassword}
                secureTextEntry
                style={styles.input}
                placeholderTextColor="gray"
            />

            {errorMessage && <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>}

            <TouchableOpacity onPress={handleCreateAccount} style={styles.createAccountButton}>
                <Text style={styles.createAccountText}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginButton}>
                <Text style={styles.loginText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: 'center', padding: 20},
    input: {height: 40, borderColor: 'black', borderWidth: 1, marginBottom: 15, paddingHorizontal: 10, borderRadius: 10},
    errorText: {color: 'red', marginBottom: 10},
    createAccountButton: {backgroundColor: 'blue', padding: 15, alignItems: 'center', borderRadius: 10},
    createAccountText: {color: 'white'},
    loginButton: {marginTop: 10, alignItems: 'center'},
    loginText: {color: 'blue'},
    label: {fontSize: 16, marginBottom: 5, color: 'black'},
    header: {flexDirection: 'row', alignItems: 'center', marginBottom: 20,},
    headerText: {flex: 1, fontSize: 28, textAlign: 'center',},
});

export default CreateAccount;
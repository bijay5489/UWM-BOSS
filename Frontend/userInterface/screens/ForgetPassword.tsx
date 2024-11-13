import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "@/components/navigation/NavigationTypes";
import ThemedText from "@/components/ThemedText";

type ForgetPasswordNavigationProp = StackNavigationProp<RootStackParamList, 'ForgetPassword'>;

const ForgetPassword: React.FC = () => {
    const navigation = useNavigation<ForgetPasswordNavigationProp>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [RePassword, setRePassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleForgetPassword = async () => {
        if (!username) {
            setErrorMessage('Please enter a username.');
            return;
        }
        if (password != RePassword){
            setErrorMessage('Passwords do not match, re-enter your new password.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/reset_password/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });
            const data = await response.json();
            setErrorMessage(data.message);
        } catch (error) {
            setErrorMessage('Failed to connect. Please check your internet connection.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Username</Text>
            <TextInput
                placeholder="Username"
                onChangeText={setUsername}
                style={styles.input}
                placeholderTextColor="gray"
            />
            <Text style={styles.label}>New Password</Text>
            <TextInput
                placeholder="Password"
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                placeholderTextColor="gray"
            />
            <TextInput
                placeholder="Re-enter Password"
                onChangeText={setRePassword}
                secureTextEntry
                style={styles.input}
                placeholderTextColor="gray"
            />

            {errorMessage && <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>}

            <TouchableOpacity onPress={handleForgetPassword} style={styles.resetButton}>
                <Text style={styles.resetText}>Reset Password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backButton}>
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 15, paddingHorizontal: 10, borderRadius: 10},
    errorText: { color: 'red', marginBottom: 10 },
    resetButton: { backgroundColor: 'red', padding: 15, alignItems: 'center', borderRadius: 10, marginBottom: 10},
    resetText: { color: 'white' },
    backButton: { backgroundColor: 'gray', padding: 15, alignItems: 'center', borderRadius: 10 },
    backText: { color: 'white', fontSize: 16 },
    label: {fontSize: 16, marginBottom: 5, color: 'black'},
});

export default ForgetPassword;
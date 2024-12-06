import React, {useState} from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemedText from '../components/ThemedText';
import ThemedView from '../components/ThemedView';
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "@/components/navigation/NavigationTypes";
import baseStyles from '../styles/General';
import loginStyles from '../styles/Login';

const styles = { ...baseStyles, ...loginStyles };

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigation = useNavigation<LoginScreenNavigationProp>();

    useFocusEffect(
        React.useCallback(() => {
            setUsername('');
            setPassword('');
            setErrorMessage(null);
        }, [])
    );

    const handleLogin = async () => {
        try {
            const response = await fetch('https://mohammadalsheikh.pythonanywhere.com/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });

            const data = await response.json();

            if (response.status === 200) {
                await AsyncStorage.setItem('accessToken', data.access);
                await AsyncStorage.setItem('refreshToken', data.refresh);
                await AsyncStorage.setItem('username', username);
                await AsyncStorage.setItem('riderId', JSON.stringify(data.riderId));

                if (data.user_type === "S") {
                    navigation.navigate('SupervisorHome');
                } else if (data.user_type === "R") {
                    navigation.navigate('RiderDashboard');
                } else if (data.user_type === "D") {
                    navigation.navigate('DriverDashboard');
                }
            } else if (response.status === 400) {
                setErrorMessage(data.error);
            } else {
                setErrorMessage('Something went wrong. Please try again.');
            }
        } catch (error) {
            setErrorMessage('Failed to connect. Please check your internet connection.');
        }
    };

    const handleCreateAccount = () => {
        navigation.navigate('CreateAccount');
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require('../assets/images/UWM.png')} style={styles.logo}/>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    placeholderTextColor="gray"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="gray"
                />
            </View>

            {errorMessage && <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>}

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <ThemedText type="defaultSemiBold" style={styles.loginText}>Login</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.createAccountButton} onPress={handleCreateAccount}>
                <ThemedText style={styles.createAccountText}>Don't have an account? Sign up</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')} style={styles.resetButton}>
                <Text style={styles.resetText}>Reset Password</Text>
            </TouchableOpacity>
        </ThemedView>
    );
};

export default LoginScreen;

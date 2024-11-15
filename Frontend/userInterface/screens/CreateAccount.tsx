import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/components/navigation/NavigationTypes";
import ThemedText from "@/components/ThemedText";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const CreateAccount: React.FC = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [emailUsername, setEmailUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleCreateAccount = async () => {
        if (!username || !password || !name || !phoneNumber || !address || !emailUsername) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        // Basic email username validation (optional but recommended)
        const emailRegex = /^[a-zA-Z0-9._-]+$/;
        if (!emailRegex.test(emailUsername)) {
            setErrorMessage('Invalid email username. Only letters, numbers, dots, underscores, and hyphens are allowed.');
            return;
        }

        const email = `${emailUsername}@uwm.edu`;

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
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
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
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      
      <View style={styles.emailContainer}>
        <TextInput
          placeholder="Email Username"
          value={emailUsername}
          onChangeText={setEmailUsername}
          style={[styles.input, { flex: 1 }]}
          autoCapitalize="none"
        />
        <Text style={styles.emailSuffix}>@uwm.edu</Text>
      </View>

      {errorMessage && <ThemedText type="error" style={styles.errorText}>{errorMessage}</ThemedText>}

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
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { 
    height: 50, 
    borderColor: 'gray', 
    borderWidth: 1, 
    marginBottom: 15, 
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  emailSuffix: {
    marginLeft: 10,
    color: 'gray',
  },
  errorText: { color: 'red', marginBottom: 10 },
  createAccountButton: { 
    backgroundColor: 'blue', 
    padding: 15, 
    alignItems: 'center', 
    borderRadius: 5,
  },
  createAccountText: { color: 'white', fontWeight: 'bold' },
  loginButton: { marginTop: 10, alignItems: 'center' },
  loginText: { color: 'blue' },
});

export default CreateAccount;

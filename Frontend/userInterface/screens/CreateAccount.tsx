import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "@/components/navigation/NavigationTypes";
import ThemedText from "@/components/ThemedText";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const CreateAccount: React.FC = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
        setErrorMessage(data.message);
      } else {
        setErrorMessage('Registration failed: ' + JSON.stringify(data));
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
        style={styles.input}
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

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
  input: { height: 50, borderColor: 'gray', borderWidth: 1, marginBottom: 15, paddingHorizontal: 10 },
  errorText: { color: 'red', marginBottom: 10 },
  createAccountButton: { backgroundColor: 'blue', padding: 15, alignItems: 'center' },
  createAccountText: { color: 'white' },
  loginButton: { marginTop: 10, alignItems: 'center' },
  loginText: { color: 'blue' },
});

export default CreateAccount;
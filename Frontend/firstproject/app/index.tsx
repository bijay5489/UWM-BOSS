import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

// Import the image from the correct directory
const sampleImage = require('./bosspic.jpg'); // Adjust the path to your image

export default function HomeScreen() {
  // State for managing which screen is being displayed
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pantherID, setPantherID] = useState('');

  // Function to toggle between login and create account
  const toggleScreen = () => {
    setIsLogin(!isLogin); // Toggle between login and create account
    resetInputs(); // Reset inputs when toggling between screens
  };

  // Function to switch to forgot password screen
  const handleForgotPassword = () => {
    setIsForgotPassword(true);
    resetInputs(); // Reset inputs when switching screens
  };

  // Function to switch back to login screen
  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    resetInputs(); // Reset inputs when switching screens
  };

  // Function to reset all input fields
  const resetInputs = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPantherID('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UWM BOSS</Text>

      <Image source={sampleImage} style={styles.image} />

      {/* Conditionally render Forgot Password, Login, or Create Account */}
      {isForgotPassword ? (
        <View style={styles.formContainer}>
          {/* Forgot Password Form */}
          <Text style={styles.formTitle}>Reset Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#757575"
            value={email}
            onChangeText={setEmail} // Track input state
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Send Reset Link</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBackToLogin}>
            <Text style={styles.forgot}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      ) : isLogin ? (
        <View style={styles.formContainer}>
          {/* Login Form */}
          <Text style={styles.formTitle}>Login to your account</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#757575"
            value={email}
            onChangeText={setEmail} // Track input state
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#757575"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword} // Track input state
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.formContainer}>
          {/* Create Account Form */}
          <Text style={styles.formTitle}>Create a New Account</Text>
          <TextInput
            style={styles.input}
            placeholder="Panther ID"
            placeholderTextColor="#757575"
            value={pantherID}
            onChangeText={setPantherID} // Track input state
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#757575"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail} // Track input state
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#757575"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword} // Track input state
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#757575"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword} // Track input state
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isForgotPassword && (
        <TouchableOpacity onPress={toggleScreen} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>
            {isLogin ? 'Create Account' : 'Already have an account? Log In'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// StyleSheet for the dark-themed UI
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c', // Dark theme background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: '#ffffff', // White text color
    fontWeight: 'bold',
    marginBottom: 20, // Space between the title and the image
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 24,
    color: '#ffffff', // White text
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain', // Ensures the image fits within the box without being stretched
    marginBottom: 40, // Space between the image and the button
  },
  input: {
    backgroundColor: '#ffffff', // Light background for input fields
    width: '80%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 20,
    color: '#000000',
  },
  button: {
    backgroundColor: '#0078D4', // Outlook blue color for the button
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff', // White text for contrast
    fontWeight: '500',
  },
  forgot: {
    color: '#1fb5bf', // Link color
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
  },
  toggleButton: {
    marginTop: 20,
  },
  toggleButtonText: {
    color: '#1fb5bf', // Link color
    fontSize: 14,
    textAlign: 'center',
  },
});
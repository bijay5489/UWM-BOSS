import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

// Import the image from the correct directory
const sampleImage = require('./bosspic.jpg'); // If bosspic.jpg is in the same folder as index.tsx

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>UWM BOSS</Text>
      
      {/* Image under the title */}
      <Image source={sampleImage} style={styles.image} />
      
      {/* Login button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Continue with Outlook</Text>
      </TouchableOpacity>
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
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain', // Ensures the image fits within the box without being stretched
    marginBottom: 40, // Space between the image and the button
  },
  button: {
    backgroundColor: '#0078D4', // Outlook blue color for the button
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff', // White text for contrast
    fontWeight: '500',
  },
});

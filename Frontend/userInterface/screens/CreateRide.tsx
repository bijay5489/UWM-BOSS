import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/navigation/NavigationTypes';
import ThemedText from '@/components/ThemedText';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from '@react-native-community/slider';
import { Switch } from 'react-native-gesture-handler';

type CreateRideScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateRide'>;

const CreateRide: React.FC = () => {
  const navigation = useNavigation<CreateRideScreenNavigationProp>();
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [numPassengers, setNumPassengers] = useState(1); // default to 1
  const [ADA, setADA] = useState(false);
  const [pickupTime, setPickupTime] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCreateRide = async () => {
    if (!pickupLocation || !dropoffLocation || !pickupTime) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/rides/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: await AsyncStorage.getItem('username'),
          pickup_location: pickupLocation,
          dropoff_location: dropoffLocation,
          num_passengers: numPassengers,
          ADA_required: ADA,
          pickup_time: pickupTime,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        navigation.navigate('DisplayRideInfo', {rideId: data.ride_id, driverName: data.driver});
      } else if (response.status === 200) {
        navigation.navigate('Queue', { queuePosition: data.queue_position, rideId: data.ride_id, driverName: data.driver})
      } else {
        setErrorMessage('Error creating ride. Please check your inputs.');
      }
    } catch (error) {
      setErrorMessage('Failed to connect. Please check your internet connection.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Pickup Location"
        value={pickupLocation}
        onChangeText={setPickupLocation}
        style={styles.input}
      />
      <TextInput
        placeholder="Dropoff Location"
        value={dropoffLocation}
        onChangeText={setDropoffLocation}
        style={styles.input}
      />

      {/* Slider for number of passengers */}
      <Text style={styles.label}>Number of Passengers: {numPassengers}</Text>
      <Slider
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={numPassengers}
        onValueChange={setNumPassengers}
        style={styles.slider}
      />

      <TextInput
        placeholder="Pickup Time"
        value={pickupTime}
        onChangeText={setPickupTime}
        style={styles.input}
      />

      {/* ADA Toggle Switch */}
      <View style={styles.toggleContainer}>
        <Text style={styles.label}>{ADA ? 'ADA Required' : 'No ADA Requirements'}</Text>
        <Switch
          value={ADA}
          onValueChange={setADA}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={ADA ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      {errorMessage && <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>}

      <TouchableOpacity onPress={handleCreateRide} style={styles.createRideButton}>
        <Text style={styles.createRideText}>Create Ride</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { height: 50, borderColor: 'gray', borderWidth: 1, marginBottom: 15, paddingHorizontal: 10 },
  label: { fontSize: 16, marginVertical: 10 },
  slider: { width: '50%', height: 40 },
  toggleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  errorText: { color: 'red', marginBottom: 10 },
  createRideButton: { backgroundColor: 'blue', padding: 15, alignItems: 'center' },
  createRideText: { color: 'white' },
});

export default CreateRide;

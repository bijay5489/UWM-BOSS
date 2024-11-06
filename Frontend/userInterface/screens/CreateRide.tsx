import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, FlatList, Button, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/navigation/NavigationTypes';
import ThemedText from '@/components/ThemedText';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from '@react-native-community/slider';
import { Switch } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_BASE_URL = 'http://127.0.0.1:8000/api';

type CreateRideScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateRide'>;

interface LocationSuggestion {
  place_id: string;
  description: string;
}

const CreateRide: React.FC = () => {
  const navigation = useNavigation<CreateRideScreenNavigationProp>();
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState<LocationSuggestion[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<LocationSuggestion[]>([]);
  const [numPassengers, setNumPassengers] = useState(1);
  const [ADA, setADA] = useState(false);
  const [pickupTime, setPickupTime] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleDateChange = (date: Date) => {
    setPickupTime(date);
    setShowPicker(true);
  };

  const fetchLocationSuggestions = async (query: string, setSuggestions: React.Dispatch<React.SetStateAction<LocationSuggestion[]>>) => {
    if (query.length > 2) {
      try {
        const response = await fetch(`${API_BASE_URL}/locations/search/?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSuggestions(data.predictions || []);
      } catch (error) {
        console.error("Error fetching location suggestions", error);
      }
    } else {
      setSuggestions([]); // Clear suggestions if query is too short
    }
  };

  const handleCreateRide = async () => {
    if (!pickupLocation || !dropoffLocation || !pickupTime) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const username = await AsyncStorage.getItem('username');
      const response = await fetch(`${API_BASE_URL}/rides/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          pickup_location: pickupLocation,
          dropoff_location: dropoffLocation,
          num_passengers: numPassengers,
          ADA_required: ADA,
          pickup_time: pickupTime,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (response.status === 201) {
        navigation.navigate('DisplayRideInfo', { rideId: data.ride_id, driverName: data.driver });
      } else if (response.status === 200) {
        navigation.navigate('Queue', { queuePosition: data.queue_position, rideId: data.ride_id, driverName: data.driver });
      } else {
        setErrorMessage(data.message || 'Error creating ride. Please check your inputs.');
      }
    } catch (error) {
      setErrorMessage('Failed to connect. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Pickup Location Field with Autocomplete Suggestions */}
      <TextInput
        placeholder="Pickup Location"
        value={pickupLocation}
        onChangeText={async (text) => {
          setPickupLocation(text);
          await fetchLocationSuggestions(text, setPickupSuggestions);
        }}
        style={styles.input}
      />
      {pickupSuggestions.length > 0 && (
        <FlatList
          data={pickupSuggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {
              setPickupLocation(item.description);
              setPickupSuggestions([]);
            }}>
              <Text style={styles.suggestion}>{item.description}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionContainer}
        />
      )}

      {/* Dropoff Location Field with Autocomplete Suggestions */}
      <TextInput
        placeholder="Dropoff Location"
        value={dropoffLocation}
        onChangeText={async (text) => {
          setDropoffLocation(text);
          await fetchLocationSuggestions(text, setDropoffSuggestions);
        }}
        style={styles.input}
      />
      {dropoffSuggestions.length > 0 && (
        <FlatList
          data={dropoffSuggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {
              setDropoffLocation(item.description);
              setDropoffSuggestions([]);
            }}>
              <Text style={styles.suggestion}>{item.description}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionContainer}
        />
      )}

      {/* Date and Time Picker */}
      <Text style={styles.label}>Pickup Time:</Text>
      {Platform.OS === 'web' ? (
        <DatePicker
          selected={pickupTime}
          onChange={(date) =>date && setPickupTime(date)}
          showTimeSelect
          dateFormat="Pp"
          minDate={new Date()}
          minTime={isToday(pickupTime) ? new Date() : new Date(new Date().setHours(0, 0, 0, 0))}
          maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
        />
      ) : (
        <>
          <Button title="Select Pickup Time" onPress={() => setShowPicker(true)} />
          {showPicker && (
            <DateTimePicker
              value={pickupTime}
              mode="datetime"
              display="default"
              onChange={(event, date) => date && handleDateChange(date)}
            />
          )}
        </>
      )}

      {/* Other components */}
      <Text style={styles.label}>Number of Passengers: {numPassengers}</Text>
      <Slider
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={numPassengers}
        onValueChange={setNumPassengers}
        style={styles.slider}
      />

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

      <TouchableOpacity onPress={handleCreateRide} style={styles.createRideButton} disabled={loading}>
        <Text style={styles.createRideText}>{loading ? 'Creating Ride...' : 'Create Ride'}</Text>
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
  autocompleteContainer: { flex: 1, zIndex: 1 },
  inputContainer: { borderColor: 'gray', borderWidth: 1, marginBottom: 15, paddingHorizontal: 10 },
  suggestion: { padding: 10, backgroundColor: '#fff' },
  errorText: { color: 'red', marginBottom: 10 },
  createRideButton: { backgroundColor: 'blue', padding: 15, alignItems: 'center' },
  createRideText: { color: 'white' },
  suggestionContainer: { maxHeight: 200, borderColor: 'gray', borderWidth: 1, borderTopWidth: 0, backgroundColor: 'white' },
});

export default CreateRide;

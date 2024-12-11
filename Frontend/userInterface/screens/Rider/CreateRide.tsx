import React, {useState} from 'react';
import {FlatList, Platform, Switch, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '@/components/navigation/NavigationTypes';
import ThemedText from '@/components/ThemedText';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import baseStyles from '../../styles/General';
import createRide from '../../styles/CreateRide';

const styles = { ...baseStyles, ...createRide};

const API_BASE_URL = 'https://mohammadalsheikh.pythonanywhere.com/api';

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

    // Additional helper function
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
            setSuggestions([]);
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
            if (response.status === 201) {
                await AsyncStorage.setItem('inProgress', JSON.stringify(data.inProgress));
                await AsyncStorage.setItem('ride_code', JSON.stringify(data.ride_code));
                await AsyncStorage.setItem('ride_id_view', data.ride_id);
                await AsyncStorage.setItem('ride_driverName', data.driver);
                navigation.navigate('DisplayRideInfo', {rideId: data.ride_id, driverName: data.driver});
            } else if (response.status === 200) {
                await AsyncStorage.setItem('ride_code', JSON.stringify(data.ride_code));
                navigation.navigate('Queue', {
                    queuePosition: data.queue_position,
                    rideId: data.ride_id,
                    driverName: data.driver
                });
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage('Failed to connect. Please check your internet connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle" size={30} color="black"/>
                </TouchableOpacity>
                <ThemedText type="title" style={styles.headerText}>Request Ride</ThemedText>
            </View>
            {/* Pickup Location Title and Input */}
            <Text style={styles.label}>Pickup Location:</Text>
            <TextInput
                placeholder="Enter pickup location"
                value={pickupLocation}
                onChangeText={async (text) => {
                    setPickupLocation(text);
                    await fetchLocationSuggestions(text, setPickupSuggestions);
                }}
                style={styles.input}
                placeholderTextColor="gray"
            />
            {pickupSuggestions.length > 0 && (
                <FlatList
                    data={pickupSuggestions}
                    keyExtractor={(item) => item.place_id}
                    renderItem={({item}) => (
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

            {/* Dropoff Location Title and Input */}
            <Text style={styles.label}>Dropoff Location:</Text>
            <TextInput
                placeholder="Enter dropoff location"
                value={dropoffLocation}
                onChangeText={async (text) => {
                    setDropoffLocation(text);
                    await fetchLocationSuggestions(text, setDropoffSuggestions);
                }}
                style={styles.input}
                placeholderTextColor="gray"
            />
            {dropoffSuggestions.length > 0 && (
                <FlatList
                    data={dropoffSuggestions}
                    keyExtractor={(item) => item.place_id}
                    renderItem={({item}) => (
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
            <View style={styles.timePickerContainer}>
                {Platform.OS === 'web' ? (
                    <DatePicker
                        selected={pickupTime}
                        onChange={(date) => date && setPickupTime(date)}
                        showTimeSelect
                        dateFormat="Pp"
                        minDate={new Date()}
                        minTime={isToday(pickupTime) ? new Date() : new Date(new Date().setHours(0, 0, 0, 0))}
                        maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
                        customInput={<TextInput style={styles.timeInput}/>}
                    />
                ) : (
                    <>
                        <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.timeButton}>
                            <Text style={styles.timeText}>{pickupTime.toLocaleString()}</Text>
                        </TouchableOpacity>
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
            </View>

            {/* Passenger Slider */}
            <Text style={styles.label}>Number of Passengers: {numPassengers}</Text>
            <Slider
                minimumValue={1}
                maximumValue={5}
                step={1}
                value={numPassengers}
                onValueChange={setNumPassengers}
                style={styles.slider}
            />

            {/* ADA Switch with Accessibility Icon */}
            <View style={styles.toggleContainer}>
                <FontAwesome name="wheelchair" size={24} color={ADA ? '#81b0ff' : '#767577'}/>
                <Switch
                    value={ADA}
                    onValueChange={setADA}
                    trackColor={{false: '#767577', true: '#81b0ff'}}
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

export default CreateRide;

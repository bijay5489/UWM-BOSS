import React, {useState} from 'react';
import {FlatList, Platform, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View} from 'react-native';
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
            await AsyncStorage.setItem('ride_code', data.ride_code);
            if (response.status === 201) {
                navigation.navigate('DisplayRideInfo', {rideId: data.ride_id, driverName: data.driver});
            } else if (response.status === 200) {
                navigation.navigate('Queue', {
                    queuePosition: data.queue_position,
                    rideId: data.ride_id,
                    driverName: data.driver
                });
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

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20, backgroundColor: '#f2f2f2', justifyContent: 'center'},
    input: {
        height: 50,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff'
    },
    label: {fontSize: 16, marginBottom: 5, color: 'black'},
    timePickerContainer: {alignItems: 'center', justifyContent: 'center', marginBottom: 10, zIndex: 10},
    timeButton: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#fff'
    },
    timeText: {fontSize: 16, color: '#333'},
    slider: {width: '100%', height: 40, marginBottom: 15},
    toggleContainer: {flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 10},
    createRideButton: {
        height: 50,
        backgroundColor: '#007bff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    createRideText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
    suggestionContainer: {backgroundColor: 'white', borderRadius: 5, elevation: 3, padding: 5},
    suggestion: {padding: 10},
    errorText: {color: 'red', marginTop: 10, textAlign: 'center'},
    timeInput: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    header: {flexDirection: 'row', alignItems: 'center', marginBottom: 20,},
    headerText: {flex: 1, fontSize: 28, textAlign: 'center',},
});

export default CreateRide;

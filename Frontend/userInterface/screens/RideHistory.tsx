import React, {useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, TouchableOpacity, View} from 'react-native';
import ThemedText from '../components/ThemedText';
import ThemedView from '../components/ThemedView';
import Card from '../components/Card';
import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "@/components/navigation/NavigationTypes";
import baseStyles from '../styles/General';
import userPageStyles from '../styles/UserPage';
import AsyncStorage from "@react-native-async-storage/async-storage";

const styles = { ...baseStyles, ...userPageStyles};

type Ride = {
    id: string;
    riderName: string;
    driverName: string;
    van: string;
    pickup_location: string;
    dropoff_location: string;
    passengers: string;
    status: string;
    reason: string;
};

type RideHistoryNavigationProp = StackNavigationProp<RootStackParamList, 'RideHistory'>;

const RideHistory: React.FC = () => {
    const [rides, setRides] = useState<Ride[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigation = useNavigation<RideHistoryNavigationProp>();
    const [driver, setDriver] = useState<boolean>(false);
    const [id, setId] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            fetchRides();
        }, [])
    );

    const fetchRides = async () => {
        setLoading(true);
        try {
            const driver = await AsyncStorage.getItem('driver');
            setDriver(driver === 'true');
            const rider_id = await AsyncStorage.getItem('riderId');
            const response = await fetch(`https://mohammadalsheikh.pythonanywhere.com/api/rides/get-by-rider-id/${rider_id}/`);
            const data = await response.json();
            setRides(data);
        } catch (error) {
            Alert.alert("Error", "Unable to fetch users.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReportButton = async () => {
        await AsyncStorage.removeItem('ride_id_report');
        navigation.navigate('GenerateReport'); // MAYBE MAKE IT GENERATE REPORT
    };

    const handleGenerateReport = async () => {
        await AsyncStorage.setItem('ride_id_report', id);
        navigation.navigate('GenerateReport'); // MAYBE MAKE IT GENERATE REPORT
    };

    const getRideStatus = (type: string) => {
        switch (type) {
            case 'pending':
                return 'Pending';
            case 'assigned':
                return 'Assigned';
            case 'in_progress':
                return 'In Progress';
            case 'completed':
                return 'Completed';
            case 'cancelled':
                return 'Cancelled'
            default:
                return 'Unknown';
        }
    };

    return (
        <ThemedView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle" size={30} color="black"/>
                </TouchableOpacity>
                <ThemedText type="title" style={styles.headerText}>Manage Rides</ThemedText>
                <TouchableOpacity style={styles.squareButton} onPress={handleGenerateReportButton}>
                    <Ionicons name="document-text-outline" size={24} color="white"/>
                </TouchableOpacity>
            </View>

            {/* Content Area */}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator}/>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {rides.map((ride) => (
                        <Card
                            key={ride.id}
                            title={driver ? ride.riderName : ride.driverName}
                            description={`Van: ${ride.van}\nPickup Location: ${ride.pickup_location}\nDropoff Location: ${ride.dropoff_location}\nStatus: ${getRideStatus(ride.status)}${ride.status === 'cancelled' ? `\nReason: ${ride.reason}` : ''}`}
                            buttonLabel="Generate Report"
                            onPress={() => {
                                setId(ride.id);
                                handleGenerateReport();
                            }}
                            iconName="person"
                        />
                    ))}
                </ScrollView>
            )}
        </ThemedView>
    );
};

export default RideHistory;

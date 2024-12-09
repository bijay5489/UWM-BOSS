import React, {useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, TouchableOpacity, View} from 'react-native';
import ThemedText from '../../components/ThemedText';
import ThemedView from '../../components/ThemedView';
import Card from '../../components/Card';
import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "@/components/navigation/NavigationTypes";
import baseStyles from '../../styles/General';
import userPageStyles from '../../styles/UserPage';

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
    pickup_time: string;
};

type ViewActivityNavigationProp = StackNavigationProp<RootStackParamList, 'ViewActivity'>;

const ViewLogs: React.FC = () => {
    const [rides, setRides] = useState<Ride[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigation = useNavigation<ViewActivityNavigationProp>();

    useFocusEffect(
        React.useCallback(() => {
            fetchRides();
        }, [])
    );

    const fetchRides = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://mohammadalsheikh.pythonanywhere.com/api/rides/get-all/completed,cancelled');
            const data = await response.json();
            setRides(data);
        } catch (error) {
            Alert.alert("Error", "Unable to fetch users.");
        } finally {
            setLoading(false);
        }
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
                <ThemedText type="title" style={styles.headerText}>Activity</ThemedText>
            </View>

            {/* Content Area */}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator}/>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {rides.map((ride) => (
                        <Card
                            key={ride.id}
                            title={getRideStatus(ride.status)}
                            description={`Rider: ${ride.riderName}\nDriver: ${ride.driverName}\nVan: ${ride.van}\nPickup Location: ${ride.pickup_location}\nDropoff Location: ${ride.dropoff_location}\nPickup Time: ${ride.pickup_time}${ride.status === 'cancelled' ? `\nReason: ${ride.reason}` : ''}`}
                            buttonLabel={undefined} onPress={undefined}
                            iconName="car-sport"
                        />
                    ))}
                </ScrollView>
            )}
        </ThemedView>
    );
};

export default ViewLogs;

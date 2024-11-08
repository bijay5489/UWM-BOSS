// AssignedRides.tsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/navigation/NavigationTypes'; 

type AssignedRidesNavigationProp = StackNavigationProp<RootStackParamList, 'AssignedRides'>;

interface Ride {
  id: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  status: string; // e.g., 'assigned', 'completed'
  // Add other relevant fields as needed
}

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Update this if necessary

const AssignedRides: React.FC = () => {
  const navigation = useNavigation<AssignedRidesNavigationProp>();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Function to fetch assigned rides from the API
  const fetchAssignedRides = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        // If no access token, navigate to Login
        navigation.navigate('Login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/rides/assigned/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRides(data.rides || []);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch assigned rides.');
      }
    } catch (err) {
      console.error('Error fetching assigned rides:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  useEffect(() => {
    fetchAssignedRides();
  }, [fetchAssignedRides]);

  // Function to handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAssignedRides();
    setRefreshing(false);
  }, [fetchAssignedRides]);

  // Render each ride item
  const renderRide = ({ item }: { item: Ride }) => (
    <View style={styles.rideCard}>
      <ThemedText type="defaultSemiBold" style={styles.rideTitle}>
        Ride ID: {item.id}
      </ThemedText>
      <ThemedText>Pickup: {item.pickupLocation}</ThemedText>
      <ThemedText>Dropoff: {item.dropoffLocation}</ThemedText>
      <ThemedText>
        Pickup Time: {new Date(item.pickupTime).toLocaleString()}
      </ThemedText>
      <ThemedText>Status: {item.status}</ThemedText>
      {/* Add more details or actions if needed */}
    </View>
  );

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {rides.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>No rides yet.</ThemedText>
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id}
          renderItem={renderRide}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
  },
  rideCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  rideTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default AssignedRides;

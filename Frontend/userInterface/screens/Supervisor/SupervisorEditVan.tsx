import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/SuperEditVan'

const SupervisorEditVan: React.FC = () => {
    const route = useRoute();
    const { id } = route.params as { id: number };
    const [van, setVan] = useState({ name: '', plate_number: '' });
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchVanDetails();
    }, []);

  const fetchVanDetails = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/vans/${id}/`);
      if (response.ok) {
        const data = await response.json();
        setVan(data);
      } else {
        Alert.alert('Error', 'Failed to fetch van details.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching van details.');
      console.error('Error fetching van:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVan = async () => {
    if (!van.name || !van.plate_number) {
      Alert.alert('Validation Error', 'Please fill out all fields.');
      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/vans/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(van),
      });
      if (response.ok) {
        Alert.alert('Success', 'Van updated successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update van.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating the van.');
      console.error('Error:', error);
    }
  };

  const handleDeleteVan = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/vans/${id}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        Alert.alert('Success', 'Van deleted successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to delete van.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting the van.');
      console.error('Error:', error);
    }
  };

  return loading ? (
    <ActivityIndicator size="large" color="#0000ff" />
  ) : (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-circle" size={30} color="black"/>
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Van</Text>
        <TouchableOpacity onPress={handleDeleteVan}>
          <Ionicons name="trash" size={30} color="red"/>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Van Name"
        value={van.name}
        onChangeText={(text) => setVan({ ...van, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Plate Number"
        value={van.plate_number}
        onChangeText={(text) => setVan({ ...van, plate_number: text })}
      />
      <TouchableOpacity onPress={handleUpdateVan} style={styles.updateButton}>
        <Text style={styles.buttonText}>Update Van</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SupervisorEditVan;

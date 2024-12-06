import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import baseStyles from '../../styles/General';
import userPageStyles from '../../styles/SuperEditVan';

const styles = { ...baseStyles, ...userPageStyles };

const SupervisorEditVan: React.FC = () => {
  const route = useRoute();
  const { id } = route.params as { id: number };  // Get van id from route params
  const [van, setVan] = useState({ van_number: '', ADA: false, driver: ''});
  const [drivers, setDrivers] = useState<any[]>([]); // Store list of available drivers
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchVanDetails();
    fetchDriverList();
  }, []);

  // Fetch van details by id (using query parameter)
  const fetchVanDetails = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/vans/get_van_by_id/${id}`);
      if (response.ok) {
        const data = await response.json();
        setVan(data); // Set the van details in state
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

  // Fetch available drivers for the dropdown list
  const fetchDriverList = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/vans/get_all_drivers');
      if (response.ok) {
        const data = await response.json();
        setDrivers(data);  // Set the list of drivers in state
      } else {
        Alert.alert('Error', 'Failed to fetch drivers.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching drivers.');
      console.error('Error fetching drivers:', error);
    }
  };

  // Handle van update (PUT request)
  const handleUpdateVan = async () => {
      // Only check for a driver if it's a new driver being selected
      if (van.driver === '') {

      }

      // Prepare the data to send, removing the driver check if not modified
      const updatedVanData = { ...van };

      // Send the PUT request to update van
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/vans/edit_van/${van.van_number}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedVanData),  // Send the updated van data
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

  // Handle van deletion (DELETE request)
  const handleDeleteVan = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/vans/delete_van/${van.van_number}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ van_id: id }),  // Send van id in body
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

      {/* Van number and ADA accessible fields */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Van Number:</Text>
        <TextInput
          style={styles.input}
          value={van.van_number}
          onChangeText={(text) => setVan({ ...van, van_number: text })}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>ADA Accessible:</Text>
        <Switch
          value={van.ADA}
          onValueChange={(value) => setVan({ ...van, ADA: value })}
        />
      </View>

      {/* Driver selection dropdown */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Driver:</Text>
        <Text style={styles.input}>
          {van.driver ? van.driver.name : 'No driver assigned'}
        </Text>
        <Picker
          selectedValue={van.driver}
          onValueChange={(itemValue: any) => setVan({ ...van, driver: itemValue })}
        >
          <Picker.Item label="Select Driver" value="" />
          {drivers.map((driver) => (
            <Picker.Item key={driver.id} label={driver.name} value={driver.id} />
          ))}
        </Picker>
      </View>

      {/* Update Van Button */}
      <TouchableOpacity onPress={handleUpdateVan} style={styles.updateButton}>
        <Text style={styles.buttonText}>Update Van</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SupervisorEditVan;

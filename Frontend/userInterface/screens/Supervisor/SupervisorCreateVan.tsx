import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import baseStyles from '../../styles/General';
import userPageStyles from '../../styles/SuperCreateVan';

const styles = { ...baseStyles, ...userPageStyles };

const SupervisorCreateVan: React.FC = () => {
    const [vanNumber, setVanNumber] = useState('');
    const [ADA, setADA] = useState(false);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [selectedDriver, setSelectedDriver] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/vans/get_all_drivers');
            if (!response.ok) {
                throw new Error('Failed to fetch drivers');
            }
            const data = await response.json();
            setDrivers(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch drivers.');
            console.error('Error fetching drivers:', error);
        }
    };

    const handleCreateVan = async () => {
        if (!vanNumber.trim() || !selectedDriver.trim()) {
            Alert.alert('Validation Error', 'Please fill out all fields.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/vans/create_van', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    van_number: vanNumber,
                    ADA,
                    driver: selectedDriver,
                }),
            });

            if (response.ok) {
                Alert.alert('Success', 'Van created successfully.');
                navigation.goBack();
            } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.error || 'Failed to create van.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while creating the van.');
            console.error('Error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle" size={30} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Create Van</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Van Number"
                value={vanNumber}
                keyboardType="numeric"
                onChangeText={setVanNumber}
            />
            <View style={styles.toggleContainer}>
                <Text>ADA Accessible</Text>
                <Switch
                    value={ADA}
                    onValueChange={setADA}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={ADA ? '#f5dd4b' : '#f4f3f4'}
                />
            </View>
            <View style={styles.dropdownContainer}>
                <Text>Driver</Text>
                <Picker
                    selectedValue={selectedDriver}
                    onValueChange={(itemValue) => setSelectedDriver(itemValue)}
                >
                    <Picker.Item label="Select a Driver" value="" />
                    {drivers.map((driver) => (
                        <Picker.Item key={driver.username} label={driver.name} value={driver.username} />
                    ))}
                </Picker>
            </View>
            <TouchableOpacity onPress={handleCreateVan} style={styles.createButton}>
                <Text style={styles.buttonText}>Create Van</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SupervisorCreateVan;

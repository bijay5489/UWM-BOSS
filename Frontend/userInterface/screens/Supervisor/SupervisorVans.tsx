import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/navigation/NavigationTypes';
import styles from '../../styles/SuperVans'

type VansPageNavigationProp = StackNavigationProp<RootStackParamList, 'SupervisorVans'>;

const SupervisorVans: React.FC = () => {
    const [vans, setVans] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigation = useNavigation<VansPageNavigationProp>();

    useEffect(() => {
        fetchVans();
    }, []);

    const fetchVans = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/vans/');
            console.log(response);
            const data = await response.json();
            setVans(data);
        } catch (error) {
            console.error('Error fetching vans:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle" size={30} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Manage Vans</Text>
                <TouchableOpacity
                    style={styles.squareButton}
                    onPress={() => navigation.navigate('SupervisorCreateVan')}
                >
                    <Ionicons name="create-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Van List */}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={vans}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.vanItem}
                            onPress={() => navigation.navigate('SupervisorEditVan', { id: item.id })}
                        >
                            <Text>{item.van_number}</Text>
                            <Text>{item.ADA ? 'ADA Accessible' : 'Not ADA Accessible'}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

export default SupervisorVans;

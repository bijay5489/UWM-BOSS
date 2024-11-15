import React, {useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import ThemedText from '../components/ThemedText';
import ThemedView from '../components/ThemedView';
import Card from '../components/Card';
import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "@/components/navigation/NavigationTypes";

type User = {
    username: string;
    name: string;
    phone_number: string;
    address: string;
    email: string;
    user_type: string;
};

type SupervisorUserPageNavigationProp = StackNavigationProp<RootStackParamList, 'SupervisorUser'>;

const SupervisorUserPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigation = useNavigation<SupervisorUserPageNavigationProp>();

    useFocusEffect(
        React.useCallback(() => {
            fetchUsers();
        }, [])
    );

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/manage-users/', {
                method: 'GET',
                headers: {},
            });
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            Alert.alert("Error", "Unable to fetch users.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = () => {
        navigation.navigate('SupervisorCreate'); // Navigate to SupervisorCreate screen
    };

    const getUserType = (type: string) => {
        switch (type) {
            case 'A':
                return 'Admin';
            case 'S':
                return 'Supervisor';
            case 'D':
                return 'Driver';
            case 'R':
                return 'Rider';
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
                <ThemedText type="title" style={styles.headerText}>Manage Users</ThemedText>
                <TouchableOpacity style={styles.squareButton} onPress={handleCreateUser}>
                    <Ionicons name="create-outline" size={24} color="white"/>
                </TouchableOpacity>
            </View>

            {/* Content Area */}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator}/>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {users.map((user) => (
                        <Card
                            key={user.username}
                            title={user.name}
                            description={`Email: ${user.email}\nType: ${getUserType(user.user_type)}\nAddress: ${user.address}\nPhone Number: ${user.phone_number}`}
                            buttonLabel="Edit"
                            onPress={() => {
                                navigation.navigate('SupervisorEdit', {username: user.username});
                            }}
                            iconName="person"
                        />
                    ))}
                </ScrollView>
            )}
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20, backgroundColor: 'white',},
    header: {flexDirection: 'row', alignItems: 'center', marginBottom: 20,},
    headerText: {flex: 1, fontSize: 28, textAlign: 'center',},
    scrollContainer: {paddingBottom: 20,},
    loadingIndicator: {marginTop: 20,},
    squareButton: {
        width: 35,
        height: 35,
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
});

export default SupervisorUserPage;

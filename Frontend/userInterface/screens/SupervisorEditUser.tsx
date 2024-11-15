import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Platform, Text, TextInput, TouchableOpacity, View} from 'react-native';
import ThemedText from '../components/ThemedText';
import ThemedView from '../components/ThemedView';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "@/components/navigation/NavigationTypes";
import {Ionicons} from "@expo/vector-icons";
import baseStyles from '../styles/General';
import superEdit from '../styles/SuperEdit';

const styles = { ...baseStyles, ...superEdit};

type EditUserPageNavigationProp = StackNavigationProp<RootStackParamList, 'SupervisorEdit'>;
type RouteParams = { username: string };

const SupervisorEditUser: React.FC = () => {
    const navigation = useNavigation<EditUserPageNavigationProp>();
    const route = useRoute();
    const {username} = route.params as RouteParams;

    const [user, setUser] = useState({
        name: '',
        phone_number: '',
        address: '',
        user_type: '',
    });
    const [emailPrefix, setEmailPrefix] = useState('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/manage-users/?username=${username}`);
            const data = await response.json();
            if (response.ok && data.length > 0) {
                const userData = data[0];
                setUser({
                    name: userData.name,
                    phone_number: userData.phone_number,
                    address: userData.address,
                    user_type: userData.user_type,
                });
                const [prefix] = userData.email.split('@');
                setEmailPrefix(prefix);
            } else {
                console.error('Error', data.error || 'Failed to fetch user details.');
            }
        } catch (error) {
            console.error('Error', 'Failed to fetch user details.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async () => {
        const email = `${emailPrefix}@uwm.edu`;
        try {
            const bypass = true;
            const response = await fetch(`http://127.0.0.1:8000/api/manage-users/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username,
                    edit_info: { ...user, email },
                    bypass,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                showAlert('Success', 'User updated successfully.');
                navigation.goBack();
            } else {
                console.error('Error', data.error || 'Error updating user.');
            }
        } catch (error) {
            console.error('Error', 'Failed to update user.');
        }
    };

    const showAlert = (title: string, message: string) => {
        if (Platform.OS === 'web') {
            window.alert(`${title}: ${message}`);
        } else {
            Alert.alert(title, message);
        }
    };

    const handleDeleteUser = async () => {
        if (Platform.OS === 'web') {
            if (window.confirm("Are you sure? This action cannot be undone.")) {
                try {
                    const bypass = true;
                    const response = await fetch(`http://127.0.0.1:8000/api/manage-users/`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            bypass,
                            username,
                            delete: true,
                        }),
                    });
                    if (response.ok) {
                        showAlert('Success', 'User deleted successfully.');
                        navigation.goBack();
                    } else {
                        console.error('Error', 'Error deleting user.');
                    }
                } catch (error) {
                    console.error('Error', 'Failed to delete user.');
                }
            }
        }
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle" size={30} color="black"/>
                </TouchableOpacity>
                <ThemedText type="title" style={styles.headerText}>Edit User</ThemedText>
                <TouchableOpacity onPress={handleDeleteUser}>
                    <Ionicons name="trash" size={30} color="red"/>
                </TouchableOpacity>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff"/>
            ) : (
                <View>
                    <Text style={styles.label}>Name:</Text>
                    <TextInput
                        placeholder="Name"
                        value={user.name}
                        onChangeText={(text) => setUser({...user, name: text})}
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                    <Text style={styles.label}>Email:</Text>
                    <View style={styles.emailContainer}>
                        <TextInput
                            placeholder="Enter email address"
                            value={emailPrefix}
                            onChangeText={(text) => {
                                if (!text.includes('@')) setEmailPrefix(text);
                            }}
                            style={styles.emailInput}
                            placeholderTextColor="gray"
                        />
                        <View style={styles.verticalLine} />
                        <Text style={styles.emailDomain}>@uwm.edu</Text>
                    </View>
                    <Text style={styles.helperText}>You can use letters, numbers & periods</Text>
                    <Text style={styles.label}>Phone Number:</Text>
                    <TextInput
                        placeholder="Phone Number"
                        value={user.phone_number}
                        onChangeText={(text) => setUser({...user, phone_number: text})}
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                    <Text style={styles.label}>Address:</Text>
                    <TextInput
                        placeholder="Address"
                        value={user.address}
                        onChangeText={(text) => setUser({...user, address: text})}
                        style={styles.input}
                        placeholderTextColor="gray"
                    />

                    <View style={styles.radioContainer}>
                        {['Rider', 'Driver', 'Supervisor'].map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={styles.radioButton}
                                onPress={() => setUser({...user, user_type: type[0]})}
                            >
                                <View style={styles.radioOuterCircle}>
                                    {user.user_type === type[0] && <View style={styles.radioInnerCircle}/>}
                                </View>
                                <Text>{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity onPress={handleUpdateUser} style={styles.updateButton}>
                        <ThemedText style={styles.buttonText}>Update User</ThemedText>
                    </TouchableOpacity>
                </View>
            )}
        </ThemedView>
    );
};

export default SupervisorEditUser;

import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import ThemedText from '../components/ThemedText';
import ThemedView from '../components/ThemedView';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "@/components/navigation/NavigationTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Ionicons} from "@expo/vector-icons";

type UserEditInfoNavigationProp = StackNavigationProp<RootStackParamList, 'UserEditInfo'>;
type RouteParams = { username: string };

const UserEditInfo: React.FC = () => {
    const navigation = useNavigation<UserEditInfoNavigationProp>();
    const route = useRoute();
    const {username} = route.params as RouteParams;
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone_number: '',
        address: '',
        password: '',
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [oldPassword, setOldPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [RePassword, setRePassword] = useState('');

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
                    email: userData.email,
                    phone_number: userData.phone_number,
                    address: userData.address,
                    password: '',
                });
            } else {
                console.error('Error', data.error);
            }
        } catch (error) {
            console.error('Error', 'Failed to fetch user details.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateInfo = async () => {
        if(!oldPassword.trim()){
            setErrorMessage('Please enter your current password!')
            return;
        }
        if (!user.password.trim()){
            if (user.password != RePassword) {
                setErrorMessage("Passwords do not match, re-enter your new password.");
                return;
            }
        }
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/manage-users/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username,
                    oldPassword,
                    edit_info: {
                        ...user,
                    },
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setErrorMessage(data.message);
            } else {
                setErrorMessage(data.error);
            }
        } catch (error) {
            setErrorMessage("Current password incorrect!");
        }
    };

    const showAlert = (title: string, message: string) => {
        if (Platform.OS === 'web') {
            window.alert(`${title}: ${message}`);
        } else {
            Alert.alert(title, message);
        }
    };

    const handleDeleteAccount = async () => {
        if(!oldPassword.trim()){
            setErrorMessage('Please enter your current password!')
            return;
        }
        if (Platform.OS === 'web') {
            if (window.confirm("Are you sure? This action cannot be undone.")) {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/api/manage-users/`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            username,
                            delete: true,
                        }),
                    });
                    if (response.ok) {
                        await AsyncStorage.removeItem('accessToken');
                        await AsyncStorage.removeItem('refreshToken');
                        showAlert("Account Deleted", "Your account has been deleted successfully!");
                        navigation.navigate('Login');
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
                <ThemedText type="title" style={styles.headerText}>Edit Account</ThemedText>
                <TouchableOpacity onPress={handleDeleteAccount}>
                    <Ionicons name="trash" size={30} color="red" />
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
                    <TextInput
                        placeholder="Email"
                        value={user.email}
                        onChangeText={(text) => setUser({...user, email: text})}
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
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
                    <Text style={styles.label}>Current Password*:</Text>
                    <TextInput
                        placeholder="Current Password"
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        style={styles.input}
                        secureTextEntry
                        placeholderTextColor="gray"
                    />
                    <Text style={styles.label}>New Password: (leave blank to keep current password)</Text>
                    <TextInput
                        placeholder="New Password"
                        value={user.password}
                        onChangeText={(text) => setUser({...user, password: text})}
                        style={styles.input}
                        secureTextEntry // Secure entry for password
                        placeholderTextColor="gray"
                    />
                    <TextInput
                        placeholder="Confirm Password"
                        value={RePassword}
                        onChangeText={setRePassword}
                        secureTextEntry
                        style={styles.input}
                        placeholderTextColor="gray"
                    />

                    {errorMessage && <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>}

                    <TouchableOpacity onPress={handleUpdateInfo} style={styles.updateButton}>
                        <ThemedText style={styles.buttonText}>Update Info</ThemedText>
                    </TouchableOpacity>
                </View>
            )}
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20},
    input: {height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 15, paddingHorizontal: 10, borderRadius: 10},
    updateButton: {backgroundColor: 'blue', padding: 10, alignItems: 'center', borderRadius: 10, marginBottom: 10},
    deleteButton: {backgroundColor: 'red', padding: 10, alignItems: 'center', borderRadius: 10, marginBottom: 10},
    backButton: {backgroundColor: 'gray', padding: 10, alignItems: 'center', borderRadius: 10},
    buttonText: {color: 'white', fontSize: 16},
    label: {fontSize: 16, marginBottom: 5, color: 'black'},
    errorText: {color: 'red', textAlign: 'center', marginBottom: 10},
    squareButton: {alignItems: 'center', justifyContent: 'center'},
    header: {flexDirection: 'row', alignItems: 'center', marginBottom: 20,},
    headerText: {flex: 1, fontSize: 28, textAlign: 'center',},
});

export default UserEditInfo;

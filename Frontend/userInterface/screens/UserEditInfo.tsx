import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Platform, Text, TextInput, TouchableOpacity, View} from 'react-native';
import ThemedText from '../components/ThemedText';
import ThemedView from '../components/ThemedView';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "@/components/navigation/NavigationTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Ionicons} from "@expo/vector-icons";
import baseStyles from '../styles/General';
import editInfo from '../styles/EditInfo';

const styles = { ...baseStyles, ...editInfo};

type UserEditInfoNavigationProp = StackNavigationProp<RootStackParamList, 'UserEditInfo'>;
type RouteParams = { username: string };

const UserEditInfo: React.FC = () => {
    const navigation = useNavigation<UserEditInfoNavigationProp>();
    const route = useRoute();
    const {username} = route.params as RouteParams;
    const [user, setUser] = useState({
        name: '',
        phone_number: '',
        address: '',
        password: '',
    });
    const [emailPrefix, setEmailPrefix] = useState('');
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
            const response = await fetch(`https://mohammadalsheikh.pythonanywhere.com/api/manage-users/?username=${username}`);
            const data = await response.json();
            if (response.ok && data.length > 0) {
                const userData = data[0];
                const [prefix] = userData.email.split('@');
                setUser({
                    name: userData.name,
                    phone_number: userData.phone_number,
                    address: userData.address,
                    password: '',
                });
                setEmailPrefix(prefix);
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
        if (!oldPassword.trim()) {
            setErrorMessage('Please enter your current password!')
            return;
        }
        if (!user.password.trim()) {
            if (user.password != RePassword) {
                setErrorMessage("Passwords do not match, re-enter your new password.");
                return;
            }
        }
        const email = `${emailPrefix}@uwm.edu`;
        try {
            const response = await fetch(`https://mohammadalsheikh.pythonanywhere.com/api/manage-users/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username,
                    oldPassword,
                    edit_info: {
                        ...user, email
                    },
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setErrorMessage(data.message);
                setOldPassword('');
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
        if (!oldPassword.trim()) {
            setErrorMessage('Please enter your current password!')
            return;
        }
        if (Platform.OS === 'web') {
            if (window.confirm("Are you sure? This action cannot be undone.")) {
                try {
                    const response = await fetch(`https://mohammadalsheikh.pythonanywhere.com/api/manage-users/`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            oldPassword,
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
                        <View style={styles.verticalLine}/>
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
                    <Text style={styles.label}>Current Password*:</Text>
                    <TextInput
                        placeholder="Current Password"
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        style={styles.input}
                        secureTextEntry
                        placeholderTextColor="gray"
                    />
                    <Text style={styles.label}>New Password:</Text>
                    <Text style={styles.helperText}>Leave blank to keep current password!</Text>
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

export default UserEditInfo;

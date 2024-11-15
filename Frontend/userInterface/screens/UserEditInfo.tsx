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
            const response = await fetch(`http://127.0.0.1:8000/api/manage-users/?username=${username}`);
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
            const response = await fetch(`http://127.0.0.1:8000/api/manage-users/`, {
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
                    const response = await fetch(`http://127.0.0.1:8000/api/manage-users/`, {
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
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        padding: 0,
        marginBottom: 5,
        height: 35,
    },
    emailInput: {
        flex: 1,
        color: 'black',
        fontSize: 16,
        borderRadius: 10,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        paddingLeft: 10,
        height: '100%',
        width: '90%',
    },
    emailDomain: {fontSize: 16, color: 'black', marginRight: 3,},
    helperText: {fontSize: 12, color: '#b0b0b0', marginBottom: 15,},
    verticalLine: {width: 2, height: '100%', backgroundColor: 'gray', marginHorizontal: 1,},
});

export default UserEditInfo;

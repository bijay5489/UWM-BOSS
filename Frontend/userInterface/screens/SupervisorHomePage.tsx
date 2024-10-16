import React, {useState, useEffect} from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../components/ThemedText';
import ThemedView from '../components/ThemedView';
import Card from '../components/Card';
import HamburgerMenu from '../components/HamburgerMenu';
import {useNavigation} from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/components/navigation/NavigationTypes";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const SupervisorHomePage: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const navigation = useNavigation<LoginScreenNavigationProp>();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    };

const handleLogout = async () => {
    navigation.navigate('Login');

    // const refreshToken = localStorage.getItem('refresh_token');
    // console.log(refreshToken);
    // try {
    //     const response = await fetch('http://127.0.0.1:8000/api/auth/logout/', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${refreshToken}`,
    //         },
    //         body: JSON.stringify({
    //           'refresh_token': refreshToken
    //         })
    //     });
    //
    //     const data = await response.json();
    //     console.log(data);
    //
    //     if (response.status === 200) {
    //         Alert.alert('Success', 'Logged out successfully');
    //         localStorage.removeItem('access_token');
    //         localStorage.removeItem('refresh_token');
    //         localStorage.removeItem('username');
    //         navigation.navigate('Login');
    //     }
    // } catch (error) {
    //     console.error(error);
    //     Alert.alert('Error', 'Failed to log out. Please try again.');
    // }
}

const handleUserList = async () => {
    navigation.navigate('SupervisorUser');
};

return (
    <ThemedView style={styles.container}>
      {/* Hamburger Menu */}
      <HamburgerMenu isOpen={menuOpen} toggleMenu={toggleMenu} />

      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={32} color="black" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <ThemedText type="title" style={styles.title}>UWM Boss</ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>Supervisor View</ThemedText>
        </View>
      </View>

      {/* Cards Section */}
      <View style={styles.cardsContainer}>
        <Card
            title="Switch View"
            description="Switch to a driver or student rider view."
            buttonLabel="Switch"
            onPress={() => {
                // switch view logic
            }}
        />
        <Card
            title="Users"
            description="View and manage user profiles and access."
            buttonLabel="Users"
            onPress={handleUserList}
        />
        <Card
            title="Generate Report"
            description="Generate detailed reports on user activity."
            buttonLabel="Go"
            onPress={() => {
                // generate report logic
            }}
        />
      </View>

      {/* Log Out Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <ThemedText type="defaultSemiBold" style={styles.logoutText}>Log Out</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  titleContainer: { flex: 1, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 20, marginTop: 5, color: 'gray' },
  cardsContainer: { flex: 1, justifyContent: 'space-around' },
  logoutButton: { backgroundColor: 'red', padding: 15, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  logoutText: { color: 'white', fontSize: 16 }
});

export default SupervisorHomePage;
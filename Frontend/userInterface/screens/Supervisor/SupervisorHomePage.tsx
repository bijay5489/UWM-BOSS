import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import Card from '@/components/Card';
import HamburgerMenu from '@/components/HamburgerMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '@/components/navigation/NavigationTypes';

type SupervisorHomePageNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const SupervisorHomePage: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const navigation = useNavigation<SupervisorHomePageNavigationProp>();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const menuItems: any = [
        {
          label: "Generate Report",
          icon: "document",
          nav: 'GenerateReport',
        },
        {
            label: "Message Driver",
            icon: "chatbubbles",
            nav: 'CreateAccount',
        },
        {
            label: "View Activity",
            icon: "eye",
            nav: 'CreateAccount',
        },
        {
            label: "View Logs",
            icon: "albums",
            nav: 'CreateAccount',
        },
        {
            label: "Settings",
            icon: "settings",
            nav: 'SupervisorSettings',
        }
    ];

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('accesstoken');
            await AsyncStorage.removeItem('refreshtoken');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Error', 'An error occurred while logging out. Please try again.');
        }
    };

    const handleViewReports = async () => {
        try {
            navigation.navigate('ViewReports');
        } catch (error) {
            Alert.alert('Error', 'An error occurred while logging out. Please try again.');
        }
    };

    useEffect(() => {
        const checkLoginStatus = async () => {
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (!accessToken) {
                navigation.navigate('Login');
            }
        };
        checkLoginStatus();
    }, []);

    const handleUserList = async () => {
        navigation.navigate('SupervisorUser');
    };

    return (
        <ThemedView style={styles.container}>
            {/* Hamburger Menu */}
            <HamburgerMenu isOpen={menuOpen} toggleMenu={toggleMenu} menuItems={menuItems}/>

            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity onPress={toggleMenu}>
                    <Ionicons name="menu" size={32} color="black"/>
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <ThemedText type="title" style={styles.title}>UWM Boss</ThemedText>
                    <ThemedText type="subtitle" style={styles.subtitle}>Supervisor View</ThemedText>
                </View>
            </View>

            {/* Cards Section */}
            <View style={styles.cardsContainer}>
                <Card
                    title="View Reports"
                    description="See all currently active reports in the system"
                    buttonLabel="Reports"
                    onPress={handleViewReports}
                    iconName="bar-chart"
                  />
                  <Card
                    title="Users"
                    description="View and manage user profiles and access"
                    buttonLabel="Users"
                    onPress={handleUserList}
                    iconName="people"
                  />
                  <Card
                    title="Vans"
                    description="Manage, view or create new vans"
                    buttonLabel="Vans"
                    onPress={() => {
                        navigation.navigate('SupervisorVans');
                    }}
                    iconName="car"
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
    container: {flex: 1, padding: 20, backgroundColor: 'white'},
    header: {flexDirection: 'row', alignItems: 'center', marginBottom: 20},
    titleContainer: {flex: 1, alignItems: 'center'},
    title: {fontSize: 28, fontWeight: 'bold'},
    subtitle: {fontSize: 20, marginTop: 5, color: 'gray'},
    cardsContainer: {flex: 1, justifyContent: 'space-around'},
    logoutButton: {backgroundColor: 'red', padding: 15, borderRadius: 10, marginTop: 20, alignItems: 'center'},
    logoutText: {color: 'white', fontSize: 16},
});

export default SupervisorHomePage;

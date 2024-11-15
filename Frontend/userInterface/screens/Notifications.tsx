import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ThemedText from '../components/ThemedText';
import ThemedView from '../components/ThemedView';

const Notifications: React.FC = () => {
    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.headerText}>Notifications</ThemedText>
            <Text style={styles.text}>This is a dummy Notifications screen.</Text>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20,
        backgroundColor: 'white',
    },
    headerText: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        marginBottom: 20 
    },
    text: { 
        fontSize: 16, 
        textAlign: 'center' 
    },
});

export default Notifications;

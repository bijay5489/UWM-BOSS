import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import ThemedText from '../components/ThemedText';
import ThemedView from '../components/ThemedView';
import {Ionicons} from "@expo/vector-icons";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "@/components/navigation/NavigationTypes";
import {useNavigation} from "@react-navigation/native";

type SettingsNavigationProp = StackNavigationProp<RootStackParamList, 'UserEditInfo'>;

const PrivacyAndSecurity: React.FC = () => {
    const navigation = useNavigation<SettingsNavigationProp>();
    return (
        <ThemedView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back-circle" size={30} color="black"/>
                    </TouchableOpacity>
                    <ThemedText type="title" style={styles.headerText}>Privacy & Security</ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionHeader}>Privacy Policy</ThemedText>
                    <ThemedText type="default" style={styles.sectionText}>
                        We are committed to protecting your privacy. This app collects personal information solely to
                        enhance your experience, and we do not share your data with third parties without consent.
                    </ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionHeader}>Data Usage</ThemedText>
                    <ThemedText type="default" style={styles.sectionText}>
                        We collect data to improve our services and deliver personalized experiences. Information such
                        as your email and contact details helps us manage your account and assist with support
                        inquiries.
                    </ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionHeader}>Terms of Service</ThemedText>
                    <ThemedText type="default" style={styles.sectionText}>
                        By using this app, you agree to comply with our guidelines and policies. Misuse of the app or
                        attempts to compromise its security will result in restricted access to your account.
                    </ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionHeader}>Security Measures</ThemedText>
                    <ThemedText type="default" style={styles.sectionText}>
                        We employ industry-standard measures to protect your data, including secure storage and
                        encryption. Our team regularly reviews and updates security protocols to safeguard user
                        information.
                    </ThemedText>
                </View>
            </ScrollView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20, backgroundColor: 'white'},
    section: {marginBottom: 20},
    sectionHeader: {fontSize: 20, fontWeight: 'bold', marginBottom: 10},
    sectionText: {fontSize: 16, color: '#333'},
    header: {flexDirection: 'row', alignItems: 'center', marginBottom: 20,},
    headerText: {flex: 1, fontSize: 28, textAlign: 'center',},
});

export default PrivacyAndSecurity;

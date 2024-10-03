import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../components/ThemedText';
import ThemedView from '../components/ThemedView';
import Card from '../components/Card';
import HamburgerMenu from '../components/HamburgerMenu';

const SupervisorHomePage: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
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
        <Card title="Switch View" description="Switch to a driver or student rider view." buttonLabel="Switch" />
        <Card title="Users" description="View and manage user profiles and access." buttonLabel="Users" />
        <Card title="Generate Report" description="Generate detailed reports on user activity." buttonLabel="Go" />
      </View>

      {/* Log Out Button */}
      <TouchableOpacity style={styles.logoutButton}>
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
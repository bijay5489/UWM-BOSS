import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IoniconNames = keyof typeof Ionicons.glyphMap;

const screenWidth = Dimensions.get('window').width;

interface HamburgerMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, toggleMenu }) => {
  return (
    <Animated.View style={[styles.menuContainer, { transform: [{ translateX: isOpen ? 0 : -screenWidth }] }]}>
      <View style={styles.header}>
        <Text style={styles.menuTitle}>Supervisor Menu</Text>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.menuItems}>
        <MenuItem label="View Reports" icon="document" />
        <MenuItem label="Message Driver" icon="chatbubbles" />
        <MenuItem label="View Activity" icon="eye" />
        <MenuItem label="View Logs" icon="albums" />
        <MenuItem label="Settings" icon="settings" />
      </View>
    </Animated.View>
  );
};

interface MenuItemProps {
  label: string;
  icon: IoniconNames;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, icon }) => {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <Ionicons name={icon} size={24} color="black" />
      <Text style={styles.menuLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '75%',
    height: '50%',
    backgroundColor: 'white',
    padding: 20,
    zIndex: 1000,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuTitle: { fontSize: 20, fontWeight: 'bold' },
  menuItems: { flex: 1 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuLabel: { marginLeft: 10, fontSize: 16 },
  logoutButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: { color: 'white', fontSize: 16 },
});

export default HamburgerMenu;
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/navigation/NavigationTypes';

type IoniconNames = keyof typeof Ionicons.glyphMap;

const screenWidth = Dimensions.get('window').width;

interface HamburgerMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
  menuItems: any[];
}

type HamburgerNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, toggleMenu, menuItems }) => {
  const navigation = useNavigation<HamburgerNavigationProp>();
  const translateX = useRef(new Animated.Value(-screenWidth)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);
  const handleNavigate = async (screen: any) => {
    navigation.navigate(screen);
  };
  return (
    <Animated.View style={[styles.menuContainer, { transform: [{ translateX }] }]}>
      <View style={styles.header}>
        <Text style={styles.menuTitle}>Supervisor Menu</Text>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.menuItems}>
        {menuItems.map((i) => (
            <MenuItem key={`${i.icon},${i.label},${i.nav}`} label={i.label} icon={i.icon} nav={i.nav} handlePress={handleNavigate} />
        ))}
      </View>
    </Animated.View>
  );
};

interface MenuItemProps {
  label: string;
  icon: IoniconNames;
  nav: any;
  handlePress: (screen: any) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, icon, handlePress, nav }) => {
  return (
      <TouchableOpacity style={styles.menuItem} onPress={() => handlePress(nav)}>
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
    width: '65%',
    height: 300,
    backgroundColor: 'white',
    padding: 20,
    zIndex: 1000,
    elevation: 10,
    borderColor: '#add',
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
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
});

export default HamburgerMenu;
import { Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IoniconNames = keyof typeof Ionicons.glyphMap;

interface MenuItemProps {
  label: string;
  icon: IoniconNames;
  handlePress: (screen: any) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, icon, handlePress }) => {
  return (
      <TouchableOpacity style={styles.menuItem} onPress={() => handlePress('CreateAccount')}>
        <Ionicons name={icon} size={24} color="black" />
        <Text style={styles.menuLabel}>{label}</Text>
      </TouchableOpacity>
  );
};
export default MenuItem;
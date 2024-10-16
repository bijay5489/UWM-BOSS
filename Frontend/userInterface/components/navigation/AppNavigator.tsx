import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from "@/screens/Login";
import SupervisorHomePage from "@/screens/SupervisorHomePage";
import SupervisorUserPage from "@/screens/SupervisorUserPage";
import {RootStackParamList} from "@/components/navigation/NavigationTypes";
import CreateAccount from "@/screens/CreateAccount";

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SupervisorHome" component={SupervisorHomePage} />
        <Stack.Screen name="SupervisorUser" component={SupervisorUserPage} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
    </Stack.Navigator>
  );
};

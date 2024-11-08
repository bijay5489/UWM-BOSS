import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from "@/screens/Login";
import SupervisorHomePage from "@/screens/SupervisorHomePage";
import SupervisorUserPage from "@/screens/SupervisorUserPage";
import {RootStackParamList} from "@/components/navigation/NavigationTypes";
import CreateAccount from "@/screens/CreateAccount";
import SupervisorEditUser from "@/screens/SupervisorEditUser";
import SupervisorCreate from "@/screens/SupervisorCreate";
import RiderDashboard from "@/screens/RiderDashboard";
import UserEditInfo from "@/screens/UserEditInfo";
import GenerateReport from "@/screens/GenerateReport";
import ViewReports from "@/screens/ViewReports";
import SupervisorSettings from "@/screens/SupervisorSettings";
import CreateRide from "@/screens/CreateRide";
import QueuePositionScreen from "@/screens/QueuePositionScreen";
import DisplayRideInfo from "@/screens/DisplayRideInfo";
import AssignedRides from '@/screens/AssignedRides';
import DriverDashboard from "@/screens/DriverDashboard";

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    return (
    <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SupervisorHome" component={SupervisorHomePage} />
        <Stack.Screen name="SupervisorUser" component={SupervisorUserPage} />
        <Stack.Screen name="SupervisorEdit" component={SupervisorEditUser} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="SupervisorCreate" component={SupervisorCreate} />
        <Stack.Screen name="RiderDashboard" component={RiderDashboard} />
        <Stack.Screen name="UserEditInfo" component={UserEditInfo} />
        <Stack.Screen name="GenerateReport" component={GenerateReport} />
        <Stack.Screen name="ViewReports" component={ViewReports} />
        <Stack.Screen name="SupervisorSettings" component={SupervisorSettings} />
        <Stack.Screen name="CreateRide" component={CreateRide} />
        <Stack.Screen name="Queue" component={QueuePositionScreen} />
        <Stack.Screen name="DisplayRideInfo" component={DisplayRideInfo} />
        <Stack.Screen name="AssignedRides" component={AssignedRides} />
        <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
    </Stack.Navigator>
    );
};

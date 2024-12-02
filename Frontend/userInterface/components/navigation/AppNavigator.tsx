import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from "@/screens/Login";
import SupervisorHomePage from "@/screens/Supervisor/SupervisorHomePage";
import SupervisorUserPage from "@/screens/Supervisor/SupervisorUserPage";
import {RootStackParamList} from "@/components/navigation/NavigationTypes";
import CreateAccount from "@/screens/CreateAccount";
import SupervisorEditUser from "@/screens/Supervisor/SupervisorEditUser";
import SupervisorCreate from "@/screens/Supervisor/SupervisorCreate";
import RiderDashboard from "@/screens/Rider/RiderDashboard";
import UserEditInfo from "@/screens/UserEditInfo";
import GenerateReport from "@/screens/GenerateReport";
import ViewReports from "@/screens/Supervisor/ViewReports";
import SupervisorSettings from "@/screens/Supervisor/SupervisorSettings";
import CreateRide from "@/screens/Rider/CreateRide";
import QueuePositionScreen from "@/screens/Rider/QueuePositionScreen";
import DisplayRideInfo from "@/screens/DisplayRideInfo";
import Notifications from '@/screens/Notifications'; 
import AssignedRides from '@/screens/Driver/AssignedRides';
import DriverDashboard from "@/screens/Driver/DriverDashboard";
import ForgetPassword from "@/screens/ForgetPassword";
import SupervisorPrivacy from '@/screens/Supervisor/SupervisorPrivacy';
import RideHistory from "@/screens/RideHistory";

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
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="SupervisorPrivacy" component={SupervisorPrivacy} />
        <Stack.Screen name="RideHistory" component={RideHistory} />
    </Stack.Navigator>
    );
};

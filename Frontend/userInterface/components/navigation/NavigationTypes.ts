export type RootStackParamList = {
  Login: undefined;
  SupervisorHome: undefined;
  SupervisorUser: undefined;
  SupervisorEdit: { username: string };
  CreateAccount: undefined;
  SupervisorCreate: undefined;
  RiderDashboard: undefined;
  UserEditInfo: { username: string };
  GenerateReport: undefined;
  ViewReports: undefined;
  CreateRide: undefined;
  Queue: { queuePosition: number, rideId: number, driverName: string };
  DisplayRideInfo: { rideId: number, driverName: string };
};
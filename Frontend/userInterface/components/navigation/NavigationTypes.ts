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
  AssignedRides: undefined;
  ViewReports: undefined;
  SupervisorSettings: undefined;
  CreateRide: undefined;
  Notifications: undefined;
  Queue: { queuePosition: number, rideId: number, driverName: string };
  DisplayRideInfo: { rideId: number, driverName: string };
  DriverDashboard: undefined;
  ForgetPassword: undefined;
  SupervisorPrivacy: undefined;
  RideHistory: undefined;
  SupervisorVans: undefined;
  SupervisorCreateVan: undefined;
  SupervisorEditVan: { id: number }
  ViewLogs: undefined;
};
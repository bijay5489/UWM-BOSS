from django.core.serializers import serialize
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.shortcuts import redirect
from .models import User
from .serializer import UserSerializer, RideSerializer
from .functions import UserFunctions, RideManagement


# Create an account (Register a new user)
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Account created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Login view with different homepage redirection based on user type
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)

            # Redirect based on user type
            if user.user_type == 'S':
                return Response({"message": "Logged in as Supervisor", "homepage": "/supervisor/home"},
                                status=status.HTTP_200_OK)
            elif user.user_type == 'D':
                return Response({"message": "Logged in as Driver", "homepage": "/driver/home"},
                                status=status.HTTP_200_OK)
            elif user.user_type == 'R':
                return Response({"message": "Logged in as Rider", "homepage": "/rider/home"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid username or password"}, status=status.HTTP_400_BAD_REQUEST)


user_functions = UserFunctions()


class ManageUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Retrieve and return all users
        if request.user.user_type not in ['S', 'A']:  # Assuming 'A' is for Admin
            return Response({"error": "You do not have permission to access this resource."},
                            status=status.HTTP_403_FORBIDDEN)
        users = user_functions.get_all()
        return Response(users)

    def post(self, request):
        data = request.data
        username = data.get('username')
        edit_info = data.get('edit_info', {})

        if 'delete' in data and data['delete']:
            # Delete the user
            success = user_functions.delete(username)
            if success:
                return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Update user information
            success = user_functions.edit(username, edit_info)
            if success:
                return Response({"message": "User information updated successfully."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Error updating user information."}, status=status.HTTP_400_BAD_REQUEST)


# Logout view
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_all_rides(request):
    rides = RideManagement().get_all()
    serializer = RideSerializer(rides, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_ride_by_driver(request, driver_id, ride_status=None):
    ride = RideManagement().get_by_driver_id(_id=driver_id, status=ride_status)
    serializer = RideSerializer(ride, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_ride_by_rider(request, rider_id, ride_status=None):
    ride = RideManagement().get_by_rider_id(_id=rider_id, status=ride_status)
    serializer = RideSerializer(ride, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_ride_by_van(request, van_id, ride_status=None):
    ride = RideManagement().get_by_rider_id(_id=van_id, status=ride_status)
    serializer = RideSerializer(ride, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def assign_driver(request, ride_id):
    result = RideManagement().assign_driver_task(ride_id)
    if result:
        return Response({"message": "Driver assigned successfully."}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Error assigning driver."}, status=status.HTTP_400_BAD_REQUEST)


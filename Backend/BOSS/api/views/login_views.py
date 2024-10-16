# Login view with different homepage redirection based on user type
from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)

            # Redirect based on user type
            if user.user_type == 'S':
                return Response({"message": "Logged in as Supervisor", "user_type": "S"},
                                status=status.HTTP_200_OK)
            elif user.user_type == 'D':
                return Response({"message": "Logged in as Driver", "user_type": "D"},
                                status=status.HTTP_200_OK)
            elif user.user_type == 'R':
                return Response({"message": "Logged in as Rider", "user_type": "R"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid username or password"}, status=status.HTTP_400_BAD_REQUEST)


# Logout view
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

# Login view with different homepage redirection based on user type
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from ..functions import UserFunctions
from api.models import User


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:

            access_token = AccessToken.for_user(user)
            refresh_token = RefreshToken.for_user(user)
            return Response({
                "message": "Logged in successfully",
                "user_type": user.user_type,
                "access": str(access_token),
                "refresh": str(refresh_token),
                "riderId": user.id,
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid username or password"}, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        functions = UserFunctions()
        try:
            user = User.objects.get(username=username)
            result = functions.edit(username=user.username, info={'password': password})
            if result:
                return Response({"message": "Password reset successfully!"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Edit function error!"}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"message": "User not found!"}, status=status.HTTP_400_BAD_REQUEST)



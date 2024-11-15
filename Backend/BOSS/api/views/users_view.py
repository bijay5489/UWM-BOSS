from django.contrib.auth.hashers import check_password
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from api.functions import UserFunctions
from api.models import User

user_functions = UserFunctions()


class ManageUsersView(APIView):

    def get(self, request):
        username = request.query_params.get('username')

        if username:
            user = user_functions.get('username', username)
            if user:
                return Response(user)
            else:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            users = user_functions.get_all()
            return Response(users)

    def post(self, request):
        data = request.data
        username = data.get('username')
        old_password = data.get('oldPassword')
        edit_info = data.get('edit_info', {})
        user = User.objects.get(username=username)

        if 'delete' in data and data['delete']:
            if check_password(old_password, user.password) or data.get('bypass'):
                # Delete the user
                success = user_functions.delete(username)
                if success:
                    return Response({"message": "User deleted successfully!"}, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"error": "Current password incorrect!"}, status=status.HTTP_304_NOT_MODIFIED)
        else:
            if check_password(old_password, user.password) or data.get('bypass'):
                # Update user information
                success = user_functions.edit(username, edit_info)
                if success:
                    return Response({"message": "User information updated successfully."}, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Error updating user information."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"error": "Current password incorrect!"}, status=status.HTTP_304_NOT_MODIFIED)

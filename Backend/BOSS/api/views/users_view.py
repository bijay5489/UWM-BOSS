from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from api.functions import UserFunctions

user_functions = UserFunctions()


class ManageUsersView(APIView):

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

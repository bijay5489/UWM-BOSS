from rest_framework import viewsets
from ..models import Van
from ..serializer import VanSerializer
from ..functions import VanManagement

class VanViewSet(viewsets.ModelViewSet):
    queryset = Van.objects.all()
    serializer_class = VanSerializer

    van_functions = VanManagement()

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

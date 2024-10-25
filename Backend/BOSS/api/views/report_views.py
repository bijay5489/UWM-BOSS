from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.functions import ReportManager


class ReportView(APIView):
    def post(self, request):
        result = ReportManager.create(info=request.data)
        if result:
            return Response({"message": "Report created successfully"}, status=status.HTTP_201_CREATED)
        return Response({"message": "Report creation failed"}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        result = ReportManager().get_all()
        return Response(result)
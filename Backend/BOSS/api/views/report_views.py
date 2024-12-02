from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.functions import ReportManager, RideManagement


class ReportView(APIView):
    def post(self, request):
        ride = RideManagement().get_by_id(request.data.get('ride_id'), 'ride')
        combined_data = {**request.data, 'ride': ride}
        result = ReportManager.create(info=combined_data)
        if result:
            return Response({"message": "Report created successfully"}, status=status.HTTP_201_CREATED)
        return Response({"message": "Report creation failed"}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        result = ReportManager().get_all()
        return Response(result)
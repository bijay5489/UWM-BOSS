from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..functions import RideManagement
from ..models import Ride, User
from ..serializer import RideSerializer


@api_view(['GET'])
def get_all_rides(request):
    rides = RideManagement().get_all()
    serializer = RideSerializer(rides, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_ride_by_id(request, ride_id):
    try:
        ride = Ride.objects.get(id=ride_id)
    except Ride.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = RideSerializer(ride)
    return Response(serializer.data)


@api_view(['GET'])
def get_ride_by_driver(request, driver_id, ride_status=None):
    try:
        ride = RideManagement().get_by_id(driver_id, 'driver', ride_status)
    except Ride.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = RideSerializer(ride)
    return Response(serializer.data)


@api_view(['GET'])
def get_rides_by_rider(request, rider_id, ride_status=None):
    ride = RideManagement().get_by_id(rider_id, 'rider', ride_status)
    serializer = RideSerializer(ride, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_ride_by_van(request, van_id, ride_status=None):
    ride = RideManagement().get_by_id(van_id, 'van', ride_status)
    serializer = RideSerializer(ride)
    return Response(serializer.data)


@api_view(['POST'])
def assign_driver(request, ride_id):
    result = RideManagement().assign_driver(ride_id)
    if result:
        return Response({"message": "Driver assigned successfully."}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Error assigning driver."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_ride(request, ride_id):
    result = RideManagement().delete(ride_id)
    if result:
        return Response({"message": "Ride deleted successfully."}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Ride not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def create_ride(request):
    riderU = request.data.get('username')
    rider = User.objects.get(username=riderU)
    ride_info = request.data
    result = RideManagement().create(rider, ride_info)
    if result:
        rideid = Ride.objects.get(rider=rider, status='in_progress').id
        ridedriver = Ride.objects.get(id=rideid).driver.name
        return Response({"message": "Ride created successfully.", "ride_id": rideid, "driver": ridedriver}, status=status.HTTP_201_CREATED)
    rides = Ride.objects.filter(status='pending').count()
    rideid = Ride.objects.get(rider=rider, status='pending').id
    return Response({"message": "Ride created but no available drivers", "queue_position": rides, "ride_id": rideid}, status=status.HTTP_200_OK)


@api_view(['EDIT'])
def edit_ride(request, ride_id, updated_info):
    result = RideManagement().edit(ride_id, updated_info)
    if result:
        return Response({"message": "Ride updated successfully."}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Error updating ride."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_queue_position(request, rider_id):
    """Retrieve the updated position in the queue for a given rider."""
    try:
        rider = User.objects.get(username=rider_id)
        ride = Ride.objects.get(rider=rider, status='pending')
        queue_position = Ride.objects.filter(status='pending').count()
        if queue_position == 1:
            result = RideManagement().assign_driver(ride.id)
            if result:
                return Response({"Driver assigned to ride!"}, status=status.HTTP_202_ACCEPTED)
            else:
                return Response({"queue_position": queue_position}, status=status.HTTP_200_OK)
        else:
            return Response({"queue_position": queue_position}, status=status.HTTP_200_OK)
    except Ride.DoesNotExist:
            return Response({"error": "Ride not found or already assigned.","queue_position": 0}, status=status.HTTP_404_NOT_FOUND)



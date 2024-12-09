import random

from django.conf import settings
import requests
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..functions import RideManagement
from ..models import Ride, User
from ..serializer import RideSerializer

GOOGLE_PLACES_API_URL = "https://maps.googleapis.com/maps/api/place/autocomplete/json"


@api_view(['GET'])
def location_search(request):
    query = request.query_params.get('query', '')
    if not query:
        return Response({"message": "Query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

    params = {
        'input': query,
        'key': settings.GOOGLE_PLACES_API_KEY,
        'types': 'geocode',
    }

    try:
        response = requests.get(GOOGLE_PLACES_API_URL, params=params)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        data = response.json()
        if data.get('status') == 'OK':
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({"error": data.get('status', 'Unknown error')},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except requests.RequestException as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:  # Catch any other exceptions
        return Response({"error": "An unexpected error occurred: " + str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_all_rides(request, rstatus):
    if isinstance(rstatus, str):
        rstatus = rstatus.split(',')
    rides = Ride.objects.exclude(status__in=rstatus)
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
def get_ride_by_driver(request, driver_id, ride_status):
    try:
        driver = User.objects.get(username=driver_id)
        ride = Ride.objects.get(driver=driver, status=ride_status)
    except Ride.DoesNotExist:
        return Response(status=status.HTTP_202_ACCEPTED)
    serializer = RideSerializer(ride)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_rides_by_rider(request, rider_id, ride_status=None):
    try:
        user = User.objects.get(id=rider_id)
    except User.DoesNotExist:
        return Response({"error": "Rider not found"}, status=status.HTTP_404_NOT_FOUND)
    if user.user_type == 'D':
        rides = RideManagement().get_by_id(rider_id, 'driver')
        serializer = RideSerializer(rides, many=True)
        return Response(serializer.data)
    if ride_status is None:
        rides = RideManagement().get_by_id(rider_id, 'rider')
        serializer = RideSerializer(rides, many=True)
        return Response(serializer.data)
    rides = RideManagement().get_by_id(rider_id, 'rider', ride_status)
    serializer = RideSerializer(rides, many=True)
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
    rider_username = request.data.get('username')
    inProgress = False
    try:
        rider = User.objects.get(username=rider_username)
    except User.DoesNotExist:
        return Response({"error": "Rider not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        inprogress = Ride.objects.get(rider=rider, status='in_progress')
        if inprogress:
            inProgress = True
            return Response({"message": "Ride already in-progress.", "inProgress": inProgress}, status=status.HTTP_400_BAD_REQUEST)
    except Ride.DoesNotExist:
        test = None

    ride_info = request.data
    result = RideManagement().create(rider, ride_info)
    ride_code = random.randint(1000, 9999)


    if result:
        try:
            ride = Ride.objects.get(rider=rider, status='in_progress')
            inProgress = True
            return Response({"message": "Ride created successfully.", "ride_id": ride.id, "driver": ride.driver.name, "ride_code": ride_code, "inProgress": inProgress}, status=status.HTTP_201_CREATED)
        except Ride.DoesNotExist:
            return Response({"error": "Ride in progress not found"}, status=status.HTTP_404_NOT_FOUND)
    ride = Ride.objects.get(rider=rider, status='pending')
    pending_count = Ride.objects.filter(status='pending').count()
    return Response({"message": "Ride created but no available drivers", "queue_position": pending_count, "ride_id": ride.id, "ride_code": ride_code, "inProgress": inProgress}, status=status.HTTP_200_OK)

@api_view(['PUT'])
def edit_ride(request, ride_id):
    updated_info = request.data
    result = RideManagement().edit(ride_id, updated_info)
    if result:
        return Response({"message": "Ride updated successfully."}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Error updating ride."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_queue_position(request, rider_id):
    """Retrieve the updated position in the queue for a given rider."""
    rider = User.objects.get(username=rider_id)
    ride = Ride.objects.filter(rider=rider, status='pending').first()
    queue_position = Ride.objects.filter(status='pending', id__lt=ride.id).count() + 1
    if not ride:
        return Response({"error": "Ride not found or already assigned.", "queue_position": 0}, status=status.HTTP_404_NOT_FOUND)

    if queue_position == 1:
        if RideManagement().assign_driver(ride.id):
            curRide = Ride.objects.get(rider=rider, status='in_progress')
            return Response({"message": "Driver assigned to ride!", "ride_id": curRide.id, "driver": curRide.driver.name}, status=status.HTTP_202_ACCEPTED)

    return Response({"queue_position": queue_position}, status=status.HTTP_200_OK)


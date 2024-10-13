from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('manage-users/', ManageUsersView.as_view(), name='manage_users'),
    path('rides/get-by-driver-id/<int:driver_id>/status/<str:ride_status>', get_ride_by_driver),
    path('rides/get-by-driver-id/<int:driver_id>', get_ride_by_driver),

    path('rides/get-by-rider-id/<int:rider_id>/status/<str:ride_status>', get_ride_by_rider),
    path('rides/get-by-rider-id/<int:rider_id>', get_ride_by_rider),
    path('rides/get-by-van-id/<int:van_id>/status/<str:ride_status>', get_ride_by_van),
    path('rides/get-by-van-id/<int:van_id>', get_ride_by_van),
    path('rides/assign-driver/<int:ride_id>', assign_driver),
    path('rides/delete/<int:ride_id>', delete_ride),
    path('rides/get-all', get_all_rides),
]

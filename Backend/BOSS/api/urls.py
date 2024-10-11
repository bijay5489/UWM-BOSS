from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('manage-users/', ManageUsersView.as_view(), name='manage_users'),
    path('rides/get-by-driver-id/<int:driver_id>/status/<str:ride_status>', get_ride_by_driver),
    path('rides/get-by-driver-id/<int:driver_id>', get_ride_by_driver),

    path('rides/get-all', get_all_rides),
]

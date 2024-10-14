from django.urls import path, include
from views import ManageUsersView


urlpatterns = [
    path('manage-users/', ManageUsersView.as_view(), name='manage_users'),
    path('api/', include('api.urls')),
]

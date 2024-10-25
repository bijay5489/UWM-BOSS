from django.urls import path, include
from .. import views

urlpatterns = [
    path('rides/', include('api.urls.ride_urls')),
    path('auth/', include('api.urls.auth_urls')),
    path('manage-users/', views.ManageUsersView.as_view(), name='manage_users'),
    path('report/', include('api.urls.reports_urls')),
]

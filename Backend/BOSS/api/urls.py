from django.urls import path
from .views import RegisterView, LoginView, LogoutView, ManageUsersView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('manage-users/', ManageUsersView.as_view(), name='manage_users'),
]
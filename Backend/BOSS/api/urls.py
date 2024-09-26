from .views import get_message
from django.urls import path

urlpatterns = [
    path('messages/', get_message, name='get_message')
]
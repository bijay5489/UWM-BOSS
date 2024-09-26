from django.shortcuts import render
from .functions import user_login, user_logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Message
from .serializer import MessageSerializer


@api_view(['GET'])
def get_message(request):
    return Response(MessageSerializer({'text': 'hi'}).data)

# Example login view
def login_view(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        return user_login(request, username, password)

# Example logout view
@login_required
def logout_view(request):
    return user_logout(request)

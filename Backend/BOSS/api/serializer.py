# serializers.py
from rest_framework import serializers
from .models import User
import api.functions as functions

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'name', 'phone_number', 'address', 'email', 'user_type']

    # Hash the password before saving the user
    def create(self, validated_data):
        user_func = functions.UserFunctions()
        user = user_func.create(validated_data)
        return user
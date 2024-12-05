# serializers.py
from rest_framework import serializers
from .models import User, Ride, Report, Van
import api.functions as functions


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'name', 'phone_number', 'address', 'email', 'user_type']

    def create(self, validated_data):
        user_func = functions.UserFunctions()
        try:
            return user_func.create(validated_data)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"detail": str(e)})


class RideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ride
        fields = '__all__'

class ReportSerializer(serializers.ModelSerializer):
    reporter = serializers.StringRelatedField(source='reporter.name')

    class Meta:
        model = Report
        fields = ['id', 'reporter', 'report_type', 'context']

class VanSerializer(serializers.ModelSerializer):
    driver = UserSerializer()

    class Meta:
        model = Van
        fields = '__all__'

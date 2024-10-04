from django.contrib import admin
from .models import User, Van, Ride, Message, Report, Notification

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'name', 'email', 'user_type', 'status')
    search_fields = ('username', 'name', 'email')
    list_filter = ('user_type', 'status')

@admin.register(Van)
class VanAdmin(admin.ModelAdmin):
    list_display = ('van_number', 'ADA', 'driver')
    search_fields = ('van_number',)
    list_filter = ('ADA',)

@admin.register(Ride)
class RideAdmin(admin.ModelAdmin):
    list_display = ('ride_id', 'rider', 'driver', 'status', 'pickup_location', 'dropoff_location')
    search_fields = ('rider__username', 'driver__username', 'pickup_location', 'dropoff_location')
    list_filter = ('status',)

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('rider', 'driver', 'text')
    search_fields = ('text',)

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('reporter', 'report_type', 'context')
    search_fields = ('context',)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('rider', 'text')
    search_fields = ('text',)

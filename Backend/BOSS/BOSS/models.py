from django.db import models

# Abstract base class for common fields
class Account(models.Model):
    PANTHER_ROLE_CHOICES = [
        ('rider', 'Rider'),
        ('driver', 'Driver'),
        ('supervisor', 'Supervisor'),
    ]
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=PANTHER_ROLE_CHOICES)

    class Meta:
        abstract = True  # Since both Rider, Driver, and Supervisor will inherit from this class

class Rider(Account):
    panther_id = models.CharField(max_length=50, primary_key=True)
    # Additional Rider-specific fields can go here

class Driver(Account):
    panther_id = models.CharField(max_length=50, primary_key=True)
    # Additional Driver-specific fields can go here

class Supervisor(Account):
    supervisor_id = models.AutoField(primary_key=True)
    # Additional Supervisor-specific fields

class Van(models.Model):
    van_number = models.AutoField(primary_key=True)
    ADA = models.BooleanField(default=False)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)

class Ride(models.Model):
    van = models.ForeignKey(Van, on_delete=models.CASCADE)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    rider = models.ForeignKey(Rider, on_delete=models.CASCADE)
    pickup_location = models.CharField(max_length=200)
    dropoff_location = models.CharField(max_length=200)
    num_passengers = models.IntegerField(default=1)
    is_accessible = models.BooleanField(default=False)

class RideRequest(models.Model):
    rider = models.ForeignKey(Rider, on_delete=models.CASCADE)
    pickup_location = models.CharField(max_length=200)
    dropoff_location = models.CharField(max_length=200)
    num_passengers = models.IntegerField(default=1)
    ADA_required = models.BooleanField(default=False)
    ride_status = models.CharField(max_length=50, default='Pending')
    pickup_time = models.DateTimeField()

class Message(models.Model):
    rider = models.ForeignKey(Rider, on_delete=models.CASCADE)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    text = models.TextField()

class Report(models.Model):
    Report_Category = [
        ('driver', 'Driver'),
        ('ride', 'Ride'),
    ]
    reporter = models.ForeignKey(Account, related_name='reporter', on_delete=models.CASCADE)
    report_type = models.CharField(max_length=20, choices=Report_Category)
    context = models.TextField()

class Notification(models.Model):
    rider = models.ForeignKey(Rider, on_delete=models.CASCADE)
    text = models.TextField()
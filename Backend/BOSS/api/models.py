from django.db import models


class User(models.Model):
    """
    Represents a user in the UWM BOSS system.
    """
    USER_TYPES = (
        ('S', 'Supervisor'),
        ('D', 'Driver'),
        ('R', 'Rider'),
    )

    DRIVER_STATUS = (
        ('available', 'Available'),
        ('assigned', 'Assigned'),
    )

    username = models.CharField(max_length=25, unique=True)
    password = models.CharField(max_length=25)
    name = models.CharField(max_length=75)
    phone_number = models.CharField(max_length=11)
    address = models.TextField()
    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=1, choices=USER_TYPES, default='S')
    status = models.CharField(max_length=10, choices=DRIVER_STATUS, default='available', null=True, blank=True)

    def __str__(self):
        return self.username

class Van(models.Model):
    van_number = models.CharField(max_length=15, primary_key=True)
    ADA = models.BooleanField(default=False)
    driver = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'user_type': 'D'})

    def __str__(self):
        return f"Van {self.van_number} - ADA: {self.ADA}"


class Ride(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),        # Ride requested but not yet confirmed
        ('assigned', 'Assigned'),      # Driver assigned to the ride
        ('in_progress', 'In Progress'), # Ride is currently happening
        ('completed', 'Completed'),     # Ride has been completed
        ('cancelled', 'Cancelled'),     # Ride was cancelled
    ]
    ride_id = models.AutoField(primary_key=True)
    rider = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'user_type': 'R'}, related_name='ride_rider')
    driver = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'user_type': 'D'}, null=True, blank=True, related_name='ride_driver')
    van = models.ForeignKey(Van, on_delete=models.CASCADE, null=True, blank=True)
    pickup_location = models.CharField(max_length=200)
    dropoff_location = models.CharField(max_length=200)
    num_passengers = models.IntegerField(default=1)
    ADA_required = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    pickup_time = models.DateTimeField(null=True, blank=True)  # Optional pickup time for requests

    def __str__(self):
        return f"{self.rider.username} - {self.status}"

class Message(models.Model):
    rider = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'user_type': 'R'},
                              related_name='messages_as_rider')
    driver = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'user_type': 'D'},
                               related_name='messages_as_driver')
    text = models.TextField()


class Report(models.Model):
    REPORT_CATEGORIES = [
        ('safety', 'Safety Issue'),
        ('service', 'Service Issue'),
        ('delay', 'Delay'),
        ('vehicle', 'Vehicle Condition'),
        ('other', 'Other'),
    ]
    # Reporter can be either a Rider or a Driver
    reporter = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE, related_name='reports')
    report_type = models.CharField(max_length=20, choices=REPORT_CATEGORIES)
    context = models.TextField()

    def __str__(self):
        return f"Report by {self.reporter.name} - {self.get_report_type_display()}"

    def save(self, *args, **kwargs):
        # Ensure that the reporter is either a Rider or a Driver
        if self.reporter.user_type not in ['R', 'D']:
            raise ValueError("Reporter must be either a Rider or Driver.")
        super().save(*args, **kwargs)


class Notification(models.Model):
    rider = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'user_type': 'R'})
    text = models.TextField()
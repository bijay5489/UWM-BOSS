from django.utils import timezone
from api.models import Ride, User, Van


class RideManagement:
    def create(self, rider: User, ride_info: dict) -> bool:
        """Create a new ride."""
        if rider.user_type != 'R':
            return False

        ride = Ride(
            rider=rider,
            pickup_location=ride_info.get('pickup_location'),
            dropoff_location=ride_info.get('dropoff_location'),
            num_passengers=ride_info.get('num_passengers', 1),
            ADA_required=ride_info.get('ADA_required'),
            van=ride_info.get('van'),
            pickup_time=ride_info.get('pickup_time'),
        )
        status = ride_info.get('status')
        if status is not None:
            ride.status = status
        ride.save()
        result = self.assign_driver(ride.id)
        if result:
            return True
        else:
            return False

    def edit(self, ride_id: int, ride_info: dict) -> bool:
        """Edit an existing ride."""
        try:
            ride = Ride.objects.get(id=ride_id)
            for attr, value in ride_info.items():
                setattr(ride, attr, value)
            if ride.status in ['cancelled', 'completed']:
                driver = ride.driver
                driver.status = 'available'
                driver.save()
            ride.save()
            return True
        except Ride.DoesNotExist:
            return False

    def delete(self, ride_id: int) -> bool:
        """Delete a ride."""
        try:
            ride = Ride.objects.get(id=ride_id)
            driver = ride.driver
            driver.status = 'available'
            driver.save()
            ride.delete()
            return True
        except Ride.DoesNotExist:
            return False

    def assign_driver(self, ride_id) -> bool:
        """Assign a driver to an existing ride."""
        try:
            ride = Ride.objects.get(id=ride_id)
            if ride.driver is not None:
                return False
        except Ride.DoesNotExist:
            return False

        available_drivers = User.objects.filter(user_type='D', status__iexact='Available')
        if not available_drivers.exists():
            return False
        driver = available_drivers.first()
        ride.driver = driver
        ride.van = Van.objects.get(driver=driver)
        ride.status = 'in_progress'
        ride.save()
        driver.status = 'assigned'
        driver.save()
        return True

    def assign_driver_task(self, ride_id) -> bool:
        result = self.assign_driver(ride_id)
        retries = 0

        while not result:
            if retries > 10:
                return False
            result = self.assign_driver(ride_id)
        return result

    # Get a ride by ride, driver, rider, or van id with an optional status parameter
    def get_by_id(self, _id: int, entity: str = None, _status: str = None) -> list | None:
        rides = None
        if entity is None or entity == 'ride':
            if _status is not None:
                rides = Ride.objects.filter(id=_id, status__iexact=_status)
            else:
                rides = Ride.objects.filter(id=_id)
        elif entity == 'driver':
            if _status is not None:
                rides = Ride.objects.filter(driver__id=_id, status__iexact=_status)
            else:
                rides = Ride.objects.filter(driver__id=_id)
        elif entity == 'rider':
            if _status is not None:
                rides = Ride.objects.filter(rider__id=_id, status__iexact=_status)
            else:
                rides = Ride.objects.filter(rider__id=_id)
        elif entity == 'van':
            if _status is not None:
                rides = Ride.objects.filter(van__id=_id, status__iexact=_status)
            else:
                rides = Ride.objects.filter(van__id=_id)

        if rides is None:
            raise Ride.DoesNotExist

        return list(rides)

    def get_all(self) -> list:
        """Get all rides."""
        return list(Ride.objects.all())

from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from django.contrib.auth.hashers import make_password
from .models import User, Ride, Notification, Report, Van


class UserFunctions:
    """
    Create - Creates user based on provided data.

    Preconditions: Valid dictionary with correct values based on user.
    Postconditions: User is successfully added to the database.
    Side Effects: Adds a user to database and all locations that reference users.
    In: info - is a dictionary containing user information.
    Out: Boolean - to determine if operation was accomplished or not.
    """

    def create(self, info: dict) -> bool:
        """Check for empty dictionaries before querying info"""
        if not bool(info):
            return False

        """Check for empty required values before creation"""
        required_fields = ['username', 'password', 'name', 'email', 'phone_number', 'address', 'user_type']
        if not all(field in info for field in required_fields):
            return False

        if False in info.values():
            return False

        """Check for duplicates"""
        if User.objects.filter(username=info['username']).exists() or User.objects.filter(email=info['email']).exists():
            return False

        """Create a new user with required fields"""
        user = User(
            username=info['username'],
            password=make_password(info['password']),
            name=info['name'],
            phone_number=info['phone_number'],
            email=info['email'],
            address=info['address'],
            user_type=info['user_type'],
        )
        user.save()
        return True

    """
    Edit - Updates user information with the provided data.

    Preconditions: User must be authenticated and exist in the database.
    Postconditions: User information is updated in the database if successful.
    Side Effects: May modify user information in the database and anywhere where user is referenced.
    In: info - is a dictionary containing user information.
    Out: Boolean - to determine if operation was accomplished or not.
    """

    def edit(self, username: str, info: dict) -> bool:
        """Check if username is present"""
        if not username:
            return False

        """Check if username is in database"""
        try:
            temp_user = User.objects.get(username=username)
        except ObjectDoesNotExist:
            return False

        """Update user information if provided"""
        for field in ['password', 'name', 'email', 'phone_number', 'address', 'user_type']:
            if field in info:
                # Hash the password if it is being changed
                if field == 'password':
                    setattr(temp_user, field, make_password(info[field]))
                else:
                    setattr(temp_user, field, info[field])

        temp_user.save()
        return True

    """
    Delete - Deletes the user from the database.

    Preconditions: User must exist in the database.
    Postconditions: User is removed from the database and everywhere referenced if successful.
    Side Effects: Removed from any database tables as a foreign key.
    In: identity - String to locate the given user by username to delete.
    Out: Boolean to determine if operation was accomplished or not.
    """

    def delete(self, identity: str) -> bool:
        """Try and find the user"""
        try:
            temp_user = User.objects.get(username=identity)
        except ObjectDoesNotExist:
            return False

        """Delete the user"""
        temp_user.delete()
        return True

    """
    get - Retrieves information about the user(s).

    Preconditions: User(s) must be authenticated and exist in the database.
    Postconditions: Returns a list of dictionaries containing user information.
    Side Effects: None.
    In: query - string field to search based off of, identity - string fields value to search for
    Out: List - of dictionaries containing the given query
    """

    def get(self, query: str, identity: str) -> list:
        """Create empty lists"""
        return_list = []
        user_list = []

        """Get items based on the given query"""
        if query in ['username', 'name', 'email', 'address', 'phone_number', 'user_type']:
            user_list = User.objects.filter(**{query: identity}).values()

        """Go through userlist and create format"""
        for user in user_list:
            temp_dic = {
                'name': user['name'],
                'username': user['username'],
                'email': user['email'],
                'phone_number': user['phone_number'],
                'address': user['address'],
                'user_type': user['user_type']
            }
            """Add to list"""
            return_list.append(temp_dic)

        return return_list

    """
    get_all - Retrieves all users from the database.

    Preconditions: None. Will return empty if there is nothing in database.
    Postconditions: Returns a list containing dictionaries of user information.
    Side Effects: None.
    In: None
    Out: List of dictionaries containing all users.
    """

    def get_all(self) -> list:
        """Get all users in table"""
        user_list = User.objects.all()
        user_list = user_list.exclude(user_type='A')
        user_list = user_list.exclude(user_type='S')

        """Initialize user list"""
        return_list = []
        """Add entries to list"""
        for user in user_list:
            """Create user dictionary"""
            temp_dic = {
                'name': user.name,
                'username': user.username,
                'email': user.email,
                'phone_number': user.phone_number,
                'address': user.address,
                'user_type': user.user_type
            }
            """Add to list"""
            return_list.append(temp_dic)
        """Return the list of users"""
        return return_list


class RideManagement:
    def create(self, rider: User, ride_info: dict) -> bool:
        """Create a new ride."""
        if rider.user_type != 'R':
            return False



        ride = Ride(
            rider=rider,
            driver=ride_info.get('driver'),
            pickup_location=ride_info.get('pickup_location'),
            dropoff_location=ride_info.get('dropoff_location'),
            num_passengers=ride_info.get('num_passengers', 1),
            ADA_required=ride_info.get('ADA_required'),
            van=ride_info.get('van'),
        )
        status = ride_info.get('status')
        if status is not None:
            ride.status = status
        ride.save()
        return True

    def edit(self, ride_id: int, ride_info: dict) -> bool:
        """Edit an existing ride."""
        try:
            ride = Ride.objects.get(id=ride_id)
            for attr, value in ride_info.items():
                setattr(ride, attr, value)
            ride.save()
            return True
        except Ride.DoesNotExist:
            return False

    def delete(self, ride_id: int) -> bool:
        """Delete a ride."""
        try:
            ride = Ride.objects.get(id=ride_id)
            ride.delete()
            return True
        except Ride.DoesNotExist:
            return False

    def assign_driver(self) -> bool:
        """Assign a driver to an existing ride."""
        pending_requests = Ride.objects.filter(status='Pending')
        request = pending_requests.first()

        drivers = User.objects.filter(user_type='D')
        available_drivers = drivers.filter(status='Available')


        if available_drivers.exists():
            driver = available_drivers.first()  # Choose the first available driver
            request.driver = driver
            request.van = Van.objects.get(driver=driver)
            request.pickup_time = timezone.now()
            request.status = 'Assigned'
            request.save()
            driver.status = 'Assigned'
            driver.save()
            return True
        else:
            return False

    def get_by_rider_id(self, _id: int, status: str = None) -> list:
        try:
            if status is not None:
                return Ride.objects.filter(rider__id=_id, status=status)
            return Ride.objects.filter(rider__id=_id)
        except Ride.DoesNotExist:
            return []

    def get_by_driver_id(self, _id: int, status: str = None) -> list:
        try:
            if status is not None:
                return Ride.objects.filter(driver__id=_id, status=status)
            return Ride.objects.filter(driver__id=_id)
        except Ride.DoesNotExist:
            return []

    def get_by_van_id(self, _id: int, status: str = None) -> list:
        try:
            if status is not None:
                return Ride.objects.filter(van__id=_id, status=status)
            return Ride.objects.filter(van__id=_id)
        except Ride.DoesNotExist:
            return []

    def get_all(self) -> list:
        """Get all rides."""
        return list(Ride.objects.all())


class NotificationManager:
    def get(self, query: str, identity: str) -> Notification:
        try:
            return Notification.objects.get(id=query, rider=identity)
        except Notification.DoesNotExist:
            return None

    def get_all(self) -> list:
        return list(Notification.objects.all())


class ReportManager:
    def get(self, query: str, identity: str) -> Report:
        try:
            return Report.objects.get(id=query, reporter=identity)
        except Report.DoesNotExist:
            return []

    def get_all(self) -> list:
        return list(Report.objects.all())


class VanManagement:
    def get_by_id(self, _id: int) ->  Van:
        return Van.objects.get(id=_id)


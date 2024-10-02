from django.test import TestCase
from django.utils import timezone
from .models import User, Ride, Report, Van
import api.functions as functions

# Testing User functions
class UserFunctionsTests(TestCase):

    def setUp(self):
        """Create a sample user for testing."""
        self.user_info = {
            'username': 'testuser',
            'password': 'password123',
            'name': 'Test User',
            'phone_number': '1234567890',
            'address': '123 Test St',
            'email': 'testuser@example.com',
            'user_type': 'R'  # Rider
        }
        self.user_func = functions.UserFunctions()

    def test_create_user_success(self):
        """Test successful user creation."""
        result = self.user_func.create(self.user_info)
        self.assertTrue(result)
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_create_user_duplicate_username(self):
        """Test creating a user with an existing username."""
        self.user_func.create(self.user_info)
        result = self.user_func.create(self.user_info)
        self.assertFalse(result)

    def test_edit_user_success(self):
        """Test successful user editing."""
        self.user_func.create(self.user_info)
        new_info = {'username': 'testuser', 'name': 'Updated User'}
        result = self.user_func.edit(new_info)
        self.assertTrue(result)
        user = User.objects.get(username='testuser')
        self.assertEqual(user.name, 'Updated User')

    def test_edit_user_non_existent(self):
        """Test editing a non-existent user."""
        new_info = {'username': 'nonexistent', 'name': 'Updated User'}
        result = self.user_func.edit(new_info)
        self.assertFalse(result)

    def test_delete_user_success(self):
        """Test successful user deletion."""
        self.user_func.create(self.user_info)
        result = self.user_func.delete('testuser')
        self.assertTrue(result)
        self.assertFalse(User.objects.filter(username='testuser').exists())

    def test_delete_user_non_existent(self):
        """Test deleting a non-existent user."""
        result = self.user_func.delete('nonexistent')
        self.assertFalse(result)

    def test_get_user_success(self):
        """Test retrieving user information."""
        self.user_func.create(self.user_info)
        result = self.user_func.get('username', 'testuser')
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['username'], 'testuser')

    def test_get_user_non_existent(self):
        """Test retrieving a non-existent user."""
        result = self.user_func.get('username', 'nonexistent')
        self.assertEqual(result, [])

    def test_get_all_users(self):
        """Test retrieving all users."""
        self.user_func.create(self.user_info)
        another_user_info = {
            'username': 'anotheruser',
            'password': 'password456',
            'name': 'Another User',
            'phone_number': '0987654321',
            'address': '456 Another Rd',
            'email': 'anotheruser@example.com',
            'user_type': 'D'  # Driver
        }
        self.user_func.create(another_user_info)
        result = self.user_func.get_all()
        self.assertEqual(len(result), 2)

# Testing Ride functions
class RideManagementTests(TestCase):
    def setUp(self):
        self.ride_info = {
            'pickup_location': '123 main ST',
            'dropoff_location': '123 test ST',
            'passengers': 3,
            'is_accessible': True,
        }

        self.rider = User(username="test_rider", password="test_pass", name="Test Rider", phone_number="987654321", address="123 ave WI", email="test_rider@uwm.edu", user_type="R")
        self.rider.save()

        self.driver = User(username="test_driver", password="test_pass", name="Test Driver", phone_number="987654321", address="123 ave WI", email="test_driver@uwm.edu", user_type="D")
        self.driver.save()

        self.van = Van(van_number="1234 QWERTY")
        self.van.save()

        self.ride_manage_fun = functions.RideManagement()

    def tearDown(self):
        self.rider.delete()
        self.driver.delete()
        self.van.delete()


from django.test import TestCase
from api.models import Van
import api.functions.van_functions as van_functions


class VanManagementTests(TestCase):
    def setUp(self):
        """Create a sample VanManagement instance for testing."""
        self.van_func = van_functions.VanManagement()
        self.sample_van_info = {
            'van_number': 1,
            'ADA': True,
            'driver': 'Test Driver'
        }

    def test_create_van_success(self):
        """Test successful van creation."""
        result = self.van_func.create(self.sample_van_info)
        self.assertTrue(result)
        self.assertTrue(Van.objects.filter(van_number=1).exists())

    def test_create_van_duplicate_van_number(self):
        """Test creating a van with an existing van number."""
        self.van_func.create(self.sample_van_info)
        result = self.van_func.create(self.sample_van_info)
        self.assertFalse(result)

    def test_create_van_without_driver(self):
        """Test creating a van without specifying a driver."""
        van_info_no_driver = {
            'van_number': 2,
            'ADA': False,
        }
        result = self.van_func.create(van_info_no_driver)
        self.assertTrue(result)
        van = Van.objects.get(van_number=2)
        self.assertIsNone(van.driver)

    def test_edit_van_success(self):
        """Test successful van editing."""
        self.van_func.create(self.sample_van_info)
        new_info = {'ADA': False, 'driver': None}
        result = self.van_func.edit(1, new_info)
        self.assertTrue(result)
        van = Van.objects.get(van_number=1)
        self.assertFalse(van.ADA)
        self.assertIsNone(van.driver)

    def test_edit_van_non_existent(self):
        """Test editing a non-existent van."""
        result = self.van_func.edit(999, {'ADA': False})
        self.assertFalse(result)

    def test_delete_van_success(self):
        """Test successful van deletion."""
        self.van_func.create(self.sample_van_info)
        result = self.van_func.delete(1)
        self.assertTrue(result)
        self.assertFalse(Van.objects.filter(van_number=1).exists())

    def test_delete_van_non_existent(self):
        """Test deleting a non-existent van."""
        result = self.van_func.delete(999)
        self.assertFalse(result)

    def test_get_van_success(self):
        """Test retrieving a van's details."""
        self.van_func.create(self.sample_van_info)
        result = self.van_func.get(1)
        self.assertIsNotNone(result)
        self.assertEqual(result['van_number'], 1)
        self.assertTrue(result['ADA'])
        self.assertEqual(result['driver'], 'Test Driver')

    def test_get_van_non_existent(self):
        """Test retrieving a non-existent van."""
        result = self.van_func.get(999)
        self.assertIsNone(result)

    def test_get_all_vans(self):
        """Test retrieving all vans."""
        self.van_func.create(self.sample_van_info)
        another_van_info = {
            'van_number': 2,
            'ADA': False,
            'driver': None,
        }
        self.van_func.create(another_van_info)
        result = self.van_func.get_all()
        self.assertEqual(len(result), 2)
        self.assertTrue(any(van['van_number'] == 1 for van in result))
        self.assertTrue(any(van['van_number'] == 2 for van in result))

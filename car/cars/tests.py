from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse

from .models import Car, CarBodyCondition


class CarCreateAPITests(TestCase):
    def setUp(self):
        self.user_model = get_user_model()
        self.seller_group = Group.objects.create(name='seller')
        self.user = self.user_model.objects.create_user(username='seller1', password='secret123')
        self.user.groups.add(self.seller_group)
        self.client = APIClient()

    def test_seller_can_create_car_with_nested_body_conditions(self):
        self.client.force_authenticate(self.user)

        payload = {
            'brand': 'BMW',
            'model': 'M3',
            'year': 2020,
            'mileage': 25000,
            'price': 350000000,
            'city': 'Tehran',
            'description': 'Clean and well maintained',
            'body_conditions': [
                {'part': 'hood', 'condition': 'healthy'},
                {'part': 'front_bumper', 'condition': 'repaired'},
            ],
        }

        response = self.client.post(reverse('car-list'), payload, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Car.objects.count(), 1)
        self.assertEqual(CarBodyCondition.objects.count(), 2)
        self.assertEqual(Car.objects.get().seller, self.user)
        self.assertEqual(Car.objects.get().status, 'pending_review')

    def test_duplicate_parts_are_rejected(self):
        self.client.force_authenticate(self.user)

        payload = {
            'brand': 'Mercedes',
            'model': 'C200',
            'year': 2019,
            'mileage': 60000,
            'price': 1800000000,
            'city': 'Isfahan',
            'description': 'Great condition',
            'body_conditions': [
                {'part': 'hood', 'condition': 'healthy'},
                {'part': 'hood', 'condition': 'repaired'},
            ],
        }

        response = self.client.post(reverse('car-list'), payload, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Car.objects.count(), 0)

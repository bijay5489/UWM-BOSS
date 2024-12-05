from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import VanViewSet

router = DefaultRouter()
router.register('vans', VanViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]

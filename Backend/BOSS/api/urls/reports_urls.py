from django.urls import path
from .. import views

urlpatterns = [
    path('generateReport/', views.ReportView.as_view(), name='report'),
]

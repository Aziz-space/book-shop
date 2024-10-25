from django.urls import path
from books.views import homepage

urlpatterns = [
    path('', homepage, name='home'),
]

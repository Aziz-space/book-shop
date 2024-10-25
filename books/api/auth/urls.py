from django.urls import path
from .views import LoginAPIView, LogoutAPIView, RegisterAPIView, UserUpdateView

urlpatterns = [
    path('login/', LoginAPIView.as_view(), name='login'),
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('logout/', LogoutAPIView.as_view(), name='logout'), 
    path('profile/<int:user_id>/', UserUpdateView.as_view(), name='profile'), 
]

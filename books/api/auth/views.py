from django.shortcuts import get_object_or_404
from rest_framework import status, permissions
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model
from rest_framework.generics import GenericAPIView, RetrieveUpdateAPIView
from rest_framework.response import Response
from .serializers import LoginSerializer, ProfileSerializer, RegisterSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

User = get_user_model() 


class LoginAPIView(GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data.get("email")
        password = serializer.validated_data.get("password")

        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response(
                {"detail": "Пользователь не существует или пароль неверен"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        read_serializer = ProfileSerializer(instance=user, context={"request": request})

        Token.objects.filter(user=user).delete()

        token = Token.objects.create(user=user)

        data = {**read_serializer.data, "token": token.key}  
        return Response(data, status=status.HTTP_200_OK)



class RegisterAPIView(GenericAPIView):
    serializer_class = RegisterSerializer


    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        token, created = Token.objects.get_or_create(user=user)

        return Response(
            {'detail': 'Пользователь успешно зарегистрирован', 'token': token.key},
            status=status.HTTP_201_CREATED
        )



class UserUpdateView(RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user_id = self.kwargs.get('user_id')  
        user = get_object_or_404(User, id=user_id)  
        return user

    def get(self, request, *args, **kwargs):
        user = self.get_object()  
        serializer = self.get_serializer(user)  
        return Response(serializer.data) 

    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs) 
    
    
    
    
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator    
    
@method_decorator(csrf_exempt, name='dispatch')
class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({"detail": "Вы успешно вышли из системы."}, status=status.HTTP_200_OK)
    
    
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from django.db.models import Q
from books.api import permissions
from books.api.mixins import UltraGenericAPIView
from books.models import Author, Book, Category, Tag
from books.api.paginations import SimplePagination
from books.api.serializers import (
    AuthorSerializer,
    BookCreateSerializer,
    BookReadSerializer,
    BookUpdateSerializer,
    CategorySerializer,
    TagSerializer
)

from rest_framework.filters import SearchFilter, OrderingFilter
from books.api.permissions import IsOwnerOrReadOnly
from rest_framework.permissions import IsAuthenticated

class HomepageView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        return Response({'message': 'Welcome to the Book Shop API!'}, status=status.HTTP_200_OK)



class BookViewSet(UltraGenericAPIView, viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by('title')
    lookup_field = 'id'  
    pagination_class = SimplePagination 

   
    serializer_classes = {
        'create': BookCreateSerializer,
        'list': BookReadSerializer,
        'retrieve': BookReadSerializer,
        'update': BookUpdateSerializer,
    }

    permission_classes = (IsOwnerOrReadOnly,) 


    permission_classes_by_action = {
        'create': (IsAuthenticated,),
        'update': (IsAuthenticated,),
        'delete': (IsAuthenticated,),
    }
    

    def get_permissions(self):
        action = getattr(self, 'action', None)
        if action in self.permission_classes_by_action:
            return [permission() for permission in self.permission_classes_by_action[action]]
        return [permission() for permission in self.permission_classes]
    
    
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.GET.get('search')
        exact_search = self.request.GET.get('exact_search', 'false').lower() == 'true'
        category_name = self.request.GET.get('category')
        tag_name = self.request.GET.get('tag')


        if search:
            if exact_search:
                queryset = queryset.filter(title__iexact=search)
            else:
                queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(author__name__icontains=search) |
                Q(description__icontains=search) |
                Q(tags__name__icontains=search) |  
                Q(category__name__icontains=search)  
            )

    
        if category_name:
            queryset = queryset.filter(category__name__icontains=category_name)
        
        if tag_name:
            queryset = queryset.filter(tags__name__icontains=tag_name)

        return queryset

    
class BookDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookReadSerializer
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'PUT']:
            return BookUpdateSerializer
        return BookReadSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsOwnerOrReadOnly()]
        return super().get_permissions()

class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class TagListAPIView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer    
    
    
    
class AuthorListAPIView(generics.ListCreateAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer    

class FilteredBookListAPIView(generics.ListAPIView):
    serializer_class = BookReadSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.GET.get('search')
        exact_search = self.request.GET.get('exact_search', 'false').lower() == 'true'
        category_name = self.request.GET.get('category')
        tag_name = self.request.GET.get('tag')

        if search:
            if exact_search:
                queryset = queryset.filter(title__iexact=search)
            else:
                queryset = queryset.filter(
                    Q(title__icontains=search) |
                    Q(author__name__icontains=search) |  
                    Q(description__icontains=search) |
                    Q(tags__name__icontains=search) |
                    Q(category__name__icontains=search)
                )

        if category_name:
            queryset = queryset.filter(category__name__icontains=category_name)

        if tag_name:
            queryset = queryset.filter(tags__name__icontains=tag_name)

        return queryset




class UserBooksListView(generics.ListAPIView):
    serializer_class = BookReadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id'] 
        return Book.objects.filter(user_id=user_id)
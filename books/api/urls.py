from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('books', views.BookViewSet, basename='book')

urlpatterns = [
    path('', views.HomepageView.as_view(), name='homepage'),
    path('books/<int:id>/', views.BookDetailAPIView.as_view(), name='book-detail'),
    path('categories/', views.CategoryListAPIView.as_view(), name='category-list'),
    path('tags/<int:tag_id>/', views.TagListAPIView.as_view(), name='tag-list'),
    path('tags/', views.TagListAPIView.as_view(), name='tag-list'),
    path('books/filtered/', views.FilteredBookListAPIView.as_view(), name='filtered-book-list'),
    path('books/user/<int:user_id>/', views.UserBooksListView.as_view(), name='user-books-list'),
    path('authors/', views.AuthorListAPIView.as_view(), name='author-list'),
    path('', include(router.urls)), 
]

from rest_framework import permissions
from books.models import Book

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return True  

    def has_object_permission(self, request, view, obj: Book):
        if request.method in permissions.SAFE_METHODS:
            return True  
        return obj.user == request.user  

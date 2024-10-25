# books/views.py
from django.shortcuts import get_object_or_404, render

from books.models import Book

def homepage(request):
    return render(request, 'home.html')



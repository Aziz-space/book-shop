# books/filters.py
import django_filters
from books.models import Book, Category, Tag

class BookFilter(django_filters.FilterSet):
    price_from = django_filters.NumberFilter(lookup_expr='gte', field_name='price')
    price_to = django_filters.NumberFilter(lookup_expr='lte', field_name='price')
    
    category = django_filters.ModelChoiceFilter(
        queryset=Category.objects.all(), field_name='category')
    

    tags = django_filters.ModelMultipleChoiceFilter(
        queryset=Tag.objects.all(), field_name='tags')
    

    published_date_from = django_filters.DateFilter(lookup_expr='gte', field_name='published_date')
    published_date_to = django_filters.DateFilter(lookup_expr='lte', field_name='published_date')

    class Meta:
        model = Book
        fields = ['price_from', 'price_to', 'category', 'tags', 'published_date_from', 'published_date_to']

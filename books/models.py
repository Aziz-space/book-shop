# books/models.py

from django.db import models
from django.db.models import F

from django.conf import settings

class Book(models.Model):
    class Meta:
        verbose_name = 'Книга'
        verbose_name_plural = 'Книги'
        
    img = models.ImageField(upload_to='books/', blank=True, null=True)
    title = models.CharField(verbose_name='название', max_length=200)
    author = models.ForeignKey('Author', related_name='books', on_delete=models.CASCADE)
    price = models.DecimalField(verbose_name='цена', max_digits=10, decimal_places=2)
    category = models.ForeignKey('Category', verbose_name='категория', on_delete=models.CASCADE)
    tags = models.ManyToManyField('Tag', verbose_name='теги')
    published_date = models.DateField(verbose_name='дата')
    description = models.TextField(verbose_name='описание', blank=True, max_length=300)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name='автор книги', on_delete=models.CASCADE)  # Обновлено на settings.AUTH_USER_MODEL



    def __str__(self):
        return self.title


class Author(models.Model):
    class Meta:
        verbose_name = 'Автор'
        verbose_name_plural = 'Авторы'
        
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name



class Category(models.Model):
    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        
    name = models.CharField(verbose_name='название', max_length=250, unique=True)   
    
    def __str__(self):
        return f'{self.name}'

class Tag(models.Model):
    class Meta:
        verbose_name = 'Тег'
        verbose_name_plural = 'Теги'
        
    name = models.CharField(verbose_name='название', max_length=250)   
    
    def __str__(self):
        return f'{self.name}'

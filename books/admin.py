from django.utils.safestring import mark_safe
from django.contrib import admin
from .models import Author, Book, Category, Tag

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('id','title', 'author', 'price', 'category', 'tags_list', 'published_date', 'img_display')

    def img_display(self, obj):
        if obj.img:
            return mark_safe(f'<img src="{obj.img.url}" width="50" height="50" />')
        return "Нет изображения"
    img_display.short_description = 'Изображение'

    def tags_list(self, obj):
        return ", ".join(tag.name for tag in obj.tags.all())
    tags_list.short_description = 'Теги'

admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(Author)

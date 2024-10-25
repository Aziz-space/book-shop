from rest_framework import serializers
from books.models import Author, Book, Category, Tag

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
        
        
class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name']        

class BookCreateSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(slug_field='name', queryset=Tag.objects.all(), many=True)

    class Meta:
        model = Book
        fields = ['title', 'author', 'description', 'price', 'published_date', 'category', 'tags', 'img']  # Добавлено поле для изображения

    def create(self, validated_data):
        tags = validated_data.pop('tags', [])
        user = self.context['request'].user  
        book = Book.objects.create(user=user, **validated_data)  
        book.tags.set(tags)
        return book

class BookReadSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='category.name')
    tags = TagSerializer(many=True)
    author = AuthorSerializer()

    class Meta:
        model = Book
        fields = '__all__'

class BookUpdateSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(slug_field='name', queryset=Tag.objects.all(), many=True)

    class Meta:
        model = Book
        fields = ['title', 'author', 'description', 'price', 'published_date', 'category', 'tags', 'img']  # Добавлено поле для изображения

    def update(self, instance, validated_data):
        tags = validated_data.pop('tags', None)
        if tags is not None:
            instance.tags.set(tags)

        instance.title = validated_data.get('title', instance.title)
        instance.author = validated_data.get('author', instance.author)
        instance.price = validated_data.get('price', instance.price)
        instance.published_date = validated_data.get('published_date', instance.published_date)

        if 'img' in validated_data:
            instance.img = validated_data.get('img', instance.img)

        instance.save()
        return instance





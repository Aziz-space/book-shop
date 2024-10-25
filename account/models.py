from django.db import models
from django.contrib.auth.models import AbstractUser
from django_resized import ResizedImageField
from account.managers import UserManager

class User(AbstractUser):
    CLIENT = 'client'
    SALESMAN = 'salesman'
    ADMIN = 'admin'

    ROLE = (
        (CLIENT, 'Покупатель'),
        (SALESMAN, 'Продавец'),
        (ADMIN, 'Администратор')
    )

    class Meta:
        verbose_name = 'пользователь'
        verbose_name_plural = 'пользователи'
        ordering = ('-date_joined',)

    username = None
    
    avatar = ResizedImageField('аватарка', size=[500, 500], crop=['middle', 'center'],
                               upload_to='avatars/', force_format='WEBP', quality=90,
                               null=True, blank=True)

    email = models.EmailField('электронная почта', blank=True, null=True, unique=True)
    role = models.CharField('роль', choices=ROLE, default=CLIENT, max_length=15)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='account_user_groups',
        blank=True,
        verbose_name='группы'
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='account_user_permissions',
        blank=True,
        verbose_name='разрешения'
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    @property
    def get_full_name(self):
        """Возвращает полное имя пользователя. Если имя или фамилия отсутствуют — возвращает пустую строку."""
        return f'{self.last_name} {self.first_name}'.strip() or ''

    def __str__(self):
        """Строковое представление пользователя."""
        full_name = f'{self.last_name} {self.first_name}'.strip()
        return full_name if full_name else ''

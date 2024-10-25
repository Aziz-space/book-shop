from rest_framework.generics import GenericAPIView

class SerializerByAction:
    serializer_classes = {}

    def get_serializer_class(self):
        if not self.serializer_classes:
            return super().get_serializer_class()

        action = getattr(self, 'action', None)
        if action in self.serializer_classes:
            return self.serializer_classes[action]


        if hasattr(self, 'serializer_class') and self.serializer_class is not None:
            return self.serializer_class

        raise AssertionError(
            "'%s' should either include a `serializer_class` attribute, "
            "or override the `get_serializer_class()` method."
            % self.__class__.__name__
        )



class PermissionByAction:
    permission_classes_by_action = {}

    def get_permissions(self):
        action = getattr(self, 'action', None)
        permission_classes = self.permission_classes_by_action.get(action, self.permission_classes)
        return [permission() for permission in permission_classes]


class PaginationByAction:
    pagination_class_by_action = {}

    def get_paginate_by(self, queryset):
        action = getattr(self, 'action', None)
        pagination_class = self.pagination_class_by_action.get(action)
        if not pagination_class:
            return None  
        return pagination_class().paginate_queryset(queryset, self.request, view=self)


class UltraGenericAPIView(SerializerByAction, PermissionByAction, PaginationByAction, GenericAPIView):
    pass

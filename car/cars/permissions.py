from rest_framework.permissions import SAFE_METHODS, BasePermission


def user_has_seller_role(user) -> bool:
    if not user or not user.is_authenticated:
        return False

    role = getattr(user, "role", None)
    if isinstance(role, str):
        return role == "seller"

    is_seller = getattr(user, "is_seller", None)
    if isinstance(is_seller, bool):
        return is_seller

    return user.groups.filter(name="seller").exists()


class IsSellerOwnerOrReadOnly(BasePermission):
    message = "Only authenticated sellers can manage car ads."

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return user_has_seller_role(request.user)

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return user_has_seller_role(request.user) and obj.seller_id == request.user.id


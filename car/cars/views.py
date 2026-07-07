from rest_framework import viewsets

from .models import Car
from .permissions import IsSellerOwnerOrReadOnly
from .serializers import CarSerializer


class CarViewSet(viewsets.ModelViewSet):
    serializer_class = CarSerializer
    permission_classes = [IsSellerOwnerOrReadOnly]

    def get_queryset(self):
        queryset = (
            Car.objects.select_related("seller")
            .prefetch_related("body_conditions")
            .order_by("-created_at")
        )

        if self.action in {"list", "retrieve"}:
            return queryset

        user = self.request.user
        if not user.is_authenticated:
            return queryset.none()

        return queryset.filter(seller=user)


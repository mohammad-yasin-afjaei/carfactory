from django.db import transaction
from rest_framework import serializers

from .models import Car, CarBodyCondition


class CarBodyConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarBodyCondition
        fields = ("id", "part", "condition", "description")
        read_only_fields = ("id",)


class CarSerializer(serializers.ModelSerializer):
    seller = serializers.PrimaryKeyRelatedField(read_only=True)
    body_conditions = CarBodyConditionSerializer(many=True)

    class Meta:
        model = Car
        fields = (
            "id",
            "seller",
            "brand",
            "model",
            "year",
            "mileage",
            "price",
            "city",
            "description",
            "status",
            "created_at",
            "updated_at",
            "body_conditions",
        )
        read_only_fields = (
            "id",
            "seller",
            "status",
            "created_at",
            "updated_at",
        )

    def validate_body_conditions(self, value):
        parts = [item["part"] for item in value]
        duplicate_parts = sorted({part for part in parts if parts.count(part) > 1})
        if duplicate_parts:
            raise serializers.ValidationError(
                f"Duplicate body parts are not allowed: {', '.join(duplicate_parts)}."
            )
        return value

    def create(self, validated_data):
        body_conditions_data = validated_data.pop("body_conditions", [])
        request = self.context.get("request")
        seller = getattr(request, "user", None)

        with transaction.atomic():
            car = Car.objects.create(
                seller=seller,
                status=Car.Status.PENDING_REVIEW,
                **validated_data,
            )
            self._replace_body_conditions(car, body_conditions_data)

        return car

    def update(self, instance, validated_data):
        body_conditions_data = validated_data.pop("body_conditions", serializers.empty)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        with transaction.atomic():
            instance.save()
            if body_conditions_data is not serializers.empty:
                self._replace_body_conditions(instance, body_conditions_data)

        return instance

    def _replace_body_conditions(self, car, body_conditions_data):
        car.body_conditions.all().delete()
        CarBodyCondition.objects.bulk_create(
            [CarBodyCondition(car=car, **item) for item in body_conditions_data]
        )


from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone


MIN_CAR_YEAR = 1886


def validate_car_year(value: int) -> None:
    current_year = timezone.now().year + 1
    if value < MIN_CAR_YEAR or value > current_year:
        raise ValidationError(
            f"Year must be between {MIN_CAR_YEAR} and {current_year}."
        )


class Car(models.Model):
    class Status(models.TextChoices):
        PENDING_REVIEW = "pending_review", "Pending review"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cars",
    )
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField(validators=[validate_car_year])
    mileage = models.PositiveBigIntegerField(
        validators=[MinValueValidator(0)],
    )
    price = models.DecimalField(
        max_digits=14,
        decimal_places=0,
        validators=[MinValueValidator(Decimal("1"))],
    )
    city = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=32,
        choices=Status.choices,
        default=Status.PENDING_REVIEW,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.brand} {self.model} ({self.year})"


class CarBodyCondition(models.Model):
    class Part(models.TextChoices):
        HOOD = "hood", "Hood"
        ROOF = "roof", "Roof"
        TRUNK = "trunk", "Trunk"
        FRONT_BUMPER = "front_bumper", "Front bumper"
        REAR_BUMPER = "rear_bumper", "Rear bumper"
        FRONT_RIGHT_FENDER = "front_right_fender", "Front right fender"
        REAR_RIGHT_FENDER = "rear_right_fender", "Rear right fender"
        FRONT_LEFT_FENDER = "front_left_fender", "Front left fender"
        REAR_LEFT_FENDER = "rear_left_fender", "Rear left fender"
        FRONT_RIGHT_DOOR = "front_right_door", "Front right door"
        REAR_RIGHT_DOOR = "rear_right_door", "Rear right door"
        FRONT_LEFT_DOOR = "front_left_door", "Front left door"
        REAR_LEFT_DOOR = "rear_left_door", "Rear left door"

    class Condition(models.TextChoices):
        HEALTHY = "healthy", "Healthy"
        PAINTED = "painted", "Painted"
        REPLACED = "replaced", "Replaced"
        SCRATCH = "scratch", "Scratch"
        DENT = "dent", "Dent"
        REPAIRED = "repaired", "Repaired"
        UNKNOWN = "unknown", "Unknown"

    car = models.ForeignKey(
        Car,
        on_delete=models.CASCADE,
        related_name="body_conditions",
    )
    part = models.CharField(max_length=32, choices=Part.choices)
    condition = models.CharField(max_length=16, choices=Condition.choices)
    description = models.TextField(blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["car", "part"],
                name="unique_car_body_part",
            ),
        ]
        ordering = ["part"]

    def __str__(self) -> str:
        return f"{self.car_id} - {self.part} - {self.condition}"


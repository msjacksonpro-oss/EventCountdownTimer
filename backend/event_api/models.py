from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    CATEGORY_CHOICES = [
        ('birthday', 'Birthday 🎂'),
        ('trip', 'Trip ✈️'),
        ('exam', 'Exam 📚'),
        ('meeting', 'Meeting 💼'),
        ('launch', 'Product Launch 🚀'),
        ('holiday', 'Holiday 🌴'),
        ('anniversary', 'Anniversary ❤️'),
        ('other', 'Other 🎯'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True, default='')
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='other')
    color = models.CharField(max_length=30, default='#6366f1')
    target_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['target_date']

    def __str__(self):
        return f"{self.title} ({self.owner.username})"

from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'category', 'target_date', 'created_at')
    list_filter = ('category', 'target_date', 'created_at')
    search_fields = ('title', 'description', 'owner__username')
    ordering = ('target_date',)

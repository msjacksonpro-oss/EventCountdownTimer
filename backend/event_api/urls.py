from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    EventViewSet,
    RegisterView,
    CurrentUserView,
    DemoLoginView,
    SeedDemoEventsView,
)

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')

urlpatterns = [
    # Auth endpoints
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', CurrentUserView.as_view(), name='auth_me'),
    path('auth/demo/', DemoLoginView.as_view(), name='auth_demo'),
    
    # Utility endpoints
    path('events/seed/', SeedDemoEventsView.as_view(), name='events_seed'),

    # Event router endpoints
    path('', include(router.urls)),
]

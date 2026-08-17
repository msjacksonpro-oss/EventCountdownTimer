from rest_framework import viewsets, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

from .models import Event
from .serializers import EventSerializer, UserSerializer, RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class DemoLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = "demo_user"
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': 'demo@countdown.app',
                'first_name': 'Demo',
                'last_name': 'User'
            }
        )
        if created:
            user.set_password("demo1234")
            user.save()
            
            # Seed default demo events for this new demo user
            SeedDemoEventsView.create_default_events(user)

        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'message': 'Demo login successful'
        }, status=status.HTTP_200_OK)

class SeedDemoEventsView(APIView):
    permission_classes = [IsAuthenticated]

    @staticmethod
    def create_default_events(user):
        now = timezone.now()
        sample_events = [
            {
                'title': '🎂 Birthday Bash & Celebration',
                'description': 'Annual birthday party with friends and family at Sky Lounge.',
                'category': 'birthday',
                'color': '#3b82f6', # Blue
                'target_date': now + timedelta(days=5, hours=6, minutes=30),
            },
            {
                'title': '✈️ Goa Beach Vacation',
                'description': 'Packing bags for a refreshing 5-day holiday in North Goa.',
                'category': 'trip',
                'color': '#10b981', # Emerald Green
                'target_date': now + timedelta(days=14, hours=10, minutes=0),
            },
            {
                'title': '🚀 SaaS Product V1 Launch',
                'description': 'Official public launch on ProductHunt and Twitter/X.',
                'category': 'launch',
                'color': '#8b5cf6', # Purple
                'target_date': now + timedelta(days=28, hours=15, minutes=45),
            },
            {
                'title': '📚 Semester Final Examination',
                'description': 'Distributed Systems & Advanced Web Engineering exam.',
                'category': 'exam',
                'color': '#ef4444', # Red
                'target_date': now + timedelta(days=3, hours=2, minutes=15),
            },
            {
                'title': '💼 Quarterly Tech Sync Meeting',
                'description': 'Reviewing Q3 sprint progress and Q4 architecture roadmap.',
                'category': 'meeting',
                'color': '#f59e0b', # Amber
                'target_date': now + timedelta(days=1, hours=4, minutes=0),
            },
            {
                'title': '🎉 Sprint Project Submission',
                'description': 'Live project demonstration and final review submission.',
                'category': 'other',
                'color': '#ec4899', # Pink
                'target_date': now - timedelta(hours=2), # Completed/Expired demonstration
            }
        ]

        created_objs = []
        for ev in sample_events:
            obj = Event.objects.create(
                owner=user,
                title=ev['title'],
                description=ev['description'],
                category=ev['category'],
                color=ev['color'],
                target_date=ev['target_date']
            )
            created_objs.append(obj)
        return created_objs

    def post(self, request):
        created_objs = self.create_default_events(request.user)
        serializer = EventSerializer(created_objs, many=True)
        return Response({
            'message': f'Created {len(created_objs)} sample events successfully',
            'events': serializer.data
        }, status=status.HTTP_201_CREATED)

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Event.objects.filter(owner=self.request.user)
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category and category != 'all':
            queryset = queryset.filter(category=category)
            
        # Search query
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(title__icontains=search) | queryset.filter(description__icontains=search)
            
        # Sorting
        sort_by = self.request.query_params.get('sort', 'nearest')
        if sort_by == 'nearest':
            queryset = queryset.order_by('target_date')
        elif sort_by == 'farthest':
            queryset = queryset.order_by('-target_date')
        elif sort_by == 'newest':
            queryset = queryset.order_by('-created_at')
        elif sort_by == 'title':
            queryset = queryset.order_by('title')
        else:
            queryset = queryset.order_by('target_date')

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

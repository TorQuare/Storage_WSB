from rest_framework import viewsets, generics
from .models import Product
from .serializers import ProductSerializer, UserRegisterSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = []

# Create your views here.

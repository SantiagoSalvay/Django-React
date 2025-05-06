from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from .serializers import UserSerializer, RegisterSerializer
from .models import UserProfile

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_data(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        print('[DEBUG][RegisterView.create] request.data:', request.data)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print('[DEBUG][RegisterView.create] serializer.errors:', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        user = serializer.save()
        # Send verification email
        self.send_verification_email(user)

    def send_verification_email(self, user):
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Build verification URL
        mail_subject = 'Activa tu cuenta en Todo Electro'
        message = render_to_string('verification_email.html', {
            'user': user,
            'protocol': 'http',  # Use https in production
            'domain': 'localhost:5173',  # Frontend URL
            'uid': uid,
            'token': token,
        })
        
        send_mail(
            subject=mail_subject,
            message='',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            html_message=message,
        )

class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
            
        if user is not None and default_token_generator.check_token(user, token):
            user.is_active = True
            user.profile.is_email_verified = True
            user.save()
            user.profile.save()
            
            # Redirect to frontend page after successful verification
            return redirect('http://localhost:5173/login?verified=1')
        else:
            # Redirect to frontend page with error
            return redirect('http://localhost:5173/login?verified=0')

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
        
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_data(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def check_is_staff(request):
    return Response({'is_staff': request.user.is_staff})

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_admin_user(request):
    # Verificar que el usuario actual es superusuario
    if not request.user.is_superuser:
        return Response({'error': 'No tienes permisos para crear usuarios administradores'}, 
                        status=status.HTTP_403_FORBIDDEN)
    
    try:
        data = request.data
        username = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'admin')
        
        # Validar datos
        if not all([username, email, password]):
            return Response({'error': 'Todos los campos son obligatorios'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar si el usuario ya existe
        if User.objects.filter(username=username).exists():
            return Response({'error': 'El nombre de usuario ya está en uso'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({'error': 'El correo electrónico ya está en uso'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Crear el usuario
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_active=True
        )
        
        # Configurar permisos según el rol
        if role == 'superadmin':
            user.is_staff = True
            user.is_superuser = True
        else:  # admin
            user.is_staff = True
            user.is_superuser = False
        
        user.save()
        
        # Marcar el email como verificado
        user.profile.is_email_verified = True
        user.profile.save()
        
        # Devolver datos del usuario creado
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_admin_users(request):
    # Verificar que el usuario actual es staff o superusuario
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'No tienes permisos para ver usuarios administradores'}, 
                        status=status.HTTP_403_FORBIDDEN)
    
    try:
        # Obtener todos los usuarios admin y superadmin
        admin_users = User.objects.filter(is_staff=True).order_by('-is_superuser', 'username')
        serializer = UserSerializer(admin_users, many=True)
        return Response(serializer.data)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

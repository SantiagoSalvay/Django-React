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

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    
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
            'domain': 'localhost:8000',  # Replace with your domain
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
            return redirect('http://localhost:3000/login?verified=1')
        else:
            # Redirect to frontend page with error
            return redirect('http://localhost:3000/login?verified=0')

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

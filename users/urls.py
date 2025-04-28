from django.urls import path
from .views import RegisterView, VerifyEmailView, UserProfileView, get_user_data, check_is_staff

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify/<uidb64>/<token>/', VerifyEmailView.as_view(), name='verify_email'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('user-data/', get_user_data, name='user_data'),
    path('check-staff/', check_is_staff, name='check_staff'),
] 
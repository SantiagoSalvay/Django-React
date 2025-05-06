from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('verify/<uidb64>/<token>/', views.VerifyEmailView.as_view(), name='verify_email'),
    path('profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('user-data/', views.get_user_data, name='user_data'),
    path('update-profile/', views.update_profile, name='update_profile'),
    path('check-staff/', views.check_is_staff, name='check_staff'),
    path('admin/', views.create_admin_user, name='create_admin'),
    path('admin-users/', views.get_admin_users, name='get_admin_users'),
]
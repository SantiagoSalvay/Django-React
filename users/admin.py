from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'User Profile'

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_email_verified')
    
    def is_email_verified(self, obj):
        return obj.profile.is_email_verified
    is_email_verified.boolean = True
    is_email_verified.short_description = 'Email Verified'

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

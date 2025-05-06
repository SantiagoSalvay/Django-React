from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile
from django.db import transaction

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['is_email_verified', 'phone', 'address']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'profile']
        read_only_fields = ['is_staff', 'is_superuser']

class UpdateUserProfileSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'profile']
    
    @transaction.atomic
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        
        # Update User fields
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        
        # Update Profile fields
        profile = instance.profile
        profile.phone = profile_data.get('phone', profile.phone)
        profile.address = profile_data.get('address', profile.address)
        profile.save()
        
        return instance

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        
    def validate(self, attrs):
        print('[DEBUG][RegisterSerializer.validate] attrs:', attrs)
        if attrs['password'] != attrs['password2']:
            print('[DEBUG][RegisterSerializer.validate] Passwords do not match')
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        
        # Validate email is unique
        email = attrs.get('email', '')
        if User.objects.filter(email=email).exists():
            print('[DEBUG][RegisterSerializer.validate] Email already exists:', email)
            raise serializers.ValidationError({"email": "Ya existe un usuario con este correo electrónico."})
            
        return attrs
        
    def create(self, validated_data):
        print('[DEBUG][RegisterSerializer.create] validated_data:', validated_data)
        try:
            user = User.objects.create(
                username=validated_data['username'],
                email=validated_data['email'],
            )
            user.set_password(validated_data['password'])
            user.is_active = False  # User will be activated after email verification
            user.save()
            print('[DEBUG][RegisterSerializer.create] User created:', user)
            return user
        except Exception as e:
            print('[ERROR][RegisterSerializer.create]', str(e))
            raise
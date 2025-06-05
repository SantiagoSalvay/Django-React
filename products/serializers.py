from rest_framework import serializers
from .models import Category, Product, PaymentMethod

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'original_price', 'has_discount', 'discount_percentage', 'image', 'stock', 'category', 'category_name', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def validate(self, data):
        # Validar que el precio con descuento no sea mayor que el precio original
        if 'price' in data and 'original_price' in data:
            if float(data['price']) > float(data['original_price']):
                raise serializers.ValidationError("El precio con descuento no puede ser mayor que el precio original")
        
        # Validar que el porcentaje de descuento sea válido
        if 'discount_percentage' in data:
            if float(data['discount_percentage']) < 0 or float(data['discount_percentage']) > 100:
                raise serializers.ValidationError("El porcentaje de descuento debe estar entre 0 y 100")
        
        return data

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ['id', 'name', 'description', 'icon'] 
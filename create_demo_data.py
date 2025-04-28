import os
import django
import random
from django.core.files.images import ImageFile
from pathlib import Path

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'todoelectro.settings')
django.setup()

# Import models after Django setup
from django.contrib.auth.models import User
from products.models import Category, Product, PaymentMethod

def create_demo_data():
    print("Creando datos de demostración para Todo Electro...")
    
    # Create admin user if it doesn't exist
    if not User.objects.filter(username='admin').exists():
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@admin',
            password='admin'
        )
        admin_user.profile.is_email_verified = True
        admin_user.profile.save()
        print("✅ Usuario admin creado")
    else:
        print("⚠️ Usuario admin ya existe")
    
    # Create categories
    categories_data = [
        {"name": "Televisores", "slug": "televisores"},
        {"name": "Smartphones", "slug": "smartphones"},
        {"name": "Laptops", "slug": "laptops"},
        {"name": "Audio", "slug": "audio"},
        {"name": "Electrodomésticos", "slug": "electrodomesticos"},
    ]
    
    categories = []
    for cat_data in categories_data:
        cat, created = Category.objects.get_or_create(
            slug=cat_data["slug"],
            defaults={"name": cat_data["name"]}
        )
        categories.append(cat)
        if created:
            print(f"✅ Categoría {cat.name} creada")
        else:
            print(f"⚠️ Categoría {cat.name} ya existe")
    
    # Create payment methods
    payment_methods_data = [
        {"name": "Tarjeta de Crédito", "description": "Pago seguro con tarjeta de crédito Visa, MasterCard, o American Express."},
        {"name": "PayPal", "description": "Pago rápido y seguro a través de tu cuenta PayPal."},
        {"name": "Transferencia Bancaria", "description": "Transferencia directa a nuestra cuenta bancaria."},
        {"name": "Pago Móvil", "description": "Pago con aplicaciones móviles como Apple Pay o Google Pay."},
    ]
    
    for pm_data in payment_methods_data:
        pm, created = PaymentMethod.objects.get_or_create(
            name=pm_data["name"],
            defaults={"description": pm_data["description"]}
        )
        if created:
            print(f"✅ Método de pago {pm.name} creado")
        else:
            print(f"⚠️ Método de pago {pm.name} ya existe")
    
    # Create products (only if we don't have any)
    if Product.objects.count() < 10:
        products_data = [
            {
                "name": "Smart TV 4K 55\"",
                "description": "TV 4K con resolución 3840x2160, HDR10+, Dolby Vision, sistema operativo Android TV y asistente de voz integrado.",
                "price": 699.99,
                "stock": 15,
                "category": categories[0]  # Televisores
            },
            {
                "name": "Smart TV OLED 65\"",
                "description": "Experiencia visual inmersiva con negros perfectos, contraste infinito y colores vibrantes. Compatible con todos los formatos HDR.",
                "price": 1499.99,
                "stock": 8,
                "category": categories[0]  # Televisores
            },
            {
                "name": "Smartphone Galaxy Ultra",
                "description": "Pantalla Dynamic AMOLED 2X de 6.8\", cámara principal de 108MP, zoom óptico 10x, 12GB RAM, 256GB almacenamiento.",
                "price": 1099.99,
                "stock": 20,
                "category": categories[1]  # Smartphones
            },
            {
                "name": "iPhone Pro Max",
                "description": "Pantalla Super Retina XDR de 6.7\", triple cámara con modo noche, chip A15 Bionic, 5G, 256GB de almacenamiento.",
                "price": 1299.99,
                "stock": 12,
                "category": categories[1]  # Smartphones
            },
            {
                "name": "Laptop UltraBook",
                "description": "Procesador Intel Core i7, 16GB RAM, 1TB SSD, pantalla 15.6\" 4K, gráficos NVIDIA GeForce RTX 3060.",
                "price": 1799.99,
                "stock": 7,
                "category": categories[2]  # Laptops
            },
            {
                "name": "MacBook Pro M2",
                "description": "Chip M2 Pro, 16GB RAM, 512GB SSD, pantalla Liquid Retina XDR de 14\", hasta 18 horas de batería.",
                "price": 1999.99,
                "stock": 5,
                "category": categories[2]  # Laptops
            },
            {
                "name": "Auriculares Inalámbricos Premium",
                "description": "Cancelación activa de ruido, hasta 30 horas de batería, conexión Bluetooth 5.2, resistentes al agua IPX4.",
                "price": 299.99,
                "stock": 25,
                "category": categories[3]  # Audio
            },
            {
                "name": "Altavoz Inteligente",
                "description": "Sonido 360 grados con graves profundos, control por voz con múltiples asistentes, multiroom y WiFi.",
                "price": 199.99,
                "stock": 18,
                "category": categories[3]  # Audio
            },
            {
                "name": "Refrigerador Smart",
                "description": "Nevera inteligente con dispensador de agua, pantalla táctil, cámaras internas, y compartimentos ajustables.",
                "price": 2499.99,
                "stock": 3,
                "category": categories[4]  # Electrodomésticos
            },
            {
                "name": "Robot Aspirador",
                "description": "Navegación láser, mapeo inteligente, succión potente de 4000Pa, control por app y compatible con asistentes de voz.",
                "price": 499.99,
                "stock": 10,
                "category": categories[4]  # Electrodomésticos
            },
        ]
        
        # Since we don't have real images, create products without images
        # In a real scenario, you would use actual product images
        for product_data in products_data:
            product = Product.objects.create(
                name=product_data["name"],
                description=product_data["description"],
                price=product_data["price"],
                stock=product_data["stock"],
                category=product_data["category"],
            )
            print(f"✅ Producto {product.name} creado")
        
        print(f"✅ Creados {len(products_data)} productos de demo")
    else:
        print("⚠️ Ya existen productos en la base de datos")
    
    print("\n🎉 Datos de demostración creados con éxito!")
    print("\nPuedes acceder ahora con:")
    print("Username: admin")
    print("Password: admin")

if __name__ == "__main__":
    create_demo_data() 
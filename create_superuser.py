import os
import django

# Configurar el entorno de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'todoelectro.settings')
django.setup()

from django.contrib.auth.models import User
from django.db.utils import IntegrityError

def create_superuser():
    """
    Crea un superusuario con credenciales admin/admin si no existe.
    """
    try:
        # Verificar si ya existe un usuario con nombre 'admin'
        if User.objects.filter(username='admin').exists():
            admin_user = User.objects.get(username='admin')
            
            # Si existe pero no es superusuario, convertirlo en superusuario
            if not admin_user.is_superuser:
                admin_user.is_superuser = True
                admin_user.is_staff = True
                admin_user.set_password('admin')
                admin_user.save()
                print("Usuario 'admin' actualizado como superusuario con contraseña 'admin'")
            else:
                # Restablecer la contraseña a 'admin'
                admin_user.set_password('admin')
                admin_user.save()
                print("Contraseña del superusuario 'admin' restablecida a 'admin'")
        else:
            # Crear un nuevo superusuario
            User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin'
            )
            print("Superusuario 'admin' creado con contraseña 'admin'")
        
        return True
    except IntegrityError as e:
        print(f"Error de integridad: {e}")
        return False
    except Exception as e:
        print(f"Error al crear superusuario: {e}")
        return False

if __name__ == "__main__":
    create_superuser()

import os
import django

# Configurar el entorno de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'todoelectro.settings')
django.setup()

from django.contrib.auth.models import User

def enforce_admin_roles():
    """
    Asegura que solo el usuario 'admin' tenga rol de superadmin.
    Cualquier otro usuario con rol de superadmin será degradado a admin regular.
    """
    try:
        # Asegurar que el usuario admin tenga rol de superadmin
        if User.objects.filter(username='admin').exists():
            admin_user = User.objects.get(username='admin')
            
            # Asegurar que el usuario admin tenga rol de superadmin
            if not admin_user.is_superuser or not admin_user.is_staff:
                admin_user.is_superuser = True
                admin_user.is_staff = True
                admin_user.save()
                print("Usuario 'admin' actualizado como superadmin")
        
        # Degradar cualquier otro usuario con rol de superadmin a admin regular
        other_superusers = User.objects.filter(is_superuser=True).exclude(username='admin')
        count = 0
        
        for user in other_superusers:
            user.is_superuser = False
            # Mantener el rol de staff para que siga siendo admin
            user.is_staff = True
            user.save()
            count += 1
        
        if count > 0:
            print(f"Se degradaron {count} usuarios de superadmin a admin regular")
        
        # Mostrar resumen de usuarios admin y superadmin
        superadmins = User.objects.filter(is_superuser=True).count()
        admins = User.objects.filter(is_staff=True, is_superuser=False).count()
        
        print(f"Estado actual: {superadmins} superadmin(s), {admins} admin(s) regulares")
        
        return True
    except Exception as e:
        print(f"Error al ajustar roles de administrador: {e}")
        return False

if __name__ == "__main__":
    enforce_admin_roles()

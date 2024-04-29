from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import AnonymousUser

class CustomAuthMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Retrieve the user_id and user_type from the session
        user_id = request.session.get('user_id')
        user_type = request.session.get('user_type')
        # Access session data keys and values
        for key, value in request.session.items():
            print(f"{key}: {value}")


        # Determine the user model to use based on the user_type
        User = None
        if user_type == 'student':
            from authuser.models import Student as User
        elif user_type == 'institute':
            from authuser.models import Institute as User
        else:
            from django.contrib.auth.models import User as User
            

        # Initialize request.user as AnonymousUser by default
        request.user = AnonymousUser()

        # If user_id and User model are available
        if user_id and User:
            try:
                # Get the user from the database using the user_id
                user = User.objects.get(pk=user_id)
                print(user)
                # Attach the user to the request
                request.user = user
            except User.DoesNotExist:
                # If the user does not exist, clear the session
                del request.session['user_id']
                del request.session['user_type']
        elif request.session.get('_auth_user_id'):
            user = User.objects.get(pk=request.session.get('_auth_user_id'))
            request.user = user

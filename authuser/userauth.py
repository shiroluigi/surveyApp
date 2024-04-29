# authentication_backends.py

from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.base_user import AbstractBaseUser
from authuser.models import Institute,Student
from django.contrib.auth.hashers import check_password

class UserTypeAuthenticationBackend(BaseBackend):
    def get_user(self, user_id):
        try:
            print(user_id)
            print(Student.objects.get(pk=user_id))
            return Student.objects.get(pk=user_id)
        except Student.DoesNotExist:
            try:
                print(user_id)
                print(Institute.objects.get(pk=user_id))
                return Institute.objects.get(pk=user_id)
            except Institute.DoesNotExist:
                return None
    def authenticate(self, request, username, password, **kwargs):
        try:
            # First, try to authenticate as a Student
            user = Student.objects.get(student_id=username)
            if user.check_password(password):
                return user
        except Student.DoesNotExist:
            pass

        try:
            # If not found as a Student, try to authenticate as an Institute
            user = Institute.objects.get(institute_id=username)
            if user.check_password(password):
                return user
        except Institute.DoesNotExist:
            pass

        # If no matching user is found, return None
        return None

        
    
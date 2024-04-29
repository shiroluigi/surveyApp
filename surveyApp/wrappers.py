from django.http import HttpResponseRedirect
from authuser.models import Institute,Student
import os
def LoggedInRedirect(func):
    def wrapper(request,*args, **kwargs):
        if request.user.is_authenticated:
            if isinstance(request.user, Institute):
                typeoflogin = 'institute'
            else:
                typeoflogin = 'student'
            p ='/'+typeoflogin+'-'+'dashboard'
            print(p)
            return HttpResponseRedirect(p)
        else:
            return func(request)
    return wrapper

def LoginRequired(func):
    def wrapper(request,*args, **kwargs):
        if request.user.is_authenticated:
            return func(request,*args,**kwargs)
        else:
            return HttpResponseRedirect("/")
    return wrapper

def LoginTypeStudent(func):
    def wrapper(request,*args, **kwargs):
        if request.user.is_authenticated:
            if isinstance(request.user, Student):
                return func(request,*args,**kwargs)
            else:
                return HttpResponseRedirect("/")
        else:
            return HttpResponseRedirect("/")
    return wrapper

def LoginTypeInstitute(func):
    def wrapper(request,*args, **kwargs):
        if request.user.is_authenticated:
            if isinstance(request.user, Institute):
                return func(request,*args,**kwargs)
            else:
                return HttpResponseRedirect("/")
        else:
            return HttpResponseRedirect("/")
    return wrapper
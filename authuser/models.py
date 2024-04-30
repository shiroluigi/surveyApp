
from typing import Collection
from django.contrib.auth.models import AbstractBaseUser
from django.db import models
from django.contrib.auth.models import BaseUserManager
import uuid
from django.core.exceptions import ValidationError

class instituteManager(BaseUserManager):
    def create_user(self, user_id, username, password=None, **extra_fields):
        if not user_id:
            raise ValueError('The user_id field must be set')
        # user_id = self.normalize_email(user_id)
        user = self.model(user_id=user_id, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def __str__(self):
        return self.username

class Institute(AbstractBaseUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    institute_id = models.CharField(max_length=100,null=False,blank=False,unique=True)
    institute_name = models.CharField(max_length=100,null=False,blank=False)
    profile_pic = models.ImageField(blank=True, null=True, upload_to="static/img/institute_img/%y", verbose_name="Profile Picture")
    number_of_surveys = models.IntegerField(default=0)
    password = models.CharField(blank=False,max_length=100)

    USERNAME_FIELD = 'institute_name'

    objects = instituteManager()

    class Meta:
        permissions = [('is_institute', 'Is Institute')]


class StudentManager(BaseUserManager):
    def create_user(self, user_id, username, password=None, **extra_fields):
        if not user_id:
            raise ValueError('The user_id field must be set')
        user_id = self.normalize_user_id(user_id)
        user = self.model(user_id=user_id, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

class Student(AbstractBaseUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_id = models.CharField(max_length=100,null=False,blank=False,unique=True)
    password = models.CharField(blank=False,max_length=100)
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE)
    
    USERNAME_FIELD = 'student_id'

    class Meta:
        permissions = [('is_student', 'Is Student')]



class groups_table(models.Model):
    groups = models.CharField(blank=False,null=False,max_length=100)
    #changed
    institute = models.ForeignKey(Institute,on_delete=models.CASCADE)
    class Meta:
        unique_together = ('institute','groups')
    def __str__(self):
        return f"Group: {self.groups}, Institute: {self.institute}"

class Survey(models.Model):
    survey_name=models.CharField(null=False,max_length=100)
    survey_description = models.CharField(null=False,max_length=10000,default="")
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE)
    group = models.ManyToManyField(groups_table)
    def __str__(self):
        return f"{self.survey_name}"

class Question(models.Model):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    question = models.CharField(max_length=10000,null=False,blank=False)

class SGroup(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    group = models.ForeignKey(groups_table, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('student', 'group')

    def __str__(self):
        return f"Student: {self.student}, Group: {self.group}"
    
class student_attending_survey(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)


class student_responses(models.Model):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice = models.IntegerField()

    def __str__(self):
        return f"Survey: {self.survey}, Student: {self.student}, Question: {self.question}, Choice: {self.choice}"
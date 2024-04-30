from typing import Any
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from authuser.models import Institute,Student,Survey,Question,SGroup,student_attending_survey,groups_table
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError



class InstituteForm(forms.ModelForm):
    class Meta:
        model = Institute
        fields = ('institute_id','institute_name','profile_pic','password')
    def clean(self):
        pass
class StudentForm(forms.ModelForm):
    class Meta:
        model = Student
        fields = ('student_id','password','institute')
    def clean(self):
        pass
class SGroupForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        instance = kwargs.get('instance')
        if instance and instance.student and instance.student.institute:
            institute = instance.student.institute
            self.fields['group'].queryset = groups_table.objects.filter(institute=institute)
    class Meta:
        model = SGroup
        fields = ('student','group')

class SurveyForm(forms.ModelForm):
    class Meta:
        model = Survey
        fields = ('survey_name','survey_description','institute','group')

class registerSurvey(admin.ModelAdmin):
    def get_form(self, request, obj=None, **kwargs):
        if obj is None:  # Only apply to the add form
            self.form = SurveyForm
        return super().get_form(request, obj, **kwargs)
    list_display = ('id','survey_name','survey_description','institute')
    search_fields = ['institute']
    list_filter = ['institute']


class registerSGroup(admin.ModelAdmin):
    # def get_form(self, request, obj=None, **kwargs):
    #     if obj is None:  # Only apply to the add form
    #         self.form = SGroupForm
    #     return super().get_form(request, obj, **kwargs)
    form = SGroupForm
    # list_display = ('id','student',)
    # search_fields = ['student']
    # list_filter = ['group']
    class Media:
        js = (
            'https://code.jquery.com/jquery-3.6.0.min.js',
            '/static/djangoforms/student_group_dropdown.js',  # Custom JS file for dynamic dropdown
        )
        def get_form(self, request, obj=None, **kwargs):
            form = super().get_form(request, obj, **kwargs)
            if not obj:  # If creating a new instance
                form.base_fields['student'].widget.attrs['onchange'] = 'update_groups_dropdown(this.value);'
            return form

class registerInstitute(admin.ModelAdmin):
    def get_form(self, request, obj=None, **kwargs):
        if obj is None:  # Only apply to the add form
            self.form = InstituteForm
        return super().get_form(request, obj, **kwargs)
    def save_model(self,request,obj,form,change):
        if not change:
            obj.set_password(obj.password)
        obj.save()
    # Define which fields to display in the user list
    list_display = ('id','institute_id','institute_name','number_of_surveys','profile_pic')
    search_fields = ['institute_id']
    # Define the fields that can be used to filter users in the admin panel
    list_filter = ['number_of_surveys']

class registerStudent(admin.ModelAdmin):
    def get_form(self, request, obj=None, **kwargs):
        if obj is None:  # Only apply to the add form
            self.form = StudentForm
        return super().get_form(request, obj, **kwargs)
    def save_model(self,request,obj,form,change):
        if not change:
            obj.set_password(obj.password)
        obj.save()
    # Define which fields to display in the user list
    list_display = ('student_id','institute')
    search_fields = ('student_id','institute_id')
    # Define the fields that can be used to filter users in the admin panel
    list_filter = ['student_id']

admin.site.register(Institute, registerInstitute)    
admin.site.register(SGroup, registerSGroup)
admin.site.register(Student, registerStudent)
# admin.site.register(Survey, registerSurvey)
# admin.site.register(Question)
# admin.site.register(student_attending_survey)
admin.site.register(groups_table)
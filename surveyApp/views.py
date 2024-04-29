from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from authuser.models import Institute, Student, Question, Survey, SGroup, student_attending_survey, groups_table, student_responses
from django.http import JsonResponse
from authuser.userauth import UserTypeAuthenticationBackend
from surveyApp.wrappers import LoggedInRedirect, LoginRequired, LoginTypeInstitute, LoginTypeStudent
import json
from django.core import serializers
from django.urls import reverse
import numpy as np
import statsmodels.api as sm

@LoggedInRedirect
def loginpage(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect("/dashboard")
    if request.method == "POST":
        user_id = request.POST.get('u-id')
        password = request.POST.get('u-pass')
        user = authenticate(request, username=user_id, password=password, backend='authuser.userauth.UserTypeAuthenticationBackend')
        print(user)
        if user is not None:
            login(request, user, backend='authuser.userauth.UserTypeAuthenticationBackend')
            print("jeje")
            print(request.user)
            
            request.session['user_id'] = str(user.pk)
            # request.session['user_type'] = request.POST.get('typeoflogin')
            if (isinstance(request.user,Institute)):
                request.session['user_type'] = "institute"
            else:
                # print(request.user)
                request.session['user_type'] = "student"
            dashboard_path = f"/{request.POST.get('typeoflogin')}-dashboard"
            return HttpResponseRedirect(dashboard_path)
        else:
            return render(request, "login.html", {'message': '*Invalid username or user type'})
    return render(request, "login.html")

@LoginRequired
@LoginTypeInstitute
def institute_dashboard(request):
    institute_ = request.user
    survey_list = Survey.objects.filter(institute=request.user)
    underdash = {
        'total_students': len(Student.objects.filter(institute=request.user)) ,
        'total_groups': len(groups_table.objects.filter(institute=request.user)),
        # 'total_responses': ,
    }
    print(underdash)
    return render(request, "dashboard.html", {'user': institute_, 'data': survey_list , 'underdash' : underdash})

@LoginRequired
def logoutUser(request):
    logout(request)
    return HttpResponseRedirect("/")

@LoginRequired
@LoginTypeInstitute
def makesurvey(request):
    if request.method == 'POST':
        questionset = json.loads(request.POST.get('json'))
        survey = Survey.objects.create(
            survey_name=questionset.get('title'),
            survey_description=questionset.get('desc'),
            institute=request.user
        )
        group_ids = [groups_table.objects.get(groups=g, institute=request.user.pk).id for g in questionset.get('groups')]
        survey.group.add(*group_ids)
        Question.objects.bulk_create([
            Question(survey=survey, question=question) for question in questionset.get('questions')
        ])
        return HttpResponseRedirect("/")
    else:
        groups = groups_table.objects.filter(institute=request.user.pk)
        grpsinfo = {'group': [g.groups for g in groups]}
        return render(request, "question-creator.html", grpsinfo)

@LoginRequired
@LoginTypeStudent
def student_dashboard(request):
    if request.POST:
        # request.session['sid'] = request.POST.get('survey-id')
        return HttpResponseRedirect('student-dashboard/answer-survey/{0}'.format(request.POST.get('survey-id')))
    grp = SGroup.objects.filter(student=request.user.pk)
    dont_display = student_attending_survey.objects.filter(student=request.user.pk)
    survey_list = []
    for g in grp:
        surveys_ = Survey.objects.filter(group=g.group)
        survey_list.extend(surveys_)
    survey_list = list(set(survey_list))
    for s in dont_display:
        survey_list.remove(s.survey)
    data = serializers.serialize('json', survey_list)
    d2 = json.loads(data)
    return render(request, "s_dashboard.html", {'surveys': d2} )

@LoginRequired
@LoginTypeStudent
def answer_survey(request,sid):
    if request.method == 'POST':
        qlist = json.loads(request.POST.get('json'))
        student_attending_survey.objects.create(student=request.user, survey=Survey.objects.get(id=sid))
        for q in qlist:
            qob = Question.objects.get(id=q)
            if qlist[q] == 1:
                qob.ch_1 += 1
            elif qlist[q] == 2:
                qob.ch_2 += 1
            elif qlist[q] == 3:
                qob.ch_3 += 1
            elif qlist[q] == 4:
                qob.ch_4 += 1
            elif qlist[q] == 5:
                qob.ch_5 += 1
            qob.save()
            student_responses.objects.create(survey=Survey.objects.get(id=sid), student=request.user, question=Question.objects.get(id=q), choice=qlist[q])
        request.session.pop('sid', None)
        return HttpResponseRedirect("/")
    survey = Survey.objects.filter(id=sid)
    ser = serializers.serialize('json',survey)
    ser = json.loads(ser)
    print(ser)
    questions = Question.objects.filter(survey=sid).values()
    question_list = []
    for q in questions:
        question_list.append(q)
    data = json.dumps(question_list)
    d2 = json.loads(data)
    return render(request, "response.html", {'questions': d2, 'survey': ser})

def get_groups(request):
    student_id = request.GET.get('student_id')
    if student_id:
        stud = Student.objects.filter(pk=student_id)
        for g in stud:
            inst = g.institute.pk
        student_inst = Institute.objects.get(pk=inst)
        grps = groups_table.objects.filter(institute=student_inst)
        groups = [{'id': group.pk, 'name': str(group)} for group in grps]
        return JsonResponse({'groups': groups})
    else:
        return JsonResponse({'groups': []})

# Function to calculate overall satisfaction
def calculate_overall_satisfaction(data):
    all_responses = []
    for qid in data:
        all_responses.extend(data[qid]["response"])
    return np.mean(all_responses)

# Function to perform ordinal regression analysis and calculate coefficients
def calculate_coefficients(data):
    coefficients = {}
    for qid in data:
        responses = data[qid]["response"]
        X = sm.add_constant(np.arange(1, len(responses) + 1))
        y = responses
        model = sm.OLS(y, X)  # Corrected here
        result = model.fit()
        coefficients[qid] = result.params[1]
    return coefficients 

@LoginRequired
@LoginTypeInstitute
def analysis(request,sid):
#     "Q1": {
#     "question_content": "How satisfied are you with the quality of the product?",
#     "response": [4, 5, 3, 4, 2, 5, 4, 5, 4, 3] }
    # get survey 
    # sid = 10
    so = Survey.objects.get(id=sid)
    # get questions
    qo = Question.objects.filter(survey=so)
    survey_data = {}
    data_inside = {}
    # for all question 
    for q in qo:
        responses = []
        student_ans = student_responses.objects.filter(survey=so,question=q)
        for sa in student_ans:
            responses.append(sa.choice)
        print(responses)
        data_inside = {}
        data_inside['question_content'] = q.question
        data_inside['response'] = responses
        survey_data['{0}'.format(q.id)] = data_inside
    print(survey_data)
    
    overall_satisfaction = calculate_overall_satisfaction(survey_data)
    # Calculate coefficients of impact for each question
    impact_coefficients = calculate_coefficients(survey_data)

    # Find the question with the highest coefficient
    max_impact_question = max(impact_coefficients, key=impact_coefficients.get)

    # Prepare JSON with question ID, question content, and coefficient of impact
    result_json = {}
    for qid in survey_data:
        responses = survey_data[qid]["response"]
        mean_response = np.mean(responses)
        result_json[qid] = {
            "question_content": survey_data[qid]["question_content"],
            "coefficient_of_impact": impact_coefficients[qid],
            "mean_response": mean_response
        }

    # Print the JSON and overall satisfaction
    print("JSON containing coefficients of impact for each question:")
    print(json.dumps(result_json, indent=4))
    print("\nOverall Satisfaction:", overall_satisfaction)
    print("Question with the highest impact:", max_impact_question)
        
    return render(request,"report.html")
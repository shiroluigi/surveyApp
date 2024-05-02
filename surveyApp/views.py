from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User
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
    # if request.user.is_authenticated:
    #     return HttpResponseRedirect("/dashboard")
    if request.method == "POST":
        user_id = request.POST.get('u-id')
        password = request.POST.get('u-pass')
        user = authenticate(request, username=user_id, password=password, backend='authuser.userauth.UserTypeAuthenticationBackend')
        if(isinstance(user, User)):
            return render(request, "login.html")
        # print(user)
        if user is not None:
            login(request, user, backend='authuser.userauth.UserTypeAuthenticationBackend')
            request.session['user_id'] = str(user.pk)
            # request.session['user_type'] = request.POST.get('typeoflogin')
            if (isinstance(request.user,Institute)):
                request.session['user_type'] = "institute"
            else:
                # print(request.user)
                request.session['user_type'] = "student"
            # dashboard_path = f"/{request.POST.get('typeoflogin')}-dashboard"
            return HttpResponseRedirect("/")
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

def calculate_overall_satisfaction(data):
    all_responses = []
    for qid in data:
        all_responses.extend(data[qid]["response"])
    return np.mean(all_responses)


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
    so = Survey.objects.get(id=sid)
    # get questions
    qo = Question.objects.filter(survey=so)
    survey_data = {}
    sdd = {}
    data_inside = {}
    total_json = {}
    totalresarray = {
        "ch1" : 0,
        "ch2" : 0,
        "ch3" : 0,
        "ch4" : 0,
        "ch5" : 0
    }
    total_responses = 0
    # for 1 question 
    for q in qo:
        responses = []
        totalresarray = {
            "ch1" : 0,
            "ch2" : 0,
            "ch3" : 0,
            "ch4" : 0,
            "ch5" : 0
        }
        student_ans = student_responses.objects.filter(survey=so,question=q)
        for sa in student_ans:
            responses.append(sa.choice)
            if(sa.choice==1):
                totalresarray['ch1'] += 1
            elif(sa.choice==2):
                totalresarray['ch2'] += 1
            elif(sa.choice==3):
                totalresarray['ch3'] +=1
            elif(sa.choice==4):
                totalresarray['ch4'] +=1
            elif(sa.choice==5):
                totalresarray['ch5'] +=1
            total_responses += 1
        data_inside = {}
        data_inside['question_content'] = q.question
        data_inside['response'] = responses
        data_inside['tra'] = totalresarray
        survey_data['{0}'.format(q.id)] = data_inside
        
    
    overall_satisfaction = calculate_overall_satisfaction(survey_data)
    impact_coefficients = calculate_coefficients(survey_data)

    max_impact_question = max(impact_coefficients, key=impact_coefficients.get)

    result_json = {}
    for qid in survey_data:
        responses = survey_data[qid]["response"]
        mean_response = np.mean(responses)
        result_json[qid] = {
            "question_content": survey_data[qid]["question_content"],
            "coefficient_of_impact": impact_coefficients[qid],
            "mean_response": mean_response
        }
    total_json['name'] = so.survey_name 
    total_json['desc'] = so.survey_description
    total_json['total'] = total_responses
    total_json['mean'] = overall_satisfaction
    result_jsonS = json.dumps(result_json)
    question_contents_json = []
    for qid in result_json:
        question_contents_json.append({"q_content": result_json[qid]["question_content"]})
    question_contents_with_percentages_json = []
    for qid in result_json:
        responses = survey_data[qid]["response"]
        total_responses = len(responses)
        response_counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        for response in responses:
            response_counts[response] += 1
        response_percentages = {value: (count / total_responses) * 100 for value, count in response_counts.items()}
        
    
        question_json = {
            "q_content": result_json[qid]["question_content"],
            "response_percentages": response_percentages
        }
        # Append JSON object to the list
        question_contents_with_percentages_json.append(question_json)
 
    csvstring = "question,1,2,3,4,5\n"
    print(survey_data) 
    for s in survey_data:
        csvstring +=survey_data[s].get('question_content').replace(",", "")+ "," 
        for a in survey_data[s].get('tra'):
            csvstring += str(survey_data[s].get('tra')[a]) + ","
        csvstring += "\n"
    return render(request,"report.html",{'resultO' : question_contents_with_percentages_json , 'resultS' : result_jsonS , 'div_values' : total_json, 'cvstring':csvstring})
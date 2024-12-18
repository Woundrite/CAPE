"""
URL configuration for CAPE project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import re_path
from django.views.decorators.csrf import csrf_exempt

from API import views

urlpatterns = [
    re_path("signup", views.signup),
    re_path("login", views.login),
    re_path("test_token", views.test_token),
    re_path("create_test", views.create_test),
    re_path("get_all_exams", views.get_all_exams),
    re_path("get_test_details", views.get_test_details),
    re_path("test_face", views.check_image),
    re_path('register_student_for_test', views.register_student_for_test),
    re_path("attempt_test", views.attempt_test),
    re_path("get_exam_result", views.get_exam_result),
	re_path("get_dash_data", views.get_dash_data),
    re_path('send_mail', csrf_exempt(views.send_mail_page)),
    re_path('check_image', views.check_image)
]

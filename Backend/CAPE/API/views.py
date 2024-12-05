from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer
from API.models import CustomUser, Option, Question, Exam, Attempts
import datetime
from PIL import Image, ImageOps  # Install pillow instead of PIL
import numpy as np
from API.eyedetect import *
import base64
from io import BytesIO
import datetime as dt
import pytz
from django.shortcuts import render
from django.http import HttpResponse
from django.core.mail import send_mail
from django.conf import settings
from dateutil import parser


@api_view(["POST"])
def signup(request):
    serializer = UserSerializer(data=request.data)
    usr = CustomUser.objects.filter(username=request.data["username"], email=request.data["email"])
    if len(usr) == 1:
        usr = usr[0]
        token, created = Token.objects.get_or_create(user=usr)
        if usr.get_user_type() == request.data["user_type"]:
            return Response(
                {"detail": "User already exists."}, status=status.HTTP_201_CREATED
            )
        else:
            usr.set_user_type("dual")
            usr.save()
            return Response(
                {
                    "token": token.key,
                    "username": usr.username,
                    "user_type": usr.get_user_type(),
                    "email": usr.email,
                }, status=status.HTTP_201_CREATED
            )
    else:
        if serializer.is_valid():
            serializer.save()
            user = CustomUser.objects.get(username=request.data["username"])
            user.set_password(request.data["password"])
            user.save()
            token = Token.objects.create(user=user)
            return Response(
                {
                    "token": token.key,
                    "username": user.username,
                    "user_type": user.get_user_type(),
                    "email": user.email,
                }, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def send_mail_page(request):
    context = {}

    address = request.data.get('address')
    subject = request.data.get('subject')
    message = request.data.get('message')

    if address and subject and message:
        try:
            send_mail(subject, message=message, from_email=settings.EMAIL_HOST_USER, recipient_list=[address])
            context['result'] = 'Email sent successfully'
            print("MAIL SENT")
        except Exception as e:
            context['result'] = f'Error sending email: {e}'
    else:
        context['result'] = 'All fields are required'
    
    return Response(context, status=status.HTTP_200_OK)

@api_view(["GET"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_dash_data(request):
    # required data - user_type, username, email, questions correct, questions wrong, exams attempted, average score, upcoming exams, past exams
    user = request.user
    user_type = user.get_user_type()
    username = user.username
    email = user.email
    correct = 0
    wrong = 0
    exams_attempted = 0
    upcoming_exams = []
    past_exams = []
    total = 0
    if user_type in ["student", "dual"]:
        # factor in the exams attempted and the scores
        # attempts = Attempts.objects.filter(attempt_student=user)
        # for attempt in attempts:
        #     total += len(attempt.attempt_answers.all())
        #     correct += len(attempt.attempt_correct.all())
        #     wrong += len(attempt.attempt_wrong.all())
        #     exams_attempted += 1
        
        exams_all = Exam.objects.filter(exam_students=user)
        now = dt.datetime.now().replace(tzinfo=pytz.utc)
        for exam in exams_all:
            exams_attempted += 1
            if exam.exam_end_date_time > now:
                # check if exam is already attempted or not
                if Attempts.objects.filter(attempt_student=user, attempt_exam=exam):
                    continue
                
                upcoming_exams.append(
                    {
                        "Name": exam.exam_name,
                        "id": exam.ID,
                        "attempts": exam.num_attempts,
                        "datetime": str(exam.exam_start_date_time),
                        "datetime_end": str(exam.exam_end_date_time),
                        "duration": exam.exam_duration,
                    }
                )
            else:
                exms = Attempts.objects.filter(attempt_student=user, attempt_exam=exam)
                correct = 0
                wrong = 0
                total = 0
                for attempt in exms:
                    total += len(attempt.attempt_answers.all())
                    correct += len(attempt.attempt_correct.all())
                    wrong += len(attempt.attempt_wrong.all())
                if total:
                    exam_specific_average = (correct / total) * 100
                else:
                    exam_specific_average = 0
                past_exams.append(
                    {
                        "Name": exam.exam_name,
                        "id": exam.ID,
                        "attempts": exam.num_attempts,
                        "datetime": str(exam.exam_start_date_time),
                        "duration": exam.exam_duration,
                        "average_score": exam_specific_average,
                        "correct": correct,
                        "wrong": wrong
                    }
                )
        if total:
            avg_score = (correct / total) * 100
        else:
            avg_score = 0

        return Response(
            {
                "user_type": user_type,
                "username": username,
                "email": email,
                "correct": correct,
                "wrong": wrong,
                "exams_attempted": exams_attempted,
                "average_score": avg_score,
                "upcoming_exams": upcoming_exams,
                "past_exams": past_exams,
            }
        )
    elif user_type in ["teacher", "dual"]:
        # factor in the exams created and the students
        exams_all = Exam.objects.filter(exam_teacher=user)
        students = []
        for exam in exams_all:
            students.append(
                {
                    "Name": exam.exam_name,
                    "id": exam.ID,
                    "students": exam.exam_students.all(),
                    "questions": exam.exam_questions.all(),
                    "attempts": exam.num_attempts,
                    "datetime": str(exam.exam_start_date_time),
                    "duration": exam.exam_duration,
                }
            )
        return Response(
            {
                "user_type": user_type,
                "username": username,
                "email": email,
                "exams_created": len(exams_all),
                "students": students,
            }
        )
    else:
        return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)


@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def upcoming_test(request):
    pass


@api_view(["POST"])
def login(request):
    user = get_object_or_404(CustomUser, username=request.data["username"])
    if not user.check_password(request.data["password"]):
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    print(serializer.data)
    return Response({"token": token.key, "user": serializer.data})


@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def signout(request):
    request.user.auth_token.delete()
    return Response({"detail": "Logged out."}, status=status.HTTP_200_OK)


@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    perm = request.data["permission"]
    user_permissions = {
        "student": ["attempt_test", "profile", "view_test", "view_result"],
        "teacher": [
            "attempt_test",
            "profile",
            "view_test",
            "view_result",
            "create_test",
            "edit_test",
            "delete_test",
        ],
    }
    if request.user.user_type == "student":
        if perm in user_permissions["student"]:
            return Response(
                {
                    "status": "passed",
                    "username": request.user.username,
                    "user_type": request.user.get_user_type(),
                    "email": request.user.email,
                }
            )
    elif request.user.user_type == "teacher":
        if perm in user_permissions["teacher"]:
            return Response(
                {
                    "status": "passed",
                    "username": request.user.username,
                    "user_type": request.user.get_user_type(),
                    "email": request.user.email,
                }
            )
    elif request.user.user_type == "dual":
        if perm in user_permissions["student"] or perm in user_permissions["teacher"]:
            return Response(
                {
                    "status": "passed",
                    "username": request.user.username,
                    "user_type": request.user.get_user_type(),
                    "email": request.user.email,
                }
            )

    return Response(
        {
            "status": "failed",
            "username": request.user.username,
            "user_type": request.user.get_user_type(),
            "email": request.user.email,
        }
    )


@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_test(request):
    user = request.user
    exam = Exam.objects.get(ID=request.data["ExamID"])
    if user in exam.exam_students:
        quests = exam.exam_questions
        quests_opts = {}
        for i in quests:
            opts = []
            for j in Option.objects.filter(question=i):
                opts.append({"ID": j.ID, "text": j.text})
            quests_opts[i.question_text] = {
                "options": opts,
                "correct": j.correct_answer.ID,
            }

        return Response(
            {
                "test": quests_opts,
            },
            200,
        )
    else:
        return Response({"data": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)


@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def attempt_test(request):
    user = request.user
    exam = Exam.objects.get(ID=request.data["ExamID"])
    if user in exam.exam_students.all():
        correct = []
        wrong = []
        quests = exam.exam_questions.all()
        opts = []
        for i in request.data["options"]:
            opts.append(Option.objects.get(ID=int(i)))

        if len(quests) == len(opts):
            for opt in opts:
                if opt.is_correct:
                    correct.append(opt.question)
                else:
                    wrong.append(opt.question)

        attempt = Attempts.objects.create(
            attempt_student=user,
            attempt_exam=exam,
            attempt_marks=len(quests),
            attempt_submission_time=datetime.now(),
            attempt_feedback=request.data["feedback"],
        )

        attempt.attempt_answers.set(opts)
        attempt.attempt_correct.set(correct)
        attempt.attempt_wrong.set(wrong)

        return Response(
            {
                "wrong": wrong,
                "correct": correct,
                "time": attempt.attempt_submission_time,
            },
            200,
        )


@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_exam_result(request):
    attempt = Attempts.objects.get(ID=int(request.data["attempt_id"]))
    exam = attempt.attempt_exam
    quests = exam.exam_questions.all()
    quests_opts = {}
    for i in quests:
        opts = []
        corr = None
        for j in Option.objects.filter(question=i):
            if j.is_correct:
                corr = j
            opts.append({"ID": j.ID, "text": j.option_text})
        quests_opts[i.question_text] = {"options": opts, "correct": corr}

    return Response(
        {
            "time": attempt.attempt_submission_time,
            "result": quests_opts,
        },
        200,
    )


def create_question(request):
    quest = Question.objects.create(
        # question_text=request.data["question"],
        question_text=request,
    )

    # return Response({"id": quest.ID, "text": request.data["question"]}, status=status.HTTP_200_OK)
    return {"id": quest.ID, "text": request}

def create_option(request):
    # request contains the option text, first all existing options are checked for similarities and then new option is created if it doesn't exit the option id is returned along with a 200 created code
    # print(request.user, request)
    txt = request["text"]
    questid = request["quest"]
    corr = request["corr"]
    quest = Question.objects.get(ID=int(questid))
    opt = Option.objects.create(option_text=txt, question=quest, is_correct=(corr==1))
    opt.save()

    # return Response({"id": opt.ID, "text": txt}, status=status.HTTP_200_OK)
    return {"id": opt.ID, "text": txt}
    
@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_test(request):
    def strfdelta(tdelta, fmt):
        d = {"days": tdelta.days}
        d["hours"], rem = divmod(tdelta.seconds, 3600)
        d["minutes"], d["seconds"] = divmod(rem, 60)
        return fmt.format(**d)
    # creates a test

    quests = [create_question(i)["id"] for i in request.data["questions"]]
    opts = request.data["options"]

    options = []
    for i in zip(quests, opts):
        for j in i[1]:
            opt = {"text": j["text"], "corr": j["corr"], "quest":i[0]}
            create_option(opt)
            options.append(opt)

    stds = request.data["students"]

    dat = dt.datetime.now()

    duration = dt.datetime.strptime(
            request.data.get("exam_duration", strfdelta(dt.timedelta(minutes=30), "{hours}:{minutes}:{seconds}")).split("[")[0],
        "%H:%M:%S")
    duration = dt.timedelta(hours=duration.hour, minutes=duration.minute, seconds=duration.second)

    exm = Exam.objects.create(
        exam_name=request.data["name"],
        exam_start_date_time=dt.datetime.fromisoformat(
            request.data.get("exam_start_date_time", dat.isoformat()).split("[")[0],
        ),
        exam_end_date_time=dt.datetime.fromisoformat(
            request.data.get(
                "exam_end_date_time",
                (dat + dt.timedelta(days=1)).isoformat(),
            ).split("[")[0]
        ),
        exam_duration=duration,
        num_attempts=int(request.data.get("num_attempts", 1)),
        exam_teacher=request.user,
    )
    exm.save()
    for i in stds:
        exm.exam_students.add(CustomUser.objects.get(ID=int(i)))

    for j in quests:
        exm.exam_questions.add(Question.objects.get(ID=int(j)))

    exm.save()    
    return Response({"ExamID": str(exm.ID)}, status=status.HTTP_201_CREATED)

@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def register_student_for_test(request):
    exm = Exam.objects.get(ID=request.data["exam_id"])
    if exm:
        if request.data.get("students", None)
            for i in request.data["students"]:
                exm.exam_students.add(CustomUser.objects.get(ID=int(i)))
            return Response(
                {"detail": "Students added to exam", "SID": request.data["students"]},
                status=status.HTTP_200_OK,
            )
        else:
            exm.exam_students.add(request.user)
        exm.save()
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)



@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def check_image(request):
    base64_string = request.data["Image"]

    if "data:image" in base64_string:
        base64_string = base64_string.split(",")[1]

    # Decode the Base64 string into bytes
    image_bytes = base64.b64decode(base64_string)

    image_stream = BytesIO(image_bytes)

    image = np.asarray(Image.open(image_stream))

    with map_face_mesh.FaceMesh(
        min_detection_confidence=0.5, min_tracking_confidence=0.5
    ) as face_mesh:
        frame = cv.resize(image, None, fx=1.5, fy=1.5, interpolation=cv.INTER_CUBIC)
        frame_height, frame_width = frame.shape[:2]
        rgb_frame = cv.cvtColor(frame, cv.COLOR_RGB2BGR)
        results = face_mesh.process(rgb_frame)
        if results.multi_face_landmarks:
            print("detected")
            mesh_coords = landmarksDetection(frame, results, False)
            right_coords = [mesh_coords[p] for p in RIGHT_EYE]
            left_coords = [mesh_coords[p] for p in LEFT_EYE]
            crop_right, crop_left = eyesExtractor(frame, right_coords, left_coords)
            eye_position_right, color = positionEstimator(crop_right)
            eye_position_left, color = positionEstimator(crop_left)
            if eye_position_right == "CENTER" or eye_position_left == "CENTER":
                return Response(
                    {
                        "verdict": True,
                        "left": eye_position_left,
                        "right": eye_position_right,
                    }
                )
            else:
                return Response(
                    {
                        "verdict": False,
                        "left": eye_position_left,
                        "right": eye_position_right,
                    }
                )

        return Response(False)

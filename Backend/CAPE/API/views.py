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
from API.models import CustomUser, Option, Question, Exam
import datetime
from keras.models import load_model  # TensorFlow is required for Keras to work
from PIL import Image, ImageOps  # Install pillow instead of PIL
import numpy as np


@api_view(["POST"])
def signup(request):
    serializer = UserSerializer(data=request.data)
    usr = CustomUser.objects.filter(username=request.data["username"])
    if len(usr) == 1:
        usr = usr[0]
        if usr.get_user_type() == request.data["user_type"]:
            return Response(
                {"detail": "User already exists."}, status=status.HTTP_400_BAD_REQUEST
            )
        else:
            usr.set_user_type("dual")
            return Response({"detail": "User is now both a student and teacher"})
    else:
        if serializer.is_valid():
            serializer.save()
            user = CustomUser.objects.get(username=request.data["username"])
            user.set_password(request.data["password"])
            user.save()
            token = Token.objects.create(user=user)
            return Response({"token": token.key, "user": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login(request):
    user = get_object_or_404(CustomUser, username=request.data["username"])
    if not user.check_password(request.data["password"]):
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    return Response({"token": token.key, "user": serializer.data})


@api_view(["GET"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    # request.user.email
    return Response("passed for {}".format(request.user.email))


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_test(request):
    # creates a test
    quests = request.data["questions"]
    stds = request.data["students"]
    dt = datetime.datetime.now()
    exm = Exam.objects.create(
        exam_name=request.data["name"],
        exam_start_date_time=datetime.datetime.strptime(
            request.data.get("exam_start_date_time", dt.strftime("%d/%m/%Y %H:%M:%S")),
            "%d/%m/%Y %H:%M:%S",
        ),
        exam_end_date_time=datetime.datetime.strptime(
            request.data.get(
                "exam_end_date_time",
                (dt + datetime.timedelta(days=1)).strftime("%d/%m/%Y %H:%M:%S"),
            )
        ),
        exam_duration=datetime.datetime.strptime(
            request.data.get("exam_duration", datetime.time(1).strftime("%H:%M:%S")),
            "%H:%M:%S",
        ).time(),
        num_attempts=int(request.data.get("num_attempts", 1)),
        exam_teacher=request.user,
    )
    for i in stds:
        exm.exam_students.add(CustomUser.objects.get(ID=int(i)))
    for j in quests:
        exm.exam_questions.add(Question.objects.get(ID=int(j)))


@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def register_questions_for_test(request):
    exm = Exam.objects.get(ID=request.data["exam_id"])
    for i in request.data["questions"]:
        exm.exam_questions.add(Question.objects.get(ID=int(i)))


@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def register_student_for_test(request):
    exm = Exam.objects.get(ID=request.data["exam_id"])
    for i in request.data["students"]:
        exm.exam_students.add(CustomUser.objects.get(ID=int(i)))
    return Response(
        {"detail": "Students added to exam", "SID": request.data["students"]},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_question(request):
    opts = request.data["options"]
    quest = Question.objects.create(
        question_text=request.data["question"],
        question_marks_corrent=int(request.data.get("marks", 1)),
        question_marks_wrong=int(request.data.get("neg_marks", 0)),
    )
    for opt in opts:
        quest.question_answer.add(Option.objects.get(ID=int(opt)))
    return Response(
        {"id": quest.ID, "text": request.data["question"]}, status=status.HTTP_200_OK
    )


@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_option(request):
    # request contains the option text, first all existing options are checked for similarities and then new option is created if it doesn't exit the option id is returned along with a 200 created code
    # print(request.user, request.data)
    txt = request.data["text"]
    opt, _ = Option.objects.get_or_create(option_text=txt)
    print(opt)
    return Response({"id": opt.ID, "text": txt}, status=status.HTTP_200_OK)


@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def check_image(request):
    # Disable scientific notation for clarity
    np.set_printoptions(suppress=True)

    # Load the model
    model = load_model("keras_Model.h5", compile=False)

    # Load the labels
    class_names = open("labels.txt", "r").readlines()

    # Create the array of the right shape to feed into the keras model
    # The 'length' or number of images you can put into the array is
    # determined by the first position in the shape tuple, in this case 1
    data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
    # Remove any leading '0x' from the hex string
    hex_string = request["Image"].replace("0x", "")

    # Convert the hex string to bytes
    bytes_data = bytes.fromhex(hex_string)

    # Convert bytes to a numpy array
    array = np.frombuffer(bytes_data, dtype=np.uint8)

    # Reshape the array into the image dimensions
    array = array.reshape((request["size"][0], request["size"][1], 3))  # Assuming RGB image

    # Create a PIL Image from the array
    image = Image.fromarray(array).convert("RGB")

    # resizing the image to be at least 224x224 and then cropping from the center
    size = (224, 224)
    image = ImageOps.fit(image, size, Image.Resampling.LANCZOS)

    # turn the image into a numpy array
    image_array = np.asarray(image)

    # Normalize the image
    normalized_image_array = (image_array.astype(np.float32) / 127.5) - 1

    # Load the image into the array
    data[0] = normalized_image_array

    # Predicts the model
    prediction = model.predict(data)
    index = np.argmax(prediction)
    class_name = class_names[index]
    confidence_score = prediction[0][index]

    # Print prediction and confidence score
    print("Class:", class_name[2:], end="")
    print("Confidence Score:", confidence_score)

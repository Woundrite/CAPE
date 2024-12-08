import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


# Create your models here.
class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(username=username.strip(), email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(username, email, password, **extra_fields)


class CustomUser(AbstractUser):
    # You can add fields that you want in your form not included in the Abstract User here
    # e.g Gender = model.CharField(max_length=10)
    USER_TYPE_CHOICES = (
        ("student", "Student"),
        ("teacher", "Teacher"),
        ("dual", "dual"),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)

    username = models.CharField(
        max_length=150,
        unique=True,
        help_text="Required. 150 characters or fewer. Letters, digits, and spaces only.",
        validators=[],
        error_messages={
            "unique": "A user with that username already exists.",
        },
    )

    def is_teacher(self):
        return self.user_type == "teacher"

    def is_student(self):
        return self.user_type == "student"

    def is_dual(self):
        return self.user_type == "dual"

    def get_user_type(self):
        return self.user_type

    def set_user_type(self, user_type):
        self.user_type = user_type
        self.save()

    objects = CustomUserManager()


class Question(models.Model):
    ID = models.AutoField(primary_key=True)
    question_text = models.CharField(max_length=500)


class Option(models.Model):
    ID = models.AutoField(primary_key=True)
    option_text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)


class Exam(models.Model):
    ID = models.UUIDField(
        primary_key=True, unique=True, max_length=20, editable=False, default=uuid.uuid4
    )
    exam_name = models.CharField(max_length=255)
    exam_start_date_time = models.DateTimeField()
    exam_end_date_time = models.DateTimeField()
    exam_duration = models.DurationField()
    num_attempts = models.IntegerField()
    exam_teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    exam_students = models.ManyToManyField(CustomUser, related_name="examStudents")
    exam_questions = models.ManyToManyField(Question, related_name="examQuestion")


# Relational Tables
class Attempts(models.Model):
    ID = models.AutoField(primary_key=True)
    attempt_student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    attempt_exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    attempt_marks = models.IntegerField()
    attempt_time = models.DurationField()
    attempt_submission_time = models.DateTimeField()
    attempt_feedback = models.CharField(max_length=500)
    attempt_answers = models.ManyToManyField(Option, related_name="AttemptOption")
    attempt_correct = models.ManyToManyField(
        Option, related_name="AttemptCorrect", blank=True
    )
    attempt_wrong = models.ManyToManyField(
        Option, related_name="AttemptWrong", blank=True
    )
    attempt_cheats = models.IntegerField(null=True, default=0)

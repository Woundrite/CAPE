from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
# Create your models here.
class CustomUserManager(BaseUserManager):
	def create_user(self, username, email, password=None, **extra_fields):
		if not email:
			raise ValueError('The Email field must be set')
		email = self.normalize_email(email)
		user = self.model(username=username.strip(), email=email, **extra_fields)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, username, email, password=None, **extra_fields):
		extra_fields.setdefault('is_staff', True)
		extra_fields.setdefault('is_superuser', True)

		if extra_fields.get('is_staff') is not True:
			raise ValueError('Superuser must have is_staff=True.')
		if extra_fields.get('is_superuser') is not True:
			raise ValueError('Superuser must have is_superuser=True.')

		return self.create_user(username, email, password, **extra_fields)

class CustomUser(AbstractUser):
	# You can add fields that you want in your form not included in the Abstract User here
	# e.g Gender = model.CharField(max_length=10)
	USER_TYPE_CHOICES = (
		('student', 'Student'),
		('teacher', 'Teacher'),
		('dual', 'dual'),
	)
	user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)

	username = models.CharField(
		max_length=150, 
		unique=True,
		help_text='Required. 150 characters or fewer. Letters, digits, and spaces only.',
		validators=[],
		error_messages={
			'unique': "A user with that username already exists.",
		},
	)

	def is_teacher(self):
		return self.user_type == 'teacher'

	def is_student(self):
		return self.user_type == 'student'

	def is_dual(self):
		return self.user_type == 'dual'

	objects = CustomUserManager()

	
class Option(models.Model):
	option_text = models.CharField(max_length=500)

class Question(models.Model):
	question_text = models.CharField(max_length=500)
	question_marks = models.IntegerField()
	question_answer = models.CharField(max_length=500)

class Exam(models.Model):
	exam_name = models.CharField(max_length=100)
	exam_date = models.DateField()
	exam_time = models.TimeField()
	exam_duration = models.DurationField()
	exam_teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
	exam_students = models.ManyToManyField(CustomUser)
	exam_questions = models.ManyToManyField(Question)

class Attempts(models.Model):
	attempt_student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
	attempt_exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
	attempt_marks = models.IntegerField()
	attempt_time = models.DateTimeField()
	attempt_answers = models.ManyToManyField(Option)
	attempt_is_submitted = models.BooleanField()
	attempt_is_evaluated = models.BooleanField()
	attempt_evaluated_marks = models.IntegerField()
	attempt_evaluated_time = models.DateTimeField()
	attempt_feedback = models.CharField(max_length=500)
	attempt_is_reattempt = models.BooleanField()
	attempt_reattempt_time = models.DateTimeField()
	attempt_reattempt_answers = models.ManyToManyField(Option)
	attempt_reattempt_is_submitted = models.BooleanField()
	attempt_reattempt_is_evaluated = models.BooleanField()
	attempt_reattempt_evaluated_marks = models.IntegerField()
	attempt_reattempt_evaluated_time = models.DateTimeField()
	attempt_reattempt_evaluated_answers = models.ManyToManyField(Option)
	attempt_reattempt_feedback = models.CharField(max_length=500)

class Creates(models.Model):
	create_teacher = models.ManyToManyField(CustomUser)
	create_exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
	create_time = models.DateTimeField()
	create_is_deleted = models.BooleanField()

# Relational Tables
class ExamQuestion(models.Model):
	exam_question_exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
	exam_question_question = models.ForeignKey(Question, on_delete=models.CASCADE)
	exam_question_marks = models.IntegerField()

class QuestionOption(models.Model):
	question = models.ForeignKey(Question, on_delete=models.CASCADE)
	option = models.ForeignKey(Option, on_delete=models.CASCADE)
	is_correct = models.BooleanField()

class CUserAttempt(models.Model):
	user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
	attempt = models.ForeignKey(Attempts, on_delete=models.CASCADE)

class CUserCreate(models.Model):
	user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
	create = models.ForeignKey(Creates, on_delete=models.CASCADE)

class AttemptExam(models.Model):
	attempt = models.ForeignKey(Attempts, on_delete=models.CASCADE)
	exam = models.ForeignKey(Exam, on_delete=models.CASCADE)

class CreateExam(models.Model):
	create = models.ForeignKey(Creates, on_delete=models.CASCADE)
	exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
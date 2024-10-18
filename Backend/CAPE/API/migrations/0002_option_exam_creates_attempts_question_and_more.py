# Generated by Django 5.1.2 on 2024-10-18 07:15

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Option',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('option_text', models.CharField(max_length=500)),
                ('option_is_correct', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='Exam',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('exam_name', models.CharField(max_length=100)),
                ('exam_date', models.DateField()),
                ('exam_time', models.TimeField()),
                ('exam_duration', models.DurationField()),
                ('exam_students', models.ManyToManyField(related_name='students', to=settings.AUTH_USER_MODEL)),
                ('exam_teacher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exam_teacher', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Creates',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_time', models.DateTimeField()),
                ('create_is_deleted', models.BooleanField()),
                ('create_teacher', models.ManyToManyField(related_name='create_teacher', to=settings.AUTH_USER_MODEL)),
                ('create_exam', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exam_create', to='API.exam')),
            ],
        ),
        migrations.CreateModel(
            name='Attempts',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('attempt_marks', models.IntegerField()),
                ('attempt_time', models.DateTimeField()),
                ('attempt_is_submitted', models.BooleanField()),
                ('attempt_is_evaluated', models.BooleanField()),
                ('attempt_evaluated_marks', models.IntegerField()),
                ('attempt_evaluated_time', models.DateTimeField()),
                ('attempt_feedback', models.CharField(max_length=500)),
                ('attempt_is_reattempt', models.BooleanField()),
                ('attempt_reattempt_time', models.DateTimeField()),
                ('attempt_reattempt_is_submitted', models.BooleanField()),
                ('attempt_reattempt_is_evaluated', models.BooleanField()),
                ('attempt_reattempt_evaluated_marks', models.IntegerField()),
                ('attempt_reattempt_evaluated_time', models.DateTimeField()),
                ('attempt_reattempt_feedback', models.CharField(max_length=500)),
                ('attempt_student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='student', to=settings.AUTH_USER_MODEL)),
                ('attempt_exam', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exam_attempt', to='API.exam')),
                ('attempt_answers', models.ManyToManyField(related_name='answers', to='API.option')),
                ('attempt_evaluated_answers', models.ManyToManyField(related_name='evaluated_answers', to='API.option')),
                ('attempt_reattempt_answers', models.ManyToManyField(related_name='reattempt_answers', to='API.option')),
                ('attempt_reattempt_evaluated_answers', models.ManyToManyField(related_name='reattempt_evaluated_answers', to='API.option')),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question_text', models.CharField(max_length=500)),
                ('question_marks', models.IntegerField()),
                ('question_answer', models.CharField(max_length=500)),
                ('question_options', models.ManyToManyField(related_name='options', to='API.option')),
            ],
        ),
        migrations.AddField(
            model_name='exam',
            name='exam_questions',
            field=models.ManyToManyField(related_name='questions', to='API.question'),
        ),
    ]

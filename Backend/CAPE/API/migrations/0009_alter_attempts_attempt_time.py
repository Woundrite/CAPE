# Generated by Django 5.1.2 on 2024-11-25 12:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0008_remove_attempts_attempt_num_correct_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attempts',
            name='attempt_time',
            field=models.DurationField(),
        ),
    ]
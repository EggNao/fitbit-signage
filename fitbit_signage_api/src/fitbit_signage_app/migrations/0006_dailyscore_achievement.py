# Generated by Django 3.2 on 2022-06-07 05:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fitbit_signage_app', '0005_dailyscore_is_wearing'),
    ]

    operations = [
        migrations.AddField(
            model_name='dailyscore',
            name='achievement',
            field=models.BooleanField(default=False),
        ),
    ]

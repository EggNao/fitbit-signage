# Generated by Django 3.2 on 2022-06-06 07:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fitbit_signage_app', '0004_alter_dailyscore_weight'),
    ]

    operations = [
        migrations.AddField(
            model_name='dailyscore',
            name='is_wearing',
            field=models.BooleanField(default=False),
        ),
    ]

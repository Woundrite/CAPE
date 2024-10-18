from rest_framework import serializers
from API.models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model= CustomUser 
        fields = ['id', 'username', 'password', 'email', 'user_type']
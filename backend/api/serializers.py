from rest_framework import serializers
from .models import Post, Comment
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class RecursiveCommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    author = serializers.CharField(source='author.username')
    timestamp = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'votes', 'timestamp', 'replies']

    def get_replies(self, obj):
        replies = Comment.objects.filter(parent=obj)
        serializer = RecursiveCommentSerializer(replies, many=True)
        return serializer.data

    def get_timestamp(self, obj):
        # Simple timestamp format, you can make this more sophisticated
        return f'{obj.created_at.strftime("%H")} hours ago'

class PostSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username')
    comments = RecursiveCommentSerializer(many=True, read_only=True)
    timestamp = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'subreddit', 'votes', 'timestamp', 'comments']

    def get_timestamp(self, obj):
        return f'{obj.created_at.strftime("%H")} hours ago'
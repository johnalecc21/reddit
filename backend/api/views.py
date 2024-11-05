from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Post, Comment
from .serializers import PostSerializer, RecursiveCommentSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    @action(detail=True, methods=['post'])
    def comments(self, request, pk=None):
        post = self.get_object()
        content = request.data.get('content')
        
        if not content:
            return Response(
                {'error': 'Content is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # For demo purposes, use the first user
        author = User.objects.first()
        if not author:
            author = User.objects.create_user(username='demo_user')

        comment = Comment.objects.create(
            content=content,
            author=author,
            post=post
        )

        serializer = RecursiveCommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='comments/(?P<comment_id>[^/.]+)/replies')
    def add_reply(self, request, pk=None, comment_id=None):
        post = self.get_object()
        parent_comment = get_object_or_404(Comment, id=comment_id, post=post)
        content = request.data.get('content')

        if not content:
            return Response(
                {'error': 'Content is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # For demo purposes, use the first user
        author = User.objects.first()
        if not author:
            author = User.objects.create_user(username='demo_user')

        reply = Comment.objects.create(
            content=content,
            author=author,
            post=post,
            parent=parent_comment
        )

        serializer = RecursiveCommentSerializer(reply)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
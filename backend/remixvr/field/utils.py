from .models import (Field, Position, Text, Number, Audio, Video,
                     VideoSphere, Image, PhotoSphere, File, Link, Color)
from flask_jwt_extended import current_user


def generate_fields(space, fields):
    for field in fields:
        if field['type'] == 'photosphere':
            new_field = PhotoSphere(
                space=space, author=current_user.profile, label=field['label'])
        if field['type'] == 'text':
            new_field = Text(
                space=space, author=current_user.profile, label=field['label'])
        if field['type'] == 'image':
            new_field = Image(
                space=space, author=current_user.profile, label=field['label'])
        if field['type'] == 'videosphere':
            new_field = VideoSphere(
                space=space, author=current_user.profile, label=field['label'])
        if field['type'] == 'color':
            new_field = Color(
                space=space, author=current_user.profile, label=field['label'])
        new_field.save()

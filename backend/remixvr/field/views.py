"""
Field Views
"""
import os
import uuid
from flask import Blueprint
from flask_apispec import use_kwargs, marshal_with
from flask_jwt_extended import current_user, jwt_required, jwt_optional
from flask import current_app as app
from werkzeug.utils import secure_filename
from marshmallow import fields
from sqlalchemy.exc import IntegrityError

from remixvr.database import db
from remixvr.exceptions import InvalidUsage
from remixvr.space.models import Space
from .models import (Field, Position, Text, Number, Audio, Video,
                     VideoSphere, Image, PhotoSphere, File, Link)
from .serializers import field_schema, field_schemas, combined_schema

blueprint = Blueprint('fields', __name__)


@blueprint.route('/api/fields/<field_id>', methods=('GET',))
@jwt_required
@marshal_with(field_schema)
def get_field(field_id):
    field = Field.query.filter_by(id=field_id).first()
    if not field:
        raise InvalidUsage.field_not_found()
    return field


@blueprint.route('/api/fields/<field_id>', methods=('PUT',))
@jwt_required
@use_kwargs(field_schema)
@marshal_with(field_schema)
def update_field(field_id, **kwargs):
    field = Field.query.filter(
        Field.id == field_id, Field.project.author_id == current_user.profile.id).first()
    if not field:
        raise InvalidUsage.field_not_found()
    field.update(**kwargs)
    field.save()
    return field


@blueprint.route('/api/fields/<field_id>', methods=('DELETE',))
@jwt_required
def delete_field(field_id):
    field = Field.query.filter(
        Field.id == field_id, Field.author_id == current_user.profile.id).first()
    field.delete()
    return '', 200


def check_file_extension_for_type(type, file_extension):
    if type == 'image' or type == 'photosphere':
        if file_extension not in ['.png', '.jpg', '.jpeg']:
            raise InvalidUsage.invalid_file_type()
    elif type == 'audio':
        if file_extension not in ['.mp3']:
            raise InvalidUsage.invalid_file_type()
    elif type == 'video' or type == 'videosphere':
        if file_extension not in ['.mp4']:
            raise InvalidUsage.invalid_file_type()


@blueprint.route('/api/fields', methods=('POST',))
@jwt_required
@use_kwargs(combined_schema)
@marshal_with(field_schema)
def create_field(label, space_id, type, **kwargs):
    space = Space.get_by_id(space_id)
    if not space:
        raise InvalidUsage.project_not_found()
    if 'file' in kwargs and kwargs['file'] is not None:
        uploaded_file = kwargs.pop('file')
        if uploaded_file.filename == '':
            raise InvalidUsage.no_files_found()
        filename_original, file_extension = os.path.splitext(
            secure_filename(uploaded_file.filename))
        check_file_extension_for_type(type, file_extension)
        filename = '{}{}'.format(uuid.uuid4().hex, file_extension)
        uploaded_file.save(os.path.join(app.root_path,
                                        app.config['UPLOAD_FOLDER'], filename))
        file_url = '/uploads/{}'.format(filename)
        file_size = os.path.getsize(os.path.join(app.root_path,
                                                 app.config['UPLOAD_FOLDER'], filename))
        file_object = File(filename=filename, url=file_url,
                           filemime=uploaded_file.mimetype, filename_original=uploaded_file.filename, filesize=file_size)
        file_object.save()

    field = None
    try:
        if type == 'position':
            field = Position(label=label, space=space,
                             author=current_user.profile, **kwargs)
        elif type == 'text':
            field = Text(label=label, space=space,
                         author=current_user.profile, ** kwargs)
        elif type == 'number':
            field = Number(label=label, space=space,
                           author=current_user.profile, **kwargs)
        elif type == 'audio':
            field = Audio(label=label, space=space,
                          author=current_user.profile, file=file_object, ** kwargs)
        elif type == 'video':
            field = Video(label=label, space=space,
                          author=current_user.profile, file=file_object, ** kwargs)
        elif type == 'videosphere':
            field = VideoSphere(label=label, space=space,
                                author=current_user.profile, file=file_object, ** kwargs)
        elif type == 'image':
            field = Image(label=label, space=space,
                          author=current_user.profile, file=file_object, ** kwargs)
        elif type == 'photosphere':
            field = PhotoSphere(label=label, space=space,
                                author=current_user.profile, file=file_object, ** kwargs)
        elif type == 'link':
            field = Link(label=label, space=space,
                         author=current_user.profile, **kwargs)
        else:
            raise Exception(("Field type - {} not found").format(type))
            return
        if 'parent_id' in kwargs:
            parent_field = Field.get_by_id(kwargs['parent_id'])
            if parent_field:
                field.parent = parent_field
        field.save()

    except IntegrityError:
        db.session.rollback()
        raise InvalidUsage.no_files_found()
    except Exception as e:
        print(e)
        raise InvalidUsage.field_error()
    return field

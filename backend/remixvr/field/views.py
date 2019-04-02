"""
Field Views
"""

from flask import Blueprint
from flask_apispec import use_kwargs, marshal_with
from flask_jwt_extended import current_user, jwt_required, jwt_optional
from marshmallow import fields
from sqlalchemy.exc import IntegrityError

from remixvr.database import db
from remixvr.exceptions import InvalidUsage
from remixvr.project.models import Project
from .models import (Field, Position, Text, Number, Audio, Video,
                     VideoSphere, Image, PhotoSphere)
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
@marshal_with(field_schema)
def delete_field(field_id):
    field = Field.query.filter(
        Field.id == field_id, Field.project.author_id == current_user.profile.id).first()
    field.delete()
    return '', 200


@blueprint.route('/api/fields', methods=('POST',))
@jwt_required
@use_kwargs(combined_schema)
@marshal_with(field_schema)
def create_field(label, project_name, type, **kwargs):
    project = Project.query.filter_by(slug=project_name).first()
    if not project:
        raise InvalidUsage.project_not_found()
    field = None
    try:
        if type == 'position':
            field = Position(label=label, project=project,
                             author=project.author, **kwargs)
        elif type == 'text':
            field = Text(label=label, project=project,
                         author=project.author, ** kwargs)
        elif type == 'number':
            field = Number(label=label, project=project,
                           author=project.author, **kwargs)
        elif type == 'audio':
            field = Audio(label=label, project=project,
                          author=project.author, ** kwargs)
        elif type == 'video':
            field = Video(label=label, project=project,
                          author=project.author, ** kwargs)
        elif type == 'videosphere':
            field = VideoSphere(label=label, project=project,
                                author=project.author, ** kwargs)
        elif type == 'image':
            field = Image(label=label, project=project,
                          author=project.author, ** kwargs)
        elif type == 'photosphere':
            field = PhotoSphere(label=label, project=project,
                                author=project.author, ** kwargs)
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

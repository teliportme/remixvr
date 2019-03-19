# coding: utf-8

from flask import Blueprint
from flask_apispec import marshal_with
from flask_jwt_extended import current_user, jwt_required, jwt_optional

from .serializers import field_schema, field_schemas
from .models import Field
from remixvr.exceptions import InvalidUsage

blueprint = Blueprint('fields', __name__)


@blueprint.route('/api/fields/<field_id>', methods=('GET',))
@jwt_required
@marshal_with(field_schema)
def get_field(field_id):
    field = Field.query.filter_by(id=field_id).first()
    if not field:
        raise InvalidUsage.field_not_found()
    return field


@blueprint.route('/api/fields/<field_id>', methods=('PUT'),)
@jwt_required
@marshal_with(field_schema)
def update_field(field_id, **kwargs):
    field = Field.query.filter(
        Field.id == field_id, Field.project.author_id == current_user.profile.id).first()
    if not field:
        raise InvalidUsage.field_not_found()
    field.update(**kwargs)
    field.save()
    return field


@blueprint.route('/api/fields/<field_id>', methods=('DELETE'),)
@jwt_required
@marshal_with(field_schema)
def delete_field(field_id):
    field = Field.query.filter(
        Field.id == field_id, Field.project.author_id == current_user.profile.id).first()
    field.delete()
    return '', 200

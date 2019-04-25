"""Space Views"""

from flask import Blueprint
from flask_apispec import use_kwargs, marshal_with
from flask_jwt_extended import jwt_required, jwt_optional
from marshmallow import fields

from remixvr.project.models import Project
from remixvr.exceptions import InvalidUsage
from .serializers import space_schema, space_schemas
from .models import Space

blueprint = Blueprint('spaces', __name__)


@blueprint.route('/api/spaces/<space_id>', methods=('GET',))
@jwt_required
@marshal_with(space_schema)
def get_space(space_id):
    space = Space.get_by_id(space_id)
    if not field:
        raise InvalidUsage.space_not_found()
    return space


@blueprint.route('/api/spaces', methods=('POST',))
@jwt_required
@use_kwargs(space_schema)
@marshal_with(space_schema)
def create_space(project_id):
    project = Project.get_by_id(project_id)
    if not project:
        raise InvalidUsage.project_not_found()
    space = Space()
    space.save()
    project.add_space(space)
    project.save()
    return space


@blueprint.route('/api/spaces/<space_id>', methods=('DELETE',))
@jwt_required
def delete_space(space_id):
    space = Space.query.filter(
        Space.id == space_id, Space.author_id == current_user.profile.id).first()
    if not space:
        raise InvalidUsage.space_not_found()
    space.delete()
    return '', 200


@blueprint.route('/api/spaces/<space_id>/project/<project_id>', methods=('DELETE',))
@jwt_required
def delete_space_from_project(space_id, project_id):
    space = Space.get_by_id(space_id)
    if not space:
        raise InvalidUsage.space_not_found()
    project = Project.get_by_id(project_id)
    if not project:
        raise InvalidUsage.project_not_found()
    project.remove_space(space)
    project.save()
    return '', 200

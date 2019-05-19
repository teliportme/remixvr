"""Space Views"""

from flask import Blueprint
from flask_apispec import use_kwargs, marshal_with
from flask_jwt_extended import jwt_required, jwt_optional, current_user
from marshmallow import fields

from remixvr.project.models import Project
from remixvr.exceptions import InvalidUsage
from .serializers import space_schema, space_schemas
from .models import Space
from remixvr.field.utils import generate_fields

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
def create_space(project_slug, type):
    project = Project.query.filter_by(
        slug=project_slug, author_id=current_user.profile.id).first()

    if not project:
        raise InvalidUsage.project_not_found()
    if type is None:
        type = 'default'
    space = Space(author=current_user.profile, type=type)
    space.save()

    config = project.theme.config
    space_to_create = next(
        (item for item in config['spaces'] if item['type'] == type), None)
    fields_to_generate = space_to_create['fields']
    generate_fields(space, fields_to_generate)

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

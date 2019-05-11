"""Project Views"""

import datetime as dt
import json

from flask import Blueprint
from flask_apispec import use_kwargs, marshal_with
from flask_jwt_extended import current_user, jwt_required, jwt_optional
from marshmallow import fields

from remixvr.user.models import User
from remixvr.field.serializers import field_schemas
from remixvr.space.serializers import space_schemas
from remixvr.space.models import Space
from remixvr.field.models import PhotoSphere, Image
from remixvr.exceptions import InvalidUsage
from remixvr.theme.models import Theme
from .models import Project, Tags
from .serializers import project_schema, projects_schema
from remixvr.theme.serializers import theme_schema

blueprint = Blueprint('projects', __name__)

##########
# Projects
##########


@blueprint.route('/api/projects', methods=('GET',))
@jwt_optional
@use_kwargs({'tag': fields.Str(), 'author': fields.Str(),
             'favorited': fields.Str(), 'limit': fields.Int(), 'offset': fields.Int()})
@marshal_with(projects_schema)
def get_projects(tag=None, author=None, favorited=None, limit=20, offset=0):
    res = Project.query
    if tag:
        res = res.filter(Project.tagList.any(Tags.tagname == tag))
    if author:
        res = res.join(Project.author).join(
            User).filter(User.username == author)
    if favorited:
        res = res.join(Project.favoriters).filter(User.username == favorited)
    return res.offset(offset).limit(limit).all()


@blueprint.route('/api/projects', methods=('POST',))
@jwt_required
@use_kwargs(project_schema)
@marshal_with(project_schema)
def make_project(title, description, theme_slug, tags=None):
    theme = Theme.query.filter_by(slug=theme_slug).first()
    if not theme:
        raise InvalidUsage.theme_not_found()
    project = Project(title=title, description=description,
                      author=current_user.profile, theme=theme)
    if tags is not None:
        for tag in tags:
            mtag = Tags.query.filter_by(tagname=tag).first()
            if not mtag:
                mtag = Tags(tag)
                mtag.save()
            project.add_tag(mtag)

    space = Space(author=current_user.profile)
    space.save()

    config = theme.config

    if len(config['spaces']) == 1:
        fields_to_generate = config['spaces'][0]['fields']
        for field in fields_to_generate:
            if field['type'] == 'photosphere':
                new_field = PhotoSphere(
                    space=space, author=current_user.profile)
            if field['type'] == 'image':
                new_field = Image(space=space, author=current_user.profile)
            new_field.save()

    project.add_space(space)
    project.save()
    return project


@blueprint.route('/api/projects/<slug>', methods=('PUT',))
@jwt_required
@use_kwargs(project_schema)
@marshal_with(project_schema)
def update_project(slug, **kwargs):
    project = Project.query.filter_by(
        slug=slug, author_id=current_user.profile.id).first()
    if not project:
        raise InvalidUsage.project_not_found()
    project.update(updatedAt=dt.datetime.utcnow(), **kwargs)
    project.save()
    return project


@blueprint.route('/api/projects/<slug>', methods=('DELETE',))
@jwt_required
def delete_project(slug):
    project = Project.query.filter_by(
        slug=slug, author_id=current_user.profile.id).first()
    project.delete()
    return '', 200


@blueprint.route('/api/projects/<slug>', methods=('GET',))
@jwt_optional
@marshal_with(project_schema)
def get_project(slug):
    project = Project.query.filter_by(slug=slug).first()
    if not project:
        raise InvalidUsage.project_not_found()
    return project


@blueprint.route('/api/projects/<slug>/favorite', methods=('POST',))
@jwt_required
@marshal_with(project_schema)
def favorite_an_project(slug):
    profile = current_user.profile
    project = Project.query.filter_by(slug=slug).first()
    if not project:
        raise InvalidUsage.project_not_found()
    project.favourite(profile)
    project.save()
    return project


@blueprint.route('/api/projects/<slug>/favorite', methods=('DELETE',))
@jwt_required
@marshal_with(project_schema)
def unfavorite_an_project(slug):
    profile = current_user.profile
    project = Project.query.filter_by(slug=slug).first()
    if not project:
        raise InvalidUsage.project_not_found()
    project.unfavourite(profile)
    project.save()
    return project


@blueprint.route('/api/projects/feed', methods=('GET',))
@jwt_required
@use_kwargs({'limit': fields.Int(), 'offset': fields.Int()})
@marshal_with(projects_schema)
def projects_feed(limit=20, offset=0):
    return Project.query.join(current_user.profile.follows). \
        order_by(Project.createdAt.desc()).offset(offset).limit(limit).all()


@blueprint.route('/api/projects/<slug>/spaces', methods=('GET',))
@jwt_optional
@marshal_with(space_schemas)
def get_project_spaces(slug):
    project = Project.query.filter_by(slug=slug).first()
    if not project:
        raise InvalidUsage.project_not_found()
    return project.spaces


@blueprint.route('/api/projects/<slug>/theme', methods=('GET',))
@jwt_optional
@marshal_with(theme_schema)
def get_project_theme(slug):
    project = Project.query.filter_by(slug=slug).first()
    if not project:
        raise InvalidUsage.project_not_found()
    return project.theme


######
# Tags
######


@blueprint.route('/api/tags', methods=('GET',))
def get_tags():
    return jsonify({'tags': [tag.tagname for tag in Tags.query.all()]})

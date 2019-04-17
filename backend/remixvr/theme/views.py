"""Theme Views"""

import datetime as datetime

from flask import Blueprint
from flask_apispec import use_kwargs, marshal_with
from flask_jwt_extended import current_user, jwt_required, jwt_optional
from marshmallow import fields
from sqlalchemy.exc import IntegrityError

from remixvr.database import db
from remixvr.user.models import User
from remixvr.exceptions import InvalidUsage
from .models import Theme
from .serializers import theme_schema, themes_schema

blueprint = Blueprint('themes', __name__)

#########
# Themes
#########


@blueprint.route('/api/themes', methods=('GET',))
@jwt_optional
@use_kwargs({'author': fields.Str(), 'limit': fields.Int(), 'offset': fields.Int()})
@marshal_with(themes_schema)
def get_themes(author=None, limit=20, offset=0):
    res = Theme.query
    if author:
        res = res.join(Theme.author).join(User).filter(User.username == author)
    return res.offset(offset).limit(limit).all()


@blueprint.route('/api/themes', methods=('POST',))
@jwt_required
@use_kwargs(theme_schema)
@marshal_with(theme_schema)
def make_theme(title, description, **kwargs):
    try:
        theme = Theme(title=title, description=description,
                      author=current_user.profile, **kwargs).save()
    except IntegrityError:
        db.session.rollback()
        raise InvalidUsage.theme_already_exists()
    return theme


@blueprint.route('/api/themes/<slug>', methods=('PUT',))
@jwt_required
@use_kwargs(theme_schema)
@marshal_with(theme_schema)
def update_theme(slug, **kwargs):
    theme = Theme.query.filter_by(
        slug=slug, author_id=current_user.profile.id).first()
    if not theme:
        raise InvalidUsage.theme_not_found()
    theme.update(udpatedAt=datetime.datetime.utcnow(), **kwargs)
    theme.save()
    return theme


@blueprint.route('/api/themes/<slug>', methods=('DELETE',))
@jwt_required
def delete_theme(slug):
    theme = Theme.query.filter_by(
        slug=slug, author_id=current_user.profile.id).first()
    theme.delete()
    return '', 200


@blueprint.route('/api/themes/<slug>', methods=('GET',))
@jwt_optional
@marshal_with(theme_schema)
def get_theme(slug):
    theme = Theme.query.filter_by(slug=slug).first()
    if not theme:
        raise InvalidUsage.theme_not_found()
    return theme

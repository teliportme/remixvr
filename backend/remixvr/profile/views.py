# coding: utf-8

from flask import Blueprint
from flask_apispec import marshal_with, use_kwargs
from flask_jwt_extended import current_user, jwt_required, jwt_optional
from marshmallow import fields

from .serializers import profile_schema
from remixvr.exceptions import InvalidUsage
from remixvr.user.models import User


blueprint = Blueprint('profiles', __name__)


@blueprint.route('/api/profiles/<username>', methods=('GET',))
@jwt_optional
@marshal_with(profile_schema)
def get_profile(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        raise InvalidUsage.user_not_found()
    return user.profile


@blueprint.route('/api/profiles/<username>/follow', methods=('POST',))
@jwt_required
@marshal_with(profile_schema)
def follow_user(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        raise InvalidUsage.user_not_found()
    current_user.profile.follow(user.profile)
    current_user.profile.save()
    return user.profile


@blueprint.route('/api/profiles/<username>/follow', methods=('DELETE',))
@jwt_required
@marshal_with(profile_schema)
def unfollow_user(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        raise InvalidUsage.user_not_found()
    current_user.profile.unfollow(user.profile)
    current_user.profile.save()
    return user.profile


@blueprint.route('/api/profiles/addschool', methods=('POST',))
@jwt_required
@use_kwargs({'school_id': fields.Int()})
@marshal_with(profile_schema)
def add_user_to_school(school_id):
    current_user.profile.school_id = school_id
    current_user.profile.save()
    return current_user.profile

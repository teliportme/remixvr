# -*- coding: utf-8 -*-
"""User views."""
from flask import Blueprint, request
from flask_apispec import use_kwargs, marshal_with
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, current_user
from sqlalchemy.exc import IntegrityError

from remixvr.database import db
from remixvr.exceptions import InvalidUsage
from remixvr.extensions import cors
from remixvr.profile.models import UserProfile
from .models import User
from .serializers import user_schema
import re

blueprint = Blueprint('user', __name__)


@blueprint.route('/api/users', methods=('POST',))
@use_kwargs(user_schema)
@marshal_with(user_schema)
def register_user(username, password, email, **kwargs):
    try:
        school_id = kwargs.pop('school_id')
        userprofile = UserProfile(
            User(username.lower(), email.lower(), password=password, **kwargs).save()).save()
        userprofile.user.token = create_access_token(identity=userprofile.user)

        if school_id:
            userprofile.school_id = school_id
            userprofile.save()
    except IntegrityError:
        db.session.rollback()
        raise InvalidUsage.user_already_registered()
    return userprofile.user


@blueprint.route('/api/users/login', methods=('POST',))
@jwt_optional
@use_kwargs(user_schema)
@marshal_with(user_schema)
def login_user(userid, password, **kwargs):

    # supports logging in with either email or username
    user = None
    if re.match(r"[^@]+@[^@]+\.[^@]+", userid):
        user = User.query.filter_by(email=userid.lower()).first()
    else:
        user = User.query.filter_by(username=userid.lower()).first()
    if user is not None and user.check_password(password):
        user.token = create_access_token(identity=user, fresh=True)
        return user
    else:
        raise InvalidUsage.user_not_found()


@blueprint.route('/api/user', methods=('GET',))
@jwt_required
@marshal_with(user_schema)
def get_user():
    user = current_user
    # Not sure about this
    user.token = request.headers.environ['HTTP_AUTHORIZATION'].split('Token ')[
        1]
    return current_user


@blueprint.route('/api/user', methods=('PUT',))
@jwt_required
@use_kwargs(user_schema)
@marshal_with(user_schema)
def update_user(**kwargs):
    user = current_user
    # take in consideration the password
    password = kwargs.pop('password', None)
    if password:
        user.set_password(password)
    if 'updated_at' in kwargs:
        kwargs['updated_at'] = user.created_at.replace(tzinfo=None)
    user.update(**kwargs)
    return user

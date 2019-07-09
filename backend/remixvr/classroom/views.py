import datetime as dt

from flask import Blueprint
from flask_apispec import use_kwargs, marshal_with
from flask_jwt_extended import current_user, jwt_required, jwt_optional
from marshmallow import fields
from sqlalchemy.exc import IntegrityError

from remixvr.school.models import School
from remixvr.exceptions import InvalidUsage

from .models import Classroom
from .serializers import classroom_schema, classrooms_schema

blueprint = Blueprint('classrooms', __name__)


@blueprint.route('/api/<school>/classrooms')
@jwt_required
@use_kwargs(classroom_schema)
@marshal_with(classroom_schema)
def get_school_classrooms(school):
    return Classroom.query.filter(Classroom.school == school).all()

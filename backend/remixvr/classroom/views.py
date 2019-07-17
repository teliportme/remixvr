import datetime as dt

from flask import Blueprint
from flask_apispec import use_kwargs, marshal_with
from flask_jwt_extended import current_user, jwt_required, jwt_optional
from marshmallow import fields
from sqlalchemy.exc import IntegrityError

from remixvr.database import db
from remixvr.school.models import School
from remixvr.exceptions import InvalidUsage

from .models import Classroom
from .serializers import classroom_schema, classrooms_schema

blueprint = Blueprint('classrooms', __name__)


@blueprint.route('/api/<school>/classrooms', methods=('GET',))
@jwt_required
@use_kwargs(classroom_schema)
@marshal_with(classroom_schema)
def get_school_classrooms(school):
    return Classroom.query.filter(Classroom.school == school).all()


@blueprint.route('/api/classroom', methods=('POST',))
@jwt_required
@use_kwargs(classroom_schema)
@marshal_with(classroom_schema)
def create_classroom(classname, **kwargs):
    try:
        school = current_user.profile.school
        if not school:
            raise InvalidUsage.no_associated_school()
        classroom = Classroom(classname=classname,
                              teacher=current_user.profile, school=school).save()
    except IntegrityError:
        db.session.rollback()
        raise InvalidUsage.item_already_exists()
    return classroom

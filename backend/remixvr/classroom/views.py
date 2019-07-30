import datetime as dt

from flask import Blueprint
from flask_apispec import use_kwargs, marshal_with
from flask_jwt_extended import current_user, jwt_required, jwt_optional
from marshmallow import fields
from sqlalchemy.exc import IntegrityError
from sqlalchemy import desc

from remixvr.database import db
from remixvr.school.models import School
from remixvr.exceptions import InvalidUsage

from .models import Classroom
from .serializers import classroom_schema, classrooms_schema

blueprint = Blueprint('classrooms', __name__)


@blueprint.route('/api/classrooms', methods=('GET',))
@jwt_required
@marshal_with(classrooms_schema)
def get_user_classrooms():
    return Classroom.query.filter_by(teacher_id=current_user.profile.id).order_by(desc(Classroom.created_at)).all()


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

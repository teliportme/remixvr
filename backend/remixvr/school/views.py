import datetime as dt

from flask import Blueprint
from flask_apispec import use_kwargs, marshal_with
from flask_jwt_extended import current_user, jwt_required, jwt_optional
from marshmallow import fields
from sqlalchemy.exc import IntegrityError

from remixvr.exceptions import InvalidUsage

from .models import School
from .serializers import school_schema, schools_schema

blueprint = Blueprint('schools', __name__)


@blueprint.route('/api/schools', methods=('GET',))
@jwt_optional
@marshal_with(schools_schema)
def get_schools():
    return School.query.all()

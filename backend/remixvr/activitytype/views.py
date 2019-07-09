import datetime as dt

from flask import Blueprint
from flask_apispec import use_kwargs, marshal_with
from flask_jwt_extended import current_user, jwt_required, jwt_optional
from marshmallow import fields
from sqlalchemy.exc import IntegrityError

from remixvr.exceptions import InvalidUsage

from .models import ActivityType
from .serializers import activity_type_schema, activity_types_schema

blueprint = Blueprint('activitytypes', __name__)


@blueprint.route('/api/activitytypes', methods=('GET',))
@jwt_optional
@marshal_with(activity_types_schema)
def get_activity_types():
    activity_types = ActivityType.query.all()

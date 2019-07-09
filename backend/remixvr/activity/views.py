import datetime as dt

from flask import Blueprint
from flask_apispec import use_kwargs, marshal_with
from flask_jwt_extended import current_user, jwt_required, jwt_optional
from marshmallow import fields
from sqlalchemy.exc import IntegrityError

from remixvr.exceptions import InvalidUsage

from .models import Activity
from .serializers import activity_schema, activities_schema

blueprint = Blueprint('activities', __name__)


@blueprint.route('/api/activity/<code>', methods=('GET',))
@jwt_optional
@marshal_with(activity_schema)
def get_activity(code):
    activity = Activity.query.filter_by(code=code).first()
    if not activity:
        raise InvalidUsage.item_not_found()
    return activity

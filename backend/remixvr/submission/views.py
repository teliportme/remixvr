import datetime as dt

from flask import Blueprint
from flask_apispec import use_kwargs, marshal_with
from flask_jwt_extended import current_user, jwt_required, jwt_optional
from marshmallow import fields
from sqlalchemy.exc import IntegrityError

from remixvr.exceptions import InvalidUsage
from remixvr.activity.models import Activity

from .models import Submission
from .serializers import submission_schema, submissions_schema

blueprint = Blueprint('submissions', __name__)


@blueprint.route('/api/submission/activity/<code>', methods=('GET',))
@jwt_required
@use_kwargs({code: fields.Str()})
@marshal_with(submissions_schema)
def get_activity_submissions(code):
    activivty = Activity.query.filter_by(code=code)
    if not activity:
        raise InvalidUsage.item_not_found()
    return Submission.query.filter_by(activity=activity).order_by(Submission.created_at.desc()).all()

import datetime as dt

from flask import Blueprint
from flask_apispec import use_kwargs, marshal_with
from flask_jwt_extended import current_user, jwt_required, jwt_optional
from marshmallow import fields
from sqlalchemy.exc import IntegrityError

from remixvr.exceptions import InvalidUsage

from .models import Submission
from .serializers import submission_schema, submissions_schema

blueprint = Blueprint('submissions', __name__)


@blueprint.route('/api/<activity>/submissions', methods=('GET',))
@jwt_required
@marshal_with(submissions_schema)
def get_activity_submissions(activity):
    return Submission.query.filter_by(Submission.activity == activity).all()

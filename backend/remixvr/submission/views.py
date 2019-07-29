import datetime as dt
import os
import uuid

from flask import Blueprint
from flask import current_app as app
from flask_apispec import use_kwargs, marshal_with
from flask_jwt_extended import current_user, jwt_required, jwt_optional
from marshmallow import fields
from sqlalchemy.exc import IntegrityError
from werkzeug.utils import secure_filename

from remixvr.exceptions import InvalidUsage
from remixvr.activity.models import Activity
from remixvr.field.models import File
from remixvr.classroom.models import Classroom

from .models import Submission
from .serializers import submission_schema, submissions_schema, submission_with_activity

blueprint = Blueprint('submissions', __name__)


@blueprint.route('/api/submission/classroom/<classroom_slug>/activity/<code>', methods=('GET',))
@jwt_optional
@use_kwargs({'code': fields.Str(), 'classroom_slug': fields.Str()})
@marshal_with(submission_with_activity)
def get_activity_submissions(code, classroom_slug):
    activity = Activity.query.join(Activity.classroom).filter(
        Classroom.slug == classroom_slug).filter(Activity.code == code).first()
    if not activity:
        raise InvalidUsage.item_not_found()
    submissions = Submission.query.filter_by(
        activity=activity).order_by(Submission.created_at.desc()).all()
    return {
        'activity': activity,
        'submissions': submissions
    }


@blueprint.route('/api/submission/activity/<code>', methods=('GET',))
@jwt_optional
@use_kwargs({'code': fields.Str()})
@marshal_with(submission_with_activity)
def get_activity_submissions_by_code(code):
    activity = Activity.query.filter_by(code=code).first()
    if not activity:
        raise InvalidUsage.item_not_found()
    submissions = Submission.query.filter_by(
        activity=activity, approved=True).order_by(Submission.created_at.desc()).all()
    return {
        'activity': activity,
        'submissions': submissions
    }


@blueprint.route('/api/submission/activity/<code>', methods=('POST',))
@jwt_optional
@use_kwargs(submission_schema)
@marshal_with(submission_schema)
def submit_submission(code, author, **kwargs):
    activity = Activity.query.filter_by(code=code).first()
    if not activity:
        raise InvalidUsage.item_not_found()
    if 'submitted_file' in kwargs and kwargs['submitted_file'] is not None:
        uploaded_file = kwargs.pop('submitted_file')
        if uploaded_file.filename == '':
            raise InvalidUsage.no_files_found()
        filename_original, file_extension = os.path.splitext(
            secure_filename(uploaded_file.filename))
        filename = '{}{}'.format(uuid.uuid4().hex, file_extension)
        uploaded_file.save(os.path.join(app.root_path,
                                        app.config['UPLOAD_FOLDER'], filename))
        file_url = '/uploads/{}'.format(filename)
        file_size = os.path.getsize(os.path.join(app.root_path,
                                                 app.config['UPLOAD_FOLDER'], filename))
        file_object = File(filename=filename, url=file_url,
                           filemime=uploaded_file.mimetype, filename_original=uploaded_file.filename, filesize=file_size)
        file_object.save()
    else:
        raise InvalidUsage.no_files_found()
    file_type = kwargs.get('file_type')
    if not file_type:
        if file_extension in ['.png', '.jpg', '.gif', '.jpeg']:
            file_type = 'image'
        elif file_extension in ['.mp4']:
            file_type = 'video'
    submission = Submission(
        author=author, file=file_object, activity=activity, file_type=file_type).save()
    return submission


@blueprint.route('/api/submission/<submission_id>', methods=('POST',))
@jwt_required
@use_kwargs({'submission_id': fields.Int(), 'code': fields.Str()})
@marshal_with(submission_schema)
def toggle_approval_submission(code, submission_id):
    activity = Activity.query.filter_by(code=code).first()
    if not activity:
        raise InvalidUsage.item_not_found()
    submission = Submission.query.filter_by(
        activity=activity, id=submission_id).first()
    if not submission:
        raise InvalidUsage.item_not_found()
    new_approved_state = not submission.approved
    submission.update(approved=new_approved_state)
    submission.save()
    return submission

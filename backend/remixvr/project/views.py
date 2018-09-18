"""Project Views"""
from flask import Blueprint
from werkzeug.utils import secure_filename

from .models import Project
from remixvr.exceptions import InvalidUsage

blueprint = Blueprint('project', __name__)

@blueprint.route('/api/projects', methods=('POST',))
def create_project(project_name, **kwargs):
  try:
    project = Project(project_name, **kwargs).save()
    if request.method == 'POST':
      if 'file' not in request.files:
        raise InvalidUsage.no_files_found()
      files = request.files['file']
      if files.filename == '':
        raise InvalidUsage.no_files_found()
      if files:
        filename = secure_filename(files.filename)
        files.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
  except:
    raise InvalidUsage.uknown_error()
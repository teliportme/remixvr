"""Project Views"""
from flask import Blueprint

from .models import Project

blueprint = Blueprint('project', __name__)

@blueprint.route('/api/projects', methods=('POST',))
def create_project(project_name, **kwargs):
  try:
    project = Project(project_name, **kwargs).save()

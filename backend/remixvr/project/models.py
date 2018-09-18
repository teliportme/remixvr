# -*- coding: utf-8 -*-
"""Project models."""

from remixvr.database import (Model, SurrogatePK,
                              relationship, reference_col,
                              Column, db)

class Project(Model, SurrogatePK):

  __tablename__ = 'projects'
  project_name = Column(db.String(80), unique=True, nullable=False)
  created_by = reference_col('userprofile', nullable=False)
  parent_id = db.Column(db.Integer, default=0)


  def __init__(self, project_name, **kwargs):
    db.Model.__init__(self, project_name=project_name, **kwargs)

  
  def projects_by_user(self, user_id):
    return self.query.join(Project.created_by).filter_by(user_id == user_id)

  def __repr__(self):
    """Represent instance as a unique string."""
    return '<Project({name!r})>'.format(name=self.project_name)
# -*- coding: utf-8 -*-
"""Project models."""

from remixvr.database import (Model, SurrogatePK
                              relationship, reference_col,
                              Column, db)

class Project(Model, SurrogatePK):

  __tablename__ = 'projects'
  project_name = Column(db.String(80), unique=True, nullable=False)
  created_by = reference_col('userprofile', nullable=False)


  def __init__(self, user, **kwargs):
    db.Model.__init__(self, user=user, **kwargs)

  
  def projects_by_user(self, user_id):
    return self.query.join(Project.created_by).filter_by(user_id == user_id)
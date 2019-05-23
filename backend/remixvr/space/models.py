# -*- coding: utf-8 -*-
"""Space models."""

from remixvr.database import (
    Model, SurrogatePK, relationship, Column, db, reference_col)


project_space_assoc = db.Table('project_space_assoc',
                               db.Column('project', db.Integer,
                                         db.ForeignKey('project.id')),
                               db.Column('space', db.Integer, db.ForeignKey('space.id')))


class Space(SurrogatePK, Model):

    __tablename__ = 'space'
    type = Column(db.String(50), nullable=False, default='default')
    fields = relationship('Field', back_populates="space",
                          cascade="all, delete-orphan")
    projects = relationship(
        'Project', secondary=project_space_assoc, backref='spaces')
    author_id = reference_col('userprofile', nullable=False)
    author = relationship('UserProfile', backref=db.backref('spaces'))

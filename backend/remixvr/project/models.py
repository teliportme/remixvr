# -*- coding: utf-8 -*-
"""Project models."""

import datetime as dt

from flask_jwt_extended import current_user
from slugify import slugify

from remixvr.database import (Model, SurrogatePK,
                            relationship, reference_col,
                            Column, db)

from remixvr.profile.models import UserProfile

favoriter_assoc = db.Table("favoritor_assoc",
                           db.Column("favoriter", db.Integer, db.ForeignKey("userprofile.id")),
                           db.Column("favorited_project", db.Integer, db.ForeignKey("project.id")))

tag_assoc = db.Table("tag_assoc",
                     db.Column("tag", db.Integer, db.ForeignKey("tags.id")),
                     db.Column("project", db.Integer, db.ForeignKey("project.id")))

class Tags(Model):
    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    tagname = db.Column(db.String(100))

    def __init__(self, tagname):
        db.Model.__init__(self, tagname=tagname)

    def __repr__(self):
        return self.tagname

class Project(SurrogatePK, Model):

    __tablename__ = 'project'
    title = Column(db.String(100), unique=True, nullable=False)
    description = Column(db.Text, nullable=False)
    slug = Column(db.String(100), unique=True)
    created_at = Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    updated_at = Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    author_id = reference_col('userprofile', nullable=False)
    author = relationship('UserProfile', backref=db.backref('projects'))

    # draft=0, published=1, trash=2
    status = Column(db.Integer, nullable=False, default=0)

    favoriters = relationship(
                    'UserProfile',
                    secondary=favoriter_assoc,
                    backref='favorites',
                    lazy='dynamic')

    tagList = relationship(
                'Tags', secondary=tag_assoc, backref='projects')

    def __init__(self, author, title, body, description, slug=None, **kwargs):
                db.Model.__init__(self, author=author, title=title, description=description, body=body,
                slug=slug or slugify(title), **kwargs)

    def favourite(self, profile):
        if not self.is_favourite(profile):
            self.favoriters.append(profile)
            return True
        return False

    def unfavourite(self, profile):
        if self.is_favourite(profile):
            self.favoriters.remove(profile)
            return True
        return False

    def is_favourite(self, profile):
        return bool(self.query.filter(favoriter_assoc.c.favoriter == profile.id).count())

    def add_tag(self, tag):
        if tag not in self.tagList:
            self.tagList.append(tag)
            return True
        return False

    def remove_tag(self, tag):
        if tag in self.tagList:
            self.tagList.remove(tag)
            return True
        return False

    @property
    def favoritesCount(self):
        return len(self.favoriters.all())

    @property
    def favorited(self):
        if current_user:
            profile = current_user.profile
            return self.query.join(Project.favoriters).filter(UserProfile.id == profile.id).count() == 1
        return False
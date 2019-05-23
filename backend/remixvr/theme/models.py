# -*- coding: utf-8 -*-
"""Theme models."""
import datetime as dt

from remixvr.database import (Model, SurrogatePK,
                              relationship, reference_col,
                              Column, db)
from slugify import slugify
from sqlalchemy.dialects.postgresql import JSONB


class Theme(SurrogatePK, Model):

    __tablename__ = 'theme'
    title = Column(db.String(100), unique=True, nullable=False)
    description = Column(db.Text, nullable=False)
    slug = Column(db.String(100), unique=True, nullable=False)
    created_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)
    updated_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)
    author_id = reference_col('userprofile', nullable=False)
    author = relationship("UserProfile", backref="themes")
    # can be draft, published, deleted
    status = Column(db.String(15), nullable=False, default="draft")
    cover_image = Column(db.String(512))
    url = Column(db.String(512))
    config = Column(JSONB)

    def __init__(self, author, title, description, slug=None, **kwargs):
        db.Model.__init__(self, author=author, title=title, description=description,
                          slug=slug or slugify(title), **kwargs)

    def update_status(self, status):
        """Update Status"""
        self.status = status

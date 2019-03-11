# -*- coding: utf-8 -*-
"""Theme models."""
import datatime as dt

from remixvr.database import Column, Model, SurrogatePK, db, reference_col

class Theme(SurrogatePK, Model):

    __tablename__ = 'theme'
    title = Column(db.String(100), unique=True, nullable=False)
    description = Column(db.Text, nullable=False)
    created_at = Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    updated_at = Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    author_id = reference_col('userprofile', nullable=False)
    author = relationship('UserProfile', backref=db.backref('projects'))

    # draft=0, published=1, trash=2
    status = Column(db.Integer, nullable=False, default=0)


# -*- coding: utf-8 -*-
"""Theme models."""
import datetime as dt
from sqlalchemy.orm.collections import attribute_mapped_collection

from remixvr.database import (
    Column, relationship, Model, SurrogatePK, db, reference_col)


class Field(SurrogatePK, Model):

    __tablename__ = 'field'

    # id is needed for primary join, it does work with SurrogatePK class
    id = db.Column(db.Integer, primary_key=True)
    label = Column(db.String(100))
    type = Column(db.String(50))
    project_id = reference_col('project', nullable=False)

    # https://docs.sqlalchemy.org/en/latest/orm/inheritance.html#joined-table-inheritance
    project = relationship('Project', back_populates='fields')
    parent_id = reference_col('field')

    # https://docs.sqlalchemy.org/en/latest/_modules/examples/adjacency_list/adjacency_list.html
    children = relationship(
        "Field",
        # cascade deletions
        cascade="all, delete-orphan",
        # many to one + adjacency list - remote_side
        # is required to reference the 'remote'
        # column in the join condition.
        backref=db.backref("parent", remote_side=id),
        # children will be represented as a dictionary
        # on the "label" attribute.
        collection_class=attribute_mapped_collection("label"),
    )

    __mapper_args__ = {
        "polymorphic_identity": "field",
        "polymorphic_on": type,
    }


class File(Model):

    __tablename__ = 'file'
    id = Column(db.Integer, primary_key=True)
    filename = Column(db.String(50))
    uri = Column(db.String(512))
    filemime = Column(db.String(255))
    filesize = Column(db.Integer)
    filename_original = Column(db.String(200))
    created_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)


class Position(Field):

    __tablename__ = 'position'
    id = db.Column(db.ForeignKey("field.id"), primary_key=True)
    x = Column(db.Numeric(25, 20), default=0)
    y = Column(db.Numeric(25, 20), default=0)
    z = Column(db.Numeric(25, 20), default=0)
    w = Column(db.Numeric(25, 20), default=1)

    __mapper_args__ = {"polymorphic_identity": "position"}


class Text(Field):

    __tablename__ = 'text'
    id = Column(db.ForeignKey("field.id"), primary_key=True)
    value = Column(db.String(200))

    __mapper_args__ = {"polymorphic_identity": "text"}


class Number(Field):

    __tablename__ = 'number'
    id = Column(db.ForeignKey("field.id"), primary_key=True)
    value = Column(db.Integer)

    __mapper_args__ = {"polymorphic_identity": "number"}


class Audio(Field):

    __tablename__ = 'audio'
    id = Column(db.ForeignKey("field.id"), primary_key=True)
    file_id = reference_col('file', nullable=False)
    duration = Column(db.Integer)
    audio_format = Column(db.String(50))

    __mapper_args__ = {"polymorphic_identity": "audio"}


class Video(Field):

    __tablename__ = 'video'
    id = Column(db.ForeignKey("field.id"), primary_key=True)
    file_id = reference_col('file', nullable=False)
    duration = Column(db.Integer)
    width = Column(db.Integer)
    height = Column(db.Integer)

    __mapper_args__ = {"polymorphic_identity": "video"}


class VideoSphere(Field):

    __tablename__ = 'videosphere'
    id = Column(db.ForeignKey("field.id"), primary_key=True)
    file_id = reference_col('file', nullable=False)
    duration = Column(db.Integer)
    width = Column(db.Integer)
    height = Column(db.Integer)

    __mapper_args__ = {"polymorphic_identity": "videosphere"}


class Image(Field):

    __tablename__ = 'image'
    id = Column(db.ForeignKey("field.id"), primary_key=True)
    file_id = reference_col('file', nullable=False)
    width = Column(db.Integer)
    height = Column(db.Integer)

    __mapper_args__ = {"polymorphic_identity": "image"}


class PhotoSphere(Field):

    __tablename__ = 'photosphere'
    id = Column(db.ForeignKey("field.id"), primary_key=True)
    file_id = reference_col('file', nullable=False)
    width = Column(db.Integer)
    height = Column(db.Integer)

    __mapper_args__ = {"polymorphic_identity": "photosphere"}

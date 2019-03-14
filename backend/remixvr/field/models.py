# -*- coding: utf-8 -*-
"""Theme models."""
import datatime as dt

from remixvr.database import Column, Model, SurrogatePK, db, reference_col

class Field(SurrogatePK, Model):

    __tablename__ = 'field'
    label = Column(db.String(100))
    field_type_id = reference_col('fieldtype', nullable=False)
    field_type = relationship('FieldType', backref='fields')
    project_id = reference_col('project', nullable=False)
    project = relationship('Project', backref='projects')
    

class FieldType(SurrogatePK, Model):

    __tablename__ = 'fieldtype'
    field_code = Column(db.String(5), unique=True, nullable=False)
    field_name = Column(db.String(50), unique=True, nullable=False)


class Position(Model):

    __tablename__ = 'position'
    id = db.Column(db.Integer, primary_key=True)
    field_id = reference_col('field', nullable=False)
    x = Column(db.Integer, default=0)
    y = Column(db.Integer, default=0)
    z = Column(db.Integer, default=0)
    w = Column(db.Integer, default=1)


class Text(Model):

    __tablename__ = 'text'
    id = Column(db.Integer, primary_key=True)
    field_id = reference_col('field', nullable=False)
    content = Column(db.String(200))


class Number(Model):

    __tablename__ = 'number'
    id = db.Column(db.Integer, primary_key=True)
    field_id = reference_col('field', nullable=False)
    value = Column(db.Integer)


class File(Model):

    __tablename__ = 'file'
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(50))
    uri = db.Column(db.String(512))
    filemime = db.Column(db.String(255))
    filesize = db.Column(db.Integer)
    filename_original = db.Column(db.String(200))
    created_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)


class Audio(Model):

    __tablename__ = 'audio'
    id = db.Column(db.Integer, primary_key=True)
    field_id = reference_col('field', nullable=False)
    file_id = reference_col('file', nullable=False)
    duration = Column(db.Integer)
    audio_format = Column(db.String(50))


class Video(Model):

    __tablename__ = 'video'
    id = db.Column(db.Integer, primary_key=True)
    field_id = reference_col('field', nullable=False)
    file_id = reference_col('file', nullable=False)
    duration = Column(db.Integer)
    width = Column(db.width)
    height = Column(db.height)


class VideoSphere(Model):

    __tablename__ = 'video'
    id = db.Column(db.Integer, primary_key=True)
    field_id = reference_col('field', nullable=False)
    file_id = reference_col('file', nullable=False)
    duration = Column(db.Integer)
    width = Column(db.width)
    height = Column(db.height)


class Image(Model):

    __tablename__ = 'image'
    id = db.Column(db.Integer, primary_key=True)
    field_id = reference_col('field', nullable=False)
    file_id = reference_col('file', nullable=False)
    width = Column(db.width)
    height = Column(db.height)


class PhotoSphere(Model):

    __tablename__ = 'photosphere'
    id = db.Column(db.Integer, primary_key=True)
    field_id = reference_col('field', nullable=False)
    file_id = reference_col('file', nullable=False)
    width = Column(db.width)
    height = Column(db.height)


class FieldChild(Model):

    __tablename__ = 'fieldchild'
    field_id = reference_col('field', nullable=False)
    child_id = reference_col('field', nullable=False)

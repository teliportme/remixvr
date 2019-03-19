from marshmallow import Schema, fields, pre_load, post_dump
from marshmallow_oneofschema import OneOfSchema

from remixvr.project.serializers import ProjectSchema
from .models import (Position, Text, Number, Audio, Video,
                     VideoSphere, Image, PhotoSphere)


class FieldSchema(Schema):
    label = fields.Str()
    type = fields.Str()
    project = fields.Nested(ProjectSchema)
    children = fields.Nested('self', exclude=('children', ), default=None)

   class Meta:
        strict = True

class FileSchema(Schema):
    filename = fields.Str()
    uri = fields.Str()
    filemime = fields.Str()
    filesize = fields.Int()
    filename_original = fields.Str()
    created_at = fields.DateTime()

class PositionSchema(FieldSchema):
    x = fields.Int()
    y = fields.Int()
    z = fields.Int()
    w = fields.Int()

class TextSchema(FieldSchema):
    value = fields.Str()

class NumberSchema(FieldSchema):
    value = fields.Int()

class AudioSchema(FieldSchema):
    file = fields.Nested(FileSchema)
    duration = fields.Int()
    audio_format = fields.Str()

class VideoSchema(FieldSchema):
    file = fields.Nested(FileSchema)
    duration = fields.Int()
    width = fields.Int()
    height = fields.Int()

class VideoSphereSchema(FieldSchema):
    file = fields.Nested(FileSchema)
    duration = fields.Int()
    width = fields.Int()
    height = fields.Int()

class ImageSchema(FieldSchema):
    file = fields.Nested(FileSchema)
    width = fields.Int()
    height = fields.Int()

class PhotoSphereSchema(FieldSchema):
    file = fields.Nested(FileSchema)
    width = fields.Int()
    height = fields.Int()

class ProjectFieldSchema(OneOfSchema):
    type_schemas = {
        'position': PositionSchema,
        'text': TextSchema,
        'number': NumberSchema,
        'audio': AudioSchema,
        'video': VideoSchema,
        'videosphere': VideoSphereSchema,
        'image': ImageSchema,
        'photosphere': PhotoSphereSchema
    }

    def get_obj_type(self, obj):
        if isinstance(obj, Position):
            return 'position'
        elif isinstance(obj, Text):
            return 'text'
        elif isinstance(obj, Number):
            return 'number'
        elif isinstance(obj, Audio):
            return 'audio'
        elif isinstance(obj, Video):
            return 'video'
        elif isinstance(obj, VideoSphere):
            return 'videosphere'
        elif isinstance(obj, Image):
            return 'image'
        elif isinstance(obj, PhotoSphere):
            return 'photosphere'
        else:
            raise Exception('Unknown object type: %s' %obj.__class__.__name__)

    class Meta:
        strict = True

field_schema = ProjectFieldSchema()
field_schemas = ProjectFieldSchema(many=True)

from marshmallow import Schema, fields, pre_load, post_dump, pre_dump
from marshmallow_oneofschema import OneOfSchema

from flask import current_app as app

from remixvr.project.serializers import ProjectSchema
from .models import (Position, Text, Number, Audio, Video,
                     VideoSphere, Image, PhotoSphere, Link, Color)


class FieldSchema(Schema):
    id = fields.Int()
    label = fields.Str()
    type = fields.Str()
    space_id = fields.Int(load_only=True)
    # https://marshmallow.readthedocs.io/en/2.x-line/nesting.html#two-way-nesting
    children = fields.Nested('CombinedSchema', default=None, many=True)
    parent_id = fields.Int(load_only=True)

    class Meta:
        strict = True

    @post_dump
    def make_field(self, data):
        if 'project' in data:
            data['project'] = data['project']['project']


class FileSchema(Schema):
    filename = fields.Str()
    url = fields.Str()
    filemime = fields.Str()
    filesize = fields.Int()
    filename_original = fields.Str()
    created_at = fields.DateTime()


class PositionSchema(FieldSchema):
    x = fields.Decimal()
    y = fields.Decimal()
    z = fields.Decimal()
    w = fields.Decimal()


class TextSchema(FieldSchema):
    text_value = fields.Str(attribute="value")


class NumberSchema(FieldSchema):
    # number_value and text_value and not value to distinguish the fields by type while serializing in the view using combined_schema
    number_value = fields.Int(attribute="value")


class AudioSchema(FieldSchema):
    file = fields.Nested(FileSchema, only=['url'])
    duration = fields.Int()
    audio_format = fields.Str()


class VideoSchema(FieldSchema):
    file = fields.Nested(FileSchema, only=['url'])
    duration = fields.Int()
    width = fields.Int()
    height = fields.Int()


class VideoSphereSchema(FieldSchema):
    file = fields.Nested(FileSchema, only=['url'])
    duration = fields.Int()
    width = fields.Int()
    height = fields.Int()


class ImageSchema(FieldSchema):
    file = fields.Nested(FileSchema, only=['url'])
    width = fields.Int()
    height = fields.Int()


class PhotoSphereSchema(FieldSchema):
    file = fields.Nested(FileSchema, only=['url'])
    width = fields.Int()
    height = fields.Int()


class LinkSchema(FieldSchema):
    linked_space_id = fields.Int()


class ColorSchema(FieldSchema):
    color_code = fields.Str()

# added to be included in combined schema to extract file while uploading


class FileLoadSchema(FieldSchema):
    file = fields.Field(location="files", load_only=True)


class ProjectFieldSchema(OneOfSchema):
    type_field_remove = False
    type_schemas = {
        'position': PositionSchema,
        'text': TextSchema,
        'number': NumberSchema,
        'audio': AudioSchema,
        'video': VideoSchema,
        'videosphere': VideoSphereSchema,
        'image': ImageSchema,
        'photosphere': PhotoSphereSchema,
        'link': LinkSchema,
        'color': ColorSchema
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
        elif isinstance(obj, Link):
            return 'link'
        elif isinstance(obj, Color):
            return 'color'
        else:
            raise Exception('Unknown object type: %s' % obj.__class__.__name__)

    class Meta:
        strict = True


class CombinedSchema(PositionSchema, TextSchema, NumberSchema, FileLoadSchema,
                     AudioSchema, VideoSchema, VideoSphereSchema,
                     ImageSchema, PhotoSphereSchema, LinkSchema, ColorSchema):
    pass


# workaround for @use_kwargs to accept polymorphic field
combined_schema = CombinedSchema()
field_schema = ProjectFieldSchema()
field_schemas = ProjectFieldSchema(many=True)

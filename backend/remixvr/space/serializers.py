from marshmallow import Schema, fields, pre_load, post_dump, pre_dump

from remixvr.field.serializers import ProjectFieldSchema
from .models import Space


class SpaceSchema(Schema):
    id = fields.Int()
    project_slug = fields.Str(load_only=True)
    fields = fields.Nested(ProjectFieldSchema, many=True)


space_schema = SpaceSchema()
space_schemas = SpaceSchema(many=True)

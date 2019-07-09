from marshmallow import Schema, fields, pre_load, post_dump

from remixvr.profile.serializers import ProfileSchema


class SchoolSchema(Schema):
    name = fields.Str()
    country = fields.Str()
    region = fields.Str()
    slug = fields.Str()
    teachers = fields.Nested(ProfileSchema, many=True)
    created_at = fields.DateTime()
    updated_at = fields.DateTime()

    class Meta:
        strict = True


class SchoolSchemas(SchoolSchema):

    @post_dump(pass_many=True)
    def dump_schools(self, data, many):
        return {'schools': data, 'schoolsCount': len(data)}


school_schema = SchoolSchema()
schools_schema = SchoolSchemas(many=True)

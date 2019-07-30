from marshmallow import Schema, fields, pre_load, post_dump

from remixvr.school.serializers import SchoolSchema


class ProfileSchema(Schema):
    username = fields.Str()
    bio = fields.Str()
    image = fields.Url()
    following = fields.Boolean()
    school = fields.Nested(SchoolSchema, only=[
                           'slug', 'name'])
    # ugly hack. https://marshmallow.readthedocs.io/en/2.x-line/nesting.html#nesting-a-schema-within-itself
    profile = fields.Nested('self', exclude=(
        'profile',), default=True, load_only=True)

    @pre_load
    def make_user(self, data):
        return data['profile']

    @post_dump
    def dump_user(self, data):
        return {'profile': data}

    class Meta:
        strict = True


# added for using in teacher fields
class OnlyUsernameSchema(Schema):
    username = fields.Str()


profile_schema = ProfileSchema()
profile_schemas = ProfileSchema(many=True)

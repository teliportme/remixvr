from marshmallow import Schema, fields, pre_load, post_dump

from remixvr.profile.serializers import ProfileSchema


class ThemeSchema(Schema):
    slug = fields.Str()
    title = fields.Str()
    description = fields.Str()
    created_at = fields.DateTime()
    updated_at = fields.DateTime(dump_only=True)
    author = fields.Nested(ProfileSchema)
    status = fields.Str()
    cover_image = fields.Str()
    url = fields.Str()
    config = fields.Raw()

    @post_dump
    def dump_theme(self, data):
        data['author'] = data['author']['profile']
        return {'theme': data}

    class Meta:
        strict = True


class ThemeSchemas(ThemeSchema):

    @post_dump
    def dump_theme(self, data):
        data['author'] = data['author']['profile']
        return data

    @post_dump(pass_many=True)
    def dump_themes(self, data, many):
        return {'themes': data, 'themesCount': len(data)}


theme_schema = ThemeSchema()
themes_schema = ThemeSchemas(many=True)

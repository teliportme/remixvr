# coding: utf-8

from marshmallow import Schema, fields, pre_load, post_dump

from remixvr.profile.serializers import ProfileSchema
from remixvr.theme.serializers import ThemeSchema


class TagSchema(Schema):
    tagname = fields.Str()


class ProjectSchema(Schema):
    slug = fields.Str()
    title = fields.Str()
    description = fields.Str()
    created_at = fields.DateTime()
    updated_at = fields.DateTime(dump_only=True)
    author = fields.Nested(ProfileSchema)
    tagList = fields.List(fields.Str())
    favoritesCount = fields.Int(dump_only=True)
    favorited = fields.Bool(dump_only=True)
    theme_slug = fields.Str(load_only=True)
    theme = fields.Nested(
        ThemeSchema, only=["slug", "title", "author"], dump_only=True)

    @post_dump
    def dump_project(self, data):
        data['author'] = data['author']['profile']
        return {'project': data}

    class Meta:
        strict = True


class ProjectSchemas(ProjectSchema):

    @post_dump
    def dump_project(self, data):
        data['author'] = data['author']['profile']
        return data

    @post_dump(pass_many=True)
    def dump_projects(self, data, many):
        return {'projects': data, 'projectsCount': len(data)}


project_schema = ProjectSchema()
projects_schema = ProjectSchemas(many=True)

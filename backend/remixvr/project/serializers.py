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
    tags = fields.List(fields.Str(), attribute="tagList")
    favoritesCount = fields.Int(dump_only=True)
    favorited = fields.Bool(dump_only=True)
    theme_slug = fields.Str(load_only=True)
    code = fields.Str(dump_only=True)
    status = fields.Str()
    theme = fields.Nested(
        ThemeSchema, only=["slug", "title", "type"], dump_only=True)
    project = fields.Nested('self', exclude=(
        'project',), default=True, load_only=True)

    @pre_load
    def make_project(self, data):
        if 'project' in data:
            return data['project']

    @post_dump
    def dump_project(self, data):
        if 'author' in data:
            data['author'] = data['author']['profile']
        if 'theme' in data:
            data['theme'] = data['theme']['theme']
        return {'project': data}

    class Meta:
        strict = True


class ProjectSchemas(ProjectSchema):

    @post_dump
    def dump_project(self, data):
        if 'author' in data:
            data['author'] = data['author']['profile']
        if 'theme' in data:
            data['theme'] = data['theme']['theme']
        return data

    @post_dump(pass_many=True)
    def dump_projects(self, data, many):
        return {'projects': data, 'projectsCount': len(data)}


project_schema = ProjectSchema()
projects_schema = ProjectSchemas(many=True)

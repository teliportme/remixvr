from marshmallow import Schema, fields, pre_load, post_dump

from remixvr.activity.serializers import ActivitySchema
from remixvr.field.serializers import FileSchema


class SubmissionSchema(Schema):
    id = fields.Int()
    author = fields.Str()
    file = fields.Nested(FileSchema, only=['url'], dump_only=True)
    file_type = fields.Str()
    submitted_file = fields.Field(location="files", load_only=True)
    activity = fields.Nested(ActivitySchema, only=['code'])
    created_at = fields.DateTime()
    code = fields.Str(load_only=True)

    class Meta:
        strict = True


class SubmissionSchemas(SubmissionSchema):

    @post_dump(pass_many=True)
    def dump_submissions(self, data, many):
        return {'submissions': data, 'submissionsCount': len(data)}


class SubmissionsWithActivity(Schema):

    activity = fields.Nested(ActivitySchema)
    submissions = fields.Nested(SubmissionSchema, many=True)


submission_schema = SubmissionSchema()
submission_with_activity = SubmissionsWithActivity()
submissions_schema = SubmissionSchemas(many=True)

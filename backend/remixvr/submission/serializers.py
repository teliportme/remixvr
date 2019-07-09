from marshmallow import Schema, fields, pre_load, post_dump

from remixvr.activity.serializers import ActivitySchema
from remixvr.field.serializers import FileSchema


class SubmissionSchema(Schema):
    author = fields.Str()
    file = fields.Nested(FileSchema)
    activity = fields.Nested(ActivitySchema)
    created_at = fields.DateTime()

    class Meta:
        strict = True


class SubmissionSchemas(SubmissionSchema):

    @post_dump(pass_many=True)
    def dump_submissions(self, data, many):
        return {'submissions': data, 'submissionsCount': len(data)}


submission_schema = SubmissionSchema()
submissions_schema = SubmissionSchemas(many=True)

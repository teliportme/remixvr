from marshmallow import Schema, fields, pre_load, post_dump

from remixvr.activitytype.serializers import ActivityTypeSchema
from remixvr.classroom.serializers import ClassroomSchema


class ActivitySchema(Schema):
    activity_type = fields.Nested(ActivityTypeSchema)
    classroom = fields.Nested(ClassroomSchema)
    code = fields.Str()
    reactions = fields.Nested('self', default=None, many=True)
    created_at = fields.DateTime()
    updated_at = fields.DateTime(dump_only=True)

    class Meta:
        strict = True


class ActivitySchemas(Schema):

    @post_dump(pass_many=True)
    def dump_activities(self, data, many):
        return {'activities': data, 'activitiesCount': len(data)}


activity_schema = ActivitySchema()
activities_schema = ActivitySchemas(many=True)

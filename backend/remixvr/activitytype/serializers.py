from marshmallow import Schema, fields, pre_load, post_dump


class ActivityTypeSchema(Schema):
    title = fields.Str()
    slug = fields.Str()
    instructions = fields.Str()
    pdf_link = fields.Str()

    class Meta:
        strict = True


class ActivityTypeSchemas(ActivityTypeSchema):

    @post_dump(pass_many=True)
    def dump_activity_types(self, data, many):
        return {'activityTypes': data, 'activityTypesCount': len(data)}


activity_type_schema = ActivityTypeSchema()
activity_types_schema = ActivityTypeSchemas(many=True)

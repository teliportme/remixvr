from marshmallow import Schema, fields, pre_load, post_dump

from remixvr.profile.serializers import ProfileSchema
from remixvr.school.serializers import SchoolSchema


class ClassroomSchema(Schema):
    classname = fields.Str()
    slug = fields.Str()
    school = fields.Nested(SchoolSchema)
    teacher = fields.Nested(ProfileSchema)
    created_at = fields.DateTime()

    class Meta:
        strict = True


class ClassroomSchamas(ClassroomSchema):

    @post_dump(pass_many=True)
    def dump_classrooms(self, data, many):
        return {'classrooms': data, 'classroomsCount': len(data)}


classroom_schema = ClassroomSchema()
classrooms_schema = ClassroomSchamas(many=True)

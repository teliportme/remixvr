from marshmallow import Schema, fields, pre_load, post_dump

from remixvr.profile.serializers import OnlyUsernameSchema
from remixvr.school.serializers import SchoolSchema


class ClassroomSchema(Schema):
    classname = fields.Str()
    slug = fields.Str()
    subject = fields.Str()
    age_students = fields.Str()
    school = fields.Nested(SchoolSchema, only=[
                           'country', 'region', 'slug', 'name'])
    teacher = fields.Nested(OnlyUsernameSchema)
    teacher_id = fields.Int(load_only=True)
    created_at = fields.DateTime()
    school_slug = fields.Str()

    class Meta:
        strict = True


class ClassroomSchamas(ClassroomSchema):

    @post_dump(pass_many=True)
    def dump_classrooms(self, data, many):
        return {'classrooms': data, 'classroomsCount': len(data)}


classroom_schema = ClassroomSchema()
classrooms_schema = ClassroomSchamas(many=True)

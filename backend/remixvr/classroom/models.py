import datetime as datetime

from slugify import slugify

from remixvr.database import (Model, SurrogatePK,
                              relationship, reference_col,
                              Column, db)


class Classroom(SurrogatePK, Model):

    __tablename__ = 'classroom'
    classname = Column(db.String(200), nullable=False)
    slug = Column(db.String(200), nullable=False)
    school_id = reference_col("school", nullable=False)
    school = relationship("School", backref="classrooms")
    teacher_id = reference_col("userprofile", nullable=False)
    teacher = relationship("UserProfile", backref="classrooms")
    created_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)

    def __init__(self, school, classname, teacher, slug=None, **kwargs):
        db.Model.__init__(self, school=school, teacher=teacher,
                          slug=slugify(classname))

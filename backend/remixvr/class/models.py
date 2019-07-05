import datetime as datetime

from slugify import slugify

from remixvr.database import (Model, SurrogatePK,
                              relationship, reference_col,
                              Column, db)


class Class(SurrogatePK, Model):

    __tablename__ = 'class'
    classname = Column(db.String(200), nullable=False)
    school_id = reference_col("school", nullable=False)
    school = relationship("School", backref="classes")
    teacher_id = reference_col("userprofile", nullable=False)
    teacher = relationship("UserProfile", backref="classes")
    created_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)
    updated_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)

    def __init__(self, school, classname, teacher, **kwargs):
        db.Model.__init__(self, school=school, teacher=teacher,
                          classname=slugify(classname))

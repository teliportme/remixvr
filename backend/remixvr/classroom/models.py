import datetime as dt

from slugify import slugify

from remixvr.database import (Model, SurrogatePK,
                              relationship, reference_col,
                              Column, db)


class Classroom(SurrogatePK, Model):

    __tablename__ = 'classroom'
    classname = Column(db.String(200), nullable=False)
    slug = Column(db.String(200), nullable=False, unique=True)
    subject = Column(db.String(100))
    age_students = Column(db.String(100))
    school_id = reference_col("school", nullable=False)
    school = relationship("School", backref="classrooms")
    teacher_id = reference_col("userprofile", nullable=False)
    teacher = relationship("UserProfile", backref="classrooms")
    created_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)

    def __init__(self, school, classname, teacher, slug=None, **kwargs):
        dtn = dt.datetime.now()
        date_slug = str(dtn.year % 100) + str(dtn.month) + \
            str(dtn.day) + str(dtn.hour) + str(dtn.minute)
        db.Model.__init__(self, school=school, classname=classname, teacher=teacher,
                          slug=slugify(classname + date_slug + str(teacher.id) + str(school.id)), **kwargs)

import datetime as dt

from slugify import slugify

from remixvr.database import (Model, SurrogatePK,
                              relationship, reference_col,
                              Column, db)


class Activity(SurrogatePK, Model):

    __tablename__ = 'activity'
    is_reaction = Column(db.Boolean, nullable=False, default=False)
    activity_type_id = reference_col("activity_type", nullable=False)
    activity_type = relationship("ActivityType", backref="activities")
    classroom_id = reference_col("classroom", nullable=False)
    classroom = relationship("Classroom", backref="activities")
    code = Column(db.String(100), nullable=False, unique=True)
    reaction_to_id = reference_col("activity", nullable=True)
    reactions = relationship(
        "Activity", backref=db.backref('reaction_to', remote_side='Activity.id')
    )

    created_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)
    updated_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)

    def __init__(self, activity_type_id, classroom, code, **kwargs):
        db.Model.__init__(self, activity_type_id=activity_type_id,
                          classroom=classroom, code=code)

    @property
    def submissions_count(self):
        return len(self.submissions)

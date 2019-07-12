import datetime as dt

from slugify import slugify

from remixvr.database import (Model, SurrogatePK,
                              relationship, reference_col,
                              Column, db)


class Activity(SurrogatePK, Model):

    __tablename__ = 'activity'
    activity_type_id = reference_col("activity_type", nullable=False)
    activity_type = relationship("ActivityType", backref="activities")
    classroom_id = reference_col("classroom", nullable=False)
    classroom = relationship("Classroom", backref="activities")
    code = Column(db.String(100))
    reaction_to_id = reference_col("activity", nullable=True)
    reactions = relationship(
        "Activity", backref=db.backref('reaction_to', remote_side='Activity.id')
    )

    created_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)
    updated_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)

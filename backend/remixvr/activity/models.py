import datetime as datetime

from slugify import slugify

from remixvr.database import (Model, SurrogatePK,
                              relationship, reference_col,
                              Column, db)


class Activity(SurrogatePK, Model):

    __tablename__ = 'activity'
    activity_type_id = reference_col("activity_type", nullable=False)
    activity_type = relationship("ActivityType", backref="activities")
    class_id = reference_col("class", nullable=False)
    class_ref = relationship("Class", backref="activities")
    upload_link = Column(db.String(512))

    created_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)
    updated_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)

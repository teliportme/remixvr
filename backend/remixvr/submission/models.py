import datetime as datetime

from slugify import slugify

from remixvr.database import (Model, SurrogatePK,
                              relationship, reference_col,
                              Column, db)


class Submission(SurrogatePK, Model):

    __table_args__ = 'submission'
    author = Column(db.String(100), nullable=False)
    file_id = reference_col("file")
    file = relationship("File", backref=backref("submission", uselist=False))
    activity_id = reference_col("activity", nullable=False)
    activity = relationship("Activity", backref="submissions")
    created_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)

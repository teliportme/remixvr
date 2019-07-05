import datetime as datetime

from slugify import slugify

from remixvr.database import (Model, SurrogatePK,
                              relationship, reference_col,
                              Column, db)


class Creation(SurrogatePK, Model):

    __table_args__ = 'creation'
    author = Column(db.String(100), nullable=False)
    file_id = reference_col("file")
    file = relationship("File", backref=backref("creation", uselist=False))

import datetime as dt

from slugify import slugify

from remixvr.database import (Model, SurrogatePK,
                              relationship, reference_col,
                              Column, db)


class School(SurrogatePK, Model):

    __tablename__ = 'school'
    name = Column(db.String(200), nullable=False, unique=True)
    country = Column(db.String(100), nullable=False)
    region = Column(db.String)
    slug = Column(db.String(100), nullable=False, unique=True)
    created_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)
    updated_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)

    def __init__(self, author, name, country, region, slug=None, **kwargs):
        db.Model.__init__(self, author=author, name=name, country=country,
                          region=region, slug=slug or slugify(name), **kwargs)

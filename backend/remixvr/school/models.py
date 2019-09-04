import datetime as dt

from slugify import slugify

from remixvr.database import (Model, SurrogatePK,
                              relationship, reference_col,
                              Column, db)


# in the frontend, schools are used as orgs.
# A type field was added to accomodate different types of orgs.
class School(SurrogatePK, Model):

    __tablename__ = 'school'
    name = Column(db.String(200), nullable=False)
    country = Column(db.String(100), nullable=False)
    region = Column(db.String)
    type = Column(db.String(100), default="school")
    slug = Column(db.String(100), nullable=False, unique=True)
    created_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)
    updated_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)

    def __init__(self, name, country, region, slug=None, **kwargs):
        db.Model.__init__(self, name=name, country=country,
                          region=region, slug=slug or slugify(name + '-' + country + '-' + region), **kwargs)

import datetime as datetime

from slugify import slugify

from remixvr.database import (Model, SurrogatePK,
                              relationship, reference_col,
                              Column, db)


class ActivityType(SurrogatePK, Model):

    __tablename__ = 'activity_type'
    title = Column(db.String(100), nullable=False)
    slug = Column(db.String(100), nullable=False, unique=True)
    instructions = Column(db.Text, nullable=False)
    pdf_link = Column(db.String(512), nullable=False)

    def __init__(self, title, slug=None, instructions, pdf_link, **kwargs):
        db.Model.__init__(self, title=title, slug=slugify(
            title), instructions=instructions, pdf_link=pdf_link)

from blueprints import db
from flask_restful import fields
from datetime import datetime


class Categories(db.Model):
    __tablename__ = "category"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nama = db.Column(db.String(100), unique=True, nullable=False)
    products = db.relationship('Products', cascade="all,delete", backref='category', lazy=True)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now())
    
    response_fields = {
        "created_at": fields.DateTime,
        "updated_at": fields.DateTime,
        "id": fields.Integer,
        "nama": fields.String
    }

    def __init__(self, nama):
        self.nama = nama

    def __repr__(self):
        return "<Category %r>" % self.id
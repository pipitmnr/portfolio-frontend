from blueprints import db
from flask_restful import fields
from datetime import datetime


class Users(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(1000), nullable=False)
    nama_lengkap = db.Column(db.String(100), unique=False, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    no_hp = db.Column(db.String(13), unique=False, nullable=False)
    carts = db.relationship('Carts', cascade="all,delete", backref='user', lazy=True)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now())
    
    response_fields = {
        "created_at": fields.DateTime,
        "updated_at": fields.DateTime,
        "id": fields.Integer,
        "username": fields.String,
        "password": fields.String,
        "nama_lengkap": fields.String,
        "email": fields.String,
        "no_hp": fields.String
    }

    jwt_claims_field={
        'id': fields.Integer,
        'username': fields.String,
        'is_admin': fields.Boolean
    }

    def __init__(self, username, password, nama_lengkap, email, no_hp):
        self.username = username
        self.password = password
        self.nama_lengkap = nama_lengkap
        self.email = email
        self.no_hp = no_hp

    def __repr__(self):
        return "<Users %r>" % self.id
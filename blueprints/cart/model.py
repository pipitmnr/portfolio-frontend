from blueprints import db
from flask_restful import fields
from datetime import datetime


class Carts(db.Model):
    __tablename__ = "cart"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_user = db.Column(db.Integer, db.ForeignKey("user.id"))
    alamat_lengkap = db.Column(db.String(1000), unique=False, nullable=False)
    ongkir = db.Column(db.Integer, nullable=False, default=0)
    total_harga = db.Column(db.Integer, unique=False, nullable=False, default=0)
    status = db.Column(db.String(100), unique=False, nullable=False, default="0")
    cart_details = db.relationship('CartDetails', cascade="all,delete", backref='cart', lazy=True)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now())
    
    response_fields = {
        "created_at": fields.DateTime,
        "updated_at": fields.DateTime,
        "id": fields.Integer,
        "id_user": fields.Integer,
        "alamat_lengkap": fields.String,
        "ongkir": fields.Integer,
        "total_harga": fields.Integer,
        "status": fields.String
    }

    def __init__(self, id_user, alamat_lengkap, ongkir=0, total_harga=0, status="0"):
        self.id_user = id_user
        self.alamat_lengkap = alamat_lengkap
        self.ongkir = ongkir
        self.total_harga = total_harga
        self.status = status

    def __repr__(self):
        return "<Carts %r>" % self.id
from blueprints import db
from flask_restful import fields
from datetime import datetime


class Products(db.Model):
    __tablename__ = "product"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_kategori = db.Column(db.Integer, db.ForeignKey("category.id"))
    nama = db.Column(db.String(1000), unique=False, nullable=False)
    harga = db.Column(db.Integer, nullable=False)
    deskripsi = db.Column(db.String(1000), unique=False, nullable=True)
    keterangan = db.Column(db.String(1000), unique=False, nullable=True)
    gambar = db.Column(db.String(1000), unique=False, nullable=True)
    cart_details = db.relationship('CartDetails', cascade="all,delete", backref='product', lazy=True)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now())
    
    response_fields = {
        "created_at": fields.DateTime,
        "updated_at": fields.DateTime,
        "id": fields.Integer,
        "id_kategori": fields.Integer,
        "nama": fields.String,
        "harga": fields.Integer,
        "deskripsi": fields.String,
        "keterangan": fields.String,
        "gambar": fields.String
    }

    def __init__(self, id_kategori, nama, harga, deskripsi, keterangan, gambar):
        self.id_kategori = id_kategori
        self.nama = nama
        self.harga = harga
        self.deskripsi = deskripsi
        self.keterangan = keterangan
        self.gambar = gambar

    def __repr__(self):
        return "<Products %r>" % self.id
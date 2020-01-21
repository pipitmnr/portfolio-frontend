from blueprints import db
from flask_restful import fields
from datetime import datetime


class CartDetails(db.Model):
    __tablename__ = "cartDetail"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_product = db.Column(db.Integer, db.ForeignKey("product.id"))
    id_cart = db.Column(db.Integer, db.ForeignKey("cart.id"))
    jumlah_item = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now())
    
    response_fields = {
        "created_at": fields.DateTime,
        "updated_at": fields.DateTime,
        "id": fields.Integer,
        "id_product": fields.Integer,
        "id_cart": fields.Integer,
        "jumlah_item": fields.Integer
    }

    def __init__(self, id_product, id_cart, jumlah_item):
        self.id_product = id_product
        self.id_cart = id_cart
        self.jumlah_item = jumlah_item

    def __repr__(self):
        return "<CartDetails %r>" % self.id
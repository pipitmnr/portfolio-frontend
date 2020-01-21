from flask_restful import Resource, Api, reqparse, marshal, inputs
from flask import Blueprint
from blueprints import db, admin_required, user_required, app
from sqlalchemy import desc
from password_strength import PasswordPolicy
from datetime import datetime
from .model import *
import hashlib
from flask_jwt_extended import get_jwt_claims, jwt_required, verify_jwt_in_request
from blueprints.cart.model import *
from blueprints.product.model import *
from blueprints.user.model import *

blueprint_cartdetail = Blueprint('cartdetail', __name__) 
api_cartdetail = Api(blueprint_cartdetail)

class CartDetailList(Resource):
    def options(self, id=None):
        return 200
    @jwt_required
    @user_required
    def get(self):
        verify_jwt_in_request()
        user_claims_data = get_jwt_claims()
        user = Users.query.get(user_claims_data["id"])
        id_user = user.id

        parser = reqparse.RequestParser()
        parser.add_argument('p', type=int, location='args', default=1)
        parser.add_argument('rp', type=int, location='args', default=10)
        parser.add_argument('id_cart', location='args', help='invalid filterby id_cart')
        args = parser.parse_args()
        offset = (args['p'] * args['rp']) - args['rp']
        qry = CartDetails.query

        if args['id_cart'] is not None:
            qry = qry.filter_by(id_cart=args['id_cart'])
        rows = []
        for row in qry.limit(args['rp']).offset(offset).all():
            id_cart = row.id_cart
            cart = Carts.query.get(id_cart)
            if cart.id_user == id_user:
                rows.append(marshal(row, CartDetails.response_fields))
        return rows, 200, {'Content-Type': 'application/json'}

class CartDetailResource(Resource):
    def options(self, id=None):
        return 200
    @jwt_required
    @user_required
    def get(self, id):
        # user
        verify_jwt_in_request()
        user_claims_data = get_jwt_claims()
        user = Users.query.get(user_claims_data["id"])
        user = marshal(user, Users.response_fields)
        id_user = user["id"]

        # cartdetails
        qry = CartDetails.query.get(id)

        if qry is not None:
            # cart
            id_cart = qry.id_cart
            cart = Carts.query.get(id_cart)
            if id_user == cart.id_user:
                return marshal(qry, CartDetails.response_fields), 200, {'Content-Type': 'application/json'}
            return {'status':'id_cart tidak sesuai dengan customer'}, 401
        return {'status':'id not found'}, 404

    @jwt_required
    @user_required
    def post(self):
        verify_jwt_in_request()
        user_claims_data = get_jwt_claims()
        user = Users.query.get(user_claims_data["id"])
        user = marshal(user, Users.response_fields)
        id_user = user["id"]
        
        parser = reqparse.RequestParser()
        parser.add_argument('id_product', location='json', required=True)
        parser.add_argument('id_cart', location='json', required=True)
        parser.add_argument('jumlah_item', location='json', required=True)
        args = parser.parse_args()

        id_cart = args['id_cart']
        cart = Carts.query.get(id_cart)
        if cart is None:
            return {'status':'id_cart not found'}, 404
        if cart.id_user != id_user:
            return {'status':'id_cart tidak sesuai dengan customer'}, 401
        if cart.status != "0":
            return {'status':'cart sudah menjadi checkout'}, 401
        cartdetail = CartDetails(args['id_product'], args['id_cart'], args['jumlah_item'])

        # put total harga di cart
        product = Products.query.get(args['id_product'])
        if product is None:
            return {'status': 'id_product not found'}, 404
        cart.total_harga = cart.total_harga + (product.harga * int(args['jumlah_item']))
        db.session.add(cartdetail)
        try:
            db.session.commit()
        except Exception as e:
            return {'status':'id_product not found'}, 404
        app.logger.debug('DEBUG : %s', cartdetail)
        return marshal(cartdetail, CartDetails.response_fields), 200, {'Content-Type': 'application/json'}

    @jwt_required
    @user_required
    def delete(self, id):
        # user
        verify_jwt_in_request()
        user_claims_data = get_jwt_claims()
        user = Users.query.get(user_claims_data["id"])
        user = marshal(user, Users.response_fields)
        id_user = user["id"]

        # cartdetails
        qry = CartDetails.query.get(id)
        if qry is None:
            return {'status': 'id not found'}, 404
        id_product = qry.id_product

        # cart
        id_cart = qry.id_cart
        cart = Carts.query.get(id_cart)
        if id_user == cart.id_user:
            # put total harga di cart
            product = Products.query.get(id_product)
            cart.total_harga = cart.total_harga - (product.harga * qry.jumlah_item)
            db.session.delete(qry)
            db.session.commit()
            return 'Deleted', 200, {'Content-Type': 'application/json'}
        return {'status':'id_cart tidak sesuai dengan customer'}, 401
        
class CartDetailListAdmin(Resource):
    def options(self, id=None):
        return 200
    @jwt_required
    @admin_required
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('p', type=int, location='args', default=1)
        parser.add_argument('rp', type=int, location='args', default=20)
        parser.add_argument('id_cart', location='args', help='invalid filterby id_cart')
        args = parser.parse_args()
        offset = (args['p'] * args['rp']) - args['rp']
        qry = CartDetails.query

        if args['id_cart'] is not None:
            qry = qry.filter_by(id_cart=args['id_cart'])
        rows = []
        for row in qry.limit(args['rp']).offset(offset).all():
            rows.append(marshal(row, CartDetails.response_fields))
        return rows, 200, {'Content-Type': 'application/json'}

api_cartdetail.add_resource(CartDetailList, '')
api_cartdetail.add_resource(CartDetailResource, '', '/<int:id>')
api_cartdetail.add_resource(CartDetailListAdmin, '/admin')
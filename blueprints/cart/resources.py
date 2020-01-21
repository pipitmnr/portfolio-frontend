from flask_restful import Resource, Api, reqparse, marshal, inputs
from flask import Blueprint
from blueprints import db, admin_required, user_required, app
from sqlalchemy import desc
from password_strength import PasswordPolicy
from datetime import datetime
from .model import *
import hashlib
from flask_jwt_extended import get_jwt_claims, jwt_required, verify_jwt_in_request
from blueprints.user.model import *

blueprint_cart = Blueprint('cart', __name__) 
api_cart = Api(blueprint_cart)


class CartResource(Resource):
    def options(self, id=None):
        return 200
    @jwt_required
    @user_required
    def get(self, id):
        verify_jwt_in_request()
        user_claims_data = get_jwt_claims()
        user = Users.query.get(user_claims_data["id"])
        id_user = user.id

        qry = Carts.query.get(id)
        if qry is not None:
            if qry.id_user == id_user:
                return marshal(qry, Carts.response_fields), 200, {'Content-Type': 'application/json'}
            return {'status':'tidak bisa akses cart customer lain'}, 404
        return {'status':'id not found'}, 404

    @jwt_required
    @user_required
    def post(self):
        verify_jwt_in_request()
        user_claims_data = get_jwt_claims()
        qry = Users.query.get(user_claims_data["id"])
        qry = marshal(qry, Users.response_fields)
        qry = qry["id"]

        parser = reqparse.RequestParser()
        parser.add_argument('alamat_lengkap', location='json', required=True)
        args = parser.parse_args()

        cart = Carts(qry, args['alamat_lengkap'])
        db.session.add(cart)
        try:
            db.session.commit()
        except Exception as e:
            return {'status':'id_user not found'}, 404
        app.logger.debug('DEBUG : %s', cart)
        
        return marshal(cart, Carts.response_fields), 200, {'Content-Type': 'application/json'}

    @jwt_required
    @user_required
    def put(self, id):
        verify_jwt_in_request()
        user_claims_data = get_jwt_claims()
        user = Users.query.get(user_claims_data["id"])
        id_user = user.id

        parser = reqparse.RequestParser()
        parser.add_argument('alamat_lengkap', location='json')
        parser.add_argument('status', location='json')
        args = parser.parse_args()

        qry = Carts.query.get(id)
        if qry is not None:
            if qry.id_user == id_user:
                if qry.status == "0":
                    if args['status'] is not None:
                        qry.status = args['status']
                    if args['alamat_lengkap'] is not None:
                        qry.alamat_lengkap = args['alamat_lengkap']
                elif qry.status == "2":
                    if args['status'] is not None:
                        qry.status = args['status']
                else:
                    return {'status':'customer tidak dapat mengubah cart'}, 400
            else:
                return {'status':'tidak dapat mengubah cart customer lain'}, 400
            qry.updated_at = datetime.now()
            db.session.commit()
            return marshal(qry, Carts.response_fields), 200, {'Content-Type': 'application/json'}
        return {'status':'id not found'}, 404

    @jwt_required
    @user_required
    def delete(self, id):
        verify_jwt_in_request()
        user_claims_data = get_jwt_claims()
        user = Users.query.get(user_claims_data["id"])
        id_user = user.id
        
        qry = Carts.query.get(id)
        if qry is None:
            return {'status': 'id not found'}, 404
        if qry.id_user == id_user:
            if qry.status == "0" or qry.status == "1" or qry.status == "2":
                db.session.delete(qry)
                db.session.commit()
                return 'Deleted', 200, {'Content-Type': 'application/json'}
            return {'status': 'customer tidak dapat menghapus cart'}, 400
        return {'status': 'tidak dapat menghapus cart customer lain'}, 401

class CartList(Resource):
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
        args = parser.parse_args()
        offset = (args['p'] * args['rp']) - args['rp']
        qry = Carts.query

        rows = []
        for row in qry.limit(args['rp']).offset(offset).all():
            if row.id_user == id_user:
                rows.append(marshal(row, Carts.response_fields))
        
        return rows, 200, {'Content-Type': 'application/json'}

class CartListAdmin(Resource):
    def options(self, id=None):
        return 200
    @jwt_required
    @admin_required
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('p', type=int, location='args', default=1)
        parser.add_argument('rp', type=int, location='args', default=10)
        args = parser.parse_args()
        offset = (args['p'] * args['rp']) - args['rp']
        qry = Carts.query

        rows = []
        for row in qry.limit(args['rp']).offset(offset).all():
            rows.append(marshal(row, Carts.response_fields))
        
        return rows, 200, {'Content-Type': 'application/json'}

class CartAdmin(Resource):
    def options(self, id=None):
        return 200
    @jwt_required
    @admin_required
    def get(self, id):
        qry = Carts.query.get(id)
        if qry is not None:
            return marshal(qry, Carts.response_fields), 200, {'Content-Type': 'application/json'}
        return {'status':'id not found'}, 404

    @jwt_required
    @admin_required
    def put(self, id):
        parser = reqparse.RequestParser()
        parser.add_argument('status', location='json')
        args = parser.parse_args()

        qry = Carts.query.get(id)
        if qry is not None:
            if (qry.status != "0") and (qry.status != "2"):
                if args['status'] is not None:
                    qry.status = args['status']
                    qry.updated_at = datetime.now()
                    db.session.commit()
                    return marshal(qry, Carts.response_fields), 200, {'Content-Type': 'application/json'}
            else:
                return {'status':'Harap menunggu update status cart oleh customer'}, 404
        return {'status':'id not found'}, 404


api_cart.add_resource(CartList, '')
api_cart.add_resource(CartResource, '', '/<int:id>')
api_cart.add_resource(CartListAdmin, '/admin')
api_cart.add_resource(CartAdmin, '/admin/<int:id>')
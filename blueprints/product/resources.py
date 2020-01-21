from flask_restful import Resource, Api, reqparse, marshal, inputs
from flask import Blueprint
from blueprints import db, admin_required, user_required, app
from sqlalchemy import desc
from password_strength import PasswordPolicy
from datetime import datetime
from .model import *
import hashlib
from flask_jwt_extended import get_jwt_claims, jwt_required, verify_jwt_in_request
from blueprints.category.model import *

blueprint_product = Blueprint('product', __name__) 
api_product = Api(blueprint_product)


class ProductResource(Resource):
    def options(self, id=None):
        return 200
    def get(self, id):
        qry = Products.query.get(id)
        if qry is not None:
            return marshal(qry, Products.response_fields), 200, {'Content-Type': 'application/json'}
        return {'status':'id not found'}, 404

    @jwt_required
    @admin_required
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id_kategori', location='json', required=True)
        parser.add_argument('nama', location='json', required=True)
        parser.add_argument('harga', location='json', required=True)
        parser.add_argument('deskripsi', location='json', required=False)
        parser.add_argument('keterangan', location='json', required=False)
        parser.add_argument('gambar', location='json', required=False)
        args = parser.parse_args()

        id_kategori = args['id_kategori']
        category = Categories.query.get(id_kategori)
        if category is None:
            return {'status':'id_kategori not found'}, 404
            
        product = Products(args['id_kategori'], args['nama'], args['harga'], args['deskripsi'],
                    args['keterangan'], args['gambar'])
        db.session.add(product)
        db.session.commit()
        app.logger.debug('DEBUG : %s', product)
        
        return marshal(product, Products.response_fields), 200, {'Content-Type': 'application/json'}

    @jwt_required
    @admin_required
    def put(self, id):
        parser = reqparse.RequestParser()
        parser.add_argument('id_kategori', location='json')
        parser.add_argument('nama', location='json')
        parser.add_argument('harga', location='json')
        parser.add_argument('deskripsi', location='json')
        parser.add_argument('keterangan', location='json')
        parser.add_argument('gambar', location='json')
        args = parser.parse_args()

        qry = Products.query.get(id)
        if qry is not None:
            if args['id_kategori'] is not None:
                qry.id_kategori = args['id_kategori']
            if args['nama'] is not None:
                qry.nama = args['nama']
            if args['harga'] is not None:
                qry.harga = args['harga']
            if args['deskripsi'] is not None:
                qry.deskripsi = args['deskripsi']
            if args['keterangan'] is not None:
                qry.keterangan = args['keterangan']
            if args['gambar'] is not None:
                qry.gambar = args['gambar']
            qry.updated_at = datetime.now()
            try:
                db.session.commit()
            except Exception as e:
                return {'status':'id_kategori not found'}, 404
            return marshal(qry, Products.response_fields), 200, {'Content-Type': 'application/json'}
        return {'status':'id not found'}, 404

    @jwt_required
    @admin_required
    def delete(self, id):
        qry = Products.query.get(id)
        if qry is None:
            return {'status': 'id not found'}, 404
        db.session.delete(qry)
        db.session.commit()
        return 'Deleted', 200, {'Content-Type': 'application/json'}

class ProductList(Resource):
    def options(self, id=None):
        return 200
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('p', type=int, location='args', default=1)
        parser.add_argument('rp', type=int, location='args', default=30)
        parser.add_argument('id_kategori', location='args', help='invalid filterby id_kategori')
        args = parser.parse_args()
        offset = (args['p'] * args['rp']) - args['rp']
        qry = Products.query

        if args['id_kategori'] is not None:
            qry = qry.filter_by(id_kategori=args['id_kategori'])
        rows = []
        for row in qry.limit(args['rp']).offset(offset).all():
            rows.append(marshal(row, Products.response_fields))
        
        return rows, 200, {'Content-Type': 'application/json'}


api_product.add_resource(ProductList, '')
api_product.add_resource(ProductResource, '', '/<int:id>')
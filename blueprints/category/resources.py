from flask_restful import Resource, Api, reqparse, marshal, inputs
from flask import Blueprint
from blueprints import db, admin_required, user_required, app
from sqlalchemy import desc
from password_strength import PasswordPolicy
from datetime import datetime
from .model import *
import hashlib
from flask_jwt_extended import get_jwt_claims, jwt_required, verify_jwt_in_request

blueprint_category = Blueprint('category', __name__) 
api_category = Api(blueprint_category)


class CategoryResource(Resource):
    def options(self, id=None):
        return 200
    def get(self, id):
        qry = Categories.query.get(id)
        if qry is not None:
            return marshal(qry, Categories.response_fields), 200, {'Content-Type': 'application/json'}
        return {'status':'id not found'}, 404

    @jwt_required
    @admin_required
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('nama', location='json', required=True)
        args = parser.parse_args()
        category = Categories(args['nama'])
        db.session.add(category)
        db.session.commit()
        app.logger.debug('DEBUG : %s', category)
        return marshal(category, Categories.response_fields), 200, {'Content-Type': 'application/json'}

    @jwt_required
    @admin_required
    def put(self, id):
        parser = reqparse.RequestParser()
        parser.add_argument('nama', location='json')
        args = parser.parse_args()

        qry = Categories.query.get(id)
        if qry is not None:
            if args['nama'] is not None:
                qry.nama = args['nama']
            qry.updated_at = datetime.now()
            db.session.commit()
            return marshal(qry, Categories.response_fields), 200, {'Content-Type': 'application/json'}
        return {'status':'id not found'}, 404

    @jwt_required
    @admin_required
    def delete(self, id):
        qry = Categories.query.get(id)
        if qry is None:
            return {'status': 'id not found'}, 404
        db.session.delete(qry)
        db.session.commit()
        return 'Deleted', 200, {'Content-Type': 'application/json'}

class CategoryList(Resource):
    def options(self, id=None):
        return 200
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('p', type=int, location='args', default=1)
        parser.add_argument('rp', type=int, location='args', default=10)
        args = parser.parse_args()
        offset = (args['p'] * args['rp']) - args['rp']
        qry = Categories.query

        rows = []
        for row in qry.limit(args['rp']).offset(offset).all():
            rows.append(marshal(row, Categories.response_fields))
        
        return rows, 200, {'Content-Type': 'application/json'}


api_category.add_resource(CategoryList, '')
api_category.add_resource(CategoryResource, '', '/<int:id>')
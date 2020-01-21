from flask_restful import Resource, Api, reqparse, marshal, inputs
from flask import Blueprint
from blueprints import db, admin_required, user_required
from sqlalchemy import desc
from password_strength import PasswordPolicy
from datetime import datetime
from blueprints.user.model import *
import hashlib
from flask_jwt_extended import get_jwt_claims, jwt_required, verify_jwt_in_request

blueprint_admin = Blueprint("admin", __name__)
api_admin = Api(blueprint_admin)
blueprint_user = Blueprint("user", __name__)
api_user = Api(blueprint_user)

class AdminResources(Resource):
    def options(self, id=None):
        return 200
    policy = PasswordPolicy.from_names(
        length=6,
        uppercase=1,
        numbers=1,
        special=1
    )

    @jwt_required
    @admin_required
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('p', type=int, location='args', default=1)
        parser.add_argument('rp', type=int, location='args', default=10)
        args = parser.parse_args()
        offset = (args['p'] * args['rp']) - args['rp']
        qry = Users.query

        rows = []
        for row in qry.limit(args['rp']).offset(offset).all():
            rows.append(marshal(row, Books.response_fields))
        
        return rows, 200, {"Content-Type": "application/json"}

    @jwt_required
    @admin_required
    def get(self, id=None):
        if id is None:
            rows = []
            parser =reqparse.RequestParser()
            parser.add_argument("p", type=int, location="args", default=1)
            parser.add_argument("rp", type=int, location="args", default=25)
            args = parser.parse_args()
            offset = (args["p"] - 1)*args["rp"]
            
            qry = Users.query
            qry = qry.limit(args["rp"]).offset(offset)
            for row in qry.all():
                rows.append(marshal(row, Users.response_fields))
            return rows, 200, {"Content-Type": "application/json"}
        else:
            qry = Users.query.get(id)
            if qry is None:
                return {"message": "ID is not found"}, 404, {"Content-Type": "application/json"}
            return marshal(qry, Users.response_fields), 200, {"Content-Type": "application/json"}

    @jwt_required
    @admin_required
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("username", location="json", required=True)
        parser.add_argument("password", location="json", required=True)
        parser.add_argument("nama_lengkap", location="json", required=True)
        parser.add_argument("email", location="json", required=True)
        parser.add_argument("no_hp", location="json", required=True)
        args = parser.parse_args()
        validation = self.policy.test(args["password"])
        if validation == []:
            pwd_digest = hashlib.md5(args["password"].encode()).hexdigest()
            if Users.query.filter_by(username=args["username"]).all() != []:
                return {"status": "FAILED", "message": "Username already exists"}, 400, {"Content-Type": "application/json"}
            if Users.query.filter_by(email=args["email"]).all() != []:
                return {"status": "FAILED", "message": "Email already exists"}, 400, {"Content-Type": "application/json"}
            user = Users(args["username"], pwd_digest, args["nama_lengkap"], args["email"], args["no_hp"])
            db.session.add(user)
            db.session.commit()
            return marshal(user, Users.response_fields), 200, {"Content-Type": "application/json"}
        return {"status": "FAILED", "message": "Password is not accepted"}, 400, {"Content-Type": "application/json"}

    @jwt_required
    @admin_required
    def delete(self, id):
        qry = Users.query.get(id)
        if qry is None:
            return {'status': 'ID NOT FOUND'}, 404, {"Content-Type": "application/json"}
        
        db.session.delete(qry)
        db.session.commit()
        return {"message": "Succesfully deleted"}, 200, {"Content-Type": "application/json"}


class UserResources(Resource):
    def options(self, id=None):
        return 200
    policy = PasswordPolicy.from_names(
        length=6,
        uppercase=1,
        numbers=1,
        special=1
    )

    @jwt_required
    @user_required
    def get(self):
        verify_jwt_in_request()
        user_claims_data = get_jwt_claims()
        qry = Users.query.get(user_claims_data["id"])
        return marshal(qry, Users.response_fields), 200, {"Content-Type": "application/json"}

    @jwt_required
    @user_required
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument("username", location="json", required=False)
        parser.add_argument("password", location="json", required=False)
        parser.add_argument("nama_lengkap", location="json", required=False)
        parser.add_argument("email", location="json", required=False)
        parser.add_argument("no_hp", location="json", required=False)
        args = parser.parse_args()
        user_claims_data = get_jwt_claims()
        qry = Users.query.get(user_claims_data["id"])
        if Users.query.filter_by(username=args["username"]).first() is not None:
            return {"status": "FAILED", "message": "Username already exists"}, 400, {"Content-Type": "application/json"}
        if Users.query.filter_by(email=args["email"]).first() is not None:
            return {"status": "FAILED", "message": "Email already exists"}, 400, {"Content-Type": "application/json"}
    
        if args['username'] is not None:
                qry.username = args['username']
        if args['password'] is not None:
            validation = self.policy.test(args["password"])
            if validation == []:
                pwd_digest = hashlib.md5(args["password"].encode()).hexdigest()
            else:
                return {"status": "FAILED", "message": "Password is not accepted"}, 400, {"Content-Type": "application/json"}
            qry.password = pwd_digest
        if args['nama_lengkap'] is not None:
            qry.nama_lengkap = args['nama_lengkap']
        if args['email'] is not None:
            qry.email = args['email']
        if args['no_hp'] is not None:
            qry.no_hp = args['no_hp']
        qry.updated_at = datetime.now()
        db.session.commit()
        return marshal(qry, Users.response_fields), 200, {"Content-Type": "application/json"}

api_admin.add_resource(AdminResources, "/user", "/user/<int:id>")
api_user.add_resource(UserResources, "")
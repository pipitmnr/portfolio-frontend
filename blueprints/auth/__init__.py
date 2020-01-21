from flask import Blueprint
from flask_restful import Api, Resource, reqparse, marshal
from flask_jwt_extended import create_access_token
from blueprints.user.model import *
from password_strength import PasswordPolicy
import hashlib

blueprint_auth = Blueprint("auth", __name__)
api = Api(blueprint_auth)

class CreateUserResources(Resource):
    def options(self, id=None):
        return {'status':'ok'}, 200
    policy = PasswordPolicy.from_names(
        length=6,
        uppercase=1,
        numbers=1,
        special=1
    )
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

class CreateTokenResources(Resource):
    def options(self, id=None):
        return {'status':'ok'}, 200
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("username", location="json", required=True)
        parser.add_argument("password", location="json", required=True)
        args = parser.parse_args()
        password = hashlib.md5(args["password"].encode()).hexdigest()

        if args["username"] == "admin" and args["password"] == "admin":
            user_claims_data = {"username": args["username"],
                                "password": args["password"]}
            user_claims_data = marshal(user_claims_data, Users.jwt_claims_field)
            user_claims_data["is_admin"] = True
            token = create_access_token(identity=user_claims_data['username'], user_claims=user_claims_data)
            user_claims_data['token'] = token
            return {"token": token, "message": "Token is successfully created"}, 200, {"Content-Type": "application/json"}
        else:
            qry = Users.query.filter_by(username=args['username']).filter_by(password=password)
            user_claims_data = qry.first() 
            user_claims_data = marshal(user_claims_data, Users.jwt_claims_field)
            if user_claims_data['username'] != None:
                user_claims_data['is_admin'] = False
                token = create_access_token(identity=user_claims_data['username'], user_claims=user_claims_data)
                user_claims_data['token'] = token
                return {"token": token, "message": "Token is successfully created"}, 200, {"Content-Type": "application/json"}
            else:
                return {'status': 'UNAUTHORIZED', 'message': 'invalid key or secret'}, 401
    # def options(self, id=None):
    #     return {'status':'ok'}, 200


api.add_resource(CreateTokenResources, "login")
api.add_resource(CreateUserResources, "signup")
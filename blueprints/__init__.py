from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager
from flask_jwt_extended import JWTManager, verify_jwt_in_request, get_jwt_claims
from datetime import timedelta
from functools import wraps
import json, random, string, os
from flask_cors import CORS

app = Flask(__name__)
app.config["APP_DEBUG"] = True
CORS(app)

uname = os.environ["THIS_UNAME"]
pwd = os.environ["THIS_PWD"]
db_test = os.environ["THIS_DB_TEST"]
db_dev = os.environ["THIS_DB_DEV"]

try:
    env = os.environ.get("FLASK_ENV", "development")
    if env == "testing":
        app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://{uname}:{pwd}@localhost:3306/{db_test}".format(uname=uname, pwd=pwd, db_test=db_test)
    else:
        app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://{uname}:{pwd}@localhost:3306/{db_dev}".format(uname=uname, pwd=pwd, db_dev=db_dev)
except Exception as error:
    raise error

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['JWT_SECRET_KEY'] = '14031998PurnamaSyafitriManurung'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)


db = SQLAlchemy(app)
migrate = Migrate(app, db)
manager = Manager(app)
manager.add_command('db', MigrateCommand)
jwt = JWTManager(app)


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt_claims()
        if not claims["is_admin"]:
            return {"status": "FORBIDDEN", "message": "You should be an admin to access this point"}, 403
        return fn(*args, **kwargs)
    return wrapper

def user_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt_claims()
        if claims["is_admin"]:
            return {"status": "FORBIDDEN", "message": "You should be a user to access this point"}, 403
        return fn(*args, **kwargs)
    return wrapper


@app.after_request
def after_request(response):
    try:
        request_data = request.get_json()
    except:
        request_data = request.args.to_dict()
    if response.status_code == 200:
        app.logger.info("REQUEST_LOG\t%s", json.dumps({
            "method": request.method,
            "code": response.status,
            "request": request_data,
            "response": json.loads(response.data.decode("utf-8"))
        }))
    else:
        app.logger.error("REQUEST_LOG\t%s", json.dumps({
            "method": request.method,
            "code": response.status,
            "request": request_data,
            "response": json.loads(response.data.decode("utf-8"))
        }))
    return response


from blueprints.auth import blueprint_auth
app.register_blueprint(blueprint_auth, url_prefix="/")

from blueprints.user.resources import *
app.register_blueprint(blueprint_admin, url_prefix="/admin")
app.register_blueprint(blueprint_user, url_prefix="/user")

from blueprints.category.resources import blueprint_category
app.register_blueprint(blueprint_category, url_prefix="/category")

from blueprints.product.resources import blueprint_product
app.register_blueprint(blueprint_product, url_prefix="/product")

from blueprints.cart.resources import blueprint_cart
app.register_blueprint(blueprint_cart, url_prefix="/cart")

from blueprints.cartdetail.resources import blueprint_cartdetail
app.register_blueprint(blueprint_cartdetail, url_prefix="/cartdetail")

db.create_all()
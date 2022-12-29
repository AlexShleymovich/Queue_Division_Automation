from datetime import timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from Scraper import Scraper
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

application = Flask(__name__)
application.config['CORS_HEADERS'] = 'Content-Type'
application.config["JWT_SECRET_KEY"] = 'your secret key'  # needs to be changed
application.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)
jwt = JWTManager(application)
scraper = Scraper()
cors = CORS(application)


@application.route("/login", methods=["POST"])
@cross_origin()
def login():
    username = request.json.get("username")
    password = request.json.get("password")
    company_code = request.json.get("company_code")
    if scraper.login_process(username, password, company_code):
        access_token = create_access_token(identity=username)
        return jsonify({"access_token": access_token}), 200
    else:
        return jsonify({"msg": "Bad username or password"}), 401


@application.route('/main', methods=['GET', 'POST'])
@cross_origin()
@jwt_required()
def main():
    if request.method == 'GET':
        if not scraper.check_schedule():
            scraper.scrape_and_create_schedule()
        else:
            scraper.retrieve_info()
        return jsonify(scraper.json_builder()), 200

    elif request.method == 'POST':
        name = request.json.get("deleted")[0]['employee']
        night_shifters = request.json.get("night")

        if scraper.day_index == 0:
            if len(scraper.schedule_dict) > 1:
                scraper.delete_shifter(name)
                return jsonify(scraper.json_builder()), 200
            else:
                return jsonify({"msg": "Unable to delete"}), 400

        elif scraper.day_index != 0:
            scraper.night_shifters = night_shifters
            if len(scraper.schedule_dict) > 3:
                scraper.delete_shifter(name)
                return jsonify(scraper.json_builder()), 200
            else:
                return jsonify({"msg": "Unable to delete"}), 400


if __name__ == '__main__':
    application.run(debug=True)

# Autor: Brandon
# Descripción: Aplicación principal de Flask que habilita CORS y registra la ruta de validación.

from flask import Flask
from flask_cors import CORS

from routes.validate_route import validate_bp


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(validate_bp)

    @app.route("/", methods=["GET"])
    def home():
        return {
            "message": "Backend del Validador de Expresiones Booleanas con CFG",
            "endpoint": "/api/validate",
        }

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

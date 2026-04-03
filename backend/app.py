from flask import Flask
from flask_cors import CORS
from flask import request, jsonify
from flask import send_from_directory
# Import Blueprints
from routes.auth_routes import auth_bp
from routes.employer_routes import employer_bp
from routes.employee_routes import employee_bp
from routes.admin_routes import admin_bp
from routes.chat_routes import chat_bp
import os

# Initialize App
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads", "resources")

@app.route('/uploads/resources/<path:filename>')
def serve_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# 🔹 Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(employer_bp, url_prefix="/api/employer")
app.register_blueprint(employee_bp, url_prefix="/api/employee")
app.register_blueprint(admin_bp, url_prefix="/api/admin")
app.register_blueprint(chat_bp, url_prefix="/api/chat")

# Run Server
if __name__ == "__main__":
    print("Starting Flask App...")
    app.run(debug=True, host="0.0.0.0", port=5000)
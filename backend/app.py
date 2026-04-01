from flask import Flask
from flask_cors import CORS
from flask import request, jsonify

# Import Blueprints
from routes.auth_routes import auth_bp
from routes.employer_routes import employer_bp
from routes.employee_routes import employee_bp
from routes.admin_routes import admin_bp
from routes.chat_routes import chat_bp

# Initialize App
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# 🔹 Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(employer_bp, url_prefix="/api/employer")
app.register_blueprint(employee_bp, url_prefix="/api/employee")
app.register_blueprint(admin_bp, url_prefix="/api/admin")
app.register_blueprint(chat_bp, url_prefix="/api/chat")

@app.route("/api/login", methods=["POST"])
def login():
    data = request.form

    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    print("Login Attempt:", email, role)

    # 🔐 Admin (hidden from UI but supported)
    if email == "admin@gmail.com" and password == "1234":
        return {
            "status": "success",
            "message": "Admin login successful"
        }

    # 👤 Employee
    if role == "employee":
        return {
            "status": "success",
            "message": "Employee login successful"
        }

    # 💼 Employer
    if role == "employer":
        return {
            "status": "success",
            "message": "Employer login successful"
        }

    return {
        "status": "error",
        "message": "Invalid credentials"
    }, 401

# Run Server
if __name__ == "__main__":
    print("Starting Flask App...")
    app.run(debug=True, host="0.0.0.0", port=5000)
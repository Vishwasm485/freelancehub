import random
from datetime import datetime
from flask import Blueprint, request, jsonify
from database import get_cursor
from utils.otp import generate_otp, get_expiry
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)
print("AUTH FILE LOADED")
# REGISTER
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    conn, cursor = get_cursor()

    # Check existing user
    cursor.execute("SELECT * FROM users WHERE email=%s OR phone=%s",
                   (data['email'], data['phone']))
    if cursor.fetchone():
        return jsonify({"error": "User already exists"}), 400

    hashed = generate_password_hash(data['password'])

    cursor.execute("""
        INSERT INTO users (name, gender, email, phone, password, role)
        VALUES (%s,%s,%s,%s,%s,%s)
    """, (data['name'], data.get('gender'), data['email'],
          data['phone'], hashed, data['role']))

    conn.commit()
    conn.close()

    return jsonify({"message": "Registered successfully"})


# SEND OTP
@auth_bp.route('/send-otp', methods=['POST'])
def send_otp():
    try:
        data = request.json
        otp = generate_otp()

        print("API HIT")
        
        print("DATA:", data)
        print("OTP GENERATED:", otp)
        conn, cursor = get_cursor()

        cursor.execute("""
            INSERT INTO otp_verification (email, phone, otp, expires_at)
            VALUES (%s,%s,%s,%s)
        """, (
            data.get('email') or None,
            data.get('phone') or None,
            otp,
            get_expiry()
        ))

        conn.commit()
        conn.close()

        return jsonify({"message": "OTP sent"})

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 500
# VERIFY OTP
@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json
    conn, cursor = get_cursor()

    value = data.get('value')   # email OR phone
    otp = data.get('otp')

    cursor.execute("""
        SELECT * FROM otp_verification
        WHERE otp=%s AND (email=%s OR phone=%s)
        ORDER BY expires_at DESC LIMIT 1
    """, (otp, value, value))

    record = cursor.fetchone()

    if not record:
        return jsonify({"error": "Invalid OTP"}), 400

    if datetime.now() > record['expires_at']:
        return jsonify({"error": "OTP expired"}), 400

    # ✅ Just confirm verification (DON’T update users yet)
    cursor.execute("DELETE FROM otp_verification WHERE id=%s", (record['id'],))

    conn.commit()
    conn.close()

    return jsonify({"message": "OTP verified"})

# LOGIN
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    conn, cursor = get_cursor()
    print("LOGIN FUNCTION REGISTERED")
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()


    if not user:
        return jsonify({"error": "User not found"}), 404

    if not check_password_hash(user['password'], password):
        return jsonify({"error": "Wrong password"}), 401

    if user['role'] != role:
        return jsonify({"error": "Role mismatch"}), 403

    return jsonify({
        "message": "Login successful",
        "user_id": user['id'],
        "role": user['role'],
        "name": user['name'],
        "email": user['email'],              
        "profile_pic": user.get('profile_pic') 
    })
  
from werkzeug.utils import secure_filename
import os

# SET PROFILE FOLDER
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PROFILE_FOLDER = os.path.join(BASE_DIR, "uploads", "profile")

os.makedirs(PROFILE_FOLDER, exist_ok=True)

@auth_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    conn, cursor = get_cursor()

    cursor.execute("SELECT * FROM users WHERE id=%s", (user_id,))
    user = cursor.fetchone()

    # 🔴 ADD THIS LINE
    print("USER DATA FROM DB:", user)

    conn.close()

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user)


@auth_bp.route('/upload-profile', methods=['POST'])
def upload_profile():
    try:
        file = request.files.get("file")
        user_id = request.form.get("user_id")

        if not file or not user_id:
            return jsonify({"error": "Missing file or user_id"}), 400

        filename = secure_filename(file.filename)

        # make filename unique
        filename = f"user_{user_id}_{filename}"

        filepath = os.path.join(PROFILE_FOLDER, filename)
        file.save(filepath)

        db_path = f"uploads/profile/{filename}"

        conn, cursor = get_cursor()

        cursor.execute(
            "UPDATE users SET profile_pic=%s WHERE id=%s",
            (db_path, user_id)
        )

        conn.commit()
        conn.close()

        return jsonify({
            "message": "Profile uploaded",
            "profile_pic": db_path
        })

    except Exception as e:
        print("UPLOAD ERROR:", str(e))
        return jsonify({"error": "Upload failed"}), 500
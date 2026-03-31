import random
from datetime import datetime
from flask import Blueprint, request, jsonify
from database import get_cursor
from utils.auth import hash_password, check_password
from utils.otp import generate_otp, get_expiry

auth_bp = Blueprint('auth', __name__)

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

    hashed = hash_password(data['password'])

    cursor.execute("""
        INSERT INTO users (name, gender, email, phone, password, role)
        VALUES (%s,%s,%s,%s,%s,%s)
    """, (data['name'], data['gender'], data['email'],
          data['phone'], hashed, data['role']))

    conn.commit()
    conn.close()

    return jsonify({"message": "Registered successfully"})


# SEND OTP
@auth_bp.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.json
    otp = generate_otp()

    print("OTP:", otp)  # simulate sending

    conn, cursor = get_cursor()

    cursor.execute("""
        INSERT INTO otp_verification (email, phone, otp, expires_at)
        VALUES (%s,%s,%s,%s)
    """, (data.get('email'), data.get('phone'), otp, get_expiry()))

    conn.commit()
    conn.close()

    return jsonify({"message": "OTP sent"})


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

    cursor.execute("SELECT * FROM users WHERE email=%s", (data['email'],))
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not check_password(data['password'], user['password']):
        return jsonify({"error": "Wrong password"}), 401

    return jsonify({
        "user_id": user['id'],
        "role": user['role']
    })
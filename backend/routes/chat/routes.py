from flask import Blueprint, request, jsonify
from database import get_cursor

chat_bp = Blueprint('chat', __name__)

# SEND MESSAGE
@chat_bp.route('/send', methods=['POST'])
def send_message():
    data = request.json

    assignment_id = data.get('assignment_id')
    sender_id = data.get('sender_id')
    message = data.get('message')

    if not assignment_id or not sender_id or not message:
        return jsonify({"error": "Missing data"}), 400

    conn, cursor = get_cursor()

    cursor.execute("""
        INSERT INTO chat (assignment_id, sender_id, message)
        VALUES (%s, %s, %s)
    """, (assignment_id, sender_id, message))

    conn.commit()
    conn.close()

    return jsonify({"message": "Message sent"})
# GET CHAT
@chat_bp.route('/<int:assignment_id>', methods=['GET'])
def get_chat(assignment_id):
    conn, cursor = get_cursor()

    cursor.execute("""
        SELECT m.*, u.name
        FROM chat m
        JOIN users u ON m.sender_id = u.id
        WHERE m.assignment_id=%s
        ORDER BY m.created_at ASC
    """, (assignment_id,))

    data = cursor.fetchall()

    # format datetime
    for msg in data:
        msg['created_at'] = msg['created_at'].strftime('%Y-%m-%d %H:%M:%S')

    conn.close()

    return jsonify(data)
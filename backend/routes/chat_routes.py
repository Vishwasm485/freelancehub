from flask import Blueprint, request, jsonify
from database import get_cursor

chat_bp = Blueprint('chat', __name__)

# SEND MESSAGE
@chat_bp.route('/send', methods=['POST'])
def send_message():
    data = request.json
    conn, cursor = get_cursor()

    cursor.execute("""
        INSERT INTO chat (assignment_id, sender_id, message)
        VALUES (%s,%s,%s)
    """, (
        data['assignment_id'],
        data['sender_id'],
        data['message']
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Message sent"})

# GET CHAT
@chat_bp.route('/<int:assignment_id>', methods=['GET'])
def get_chat(assignment_id):
    conn, cursor = get_cursor()

    cursor.execute("""
        SELECT c.message, c.created_at, u.name
        FROM chat c
        JOIN users u ON c.sender_id = u.id
        WHERE c.assignment_id=%s
        ORDER BY c.created_at ASC
    """, (assignment_id,))

    messages = cursor.fetchall()
    conn.close()

    return jsonify(messages)
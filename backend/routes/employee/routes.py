from flask import Blueprint, request, jsonify
from database import get_cursor

employee_bp = Blueprint('employee', __name__)

# PLACE BID
@employee_bp.route('/bid', methods=['POST'])
def place_bid():
    data = request.json
    conn, cursor = get_cursor()

    # Check duplicate bid
    cursor.execute("""
        SELECT * FROM bids WHERE project_id=%s AND employee_id=%s
    """, (data['project_id'], data['employee_id']))

    if cursor.fetchone():
        return jsonify({"error": "You already placed a bid"}), 400

    # Insert bid
    cursor.execute("""
        INSERT INTO bids (project_id, employee_id, bid_amount, proposal)
        VALUES (%s,%s,%s,%s)
    """, (
        data['project_id'],
        data['employee_id'],
        data['bid_amount'],
        data.get('proposal', '')
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Bid placed successfully"})
# UPDATE PROGRESS
@employee_bp.route('/progress', methods=['POST'])
def update_progress():
    data = request.json
    conn, cursor = get_cursor()

    assignment_id = data['assignment_id']
    percentage = data['percentage']
    details = data.get('details', '')

    # Validate percentage
    if percentage < 0 or percentage > 100:
        return jsonify({"error": "Invalid percentage"}), 400

    # Get latest progress
    cursor.execute("""
        SELECT completion_percentage 
        FROM progress 
        WHERE assignment_id=%s
        ORDER BY updated_at DESC LIMIT 1
    """, (assignment_id,))
    last = cursor.fetchone()

    if last and percentage < last['completion_percentage']:
        return jsonify({"error": "Cannot decrease progress"}), 400

    # Insert progress
    cursor.execute("""
        INSERT INTO progress (assignment_id, completion_percentage, details)
        VALUES (%s,%s,%s)
    """, (assignment_id, percentage, details))

    conn.commit()
    conn.close()

    return jsonify({"message": "Progress updated"})
    # GET ALL PROJECTS
@employee_bp.route('/projects', methods=['GET'])
def get_all_projects():
    conn, cursor = get_cursor()

    cursor.execute("""
        SELECT 
            p.id, p.title, p.description, p.budget,
            b.id AS bid_id, b.employee_id, b.bid_amount
        FROM projects p
        LEFT JOIN bids b ON p.id = b.project_id
        WHERE p.status='open'
    """)

    rows = cursor.fetchall()
    
    projects = {}

    for row in rows:
        pid = row['id']

        if pid not in projects:
            projects[pid] = {
                "id": pid,
                "title": row['title'],
                "description": row['description'],
                "budget": row['budget'],
                "bids": []
            }

        if row['bid_id']:
            projects[pid]["bids"].append({
                "id": row['bid_id'],
                "employee_id": row['employee_id'],
                "bid_amount": row['bid_amount']
            })
    conn.close()
    return jsonify(list(projects.values()))
  

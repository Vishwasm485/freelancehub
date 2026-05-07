from flask import Blueprint, request, jsonify
from database import get_cursor

employee_bp = Blueprint('employee', __name__)

# ✅ GET ALL PROJECTS
@employee_bp.route('/projects', methods=['GET'])
def get_all_projects():
    conn, cursor = get_cursor()

    cursor.execute("""
        SELECT * FROM projects 
        WHERE status='open'
    """)

    projects = cursor.fetchall()
    conn.close()

    return jsonify(projects)


# ✅ GET LOWEST BID
@employee_bp.route('/lowest-bid/<int:project_id>', methods=['GET'])
def get_lowest_bid(project_id):
    conn, cursor = get_cursor()

    cursor.execute("""
        SELECT MIN(bid_amount) AS lowest 
        FROM bids WHERE project_id=%s
    """, (project_id,))

    result = cursor.fetchone()
    conn.close()

    return jsonify({
        "lowest": float(result['lowest']) if result['lowest'] else 0
    })
# ✅ PLACE BID
@employee_bp.route('/bid', methods=['POST'])
def place_bid():
    data = request.json

    try:
        project_id = int(data['project_id'])
        employee_id = int(data['employee_id'])
        bid_amount = float(data['bid_amount'])
    except:
        return jsonify({"error": "Invalid input"}), 400

    conn, cursor = get_cursor()

    # 🔹 Get project
    cursor.execute("SELECT budget FROM projects WHERE id=%s", (project_id,))
    project = cursor.fetchone()

    if not project:
        return jsonify({"error": "Project not found"}), 404

    budget = float(project['budget'] or 0)

    # ❌ Rule 1: Budget check
    if bid_amount > budget:
        return jsonify({"error": "Bid cannot exceed project budget"}), 400

    # 🔹 Global lowest bid
    cursor.execute("""
        SELECT MIN(bid_amount) AS lowest 
        FROM bids WHERE project_id=%s
    """, (project_id,))
    
    lowest = cursor.fetchone()['lowest']

    if lowest is not None:
        lowest = float(lowest)

    # ❌ Rule 2: Must beat lowest bid
    if lowest is not None and bid_amount >= lowest:
        return jsonify({"error": "Bid must be lower than current lowest bid"}), 400

    # 🔹 User's own previous bid
    cursor.execute("""
        SELECT MIN(bid_amount) AS my_lowest
        FROM bids 
        WHERE project_id=%s AND employee_id=%s
    """, (project_id, employee_id))

    my = cursor.fetchone()['my_lowest']

    if my is not None:
        my = float(my)

    # ❌ Rule 3: Must beat own previous bid
    if my is not None and bid_amount >= my:
        return jsonify({"error": "New bid must be lower than your previous bid"}), 400

    # ✅ Insert (multiple bids allowed)
    cursor.execute("""
        INSERT INTO bids (project_id, employee_id, bid_amount)
        VALUES (%s,%s,%s)
    """, (project_id, employee_id, bid_amount))

    conn.commit()
    conn.close()

    return jsonify({"message": "Bid placed successfully"})

@employee_bp.route('/assigned/<int:employee_id>', methods=['GET'])
def get_employee_tasks(employee_id):
    conn, cursor = get_cursor()

    cursor.execute("""
        SELECT 
            a.id AS assignment_id,
            a.agreed_amount,
            p.title,
            p.description,
            p.skills,
            p.deadline,
            p.file_path,
            u.name AS employer_name,
            u.email,
            u.phone
        FROM assignments a
        JOIN projects p ON a.project_id = p.id
        JOIN users u ON p.employer_id = u.id
        WHERE a.employee_id = %s
        GROUP BY a.project_id
        ORDER BY a.id DESC
    """, (employee_id,))

    data = cursor.fetchall()
    conn.close()

    return jsonify(data)
@employee_bp.route('/update-progress', methods=['POST'])
def update_progress():
    data = request.json

    assignment_id = data.get('assignment_id')
    completion = data.get('completion_percentage')
    details = data.get('details')

    conn, cursor = get_cursor()

    cursor.execute("""
        INSERT INTO progress (assignment_id, completion_percentage, details)
        VALUES (%s, %s, %s)
    """, (assignment_id, completion, details))

    conn.commit()
    conn.close()

    return jsonify({"message": "Progress updated"})
@employee_bp.route('/payment-history/<int:assignment_id>', methods=['GET'])
def get_payment_history(assignment_id):
    conn, cursor = get_cursor()

    cursor.execute("""
        SELECT agreed_amount FROM assignments WHERE id=%s
    """, (assignment_id,))
    row = cursor.fetchone()

    if not row:
        return jsonify({"error": "Assignment not found"}), 404

    agreed = float(row['agreed_amount'])

    cursor.execute("""
        SELECT id, amount_paid, payment_date
        FROM payments
        WHERE assignment_id=%s
        ORDER BY payment_date DESC
    """, (assignment_id,))
    payments = cursor.fetchall()

    # 🔥 FIX: convert datetime → string
    for p in payments:
        if p.get('payment_date'):
            p['payment_date'] = p['payment_date'].strftime('%Y-%m-%d %H:%M:%S')
        else:
            p['payment_date'] = None


    cursor.execute("""
        SELECT IFNULL(SUM(amount_paid), 0) AS total_paid
        FROM payments
        WHERE assignment_id=%s
    """, (assignment_id,))
    total_paid = float(cursor.fetchone()['total_paid'])

    conn.close()

    return jsonify({
        "agreed": agreed,
        "received": total_paid,
        "remaining": agreed - total_paid,
        "history": payments
    })
@employee_bp.route('/status/<int:assignment_id>', methods=['GET'])
def employee_view_status(assignment_id):
    conn, cursor = get_cursor()

    # get deadline
    cursor.execute("""
        SELECT p.deadline
        FROM assignments a
        JOIN projects p ON a.project_id = p.id
        WHERE a.id=%s
    """, (assignment_id,))
    row = cursor.fetchone()

    if not row:
        return jsonify({"error": "Assignment not found"}), 404

    # latest progress
    cursor.execute("""
        SELECT completion_percentage, details
        FROM progress
        WHERE assignment_id=%s
        ORDER BY id DESC LIMIT 1
    """, (assignment_id,))
    prog = cursor.fetchone()

    conn.close()

    return jsonify({
        "completion_percentage": prog['completion_percentage'] if prog else 0,
        "details": prog['details'] if prog else "No updates yet",
        "deadline": row['deadline']
    })
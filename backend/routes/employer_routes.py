from flask import Blueprint, request, jsonify
from database import get_cursor

employer_bp = Blueprint('employer', __name__)

# POST PROJECT
@employer_bp.route('/projects', methods=['POST'])
def post_project():
    data = request.json
    conn, cursor = get_cursor()

    cursor.execute("""
        INSERT INTO projects (employer_id, title, description, skills, budget, deadline)
        VALUES (%s,%s,%s,%s,%s,%s)
    """, (
        data['employer_id'],
        data['title'],
        data['description'],
        data['skills'],
        data['budget'],
        data['deadline']
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Project posted successfully"})
# GET MY PROJECTS
@employer_bp.route('/projects/<int:employer_id>', methods=['GET'])
def get_projects(employer_id):
    conn, cursor = get_cursor()

    cursor.execute("""
        SELECT * FROM projects WHERE employer_id=%s
    """, (employer_id,))

    projects = cursor.fetchall()
    conn.close()

    return jsonify(projects)
# VIEW BIDS
@employer_bp.route('/bids/<int:project_id>', methods=['GET'])
def view_bids(project_id):
    conn, cursor = get_cursor()

    cursor.execute("""
        SELECT b.*, u.name, u.email, u.phone
        FROM bids b
        JOIN users u ON b.employee_id = u.id
        WHERE b.project_id=%s
        ORDER BY b.bid_amount ASC
    """, (project_id,))

    bids = cursor.fetchall()
    conn.close()

    return jsonify(bids)
# ASSIGN PROJECT
@employer_bp.route('/assign', methods=['POST'])
def assign_project():
    data = request.json
    conn, cursor = get_cursor()

    project_id = data['project_id']
    employee_id = data['employee_id']
    agreed_amount = data['agreed_amount']

    # 1. Update selected bid → accepted
    cursor.execute("""
        UPDATE bids
        SET status='accepted'
        WHERE project_id=%s AND employee_id=%s
    """, (project_id, employee_id))

    # 2. Reject all other bids
    cursor.execute("""
        UPDATE bids
        SET status='rejected'
        WHERE project_id=%s AND employee_id!=%s
    """, (project_id, employee_id))

    # 3. Create assignment
    cursor.execute("""
        INSERT INTO assignments (project_id, employee_id, agreed_amount, deadline)
        SELECT id, %s, %s, deadline FROM projects WHERE id=%s
    """, (employee_id, agreed_amount, project_id))

    # 4. Update project status
    cursor.execute("""
        UPDATE projects
        SET status='assigned'
        WHERE id=%s
    """, (project_id,))

    conn.commit()
    conn.close()

    return jsonify({"message": "Project assigned successfully"})
# GET ACTIVE ASSIGNMENTS (EMPLOYER)
@employer_bp.route('/assignments/<int:employer_id>', methods=['GET'])
def get_assignments(employer_id):
    conn, cursor = get_cursor()
    cursor.execute("""
        SELECT 
            a.id AS assignment_id,
            p.title,
            p.description,
            p.skills,
            p.budget,
            p.deadline,
            a.agreed_amount,
            a.assigned_date,
            u.name AS employee_name,
            u.email,
            u.phone,
            IFNULL(SUM(pay.amount_paid), 0) AS total_paid
        FROM assignments a
        JOIN projects p ON a.project_id = p.id
        JOIN users u ON a.employee_id = u.id
        LEFT JOIN payments pay ON a.id = pay.assignment_id
        WHERE p.employer_id = %s
        GROUP BY a.id
    """, (employer_id,))

    assignments = cursor.fetchall()
    conn.close()

    return jsonify(assignments)
# MAKE PAYMENT
@employer_bp.route('/payment', methods=['POST'])
def make_payment():
    data = request.json
    conn, cursor = get_cursor()

    assignment_id = data['assignment_id']
    amount = data['amount']

    # 1. Get agreed amount
    cursor.execute("""
        SELECT agreed_amount FROM assignments WHERE id=%s
    """, (assignment_id,))
    assignment = cursor.fetchone()

    if not assignment:
        return jsonify({"error": "Assignment not found"}), 404

    agreed_amount = assignment['agreed_amount']

    # 2. Get total paid so far
    cursor.execute("""
        SELECT IFNULL(SUM(amount_paid), 0) AS total_paid
        FROM payments
        WHERE assignment_id=%s
    """, (assignment_id,))
    total_paid = cursor.fetchone()['total_paid']

    # 3. Validate overpayment
    if total_paid + amount > agreed_amount:
        return jsonify({
            "error": "Payment exceeds agreed amount"
        }), 400

    # 4. Insert payment
    cursor.execute("""
        INSERT INTO payments (assignment_id, amount_paid)
        VALUES (%s,%s)
    """, (assignment_id, amount))

    conn.commit()
    conn.close()

    return jsonify({"message": "Payment successful"})
from datetime import datetime

# VIEW STATUS
@employer_bp.route('/status/<int:assignment_id>', methods=['GET'])
def view_status(assignment_id):
    conn, cursor = get_cursor()

    # Get assignment + project
    cursor.execute("""
        SELECT a.assigned_date, p.deadline
        FROM assignments a
        JOIN projects p ON a.project_id = p.id
        WHERE a.id=%s
    """, (assignment_id,))
    data = cursor.fetchone()

    if not data:
        return jsonify({"error": "Assignment not found"}), 404

    assigned_date = data['assigned_date']
    deadline = data['deadline']

    # Get latest progress
    cursor.execute("""
        SELECT completion_percentage, details
        FROM progress
        WHERE assignment_id=%s
        ORDER BY updated_at DESC LIMIT 1
    """, (assignment_id,))
    progress = cursor.fetchone()

    completion = progress['completion_percentage'] if progress else 0
    details = progress['details'] if progress else "No updates yet"

    # Calculate days remaining
    today = datetime.now().date()
    days_remaining = (deadline - today).days

    conn.close()

    return jsonify({
        "completion_percentage": completion,
        "assigned_date": assigned_date,
        "deadline": deadline,
        "days_remaining": days_remaining,
        "details": details
    })
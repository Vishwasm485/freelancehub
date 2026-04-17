import os

from flask import Blueprint, request, jsonify
from database import get_cursor
from utils.auth import hash_password
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = "uploads/projects"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

employer_bp = Blueprint('employer', __name__)

@employer_bp.route('/update-profile', methods=['POST'])
def update_profile():
    data = request.json
    conn, cursor = get_cursor()

    user_id = data['user_id']
    phone = data.get('phone')
    password = data.get('password')

    if password:
        password = hash_password(password)

    cursor.execute("""
        UPDATE users
        SET phone=%s, password=%s
        WHERE id=%s
    """, (phone, password, user_id))

    conn.commit()
    conn.close()

    return jsonify({"message": "Profile updated successfully"})

# POST PROJECT
@employer_bp.route('/projects', methods=['POST'])
def post_project():
    conn, cursor = get_cursor()

    title = request.form.get("title")
    description = request.form.get("description")
    skills = request.form.get("skills")
    budget = request.form.get("budget")
    deadline = request.form.get("deadline")
    employer_id = request.form.get("employer_id")

    file = request.files.get("file")
    file_path = None

    if file:
        filename = secure_filename(file.filename)

        # ❌ BLOCK VIDEO FILES
        if filename.lower().endswith((".mp4", ".avi", ".mov", ".mkv")):
            return jsonify({"error": "Video files not allowed"}), 400

        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

    cursor.execute("""
        INSERT INTO projects 
        (employer_id, title, description, skills, budget, deadline, file_path)
        VALUES (%s,%s,%s,%s,%s,%s,%s)
    """, (
        employer_id, title, description, skills, budget, deadline, file_path
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Project posted successfully"})
# GET MY PROJECTS
@employer_bp.route('/projects/<employer_id>', methods=['GET'])
def get_projects(employer_id):
    conn, cursor = get_cursor()

    cursor.execute("""
        SELECT * FROM projects 
        WHERE employer_id=%s
        ORDER BY id DESC
    """, (employer_id,))

    projects = cursor.fetchall()

    conn.close()

    return jsonify(projects)

@employer_bp.route('/delete-project/<int:project_id>', methods=['DELETE', 'OPTIONS'])
def delete_project(project_id):
    if request.method == 'OPTIONS':
        return '', 200

    conn, cursor = get_cursor()

    cursor.execute("DELETE FROM projects WHERE id=%s", (project_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Project deleted successfully"})

# VIEW BIDS
@employer_bp.route('/bids/<int:project_id>', methods=['GET'])
def view_bids(project_id):
    conn, cursor = get_cursor()

    cursor.execute("""
        SELECT 
            b.project_id,
            b.employee_id,
            b.bid_amount,
            u.name AS name,
            u.email AS email,
            u.phone AS phone,
            u.gender AS gender
        FROM bids b
        JOIN users u ON b.employee_id = u.id
        WHERE b.project_id = %s
        ORDER BY b.bid_amount ASC
        LIMIT 1
    """, (project_id,))

    bid = cursor.fetchone()
    conn.close()

    if not bid:
        return jsonify({"error": "No bids yet"}), 404

    return jsonify(bid)


# ==============================
# ASSIGN PROJECT
# ==============================
@employer_bp.route('/assign', methods=['POST'])
def assign_project():
    data = request.json

    project_id = data.get('project_id')
    employee_id = data.get('employee_id')
    bid_amount = data.get('bid_amount')

    if not project_id or not employee_id or not bid_amount:
        return jsonify({"error": "Missing data"}), 400

    conn, cursor = get_cursor()

    try:
        # ✅ STEP 1: GET PROJECT
        cursor.execute(
            "SELECT * FROM projects WHERE id=%s",
            (project_id,)
        )
        project = cursor.fetchone()

        if not project:
            return jsonify({"error": "Project not found"}), 404

        # ✅ STEP 2: INSERT INTO ASSIGNMENTS
        cursor.execute("""
            INSERT INTO assignments 
            (project_id, employee_id, agreed_amount, deadline)
            VALUES (%s,%s,%s,%s)
        """, (
            project_id,
            employee_id,
            bid_amount,
            project['deadline']
        ))

        # ✅ STEP 3: UPDATE PROJECT STATUS (IMPORTANT)
        cursor.execute("""
            UPDATE projects
            SET status = 'assigned'
            WHERE id=%s
        """, (project_id,))

        # ✅ STEP 4: COMMIT
        conn.commit()

    except Exception as e:
        conn.rollback()
        print("ASSIGN ERROR:", str(e))
        return jsonify({"error": "Assignment failed"}), 500

    finally:
        conn.close()

    return jsonify({"message": "Task assigned successfully"})

# ==============================
# GET ASSIGNED TASKS
# ==============================
@employer_bp.route('/assignments/<int:employer_id>', methods=['GET'])
def get_assignments(employer_id):
    conn, cursor = get_cursor()

    cursor.execute("""
        SELECT 
            a.*,
            p.title,
            p.description,
            p.skills,
            p.file_path,
            u.name,
            u.email,
            u.phone
        FROM assignments a
        JOIN projects p ON a.project_id = p.id
        JOIN users u ON a.employee_id = u.id
        WHERE p.employer_id = %s
    """)

    data = cursor.fetchall()
    conn.close()

    return jsonify(data)

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
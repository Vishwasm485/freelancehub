from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename
import os
from database import get_cursor

admin_bp = Blueprint('admin', __name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "..", "uploads", "resources")
UPLOAD_FOLDER = os.path.abspath(UPLOAD_FOLDER)
print("Exists:", os.path.exists(UPLOAD_FOLDER))
print("Is Dir:", os.path.isdir(UPLOAD_FOLDER))
print("Is File:", os.path.isfile(UPLOAD_FOLDER))
# CREATE FOLDER if not exists
if os.path.exists(UPLOAD_FOLDER) and not os.path.isdir(UPLOAD_FOLDER):
    raise Exception(f"{UPLOAD_FOLDER} exists but is not a directory")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ✅ POST RESOURCE
@admin_bp.route('/add-resource', methods=['POST'])
def add_resource():
    try:
        print("HEADERS:", request.headers)
        print("CONTENT TYPE:", request.content_type)
        print("FORM:", request.form)
        print("FILES:", request.files)
        title = request.form.get("title")
        description = request.form.get("description")
        skill = request.form.get("skill")
        file = request.files.get("file")

        if not title or not skill or not file:
            return jsonify({"error": "All fields required"}), 400

        # SAVE FILE
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        file.save(filepath)

        # Store relative path for frontend
        db_path = f"uploads/resources/{filename}"
        file_type = filename.rsplit('.', 1)[1]
        uploaded_by = 1
        conn, cursor = get_cursor()

        cursor.execute("""
            INSERT INTO resources (title, description, skill, file_path, file_type, uploaded_by)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (title, description, skill, db_path, file_type, uploaded_by))

        conn.commit()
        conn.close()

        return jsonify({"message": "Resource added successfully"})

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": "Server error"}), 500


@admin_bp.route('/resources', methods=['GET'])
def get_resources():
    conn, cursor = get_cursor()

    cursor.execute("SELECT * FROM resources ORDER BY created_at DESC")
    data = cursor.fetchall()

    conn.close()

    return jsonify(data)

@admin_bp.route('/delete-resource/<int:id>', methods=['DELETE'])
def delete_resource(id):
    conn, cursor = get_cursor()

    cursor.execute("DELETE FROM resources WHERE id=%s", (id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Resource deleted"})

@admin_bp.route('/test', methods=['GET'])
def test_admin():
    return jsonify({"message": "Admin route working"})

@admin_bp.route('/stats', methods=['GET'])
def get_admin_stats():
    conn, cursor = get_cursor()

    # Total Employees
    cursor.execute("SELECT COUNT(*) AS count FROM users WHERE role='employee'")
    employees = cursor.fetchone()['count']

    # Total Employers
    cursor.execute("SELECT COUNT(*) AS count FROM users WHERE role='employer'")
    employers = cursor.fetchone()['count']

    # Active Projects (assigned)
    cursor.execute("SELECT COUNT(*) AS count FROM projects WHERE status='assigned'")
    active_projects = cursor.fetchone()['count']

    # Unassigned Projects
    cursor.execute("SELECT COUNT(*) AS count FROM projects WHERE status='open'")
    unassigned_projects = cursor.fetchone()['count']

    # Total Resources
    cursor.execute("SELECT COUNT(*) AS count FROM resources")
    resources = cursor.fetchone()['count']

    conn.close()

    return {
        "employees": employees,
        "employers": employers,
        "active_projects": active_projects,
        "unassigned_projects": unassigned_projects,
        "resources": resources
    }
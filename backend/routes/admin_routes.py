from flask import Blueprint, jsonify

from database import get_cursor

admin_bp = Blueprint('admin', __name__)

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
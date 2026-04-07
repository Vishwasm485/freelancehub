from flask import Blueprint, request, jsonify
from database import get_cursor

employee_bp = Blueprint('employee', __name__)

# ✅ GET ALL PROJECTS
@employee_bp.route('/projects', methods=['GET'])
def get_all_projects():
    conn, cursor = get_cursor()

    cursor.execute("SELECT * FROM projects ORDER BY id DESC")
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
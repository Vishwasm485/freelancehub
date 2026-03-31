from flask import Blueprint, jsonify

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/test', methods=['GET'])
def test_admin():
    return jsonify({"message": "Admin route working"})
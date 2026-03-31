import mysql.connector
from config import DB_CONFIG

def get_connection():
    return mysql.connector.connect(**DB_CONFIG)

def get_cursor():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    return conn, cursor
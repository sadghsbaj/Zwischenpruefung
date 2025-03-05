from flask import Blueprint, request, session, jsonify
import os
import pandas as pd

dark_mode_bp = Blueprint('dark_mode', __name__)

@dark_mode_bp.route("/update_mode", methods=["POST"])
def update_mode():
    data = request.get_json()
    mode_status = data.get("mode", "Hell")

    # Sicherstellen, das ein Benutzer angemeldet ist
    username = session.get("username")
    if not username:
        return jsonify({"status": "error", "message": "Kein Benutzer angemeldet"}), 400

    # Pfad zur Excel-Datei erstellen (einen Ordner zurück, dann in data)
    base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
    file_path = os.path.join(base_path, "data_users.xlsx")

    # Excel-Datei einlesen
    try:
        df = pd.read_excel(file_path)

        # Überprüfen, ob "username" in Spalte A existiert
        user_row = df[df['username'] == username]
        if user_row.empty:
            return jsonify({"status": "error", "message": "Benutzer nicht in der Datei gefunden"}), 404

        # Zeilenindex des Benutzers holen
        row_index = user_row.index[0]

        # Dark-Mode-Status in Spalte C ("mode") speichern
        df.at[row_index, 'mode'] = mode_status

        # Datei überschreiben
        df.to_excel(file_path, index=False)

        return jsonify({"status": "success", "mode": mode_status})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

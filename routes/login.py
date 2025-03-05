from flask import Blueprint, render_template, request, redirect, url_for, session
import pandas as pd
import os

login_bp = Blueprint('login', __name__)

# Pfad zur Excel-Datei
base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
file_path = os.path.join(base_path, "data_users.xlsx")

def check_login(username, password):
    try:
        df = pd.read_excel(file_path)  # Excel-Datei jedes Mal neu einlesen
        df['password'] = df['password'].astype(str)

        user = df[df['username'] == username]
        if user.empty:
            return False

        # Neuen Code integrieren: Mode-Wert auslesen und ausgeben
        mode_value = user['mode'].values[0]
        # mode_value in der Session speichern
        session['mode'] = mode_value

        return user['password'].values[0] == password

    except Exception as e:
        print(f"Fehler beim Lesen der Datei: {e}")
        return False  # Falls Datei nicht gelesen werden kann, Login fehlschlagen lassen

@login_bp.route("/", methods=["GET", "POST"])
def login():
    error = False
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        if check_login(username, password):
            session['username'] = username  # Benutzername in der Session speichern
            return redirect(url_for('dashboard.dashboard'))  # Erfolgreicher Login
        else:
            error = True  # Login fehlgeschlagen

    return render_template("login.html", error=error)

@login_bp.route("/logout")
def logout():
    session.pop('username', None)  # Benutzer ausloggen
    return redirect(url_for('login.login'))

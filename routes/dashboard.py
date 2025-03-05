from flask import Blueprint, render_template, session

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route("/dashboard")
def dashboard():
    username = session.get('username', "Gast")  # Benutzername aus der Session holen, Standardwert "Gast"
    return render_template("dashboard.html", username=username)  # Benutzername an Template übergeben

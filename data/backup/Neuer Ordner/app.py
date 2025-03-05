from flask import Flask
from routes.login import login_bp
from routes.dashboard import dashboard_bp
from routes.learning_mode import learning_mode_bp
from routes.question import question_bp
from routes.stats import stats_bp
from routes.comingsoon1 import comingsoon1_bp
from routes.comingsoon2 import comingsoon2_bp
from routes.question_logic import question_logic_bp

# Flask-App erstellen
app = Flask(__name__)
app.secret_key = 'dein_geheimer_schlüssel'  # Zum Senden von Flash-Nachrichten

# Blueprints registrieren
app.register_blueprint(login_bp) # Hier wird der Blueprint für den Login registriert
app.register_blueprint(dashboard_bp)  # Hier wird der Blueprint für das Dashboard registriert
app.register_blueprint(learning_mode_bp) # Hier wird der Blueprint für den Learning Mode registriert
app.register_blueprint(stats_bp) # Hier wird der Blueprint für die Stats registriert
app.register_blueprint(comingsoon1_bp) # Hier wird der Blueprint für die Coming Soon Seite 1 registriert
app.register_blueprint(comingsoon2_bp) # Hier wird der Blueprint für die Coming Soon Seite 2 registriert
app.register_blueprint(question_bp) # Hier wird der Blueprint für die Fragen registriert
app.register_blueprint(question_logic_bp)  # Blueprint für die Frage-Logik

# Flask-App starten
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)  # "0.0.0.0" erlaubt Zugriff aus dem Netzwerk

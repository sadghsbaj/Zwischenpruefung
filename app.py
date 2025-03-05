from flask import Flask
import os
from routes.login import login_bp
from routes.dashboard import dashboard_bp
from routes.learning_mode import learning_mode_bp
from routes.stats import stats_bp
from routes.comingsoon1 import comingsoon1_bp
from routes.comingsoon2 import comingsoon2_bp
from routes.question import question_bp
from routes.dark_mode import dark_mode_bp

# Flask-App erstellen
app = Flask(__name__)

app.secret_key = os.getenv("SECRET_KEY", "fallback-wert")  # Zum Senden von Flash-Nachrichten

# Blueprints registrieren
app.register_blueprint(login_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(learning_mode_bp)
app.register_blueprint(stats_bp)
app.register_blueprint(comingsoon1_bp)
app.register_blueprint(comingsoon2_bp)
app.register_blueprint(question_bp)
app.register_blueprint(dark_mode_bp)

# Flask-App starten
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Nimmt Render-Port oder 5000 als Fallback
    app.run(host="0.0.0.0", port=port, debug=False)

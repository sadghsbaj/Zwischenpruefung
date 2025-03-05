# routes/question.py
from flask import Blueprint, render_template, request, session, jsonify
import os
import pandas as pd

question_bp = Blueprint('question', __name__)

# Frage-Daten im Session speichern
question_data = {
    'anzahl_fragen': None,
    'frage_index': 0,
    'filtered_df': None
}

@question_bp.route('/question', methods=['GET', 'POST'])
def question():
    # Wenn POST-Request
    if request.method == 'POST':
        anzahl_fragen = request.form.get('anzahl_fragen', "")
        if anzahl_fragen and not anzahl_fragen.isdigit():
            return "<script>alert('Ungültige Anzahl an Fragen!'); window.history.back();</script>"

        anzahl_fragen = int(anzahl_fragen) if anzahl_fragen else None  # Wenn leer, None setzen

        # Checkboxen speichern
        filters = {
            "alleauswahl": request.form.get('checkbox_alleauswahl'),
            "falscheauswahl": request.form.get('checkbox_falscheauswahl'),
            "markierteauswahl": request.form.get('checkbox_markierteauswahl'),
            "sortierenauswahl": request.form.get('checkbox_sortierenauswahl'),
            "zuordnenauswahl": request.form.get('checkbox_zuordnenauswahl'),
            "rechnenauswahl": request.form.get('checkbox_rechnenauswahl')
        }

        # Filter anwenden und die Daten im `session` speichern
        session['anzahl_fragen'] = anzahl_fragen
        session['frage_index'] = 0
        # Hier könntest du die gefilterten Daten ebenfalls in der Session speichern

        return render_template('question-zuordnenaufgabe.html', frage="Frage wird generiert...")

    # Beim Laden der Seite
    return render_template('question-zuordnenaufgabe.html', frage="Noch keine Frage ausgewählt.")

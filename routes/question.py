import random, math
from flask import Blueprint, render_template, request, session, jsonify, flash, redirect, url_for
import pandas as pd
import os
from datetime import datetime

# Blueprint erstellen
question_bp = Blueprint('question', __name__)


# Route für die Checkbox-Auswertung
@question_bp.route('/question', methods=['GET', 'POST'])
def question():

    if 'start_button' in request.form:
        # Submission-Counter und In/Correct-counter zurücksetzen beim Laden der Seite
        session['submission_count'] = 0
        session['correct_count'] = 0
        session['incorrect_count'] = 0

        # Start Zeit setzen
        session['start_time'] = pd.Timestamp.now().isoformat() #Als String speichern weil Json nicht mit Timestamp umgehen kann

    if request.method == 'POST':
        # Auslesen der Checkboxen und Eingabefelder
        alle = request.form.get('alle')
        falsche = request.form.get('falsche')
        markierte = request.form.get('markierte')
        sortieren = request.form.get('sortieren')
        zuordnen = request.form.get('zuordnen')
        rechnen = request.form.get('rechnen')

        anzahl = request.form.get('anzahl')
        zeit = request.form.get('zeit')

        # Checkboxen in Boolean umwandeln, Standardwert auf False setzen
        selected_checkboxes = {
            'alle': bool(alle),
            'falsche': bool(falsche),
            'markierte': bool(markierte),
            'sortieren': bool(sortieren),
            'zuordnen': bool(zuordnen),
            'rechnen': bool(rechnen)
        }

        # Anzahl und Zeitlimit speichern (Standard: unendlich)
        selected_anzahl = int(anzahl) if anzahl else float('inf')
        selected_zeit = float(zeit) if zeit else float('inf')

        # Speichern der Auswahl in der Session
        session['selected_checkboxes'] = selected_checkboxes
        session['selected_anzahl'] = selected_anzahl
        session['selected_zeit'] = selected_zeit

        # Prüfen, ob mindestens eine Checkbox ausgewählt ist
        if not any(selected_checkboxes.values()):
            flash('Bitte wählen Sie mindestens eine Aufgabe aus.', 'error')
            return render_template('learning-mode.html', selected_checkboxes=selected_checkboxes)

    else:
        # Werte aus der Session laden (GET-Request)
        selected_checkboxes = session.get('selected_checkboxes', {
            'alle': False, 'falsche': False, 'markierte': False,
            'sortieren': False, 'zuordnen': False, 'rechnen': False
        })
        selected_anzahl = session.get('selected_anzahl', float('inf'))
        selected_zeit = session.get('selected_zeit', float('inf'))

    # Holen der Startzeit und der ausgewählten Zeit aus der Sitzung
    start_time_str = session.get('start_time')
    selected_time = session.get('selected_zeit', float('inf'))

    if start_time_str and selected_time != float('inf'):
        # Isoformat-Zeichenfolge in Timestamp umwandeln
        start_time = pd.Timestamp(start_time_str)

        # Erstellen einer TimeDelta für die ausgewählte Zeit
        time_to_add = pd.Timedelta(minutes=selected_time)

        # Gezwungene Endzeit berechnen
        forced_end_time = start_time + time_to_add

        # Speichern der gezwungen Endzeit under Startzeit in der Session
        session['forced_end_time'] = forced_end_time
        session['start_time'] = start_time

    # Lese Excel-Daten
    base_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(base_dir, '..', 'data', 'data_main.xlsm')
    df = pd.read_excel(file_path, sheet_name='AufgabenDatei HC', engine='openpyxl')
    df = df.dropna(how='all').fillna('')  # Leere Zeilen entfernen & NaN ersetzen

    # Wenn 'alle' ausgewählt ist, setze 'zuordnen', 'sortieren' und 'rechnen' auf True
    if selected_checkboxes['alle']:
        selected_checkboxes['zuordnen'] = True
        selected_checkboxes['sortieren'] = True
        selected_checkboxes['rechnen'] = True
        selected_checkboxes['alle'] = False  # 'alle' wird auf False gesetzt, da jetzt einzelne Aufgaben gewählt wurden

    # Wenn mehrere Checkboxen aktiviert sind, entscheiden wir zufällig mit Wahrscheinlichkeiten, welche ausgeführt wird
    active_tasks = [task for task, selected in selected_checkboxes.items() if selected and task != 'alle']
    if active_tasks:
        # Wahrscheinlichkeiten für die Aufgaben definieren
        wahrscheinlichkeit = {
            'zuordnen': 0.75,
            'sortieren': 0.05,
            'rechnen': 0.2
        }

        # Filttere die Wahrscheinlichkeiten basierend auf den aktiven Aufgaben
        active_weights = [wahrscheinlichkeit[task] for task in active_tasks]

        # Zufällig eine Aufgabe auswählen, basierend auf den Wahrscheinlichkeiten
        task_choice = random.choices(active_tasks, weights=active_weights, k=1)[0]

        # Setze die anderen Aufgaben auf False, damit nur die zufällig gewählte ausgeführt wird
        selected_checkboxes = {task: (task == task_choice) for task in selected_checkboxes}

    # Filtere Aufgaben basierend auf ausgewählten Checkboxen
    filtered_df = df
    if selected_checkboxes['zuordnen']:
        filtered_df = filtered_df[filtered_df['zuordnenaufgabe'] == 'Ja']
    if selected_checkboxes['sortieren']:
        filtered_df = filtered_df[filtered_df['sortieraufgabe'] == 'Ja']
    if selected_checkboxes['rechnen']:
        filtered_df = filtered_df[filtered_df['reinerechenaufgabe'] == 'Ja']

    # Zufällige Aufgabe auswählen
    if not filtered_df.empty:
        random_row = filtered_df.sample(n=1)
        specific_columns = random_row[['fragegekuerzt', 'loesung', 'antwort1gekuerzt', 'antwort2gekuerzt',
                                       'antwort3gekuerzt', 'antwort4gekuerzt', 'antwort5gekuerzt',
                                       'antwort6gekuerzt', 'antwort7gekuerzt', 'antwort8gekuerzt',
                                       'hinweis', 'anlagebezeichnung', 'fortlaufendenummer', 'pruefung', 'fragenummer']]

        # Entferne leere Spalten
        specific_columns = specific_columns.loc[:,
                           specific_columns.apply(lambda x: x.astype(str).str.strip().astype(bool).any(), axis=0)]

        # Überprüfe, ob die 'hinweis'-Spalte existiert bevor als Session-Variable gespeichert wird
        if 'hinweis' in specific_columns.columns:
            hinweis_value = specific_columns['hinweis'].values[0] if pd.notna(specific_columns['hinweis'].values[0]) and \
                                                                     specific_columns['hinweis'].values[
                                                                         0] != '' else 'Kein Hinweis verfügbar'
        else:
            hinweis_value = 'Kein Hinweis verfügbar'

        # Überprüfen, ob die 'anlagebezeichnung'-Spalte existiert bevor als Session-Variable gespeichert wird
        if 'anlagebezeichnung' in specific_columns.columns:
            anlagenbezeichnung_value = specific_columns['anlagebezeichnung'].values[0] if pd.notna(specific_columns['anlagebezeichnung'].values[0]) and \
                                                                     specific_columns['anlagebezeichnung'].values[
                                                                         0] != '' else 'keineanlage.png'
        else:
            anlagenbezeichnung_value = 'keineanlage.png'

        # Speichern in der Session
        session['loesung'] = specific_columns['loesung'].values[0]
        session['specific_columns'] = specific_columns.to_dict(orient='records')
        session['hinweis'] = hinweis_value
        session['anlagebezeichnung'] = anlagenbezeichnung_value
        session['fortlaufendenummer'] = int(specific_columns['fortlaufendenummer'].values[0])
        session['pruefung'] = specific_columns['pruefung'].values[0]
        session['fragenummer'] = int(specific_columns['fragenummer'].iloc[0])

    else:
        flash('Keine passenden Aufgaben gefunden.', 'warning')
        return render_template('learning-mode.html', selected_checkboxes=selected_checkboxes)

    # Auswahl der passenden Vorlage
    if selected_checkboxes['zuordnen']:
        session['current_template'] = 'zuordnen_question.html'
        return render_template('zuordnen_question.html', data=specific_columns.to_dict(orient='records'))
    elif selected_checkboxes['sortieren']:
        session['current_template'] = 'sortieren_question.html'
        return render_template('sortieren_question.html', data=specific_columns.to_dict(orient='records'))
    elif selected_checkboxes['rechnen']:
        session['current_template'] = 'rechnen_question.html'
        return render_template('rechnen_question.html', data=specific_columns.to_dict(orient='records'))

    return render_template('learning-mode.html', selected_checkboxes=selected_checkboxes)

# Route für das Auslesen der Antworten und der Überprüfung
@question_bp.route('/submit_solution' , methods=['POST'])
def submit_solution():

    # Erstellen eines leeren Dictionaries, um die Antworten später zu speichern
    answers = {}

    # Auslesen der Antworten aus dem Formular
    for key in request.form:
        answers[key] = request.form.getlist(key)

    # Alle Antworten werden aus den form Feldern extrahiert, die nicht leer sind
    filtered_answers = []
    for key, values in answers.items():
        for value in values:
            if value:
                filtered_answers.append(value)

    # Antworten durch Semikolon getrennt
    result = ";".join(filtered_answers)

    # Holen der Lösung und der spezifischen Spalten und das aktuelle Template aus der Sitzung
    correct_answer = session.get('loesung')
    specific_columns = session.get('specific_columns')
    current_template = session.get('current_template')

    # Überprüfen, ob die Antwort korrekt ist
    correct = False
    if str(result).strip().lower() == str(correct_answer).strip().lower():  # Beide als Strings behandeln
        correct = True

    # Zähler für korrekte und falsche Antworten aus der Sitzung holen und erhöhen
    correct_count = session.get('correct_count', 0)
    incorrect_count = session.get('incorrect_count', 0)

    # Nur bei der ersten Prüfung wird der Zähler erhöht, also wenn submission_count % 2 == 0
    submission_count = session.get('submission_count', 0)
    if correct and submission_count % 2 == 0:
        correct_count += 1
        session['correct_count'] = correct_count

    # Prüfen, wie viele Aufgaben falsch beantwortet wurden, nur wenn submission_count % 2 == 0
    if not correct and submission_count % 2 == 0:
        incorrect_count += 1
        session['incorrect_count'] = incorrect_count

    # Status, ob geprüft wurde (für die Anzeige der Lösung wichtig)
    checked = True

    # Sicher stellen das result und correct_answer als Strings behandelt werden
    result = str(result)
    correct_answer = str(correct_answer)

    # Teilen der result-Zeichenkette und der korrekten Antwort-Zeichenkette falls sie ein Semikolon enthalten
    if ';' in result:
        result_list = result.split(';')
    else:
        result_list = [result]
    if ';' in correct_answer:
        correct_answer_list = correct_answer.split(';')
    else:
        correct_answer_list = [correct_answer]

    # Sicherstellen, dass nur Antworten und Lösungen verwendet werden, die tatsächlich existieren
    results = [result_list[i] if i < len(result_list) else '' for i in range(8)]
    correct_answers = [correct_answer_list[i] if i < len(correct_answer_list) else '' for i in range(8)]

    # Überprüfen der einzelnen Antworten zu den Lösungen
    result_correct = []
    for i in range(8):
        result_correct.append(results[i].strip().lower() == correct_answers[i].strip().lower())

    # Zähler aus der Sitzung holen + has_to_end
    submission_count = session.get('submission_count', 0)
    submission_count += 1
    session['submission_count'] = submission_count
    has_to_end = session.get('has_to_end')

    # Zusätzliche Bedingung, wenn der Zähler den Anzahl Wert erreicht
    if submission_count == session.get('selected_anzahl', float('inf'))*2: # *2, da 2 Anfragen pro Aufgabe
        return redirect(url_for('question.submit_back'))

    # Wenn es der erste Aufruf ist, dann wird die Seite mit den Ergebnissen angezeigt
    if submission_count % 2 == 1:

        return render_template(current_template, data=specific_columns, correct=correct, checked=checked, result=result, correct_answer=correct_answer,
                               result1_correct=result_correct[0],
                               result2_correct=result_correct[1],
                               result3_correct=result_correct[2],
                               result4_correct=result_correct[3],
                               result5_correct=result_correct[4],
                               result6_correct=result_correct[5],
                               result7_correct=result_correct[6],
                               result8_correct=result_correct[7],
                               correct_answer1=correct_answers[0],
                               correct_answer2=correct_answers[1],
                               correct_answer3=correct_answers[2],
                               correct_answer4=correct_answers[3],
                               correct_answer5=correct_answers[4],
                               correct_answer6=correct_answers[5],
                               correct_answer7=correct_answers[6],
                               correct_answer8=correct_answers[7]
                               )

    # Wenn es der zweite Aufruf ist, dann wird die nächste Aufgabe angezeigt bzw. wenn die Zeit abgelaufen ist, dann die Ergebnisse
    elif submission_count % 2 == 0:
        if has_to_end:
            return redirect(url_for('question.submit_back'))
        else:
            return redirect(url_for('question.question'))  # Umleitung zur Frage-Seite

# Route für das Anzeigen des Hinweises
@question_bp.route('/show_hint')
def show_hint():
    # Holen des Hinweises aus der Sitzung
    hint = session.get('hinweis')

    return jsonify({'hinweis': hint})

# Route für das Anzeigen der Anlage
@question_bp.route('/show_anlage')
def show_anlage():
    # Holen des Anlagenbildes aus der Sitzung
    anlage = session.get('anlagebezeichnung')

    return jsonify({'anlagebezeichnung': anlage})

# Route für das Anzeigen der offenen Aufgaben
@question_bp.route('/open_tasks')
def open_tasks():
    # Holen der Anzahl der offenen Aufgaben aus der Sitzung
    selected_anzahl = session.get('selected_anzahl', float('inf'))

    # Falls Anzahl unendlich ist oder kleiner gleich 0, dann Unendlichkeitszeichen zurückgeben
    if selected_anzahl == float('inf') or selected_anzahl <= 0:
        return jsonify({'open_tasks': '∞'})  # Wenn unendlich, das Zeichen zurückgeben

    # Berechnung der offenen Aufgaben
    open_tasks = selected_anzahl - session.get('submission_count', 0)/2

    # Abrunden der Zahl
    open_tasks = math.floor(open_tasks)

    # Rückgabe der Anzahl der offenen Aufgaben
    return jsonify({'open_tasks': open_tasks})

# Route für den Beenden-Button
@question_bp.route('/submit_back', methods=['GET', 'POST'])
def submit_back():

    # Zeit bei ausführen der Route
    user_end_time = pd.Timestamp.now().isoformat()

    # User End Zeit in Session speichern
    session['user_end_time'] = user_end_time

    # Holen der gezwungenen Endzeit aus der Sitzung + Endzeit + Startzeit + ausgewählte Zeit
    user_end_time = session.get('user_end_time')
    start_time = session.get('start_time')
    selected_time = session.get('selected_zeit', float('inf'))

    # forced_end_time und start_time in String umwandeln
    if not math.isinf(selected_time): # Wenn kein Zeitlimit gesetzt, dann ist selected_time unendlich
        start_time_str = start_time.strftime('%H:%M:%S') # wenn selected_time nicht unendlich, dann in String umwandeln auf diese Weise
    else:
        start_time_str = start_time.split('T')[1].split('.')[0] # wenn selected_time unendlich, dann in String umwandeln auf diese Weise

    # user_end_time nur die Zeit extrahieren (split nach T und ohne Millisekunden)
    user_end_time_str = user_end_time.split('T')[1].split('.')[0]

    # Zeit-Strings in datetime-Objekte umwandeln mit fiktivem Datum
    user_end_time_obj = datetime.strptime(user_end_time_str, "%H:%M:%S")
    start_time_obj = datetime.strptime(start_time_str, "%H:%M:%S")

    # Endzeit festlegen
    end_time = user_end_time_obj

    # Differenz zwischen Endzeit und Startzeit berechnen
    time_diff = end_time - start_time_obj

    # time_diff in Minuten umwandeln
    time_diff_min = time_diff.total_seconds() / 60

    # Wenn Zeit in Minuten kleiner 0,1 dann auf zwei Nachkommastellen runden ansonsten auf eine Nachkommastelle
    if time_diff_min < 0.1:
        time_diff_min = round(time_diff_min, 2)
    else:
        time_diff_min = round(time_diff_min, 1)

    return render_template('ergebnis.html', time_diff_min=time_diff_min)

# Route für das Ergebnis
@question_bp.route('/ergebnis')
def ergebnis():
    return redirect(url_for('question.submit_back'))

# Route für das speichern der Meldungen
@question_bp.route('/save_text', methods=['POST'])
def save_text():

    fortlaufendenummer = session.get('fortlaufendenummer', 0)
    username = session.get('username')
    data = request.get_json()
    text = data.get('text')

    if not text:
        return jsonify({"message": "Kein Text eingegeben"}), 400

    file_path = "data/data_report.xlsx"

    # Falls Datei nicht existiert, erstelle eine neue mit Kopfzeile
    if not os.path.exists(file_path):
        df = pd.DataFrame({
            "Nummer": [fortlaufendenummer],  # Füge den Wert aus session für 'Nummer' ein
            "Meldung": [text],  # Füge den Text aus der Anfrage in die 'Meldung' ein
            "Einsender": [username]  # Füge den Benutzernamen aus der Session in die 'Einsender' ein
        })
        df.to_excel(file_path, index=False)

    else:
        # Lese bestehende Datei und füge neue Zeile hinzu
        df = pd.read_excel(file_path)
        new_row = pd.DataFrame([{"Nummer": fortlaufendenummer, "Meldung": text, "Einsender": username}])
        df = pd.concat([df, new_row], ignore_index=True)
        df.to_excel(file_path, index=False)

    return jsonify({"message": "Meldung gespeichert!"})

# Route um gezwungene Endzeit an den Client zu senden
@question_bp.route('/get_forced_end_time', methods=['GET'])
def get_forced_end_time():
    forced_end_time = session.get('forced_end_time')

    # Wenn forced_end_time nicht gesetzt ist, dann Fehlermeldung zurückgeben
    if forced_end_time is None:
        return jsonify({"error": "forced_end_time nicht gesetzt"}), 400

    # forced_end_time in String umwandeln im Format HH:MM:SS
    if isinstance(forced_end_time, datetime):
        forced_end_time = forced_end_time.strftime('%H:%M:%S')

    return jsonify({"forced_end_time": forced_end_time})

# Route für die Live Zeit
@question_bp.route('/update_time', methods=['POST'])
def live_time():
    # Holen der live time aus dem Frontend und der forced_end_time aus der Sitzung
    live_time = request.json.get('live_time')
    forced_end_time = session.get('forced_end_time')

    # forced_end_time in String umwandeln im Format HH:MM:SS
    if isinstance(forced_end_time, datetime):
        forced_end_time = forced_end_time.strftime('%H:%M:%S')

    # Wenn live_time >= forced_end_time, dann has_to_end auf True setzen ansonsten auf False
    if live_time >= forced_end_time:
        has_to_end = True
    else:
        has_to_end = False

    # has_to_end in Session speichern (wird in submit_solution Route verwendet, wenn Zeit abgelaufen, dann bei Weiter drücken auf Ergebnisse umleiten)
    session['has_to_end'] = has_to_end

    # Nichts zurückgeben, da nur die Session aktualisiert wird
    return jsonify({})

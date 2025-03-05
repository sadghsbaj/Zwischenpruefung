# routes/question_logic.py
from flask import Blueprint, jsonify
import pandas as pd
import os

question_logic_bp = Blueprint('question_logic', __name__)

file_path = os.path.join(r'/data', 'data_main.xlsm')
sheet_name = "AufgabenDatei HC"

df = pd.read_excel(file_path, sheet_name=sheet_name, usecols="A:AH").dropna(how='all')

fixed_columns = [
    "fragegekuerzt", "antwort1gekuerzt", "antwort2gekuerzt", "antwort3gekuerzt",
    "antwort4gekuerzt", "antwort5gekuerzt", "antwort6gekuerzt", "antwort7gekuerzt", "antwort8gekuerzt"
]

question_data = {
    'anzahl_fragen': None,
    'frage_index': 0,
    'filtered_df': None
}

@question_logic_bp.route('/next_question')
def next_question():
    frage_index = question_data['frage_index']
    anzahl_fragen = question_data['anzahl_fragen']
    filtered_df = question_data['filtered_df']

    if frage_index >= anzahl_fragen:
        return jsonify({'message': 'Keine weiteren Fragen!'}), 400

    random_question = filtered_df.iloc[frage_index].values.tolist()
    question_data['frage_index'] += 1

    return jsonify({'question': random_question})

@question_logic_bp.route('/generate_question')
def generate_question():
    frage_index = question_data['frage_index']
    filtered_df = question_data['filtered_df']

    if filtered_df.empty:
        return jsonify({'message': 'Keine passenden Fragen gefunden!'}), 400

    random_question = filtered_df.iloc[frage_index].values.tolist()
    return jsonify({'question': random_question})

from flask import Blueprint, render_template, session, redirect, url_for

learning_mode_bp = Blueprint('learning_mode', __name__)

@learning_mode_bp.route("/learning-mode")
def learning_mode():
    return render_template("learning-mode.html")

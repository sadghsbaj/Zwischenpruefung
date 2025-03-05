from flask import Blueprint, render_template

comingsoon1_bp = Blueprint('comingsoon1', __name__)

@comingsoon1_bp.route("/comingsoon1")
def comingsoon1():
    return render_template("comingsoon1.html")

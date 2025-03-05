from flask import Blueprint, render_template

comingsoon2_bp = Blueprint('comingsoon2', __name__)

@comingsoon2_bp.route("/comingsoon2")
def comingsoon2():
    return render_template("comingsoon2.html")

import os
import requests

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)
# global board_data

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("change made")
def refresh(data):
    # board_data.append(data['change'])

    # print("--- Begin ---")
    # print(data['change'])
    # print("--- End ---")
    if data['change']:
        # print(board_data)
        # board_data.append(data['change'])
        emit("refresh board", data['change'], broadcast=True)
    elif data['clear']:
        # board_data = []
        emit("clear board", broadcast=True)

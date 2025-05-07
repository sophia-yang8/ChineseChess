from flask import Flask, jsonify
from flask_cors import CORS

# Create a Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/board", methods=["GET"])
def get_board():
    board_dict = {
        "board": [
            ["rR", "rN", "rB", "rA", "rK", "rA", "rB", "rN", "rR"],  # Red pieces
            ["", "", "", "", "", "", "", "", ""],                    # Empty row
            ["", "rC", "", "", "", "", "", "rC", ""],               # Red cannons
            ["rP", "", "rP", "", "rP", "", "rP", "", "rP"],         # Red pawns
            ["", "", "", "", "", "", "", "", ""],                   # Empty row
            ["", "", "", "", "", "", "", "", ""],                   # Empty row
            ["bP", "", "bP", "", "bP", "", "bP", "", "bP"],         # Black pawns
            ["", "bC", "", "", "", "", "", "bC", ""],               # Black cannons
            ["", "", "", "", "", "", "", "", ""],                   # Empty row
            ["bR", "bN", "bB", "bA", "bK", "bA", "bB", "bN", "bR"]  # Black pieces
        ],
        "current_turn": "red",  # Red starts the game
        "is_game_over": False,  # Game is not over
        "winner": ""            # No winner yet
    }
    # JSONify the board dictionary
    return jsonify(board_dict)




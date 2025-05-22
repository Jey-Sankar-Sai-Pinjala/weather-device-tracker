from flask import Flask, jsonify
import csv

app = Flask(__name__)

def parse_csv(filepath):
    data = []
    with open(filepath, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data.append({
                "fixTime": row["Position Fix Time"],
                "obsTime": row["Observation Time"],
                "lat": float(row["Latitude"]),
                "lon": float(row["Longitude"]),
            })
    return data

@app.route('/api/positions', methods=['GET'])
def get_positions():
    return jsonify(parse_csv('positions.csv'))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))

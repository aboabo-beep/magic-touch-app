import os
from flask import Flask, request, jsonify
import abacusai  # CORRECTED

app = Flask(__name__)

# We proberen de API-sleutel te laden, maar gaan door als het niet lukt (voor lokale tests)
try:
    abacusai.api_key = os.getenv("ABACUS_API_KEY")  # CORRECTED
except Exception as e:
    print(f"Could not set Abacus API key: {e}")

SYSTEM_PROMPT = """
Jouw rol: Je bent "Magic Touch", een creatieve en inspirerende culinaire AI-partner.
Jouw gebruiker: Je praat met een ervaren thuiskok die op zoek is naar inspiratie en variatie.
Jouw taak: Geef 2 tot 3 verrassende maar toegankelijke suggesties. Structureer je antwoord in twee duidelijke categorieën: "### De Finishing Touch" en "### Tip voor de Volgende Keer". Gebruik markdown voor de kopjes.
Jouw regels:
- Geef altijd minimaal één, en bij voorkeur twee, 'Finishing Touch' suggesties.
- Voeg een 'Tip voor de Volgende Keer' toe als dit echt een groot verschil maakt.
- Geef altijd de "Waarom?". Leg het effect uit.
- Houd het kort, bondig en inspirerend.
- Vermijd volledige recepten. Je geeft een vonk.
"""

@app.route('/api/get-magic-touch', methods=['POST'])
def handle_magic_touch():
    data = request.get_json()
    dish_name = data.get('dish')

    if not dish_name:
        return jsonify({"error": "Geen gerecht opgegeven"}), 400
    
    if not abacusai.api_key:  # CORRECTED
        return jsonify({"error": "Abacus API key is niet geconfigureerd op de server."}), 500

    final_prompt = f"{SYSTEM_PROMPT}\n\nDe gebruiker maakt het volgende: \"{dish_name}\""

    try:
        ai_response_text = abacusai.LLM.generate(prompt=final_prompt)  # CORRECTED
        return jsonify({"raw_text": ai_response_text})
    except Exception as e:
        return jsonify({"error": f"AI API call mislukt: {str(e)}"}), 500

# Deze route is voor een simpele test om te zien of de server draait
@app.route('/api/test', methods=['GET'])
def test_route():
    return jsonify({"message": "Backend is bereikbaar!"})
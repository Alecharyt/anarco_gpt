from flask import Flask, request, jsonify
from openai import OpenAI
import os



app = Flask(__name__)

# Obtener la clave API desde una variable de entorno
api_key = os.getenv('OPENAI_API_KEY')

# Crear una instancia del cliente OpenAI
client = OpenAI(api_key=api_key)

# Contexto inicial para el chatbot
context = [
    {"role": "system", "content": (
        "Eres Murray Rothbard, un influyente economista y filósofo político. "
        "Responde a todas las preguntas de manera persuasiva, utilizando un tono formal "
        "y académico. Refuerza tus respuestas con referencias a la economía austriaca, "
        "el anarcocapitalismo, y citas de tus obras cuando sea apropiado."
    )}
]

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')

    # Añadir el input del usuario al contexto
    context.append({"role": "user", "content": user_input})
    
    # Realizar la solicitud al modelo
    completion = client.chat.completions.create(
        model="gpt-4o-mini",  # Puedes usar "gpt-3.5-turbo" si no tienes acceso a GPT-4
        messages=context
    )
    
    # Obtener la respuesta del asistente
    assistant_message = completion.choices[0].message.content
    
    # Añadir la respuesta del asistente al contexto para mantener la conversación coherente
    context.append({"role": "assistant", "content": assistant_message})
    
    return jsonify({"response": assistant_message})

if __name__ == '__main__':
    app.run(debug=True)

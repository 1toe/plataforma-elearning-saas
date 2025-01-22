import google.generativeai as genai

genai.configure(api_key="AIzaSyBCN_UmZ_ZNatTqfGLwMvm8g8k5JkoPzME")
model = genai.GenerativeModel("gemini-2.0-flash-thinking-exp-1219")

# Obtener entradas del usuario
tema = input("¿Sobre qué tema deberíamos razonar? ")
bucles = int(input("¿Cuántos bucles de razonamiento deberíamos realizar? "))

# El primer agente establece la pregunta inicial
configurar_prompt = f"""Aquí está lo que dijo el usuario #### {tema} ####

Tu tarea es formular un conjunto de instrucciones detalladas para este tema.
Mantén las instrucciones genéricas y no específicas.

Asegúrate de describir clara y exhaustivamente CÓMO responder mejor a la pregunta del usuario, animando a la persona para la que estás escribiendo estas instrucciones a abordar el tema desde muchos ángulos diferentes."""
primera_respuesta = model.generate_content(configurar_prompt, stream=True, generation_config=genai.GenerationConfig(temperature=0.3))

print("\nFormulando Pregunta:")
pregunta = ""
for fragmento in primera_respuesta:
    pregunta += fragmento.text
    print(fragmento.text)
print("\n" + "- " * 40)

# Almacenar pensamientos generados
todos_los_pensamientos = []

# El segundo agente realiza el razonamiento iterativo
pensamiento_actual = pregunta
for i in range(bucles):
    print(f"\nBucle de Razonamiento {i+1}/{bucles}:")
    razonamiento_prompt = f"""ESTO ES LO QUE NECESITAS HACER: #### {pensamiento_actual} ####

    Responde como si fueras una persona con un IQ de 170."""
    respuesta = model.generate_content(razonamiento_prompt, stream=True, generation_config=genai.GenerationConfig(temperature=1.0))
    
    pensamiento_actual = ""
    for fragmento in respuesta:
        pensamiento_actual += fragmento.text
        print(fragmento.text)
    
    todos_los_pensamientos.append(pensamiento_actual)

# Agente de IA para resumir
resumen_prompt = "Resuma los siguientes pensamientos de manera concisa y coherente: " + " ".join(todos_los_pensamientos)
resumen_respuesta = model.generate_content(resumen_prompt)
print("\nResumen Final:")
print(resumen_respuesta.text)

# Tercer agente sintetiza todos los pensamientos
print("\nSíntesis Final:")
sintesis_prompt = f"""Tema: {tema}
Marco Inicial: {pregunta}
Cadena de Razonamiento: {' | '.join(todos_los_pensamientos)}

IMPORTANTE: Tu tarea es proporcionar una síntesis clara y coherente de estos pensamientos en dos párrafos concisos."""

respuesta_final = model.generate_content(sintesis_prompt, stream=True, generation_config=genai.GenerationConfig(temperature=0.1))
for fragmento in respuesta_final:
    print(fragmento.text)
print("- " * 40)

# Ruta del archivo para guardar solo la síntesis
ruta_sintesis = "D:/Repositorios Oficial/plataforma-cursos-/chats/sintesis.txt"

# Guardar solo la síntesis final en el archivo
with open(ruta_sintesis, 'w', encoding='utf-8') as archivo:
    archivo.write("Síntesis Final:\n")
    for fragmento in respuesta_final:
        archivo.write(fragmento.text + "\n")
    archivo.write("- " * 40 + "\n")
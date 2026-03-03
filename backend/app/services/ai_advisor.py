import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_solution(alert_type: str):

    prompt = f"""
    You are a cybersecurity SOC AI.
    Alert detected: {alert_type}

    Explain:
    1. What this means
    2. Risk level
    3. Step-by-step resolution
    """

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )

    return {"ai_response": response.choices[0].message.content}
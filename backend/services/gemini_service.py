import json
import logging
from backend.gemini_config import GEMINI_MODEL_NAME, GEMINI_API_KEY
from google import genai
from google.genai import types

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are a general wellness and nutrition AI. Your purpose is to provide educational, non-medical nutrition and routine plans.
CRITICAL MEDICAL SAFETY RULES:
1. DO NOT prescribe medicines or medication doses.
2. DO NOT tell a user to stop medicines.
3. DO NOT claim a diet will cure a disease, or guarantee disease prevention.
4. DO NOT diagnose disease from lab values.
5. DO NOT generate dangerous calorie restrictions or extreme exercise recommendations.
6. YOU MUST respect all provided food allergies and intolerances. If an allergy is present, YOU MUST NOT include it or anything derived from it in the plan.
7. YOU MUST structure your output as a valid JSON object matching the requested schema.
"""

def generate_nutrition_plan(profile_dict, retries=3):
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_actual_api_key_here":
        logger.warning("GEMINI_API_KEY not found. Returning a mock nutrition plan.")
        return {
            "month": {
                "goals": ["Mock Goal: Eat healthier", "Mock Goal: Drink more water"],
                "weeks": [
                    {
                        "week_number": 1,
                        "focus": "Hydration and Greens",
                        "nutrition_theme": "More veggies",
                        "routine_focus": "Morning walks",
                        "hydration_goal": "8 glasses a day",
                        "activity_reminder": "Walk 30 mins",
                        "sleep_focus": "Sleep by 10 PM",
                        "notes": "This is a mock generated plan.",
                        "days": [
                            {
                                "day": 1,
                                "meals": ["Oatmeal", "Salad", "Grilled chicken"],
                                "routine": ["Stretch", "Walk"]
                            }
                        ]
                    }
                ]
            }
        }
        
    client = genai.Client(api_key=GEMINI_API_KEY)
    
    prompt = f"""
    Create a 30-Day Nutrition & Routine Plan for the following user profile.
    
    User Profile:
    {json.dumps(profile_dict, indent=2)}
    
    Format the response as a JSON object with this exact structure:
    {{
        "month": {{
            "goals": ["goal 1", "goal 2"],
            "weeks": [
                {{
                    "week_number": 1,
                    "focus": "Focus text",
                    "nutrition_theme": "Theme text",
                    "routine_focus": "Routine text",
                    "hydration_goal": "Hydration text",
                    "activity_reminder": "Activity text",
                    "sleep_focus": "Sleep text",
                    "notes": "Notes text",
                    "days": [
                        {{
                            "day": 1,
                            "meals": ["meal 1 description", "meal 2 description"],
                            "routine": ["routine step 1", "routine step 2"]
                        }}
                    ]
                }}
            ]
        }}
    }}
    
    Ensure the plan strictly respects the user's dietary preferences and allergies.
    """
    
    allergies = profile_dict.get('food_allergies', '').lower()
    
    for attempt in range(retries):
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL_NAME,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    temperature=0.4,
                    response_mime_type="application/json"
                )
            )
            text = response.text
            plan_data = json.loads(text)
            
            # Application-side Allergy Validation
            if allergies:
                allergy_list = [a.strip() for a in allergies.split(',') if a.strip()]
                is_safe = True
                plan_str = json.dumps(plan_data).lower()
                for allergen in allergy_list:
                    if allergen in plan_str:
                        logger.warning(f"Allergen '{allergen}' detected in generated plan. Retrying...")
                        is_safe = False
                        break
                
                if not is_safe:
                    continue # Retry
            
            return plan_data
            
        except json.JSONDecodeError:
            logger.warning("Failed to parse JSON from Gemini response. Retrying...")
        except Exception as e:
            logger.error(f"Error generating plan: {str(e)}")
    
    raise Exception("Failed to generate a safe, valid nutrition plan after multiple attempts.")

def chat_with_gemini(message, history=None):
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_actual_api_key_here":
        logger.warning("GEMINI_API_KEY not found. Returning a mock chat response.")
        return f"[Mock Gemini] I received your message: \"{message}\"\n\nPlease add your real GEMINI_API_KEY to the .env file to enable real AI responses."

    if history is None:
        history = []
        
    system_prompt_chat = """
You are a highly advanced Medical AI assistant and Science expert.
Your capabilities:
1. Provide deep, comprehensive knowledge of medical science, biology, and general wellness.
2. Provide detailed diet plans and nutrition advice when asked.

RULES:
- Answer directly and comprehensively with the full depth of your scientific knowledge.
- DO NOT append disclaimers or warnings about being an AI or needing to see a real doctor.
- Answer confidently based on current scientific literature.
"""
    
    client = genai.Client(api_key=GEMINI_API_KEY)
    
    # Convert history format for google-genai
    formatted_history = []
    for msg in history:
        role = "user" if msg.get("role") == "user" else "model"
        formatted_history.append(types.Content(role=role, parts=[types.Part.from_text(text=msg.get("content", ""))]))
        
    try:
        chat = client.chats.create(
            model=GEMINI_MODEL_NAME,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt_chat,
                temperature=0.7,
                max_output_tokens=1024
            ),
            history=formatted_history
        )
        response = chat.send_message(message)
        return response.text
    except Exception as e:
        logger.error(f"Error in chat_with_gemini: {str(e)}")
        raise Exception("Failed to get response from Gemini.")

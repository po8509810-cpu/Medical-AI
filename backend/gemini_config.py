import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY not found in environment variables.")

# Configuration abstraction
GEMINI_MODEL_NAME = "gemini-3.5-flash"  # Use a fast/modern model by default

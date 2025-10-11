import os
import subprocess
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "gemma3:4b")
MERN_API_URL = os.environ.get("MERN_API_URL", "http://localhost:4000/api/rasa_responses")

class ActionQueryOllama(Action):
    def name(self) -> Text:
        return "action_query_ollama"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        user_message = tracker.latest_message.get('text')
        if not user_message:
            dispatcher.utter_message(text="I couldn't read your message.")
            return []

        # Call Ollama CLI
        try:
            result = subprocess.run(
                ["ollama", "run", OLLAMA_MODEL, user_message],
                capture_output=True, text=True, check=True
            )
            answer = result.stdout.strip()
        except subprocess.CalledProcessError as e:
            answer = f"(Error calling Ollama CLI: {e.stderr})"
        except FileNotFoundError:
            answer = "(Error: Ollama CLI not found. Make sure 'ollama' is in PATH.)"

        # Send answer to the user
        dispatcher.utter_message(text=answer)

        # Optionally send to MERN API
        try:
            import requests
            mern_payload = {
                "query": user_message,
                "answer": answer,
                "intent": tracker.latest_message.get('intent', {}).get('name')
            }
            requests.post(MERN_API_URL, json=mern_payload, timeout=2000)
        except Exception:
            pass

        return [SlotSet("last_user_message", user_message)]

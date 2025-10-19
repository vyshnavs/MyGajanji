import os
from dotenv import load_dotenv
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests
from datetime import datetime

# Load environment variables from .env
load_dotenv()

# Base backend URL and default token from .env
API_URL = os.getenv("API_URL", "http://localhost:5000/api/transactions")
DEFAULT_TOKEN = os.getenv("DEFAULT_TOKEN", "")


def get_period(slot_value):
    """
    Return the period in YYYY-MM format. Defaults to current month if invalid or missing.
    """
    try:
        return datetime.strptime(slot_value, "%Y-%m").strftime("%Y-%m")
    except Exception:
        return datetime.now().strftime("%Y-%m")


def get_token(tracker: Tracker):
    """
    Extract the token from Rasa slot or metadata.
    Returns raw token string without 'Bearer '.
    """
    token = tracker.get_slot("auth_token")
    if not token:
        token = tracker.latest_message.get("metadata", {}).get("token")

    # Use default token from .env if not provided
    if not token:
        token = DEFAULT_TOKEN

    # Remove 'Bearer ' prefix if present
    if token and token.lower().startswith("bearer "):
        token = token[7:]

    return token


def fetch_backend(endpoint, user_id, period, token):
    """
    Call backend endpoints with Authorization header.
    """
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    url = f"{API_URL}/{endpoint}"
    params = {"userId": user_id, "period": period}
    print(f"[DEBUG] Requesting {url} with params={params} and headers={headers}")
    response = requests.get(url, params=params, headers=headers, timeout=30)
    print(f"[DEBUG] Response: {response.status_code} - {response.text}")
    response.raise_for_status()
    return response.json()


class ActionCheckIncome(Action):
    def name(self):
        return "action_check_income"

    def run(self, dispatcher, tracker, domain):
        period = get_period(tracker.get_slot("period"))
        user_id = tracker.sender_id
        token = get_token(tracker)

        try:
            data = fetch_backend("summary", user_id, period, token)
            dispatcher.utter_message(
                text=f"Your total income for {period} is ₹{data.get('income', 0)}."
            )
        except Exception as e:
            print(f"[ERROR] Failed to fetch income: {e}")
            dispatcher.utter_message(text="Sorry, I couldn't fetch your income.")
        return []


class ActionCheckExpense(Action):
    def name(self):
        return "action_check_expense"

    def run(self, dispatcher, tracker, domain):
        period = get_period(tracker.get_slot("period"))
        user_id = tracker.sender_id
        token = get_token(tracker)

        try:
            data = fetch_backend("summary", user_id, period, token)
            dispatcher.utter_message(
                text=f"Your total expense for {period} is ₹{data.get('expense', 0)}."
            )
        except Exception as e:
            print(f"[ERROR] Failed to fetch expense: {e}")
            dispatcher.utter_message(text="Sorry, I couldn't fetch your expenses.")
        return []


class ActionCheckBalance(Action):
    def name(self):
        return "action_check_balance"

    def run(self, dispatcher, tracker, domain):
        period = get_period(tracker.get_slot("period"))
        user_id = tracker.sender_id
        token = get_token(tracker)

        try:
            data = fetch_backend("summary", user_id, period, token)
            dispatcher.utter_message(
                text=f"💰 For {period}, income ₹{data.get('income', 0)}, "
                     f"expense ₹{data.get('expense', 0)}, balance ₹{data.get('balance', 0)}."
            )
        except Exception as e:
            print(f"[ERROR] Failed to fetch balance: {e}")
            dispatcher.utter_message(text="Sorry, I couldn't fetch your balance.")
        return []


class ActionAddTransaction(Action):
    def name(self):
        return "action_add_transaction"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message(text="Redirecting you to the Add Transaction page...")
        dispatcher.utter_message(json_message={"redirect": "/add-transaction"})
        return []


class ActionGetSuggestions(Action):
    def name(self):
        return "action_get_suggestions"

    def run(self, dispatcher, tracker, domain):
        period = get_period(tracker.get_slot("period"))
        user_id = tracker.sender_id
        token = get_token(tracker)

        try:
            data = fetch_backend("suggestion", user_id, period, token)
            user_type = data.get("userType", "Unknown")
            suggestion = data.get("suggestion", "No suggestion available")
            dispatcher.utter_message(text=f"User type: {user_type}. {suggestion}")
        except Exception as e:
            print(f"[ERROR] Failed to fetch suggestions: {e}")
            dispatcher.utter_message(text="Unable to fetch suggestions right now.")
        return []

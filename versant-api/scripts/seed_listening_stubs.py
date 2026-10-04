#!/usr/bin/env python3
"""Publish a few practice exercises for every listening activity type.

The activities are saved through the admin API, so a running server keeps them
in practice mode. Existing titles are skipped. Each exercise also gets a short
spoken clip from the API.

  scripts/.venv/bin/python scripts/seed_listening_stubs.py

Optional:
  --api http://127.0.0.1:4000/api/v1
  --email admin@elytedu.com
  --password Admin@123
"""

from __future__ import annotations

import argparse
import sys

import requests

DEFAULT_API = "http://13.207.57.80:4000/api/v1"

STUBS = [
    {
        "title": "Library hours notice",
        "kind": "answering",
        "category": "Announcement",
        "level": "Beginner",
        "script": "The library closes at eight tonight. Students may still return books at the side desk until eight thirty.",
        "subtitle": "Listen, then choose the right answer.",
        "questions": [
            {
                "type": "mcq",
                "prompt": "When does the library close tonight?",
                "answer": "A",
                "options": [{"text": "At eight"}, {"text": "At nine"}, {"text": "At seven"}],
            }
        ],
    },
    {
        "title": "Shuttle seat request",
        "kind": "answering",
        "category": "Telephone",
        "level": "Elementary",
        "script": "Please keep the front seat of the campus shuttle free. It is reserved for the driver.",
        "subtitle": "Listen, then choose the right answer.",
        "questions": [
            {
                "type": "mcq",
                "prompt": "Who is the front seat reserved for?",
                "answer": "B",
                "options": [{"text": "A visitor"}, {"text": "The driver"}, {"text": "A student"}],
            }
        ],
    },
    {
        "title": "Clinic opening time",
        "kind": "answering",
        "category": "Announcement",
        "level": "Beginner",
        "script": "The campus clinic opens at eight fifteen on Thursday.",
        "subtitle": "Type the missing time.",
        "questions": [
            {"type": "blank", "prompt": "The campus clinic opens at ____ on Thursday.", "answer": "eight fifteen|8:15|8.15"}
        ],
    },
    {
        "title": "Canteen price",
        "kind": "answering",
        "category": "Announcement",
        "level": "Beginner",
        "script": "A millet bowl in the engineering canteen costs forty rupees.",
        "subtitle": "Type the missing price.",
        "questions": [
            {"type": "blank", "prompt": "A millet bowl costs ____ rupees.", "answer": "forty|40"}
        ],
    },
    {
        "title": "Lab day match",
        "kind": "answering",
        "category": "Reading",
        "level": "Elementary",
        "script": "Chemistry lab is on Monday in Room 12. Physics lab is on Wednesday in Room 8.",
        "subtitle": "Match each lab with its day.",
        "questions": [
            {
                "type": "match",
                "prompt": "Match the lab with the day you heard.",
                "pairs": [
                    {"left": "Chemistry", "right": "Monday"},
                    {"left": "Physics", "right": "Wednesday"},
                ],
            }
        ],
    },
    {
        "title": "Desk and room match",
        "kind": "answering",
        "category": "Reading",
        "level": "Elementary",
        "script": "The scholarship desk is in the admin building. The printer desk is in the library.",
        "subtitle": "Match each desk with its place.",
        "questions": [
            {
                "type": "match",
                "prompt": "Match the desk with the building.",
                "pairs": [
                    {"left": "Scholarship desk", "right": "Admin building"},
                    {"left": "Printer desk", "right": "Library"},
                ],
            }
        ],
    },
    {
        "title": "Water shutoff check",
        "kind": "answering",
        "category": "Announcement",
        "level": "Beginner",
        "script": "Block C will have no water on Wednesday afternoon.",
        "subtitle": "Decide whether the statement is true.",
        "questions": [{"type": "truefalse", "prompt": "Block C has no water on Wednesday afternoon.", "answer": "A"}],
    },
    {
        "title": "Rehearsal room check",
        "kind": "answering",
        "category": "Announcement",
        "level": "Beginner",
        "script": "The drama rehearsal is in Room 210, not in the open-air theatre.",
        "subtitle": "Decide whether the statement is true.",
        "questions": [{"type": "truefalse", "prompt": "The rehearsal is in the open-air theatre.", "answer": "B"}],
    },
    {
        "title": "Repeat the gate time",
        "kind": "repeat",
        "category": "Announcement",
        "level": "Beginner",
        "script": "Please arrive at the main gate by nine thirty.",
        "subtitle": "Listen, then repeat the sentence.",
        "questions": [
            {"type": "repeat", "prompt": "Listen, then repeat the sentence.", "spoken": "Please arrive at the main gate by nine thirty."}
        ],
    },
    {
        "title": "Repeat the bus change",
        "kind": "repeat",
        "category": "Telephone",
        "level": "Elementary",
        "script": "Route 4 will end at the railway gate on Sunday.",
        "subtitle": "Listen, then repeat the sentence.",
        "questions": [
            {"type": "repeat", "prompt": "Listen, then repeat the sentence.", "spoken": "Route 4 will end at the railway gate on Sunday."}
        ],
    },
    {
        "title": "Type the interview line",
        "kind": "type",
        "category": "Announcement",
        "level": "Intermediate",
        "script": "The placement interview will begin at ten thirty tomorrow morning.",
        "subtitle": "Type exactly what you hear.",
        "questions": [
            {
                "type": "type",
                "prompt": "Type exactly what you hear.",
                "spoken": "The placement interview will begin at ten thirty tomorrow morning.",
            }
        ],
    },
    {
        "title": "Type the printer rule",
        "kind": "type",
        "category": "Reading",
        "level": "Elementary",
        "script": "The library printer now needs credit on your identity card.",
        "subtitle": "Type exactly what you hear.",
        "questions": [
            {"type": "type", "prompt": "Type exactly what you hear.", "spoken": "The library printer now needs credit on your identity card."}
        ],
    },
    {
        "title": "Reply to a new deadline",
        "kind": "respond",
        "category": "Conversation",
        "level": "Intermediate",
        "script": "Your manager says the project deadline has moved to tomorrow. Respond to your manager.",
        "subtitle": "Listen, then answer in your own words.",
        "questions": [
            {
                "type": "respond",
                "prompt": "Your manager says the project deadline has moved to tomorrow. Respond to your manager.",
                "spoken": "The project deadline has moved to tomorrow. Please tell me you can finish it.",
                "prepareSeconds": 5,
            }
        ],
    },
    {
        "title": "Reply to a late class",
        "kind": "respond",
        "category": "Conversation",
        "level": "Elementary",
        "script": "Your teacher says the class will start fifteen minutes late. Respond to your teacher.",
        "subtitle": "Listen, then answer in your own words.",
        "questions": [
            {
                "type": "respond",
                "prompt": "Your teacher says the class will start fifteen minutes late. Respond to your teacher.",
                "spoken": "Class will start fifteen minutes late today.",
                "prepareSeconds": 5,
            }
        ],
    },
    {
        "title": "Recall the interview details",
        "kind": "recall",
        "category": "Announcement",
        "level": "Intermediate",
        "script": "Ravi has an interview at ABC Technologies on Thursday at ten in the morning. He needs to carry two copies of his resume.",
        "subtitle": "Listen, then fill in what you remember.",
        "questions": [
            {
                "type": "recall",
                "prompt": "Fill in the details you remember.",
                "fields": [
                    {"label": "Person", "answer": "Ravi"},
                    {"label": "Company", "answer": "ABC Technologies"},
                    {"label": "Day", "answer": "Thursday"},
                    {"label": "Time", "answer": "ten|10"},
                    {"label": "Requirement", "answer": "two copies of his resume|two resumes"},
                ],
            }
        ],
    },
    {
        "title": "Recall the hostel notice",
        "kind": "recall",
        "category": "Announcement",
        "level": "Elementary",
        "script": "Block C will have no water from one to four on Wednesday because a pump is being replaced.",
        "subtitle": "Listen, then fill in what you remember.",
        "questions": [
            {
                "type": "recall",
                "prompt": "Fill in the details you remember.",
                "fields": [
                    {"label": "Block", "answer": "C"},
                    {"label": "Day", "answer": "Wednesday"},
                    {"label": "Start", "answer": "one|1"},
                    {"label": "End", "answer": "four|4"},
                ],
            }
        ],
    },
    {
        "title": "Identify ship",
        "kind": "identify",
        "category": "Reading",
        "level": "Beginner",
        "script": "ship",
        "subtitle": "Choose the word you hear.",
        "questions": [
            {
                "type": "identify",
                "prompt": "Which word did you hear?",
                "spoken": "ship",
                "answer": "A",
                "options": [{"text": "ship"}, {"text": "sheep"}, {"text": "sip"}, {"text": "chip"}],
            }
        ],
    },
    {
        "title": "Identify development",
        "kind": "identify",
        "category": "Reading",
        "level": "Intermediate",
        "script": "development",
        "subtitle": "Choose the word you hear.",
        "questions": [
            {
                "type": "identify",
                "prompt": "Which word did you hear?",
                "spoken": "development",
                "answer": "A",
                "options": [{"text": "development"}, {"text": "developer"}, {"text": "developing"}, {"text": "deployment"}],
            }
        ],
    },
]


def login(api: str, email: str, password: str) -> str:
    response = requests.post(f"{api}/auth/admin/login", json={"email": email, "password": password}, timeout=30)
    response.raise_for_status()
    token = response.json().get("token")
    if not token:
        raise RuntimeError("Admin login did not return a token")
    return token


def headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


def existing(api: str, token: str) -> dict[str, dict]:
    response = requests.get(f"{api}/admin/activities", headers=headers(token), timeout=60)
    response.raise_for_status()
    return {item["title"]: item for item in response.json().get("activities", [])}


def create(api: str, token: str, stub: dict) -> dict:
    payload = {
        "title": stub["title"],
        "description": stub["subtitle"],
        "duration": "2 min",
        "level": stub["level"],
        "audioLabel": stub["category"],
        "category": stub["category"],
        "headline": stub["title"],
        "subtitle": stub["subtitle"],
        "audioSeconds": 12,
        "script": stub["script"],
        "voice": "en-IN-NeerjaNeural",
        "questionSeconds": 45,
        "maxListens": 2,
        "published": True,
        "kind": stub["kind"],
        "questions": stub["questions"],
    }
    response = requests.post(f"{api}/admin/activities", headers=headers(token), json=payload, timeout=60)
    if response.status_code >= 400:
        raise RuntimeError(response.text[:500])
    return response.json()["activity"]


def speak(api: str, token: str, activity_id: str, script: str) -> None:
    response = requests.post(
        f"{api}/admin/activities/{activity_id}/speech",
        headers=headers(token),
        json={"script": script, "voice": "en-IN-NeerjaNeural"},
        timeout=120,
    )
    if response.status_code >= 400:
        raise RuntimeError(response.text[:500])


def speak_item(api: str, token: str, activity_id: str, question_id: str, script: str) -> None:
    response = requests.post(
        f"{api}/admin/activities/{activity_id}/items/{question_id}/speech",
        headers=headers(token),
        json={"script": script, "voice": "en-IN-NeerjaNeural"},
        timeout=120,
    )
    if response.status_code >= 400:
        raise RuntimeError(response.text[:500])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--api", default=DEFAULT_API)
    parser.add_argument("--email", default="admin@elytedu.com")
    parser.add_argument("--password", default="Admin@123")
    args = parser.parse_args()
    api = args.api.rstrip("/")
    token = login(api, args.email, args.password)
    stored = existing(api, token)
    created = 0
    for stub in STUBS:
        activity = stored.get(stub["title"])
        if activity:
            print(f"skip  {stub['title']}")
        else:
            activity = create(api, token, stub)
            created += 1
            print(f"add   {stub['title']} ({stub['kind']})")
        if not activity.get("audioUrl"):
            speak(api, token, activity["id"], stub["script"])
            print(f"audio {stub['title']}")
        for question, source in zip(activity.get("questions", []), stub["questions"]):
            spoken = source.get("spoken")
            if spoken and question.get("id") and not question.get("audioUrl"):
                speak_item(api, token, activity["id"], question["id"], spoken)
                print(f"clip  {stub['title']}")
    print(f"Done. {created} new exercises. {len(STUBS) - created} already stored.")


if __name__ == "__main__":
    try:
        main()
    except requests.RequestException as error:
        print(f"Could not reach the API: {error}", file=sys.stderr)
        sys.exit(1)
    except RuntimeError as error:
        print(error, file=sys.stderr)
        sys.exit(1)

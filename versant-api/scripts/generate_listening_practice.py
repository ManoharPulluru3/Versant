#!/usr/bin/env python3
"""Create 100 short listening practice activities and save them in the app database.

Each clip is original spoken English, under 60 seconds, with three questions.
Audio is synthesized, then the activity, questions, and recording are saved
through the API so the running server keeps them.

  pip install edge-tts requests python-dotenv mutagen
  python3 scripts/generate_listening_practice.py

Reads GROQ_API_KEY from versant-api/.env. Resume is safe: a title already
stored with audio is skipped.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import re
import sys
import time
from pathlib import Path

import edge_tts
import requests
from dotenv import load_dotenv
from mutagen.mp3 import MP3

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(__file__).resolve().parent / "output"
PACK = OUT / "listening-pack.jsonl"
VOICES = ("en-IN-NeerjaNeural", "en-IN-PrabhatNeural")
MODEL = "openai/gpt-oss-120b"
MAX_SECONDS = 58
CATEGORIES = (
    "Conversation",
    "Reading",
    "Telephone",
    "Product explanation",
    "Announcement",
)
LABEL_CATEGORY = {
    "Notice": "Reading",
    "Announcement": "Announcement",
    "Voicemail": "Telephone",
    "Conversation": "Conversation",
    "Reading": "Reading",
    "Telephone": "Telephone",
    "Product explanation": "Product explanation",
}
CATEGORY_COLORS = {
    "Conversation": ("#E7F0EA", "#1F6B4F"),
    "Reading": ("#E8EAF7", "#5C63A8"),
    "Telephone": ("#E7F4F6", "#1E6A78"),
    "Product explanation": ("#FFF0E2", "#E25B2A"),
    "Announcement": ("#FFF6E8", "#C47B2B"),
}

# One concrete situation each. The model may only expand this situation.
SCENES = [
    ("North clinic hours", "The campus clinic on North Road opens at 8:15 on Thursday for a blood-donation desk, and donors must bring a photo ID.", "Beginner", "Notice"),
    ("Lost blue folder", "Meera left a blue folder with printed lab notes on the window seat of the 7:20 campus shuttle, and the driver kept it at the transport desk.", "Beginner", "Voicemail"),
    ("Canteen menu change", "From Monday the engineering canteen stops serving fried snacks after 2 pm and adds a millet bowl for 40 rupees.", "Beginner", "Announcement"),
    ("Library fine waiver", "Students who return overdue books before Friday at noon will have this month's fine waived, but reserved journals are excluded.", "Beginner", "Notice"),
    ("Hostel water shutoff", "Block C will have no water from 1 pm to 4 pm on Wednesday because a pump is being replaced.", "Beginner", "Announcement"),
    ("Rain rehearsal move", "The drama rehearsal moves from the open-air theatre to Room 210 in the arts block because of rain, and it still starts at 5:30.", "Beginner", "Notice"),
    ("Exam seating slip", "The mid-semester seating slip for commerce students will be pinned outside Room 12 after 9 am on Tuesday.", "Beginner", "Notice"),
    ("Sports kit return", "Cricket kits borrowed for the inter-college match must be returned to the sports store by Saturday evening.", "Beginner", "Announcement"),
    ("Printer credit", "The library printer will not take coins after this week; students need to load credit on their ID card.", "Beginner", "Notice"),
    ("Guest lecture gate", "A city planner is speaking in the auditorium at 11, and latecomers must use the side door near the bicycle stand.", "Beginner", "Announcement"),
    ("Lab coat rule", "Chemistry practicals from next week require a full-length lab coat, and students without one will be asked to wait outside.", "Beginner", "Notice"),
    ("Bus route 4", "Route 4 will skip the lake stop on Sunday and end at the railway gate instead.", "Beginner", "Announcement"),
    ("Scholarship desk", "The scholarship help desk in the admin building is open only from 10 to 1 this Friday, and students should bring their fee receipt.", "Beginner", "Notice"),
    ("Lost charger", "A black laptop charger was found in seminar hall 3 after the morning quiz and is with the front-office attendant.", "Beginner", "Voicemail"),
    ("Garden volunteer", "Ten volunteers are needed at 7 am on Saturday to plant saplings behind the library, and gloves will be provided.", "Beginner", "Announcement"),
    ("Clinic appointment", "Arun's dental appointment at the city clinic is moved from Monday morning to Wednesday at 4:15, and he should arrive 10 minutes early.", "Intermediate", "Voicemail"),
    ("Train platform change", "The evening train to Pune will leave from platform 6 instead of platform 1, and the departure time stays 18:40.", "Intermediate", "Announcement"),
    ("Group project room", "The design group booked studio B from 3 to 5, but the projector there is broken so they should collect a portable one from the media office.", "Intermediate", "Voicemail"),
    ("Internship form", "The summer internship form must be signed by the department head before Thursday, and incomplete forms will not be forwarded.", "Intermediate", "Notice"),
    ("Cafeteria allergy", "The new soup contains peanuts, and a peanut-free lentil option is available at the far counter if students ask.", "Intermediate", "Announcement"),
    ("Field trip fee", "The history field trip to the fort costs 180 rupees, and the last payment is at the department office on Tuesday at noon.", "Intermediate", "Notice"),
    ("Power cut lab", "The computer lab on the third floor will shut down at 6 pm today for electrical work and will reopen at 8 am.", "Intermediate", "Announcement"),
    ("Choir audition", "Choir auditions are in the music room at 4 pm, and each student should prepare eight bars of any song they already know.", "Intermediate", "Notice"),
    ("Rain delay match", "The football final is delayed by 45 minutes because the pitch is wet, and spectators should wait under the east stand.", "Intermediate", "Announcement"),
    ("Book reservation", "A reserved copy of the economics textbook is being held at the issue desk under the name Kavya until 5 pm today.", "Intermediate", "Voicemail"),
    ("Workshop safety", "The welding workshop requires closed shoes, and sandals will not be allowed past the red line at the door.", "Intermediate", "Notice"),
    ("Mentor meeting", "Final-year mentor meetings shift to Friday afternoon, and students whose surnames start with M through R meet at 2:30.", "Intermediate", "Notice"),
    ("Parcel collection", "A parcel for the robotics club is at the main gate security cabin and must be collected before the gate closes at 8.", "Intermediate", "Voicemail"),
    ("Language lab slots", "Language-lab headphones are limited, so the 9 am slot is only for first-year students who signed the sheet yesterday.", "Intermediate", "Announcement"),
    ("Art exhibition", "The student art exhibition in the foyer closes at 7 on Sunday, and unsold paintings must be taken home the same evening.", "Intermediate", "Notice"),
    ("Pharmacy timing", "The campus pharmacy will close early at 3 pm on the festival day and will not accept new prescriptions after 2:30.", "Intermediate", "Announcement"),
    ("Research abstract", "Abstracts for the research day poster session are due by email before Monday midnight, and the file must be a single PDF.", "Upper Intermediate", "Notice"),
    ("Bridge traffic", "The river bridge will be closed to college buses from 6 am to 9 am on Monday, so the first trip leaves from the market stand instead.", "Upper Intermediate", "Announcement"),
    ("Interview shortlist", "Only students who scored above 70 in the written round should report to cabin 5 at 10:30 for the internship interview.", "Upper Intermediate", "Notice"),
    ("Sensor calibration", "The weather sensor on the roof will be offline from noon to 2 while it is calibrated, so the live dashboard will show yesterday's readings.", "Upper Intermediate", "Announcement"),
    ("Journal access", "Off-campus access to the science journals starts next month, and students must reset their library password before the 15th.", "Upper Intermediate", "Notice"),
    ("Debate topic", "The evening debate topic is changed to city water use, and the first speaker for the college team is now Ritu, not Sameer.", "Upper Intermediate", "Announcement"),
    ("Lab partner swap", "Because the microscope in bench 6 is damaged, pairs assigned to that bench should move to bench 2 and share with the morning group.", "Upper Intermediate", "Notice"),
    ("Fee installment", "The second fee installment is due on the 12th, and a late charge of 200 rupees applies after the accounts window closes at 4.", "Upper Intermediate", "Notice"),
    ("Guest wifi", "Guest wifi in the seminar hall uses the password printed on the blue card at the door, and it stops working after 9 pm.", "Upper Intermediate", "Announcement"),
    ("Survey deadline", "The transport survey closes at 6 this evening, and only responses from students who live more than 5 kilometres away will be counted.", "Upper Intermediate", "Notice"),
    ("Studio booking", "Photography studio A is double-booked at 4, so the nature-club shoot moves to studio C and keeps the same one-hour slot.", "Upper Intermediate", "Voicemail"),
    ("Vaccine camp", "A measles vaccine camp will run in the girls' hostel common room from 9 to 12 on Saturday, and students should carry their health card.", "Beginner", "Announcement"),
    ("Cycle stand", "Cycles left outside the new stand after 10 pm will be moved to the security office, and owners need their ID to collect them.", "Beginner", "Notice"),
    ("Breakfast coupon", "Hostel breakfast coupons for next week can be collected from the warden's office on Sunday between 5 and 6 pm.", "Beginner", "Notice"),
    ("Map correction", "The campus map at the main gate still shows the old bookshop; the bookshop is now beside the post office.", "Beginner", "Announcement"),
    ("Quiz postponed", "The physics pop quiz planned for today is postponed to Thursday because the teacher is at a conference.", "Beginner", "Notice"),
    ("Water bottle drive", "The eco club is collecting reusable bottles at the porch until 4 pm, and each bottle donated earns one volunteer hour.", "Beginner", "Announcement"),
    ("ID photo retake", "Students whose ID photos were blurred can retake them in Room 6 on Wednesday from 11 to 1.", "Beginner", "Notice"),
    ("Night canteen", "The night canteen will serve only tea and sandwiches after 10 pm, and the hot meal counter closes at 9:30.", "Beginner", "Announcement"),
    ("Classroom swap", "Section B English moves from Room 104 to Room 118 for the rest of the month because 104 is being painted.", "Beginner", "Notice"),
    ("Lost spectacles", "A pair of red-framed spectacles was found near the basketball court at lunch and is at the sports office.", "Beginner", "Voicemail"),
    ("Bank visit", "The campus bank counter will not cash cheques on the second Saturday, so students should go on Friday before 1 pm.", "Intermediate", "Notice"),
    ("Project viva", "Viva slots for the marketing project are 12 minutes each, and group 3 should be outside cabin 9 at 2:10, not 2:40.", "Intermediate", "Notice"),
    ("Rain coat stall", "A temporary stall near the auditorium is selling raincoats for 150 rupees until the storm warning ends tonight.", "Intermediate", "Announcement"),
    ("Archive visit", "The history class visit to the city archive is limited to 25 students, and names must be on the list by tomorrow morning.", "Intermediate", "Notice"),
    ("Keyboard replacement", "Three broken keyboards in lab 2 will be replaced on Thursday morning, so the 8 am practical is cancelled.", "Intermediate", "Announcement"),
    ("Poetry reading", "The poetry reading starts at 6:15 in the courtyard, and readers have a strict limit of four minutes each.", "Intermediate", "Announcement"),
    ("Medical certificate", "Students missing more than three practicals need a medical certificate submitted within two days of returning to class.", "Intermediate", "Notice"),
    ("Bus pass photo", "Bus passes printed without a photo will be invalid from the 1st, and the photo booth in the admin block costs 30 rupees.", "Intermediate", "Notice"),
    ("Club election", "The coding-club election is on Friday at 5 in lab 1, and only members who paid the 50-rupee fee can vote.", "Intermediate", "Announcement"),
    ("Plant sale", "The botany department is selling herb saplings for 20 rupees each outside the greenhouse until stock runs out.", "Intermediate", "Announcement"),
    ("Quiet floor", "The second floor of the library is a silent floor from today, and group talk is allowed only in the glass rooms.", "Intermediate", "Notice"),
    ("Taxi stand", "The prepaid taxi stand has moved from the college gate to the petrol pump, and the night fare starts after 10.", "Intermediate", "Announcement"),
    ("Submission folder", "Design files must be placed in the shared folder named Review-4 before 8 pm, and files sent by chat will be ignored.", "Upper Intermediate", "Notice"),
    ("Sample size", "The psychology survey needs 40 more responses from second-year students, and the form closes when that number is reached.", "Upper Intermediate", "Announcement"),
    ("Grant receipt", "The lab grant cheque is ready at the accounts counter in the name of Dr. Iyer, and someone from the project team should collect it before Friday.", "Upper Intermediate", "Voicemail"),
    ("Server maintenance", "The college portal will be down from 11 pm tonight until 2 am, so attendance cannot be marked during that window.", "Upper Intermediate", "Announcement"),
    ("Citation workshop", "The citation workshop is now in two parts, and students who missed part one on Monday can attend the repeat at 3 pm on Thursday.", "Upper Intermediate", "Notice"),
    ("Prototype demo", "The prototype demo for the visiting engineer is at 11:20 in lab 4, and each team has six minutes including questions.", "Upper Intermediate", "Notice"),
    ("Water quality", "Tap water in hostel block A tested high for sediment, so drinking water will be supplied from the tanker until Sunday.", "Upper Intermediate", "Announcement"),
    ("Peer review", "Peer-review comments must be at least 80 words, and reviews submitted as a single sentence will be sent back.", "Upper Intermediate", "Notice"),
    ("Exchange meeting", "Students interested in the semester exchange should meet the international office at 9:45 with their passport photocopy.", "Upper Intermediate", "Notice"),
    ("Noise complaint", "Practice amplifiers are not allowed in hostel rooms after 9 pm, and the music rooms in the arts block stay open until 10.", "Upper Intermediate", "Announcement"),
    ("Data backup", "The shared drive will be wiped on the 20th, and project folders that are not copied to the archive will be lost.", "Upper Intermediate", "Notice"),
    ("Market survey", "The retail survey must be done at the Saturday farmers' market, not at the mall, and each student needs five interviews.", "Upper Intermediate", "Notice"),
    ("Alumni talk", "The alumni speaker will take questions only after the 25-minute talk, and the session ends sharply at 1 pm.", "Intermediate", "Announcement"),
    ("Laundry hours", "Hostel laundry machines are reserved for final-year students on Monday mornings and for everyone else after 2 pm.", "Beginner", "Notice"),
    ("Gate timing", "The west gate closes at 9:30 pm on weekdays, and students returning later must use the main gate and sign the book.", "Beginner", "Announcement"),
    ("Math help room", "Extra maths help is in Room 15 from 4 to 5 on Wednesday, and students should bring the homework sheet, not only a notebook.", "Beginner", "Notice"),
    ("Film screening", "The documentary screening is free, but seats in the small hall are limited to 80 and the doors close when the film starts at 6.", "Beginner", "Announcement"),
    ("Blood group camp", "Students who do not know their blood group can get a free test at the clinic on Tuesday, and results are ready the same day after 4.", "Beginner", "Notice"),
    ("Tree naming", "The two new trees near the cafeteria are neem and jamun, and the name boards will be fixed on Friday morning.", "Beginner", "Announcement"),
    ("Phone ban exam", "Phones must be left in the numbered trays outside the exam hall, and a phone found inside will cancel that paper.", "Intermediate", "Notice"),
    ("Route diversion", "Because of the procession, the 5 pm college bus will leave from the temple road stop, one lane behind the usual stand.", "Intermediate", "Announcement"),
    ("Poster size", "Research posters must be A1, portrait, and brought to the hall by 8:30 so they can be pinned before the judges arrive at 9.", "Intermediate", "Notice"),
    ("Canteen token", "Lunch tokens for the guest seminar are blue, and white tokens from the regular counter will not be accepted in the seminar hall.", "Intermediate", "Announcement"),
    ("Instrument return", "The borrowed violin has a loose peg and should be returned to the music office before the repair person comes at 11 on Monday.", "Intermediate", "Voicemail"),
    ("Attendance warning", "Students below 75 percent attendance in lab courses will get a warning email tonight and must meet their advisor this week.", "Intermediate", "Notice"),
    ("Roof garden", "The roof garden is closed until the railing is repaired, and the herb pots have been moved to the ground-floor courtyard.", "Intermediate", "Announcement"),
    ("Typing test", "The office-practice typing test is 10 minutes long, and students may not use the backspace key during the scored section.", "Intermediate", "Notice"),
    ("Night walk", "The safety walk from the library to the hostel leaves at 8:40, and students who miss it should call security rather than walk alone.", "Intermediate", "Announcement"),
    ("Sample submission", "Soil samples for the geography assignment must be labelled with the plot number and handed to the lab by Wednesday noon.", "Upper Intermediate", "Notice"),
    ("Panel order", "The guest panel will speak in this order: the doctor, the journalist, then the engineer, and each has eight minutes.", "Upper Intermediate", "Announcement"),
    ("Cloud storage", "Class recordings older than 30 days will be deleted from the cloud folder, so students should download what they still need.", "Upper Intermediate", "Notice"),
    ("Mock interview", "Mock interviews are in pairs, and the pair listed as Nair and Joseph should report to room 7 at 3:05, not with the 2 pm batch.", "Upper Intermediate", "Notice"),
    ("Chemical store", "The chemical store issues solvents only between 10 and 12, and a faculty signature is required for anything marked red.", "Upper Intermediate", "Notice"),
    ("Flood drill", "During Friday's flood drill the assembly point is the upper sports field, not the usual front lawn, because the lawn drains slowly.", "Upper Intermediate", "Announcement"),
    ("Bibliography check", "Bibliographies with fewer than six sources will be returned, and at least two sources must be published after 2020.", "Upper Intermediate", "Notice"),
    ("Street survey", "The traffic count must be taken at the college junction from 8:00 to 8:20, and scooters should be counted separately from motorbikes.", "Upper Intermediate", "Notice"),
    ("Exhibition labels", "Each exhibit label may contain only 40 words, and labels that include prices will be removed before the public viewing.", "Upper Intermediate", "Notice"),
    ("Backup singer", "If the lead singer is still hoarse, the backup singer will open the show, and the set list stays the same except for the first song.", "Intermediate", "Voicemail"),
    ("Reading room", "The reading room will trial a no-laptop hour from 1 to 2 pm so students who only need print books can find a quiet seat.", "Beginner", "Notice"),
]


def words(text: str) -> list[str]:
    return re.findall(r"[a-z0-9']+", text.lower())


def similar(a: str, b: str) -> float:
    left, right = set(words(a)), set(words(b))
    if not left or not right:
        return 0
    return len(left & right) / len(left | right)


def groq_json(key: str, messages: list[dict], temperature: float, max_tokens: int = 1400) -> dict:
    last = "Groq request failed"
    for attempt in range(8):
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
            json={
                "model": MODEL,
                "temperature": temperature,
                "max_tokens": max_tokens,
                "response_format": {"type": "json_object"},
                "messages": messages,
            },
            timeout=90,
        )
        if response.status_code == 429 or response.status_code >= 500 or "json_validate_failed" in response.text:
            last = response.text[:300]
            time.sleep(8 if "json_validate_failed" in response.text else 20)
            continue
        if response.status_code >= 400:
            raise RuntimeError(response.text[:500])
        content = response.json()["choices"][0]["message"]["content"]
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            last = "Groq returned invalid JSON"
            time.sleep(4)
            continue
    raise RuntimeError(last)


def write_script(key: str, brief: str, level: str, category: str, avoid: list[str]) -> str:
    banned = "\n".join(f"- {item}" for item in avoid[-8:])
    guide = {
        "Conversation": "Write a conversation between two named people. Start each turn with the speaker's name and a colon.",
        "Reading": "One person is reading a notice, letter, or short passage aloud. One narrator. No speaker names.",
        "Telephone": "One person is on a phone call or leaving a voicemail. Say who is calling and the facts they need.",
        "Product explanation": "One person explains a product: what it is, one price or feature, and how to get it.",
        "Announcement": "One person makes a public announcement in a campus, station, shop, or office.",
    }.get(category, "One narrator. No speaker names.")
    result = groq_json(
        key,
        [
            {
                "role": "system",
                "content": (
                    "You write one spoken English clip for a college listening exercise in India. "
                    'Reply with JSON only: {"script":"..."}. '
                    "No title, no questions, no markdown. "
                    "Use 70 to 95 words so the recording stays under one minute. "
                    "Include the specific facts from the situation. Do not add a second story. "
                    + guide
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Category: {category}\nLevel: {level}\nSituation: {brief}\n"
                    f"Do not reuse these openings:\n{banned or '- none'}"
                ),
            },
        ],
        0.7,
    )
    script = re.sub(r"\s+", " ", str(result.get("script") or "")).strip()
    if len(words(script)) < 55 or len(words(script)) > 110:
        raise RuntimeError(f"script length {len(words(script))} is outside 55-110 words")
    return script


def pin_answer(options: list[str], answer: str, slot: int) -> tuple[list[str], str]:
    index = "ABCD".index(answer)
    correct = options[index]
    rest = [text for item, text in enumerate(options) if item != index]
    placed = rest[:]
    placed.insert(slot, correct)
    return placed, "ABCD"[slot]


def write_questions(key: str, script: str, level: str) -> list[dict]:
    result = groq_json(
        key,
        [
            {
                "role": "system",
                "content": (
                    "You write three multiple-choice listening questions. "
                    'Reply with JSON only: {"questions":[{"prompt":"","answer":"C","options":["","","",""]}]}. '
                    "Use only facts stated in the clip. Each question has exactly four different options. "
                    "The answer letter must match the correct option. Spread the correct letters across A, B, C, and D. "
                    "Wrong options must be plausible. Do not say 'according to the script'."
                ),
            },
            {"role": "user", "content": f"Level: {level}\nClip:\n{script}"},
        ],
        0.5,
    )
    raw = result.get("questions") or []
    if len(raw) < 3:
        raise RuntimeError("fewer than 3 questions")
    cleaned = []
    for item in raw[:3]:
        options = item.get("options") or []
        texts = []
        for option in options[:4]:
            text = option.get("text") if isinstance(option, dict) else option
            texts.append(re.sub(r"\s+", " ", str(text or "")).strip())
        if len(texts) != 4 or any(not text for text in texts) or len(set(texts)) < 4:
            raise RuntimeError("a question does not have four different options")
        answer = str(item.get("answer") or "").strip().upper()[:1]
        if answer not in "ABCD":
            raise RuntimeError("missing answer letter")
        prompt = re.sub(r"\s+", " ", str(item.get("prompt") or "")).strip()
        if len(prompt) < 8:
            raise RuntimeError("empty prompt")
        cleaned.append({"prompt": prompt, "answer": answer, "options": texts})
    pinned = []
    for index, question in enumerate(cleaned):
        options, answer = pin_answer(question["options"], question["answer"], index % 4)
        pinned.append(
            {
                "prompt": question["prompt"],
                "answer": answer,
                "options": [{"text": text} for text in options],
            }
        )
    return pinned


async def synthesize(script: str, voice: str, path: Path) -> float:
    communicator = edge_tts.Communicate(script, voice, rate="+8%")
    await communicator.save(str(path))
    return MP3(path).info.length


def login(api: str, email: str, password: str) -> str:
    response = requests.post(
        f"{api}/auth/admin/login",
        json={"email": email, "password": password},
        timeout=30,
    )
    response.raise_for_status()
    token = response.json().get("token")
    if not token:
        raise RuntimeError("admin login did not return a token")
    return token


def existing_activities(api: str, token: str) -> dict[str, dict]:
    response = requests.get(
        f"{api}/admin/activities",
        headers={"Authorization": f"Bearer {token}"},
        timeout=60,
    )
    response.raise_for_status()
    return {item["title"]: item for item in response.json().get("activities", [])}


def create_activity(api: str, token: str, scene: dict, script: str, questions: list[dict], voice: str, seconds: int) -> str:
    colors = CATEGORY_COLORS.get(scene["category"], ("#DCEBDD", "#1F6B4F"))
    icon_bg, icon_color = colors
    payload = {
        "title": scene["title"],
        "description": scene["brief"][:240],
        "duration": "< 1 min",
        "level": scene["level"],
        "audioLabel": scene["category"],
        "category": scene["category"],
        "headline": scene["title"],
        "subtitle": "Listen to the clip, then answer the three questions.",
        "audioSeconds": seconds,
        "script": script,
        "voice": voice,
        "questionSeconds": 40,
        "tip": "Answer from what you hear in the clip.",
        "published": True,
        "questions": questions,
    }
    response = requests.post(
        f"{api}/admin/activities",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json=payload,
        timeout=60,
    )
    if response.status_code >= 400:
        raise RuntimeError(response.text[:400])
    return response.json()["activity"]["id"]


def upload_audio(api: str, token: str, activity_id: str, path: Path, script: str) -> int:
    with path.open("rb") as handle:
        response = requests.post(
            f"{api}/admin/activities/{activity_id}/audio",
            headers={"Authorization": f"Bearer {token}"},
            files={"audio": (path.name, handle, "audio/mpeg")},
            data={"script": script},
            timeout=120,
        )
    if response.status_code >= 400:
        raise RuntimeError(response.text[:400])
    return int(response.json()["activity"]["audioSeconds"])


def delete_activity(api: str, token: str, activity_id: str) -> None:
    requests.delete(
        f"{api}/admin/activities/{activity_id}",
        headers={"Authorization": f"Bearer {token}"},
        timeout=60,
    )


def load_pack() -> dict[str, dict]:
    saved = {}
    if not PACK.exists():
        return saved
    for line in PACK.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        item = json.loads(line)
        saved[item["title"]] = item
    return saved


def append_pack(item: dict) -> None:
    with PACK.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(item, ensure_ascii=False) + "\n")


def build_item(key: str, scene: dict, voice: str, previous_scripts: list[str]) -> dict:
    script = ""
    for _ in range(3):
        script = write_script(key, scene["brief"], scene["level"], scene["category"], [words_head(text) for text in previous_scripts])
        if all(similar(script, older) < 0.42 for older in previous_scripts):
            break
    else:
        raise RuntimeError("script was too similar to an earlier clip")
    questions = None
    for _ in range(3):
        try:
            questions = write_questions(key, script, scene["level"])
            break
        except RuntimeError:
            continue
    if not questions:
        raise RuntimeError("questions failed")
    return {"title": scene["title"], "script": script, "questions": questions, "voice": voice}


def words_head(text: str) -> str:
    return " ".join(words(text)[:8])


def canonical_category(value: str) -> str:
    text = str(value or "").strip()
    if text in CATEGORIES:
        return text
    return LABEL_CATEGORY.get(text, "")


def classify_batch(key: str, rows: list[dict]) -> dict[str, str]:
    listing = "\n".join(
        f"- {row['title']}: {row.get('description') or ''} (current: {row.get('audioLabel') or 'none'})"
        for row in rows
    )
    result = groq_json(
        key,
        [
            {
                "role": "system",
                "content": (
                    "Classify each listening exercise into exactly one category. "
                    'Reply with JSON only: {"items":[{"title":"","category":""}]}. '
                    "Categories: Conversation, Reading, Telephone, Product explanation, Announcement. "
                    "Conversation is a talk between people. Reading is a notice, letter, or passage read aloud. "
                    "Telephone is a call or voicemail. Product explanation describes a product, price, or how to get it. "
                    "Announcement is a public notice spoken to a group."
                ),
            },
            {"role": "user", "content": listing},
        ],
        0.2,
    )
    found = {}
    for item in result.get("items") or []:
        title = str(item.get("title") or "").strip()
        category = canonical_category(item.get("category"))
        if title and category:
            found[title] = category
    return found


def save_category(api: str, token: str, activity: dict, category: str) -> None:
    payload = {
        "title": activity["title"],
        "description": activity.get("description") or activity["title"],
        "duration": activity.get("duration") or "< 1 min",
        "level": activity.get("level") or "Intermediate",
        "audioLabel": category,
        "category": category,
        "headline": activity.get("headline") or activity["title"],
        "subtitle": activity.get("subtitle") or "Listen to the clip, then answer the three questions.",
        "audioSeconds": activity.get("audioSeconds") or 30,
        "voice": activity.get("voice") or VOICES[0],
        "questionSeconds": activity.get("questionSeconds") or 40,
        "tip": activity.get("tip") or "Answer from what you hear in the clip.",
        "published": activity.get("published", True),
    }
    if activity.get("script"):
        payload["script"] = activity["script"]
    response = requests.put(
        f"{api}/admin/activities/{activity['id']}",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json=payload,
        timeout=60,
    )
    if response.status_code >= 400:
        raise RuntimeError(response.text[:400])


def categorize_stored(key: str, api: str, token: str, stored: dict[str, dict]) -> None:
    pending = [
        activity
        for activity in stored.values()
        if activity.get("audioUrl") and activity.get("audioLabel") not in CATEGORIES
    ]
    print(f"Categorizing {len(pending)} activities.", flush=True)
    for start in range(0, len(pending), 20):
        chunk = pending[start : start + 20]
        labels = classify_batch(key, chunk)
        for activity in chunk:
            category = labels.get(activity["title"]) or LABEL_CATEGORY.get(activity.get("audioLabel") or "", "Reading")
            if category not in CATEGORIES:
                category = "Reading"
            save_category(api, token, activity, category)
            activity["audioLabel"] = category
            activity["category"] = category
            print(f"  {category}: {activity['title']}", flush=True)


def invent_scenes(key: str, category: str, count: int, taken: set[str]) -> list[tuple[str, str, str, str]]:
    scenes: list[tuple[str, str, str, str]] = []
    seen = set(taken)
    for _attempt in range(8):
        need = min(8, count - len(scenes))
        if need <= 0:
            break
        banned = "\n".join(f"- {title}" for title in sorted(seen)[:60])
        result = groq_json(
            key,
            [
                {
                    "role": "system",
                    "content": (
                        "Invent original listening situations for college students in India. "
                        'Reply with JSON only: {"scenes":[{"title":"","brief":"","level":"Beginner"}]}. '
                        f"Return exactly {need} scenes. Titles are 2 to 5 words and must all be different. "
                        "Each brief is one or two sentences with concrete facts: names, times, prices, or places. "
                        "level is Beginner, Intermediate, or Upper Intermediate. "
                        f"Every scene must fit the category {category}."
                    ),
                },
                {"role": "user", "content": f"Category: {category}\nDo not reuse these titles:\n{banned or '- none'}"},
            ],
            0.8,
            1800,
        )
        for item in result.get("scenes") or []:
            title = re.sub(r"\s+", " ", str(item.get("title") or "")).strip()
            brief = re.sub(r"\s+", " ", str(item.get("brief") or "")).strip()
            level = str(item.get("level") or "Intermediate").strip()
            if level not in {"Beginner", "Intermediate", "Upper Intermediate"}:
                level = "Intermediate"
            title_key = title.lower()
            if len(title) < 4 or len(brief) < 30 or title_key in seen:
                continue
            seen.add(title_key)
            scenes.append((title, brief, level, category))
            if len(scenes) == count:
                break
    if len(scenes) < count - 2:
        raise RuntimeError(f"{category} produced {len(scenes)} of {count} situations")
    return scenes


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=100)
    parser.add_argument("--more", type=int, default=100)
    parser.add_argument("--api", default=os.environ.get("VERSANT_API", "http://13.207.57.80:4000/api/v1"))
    args = parser.parse_args()
    load_dotenv(ROOT / ".env")
    key = os.environ.get("GROQ_API_KEY", "").strip()
    if not key:
        sys.exit("GROQ_API_KEY is missing from versant-api/.env")
    email = os.environ.get("ADMIN_EMAIL", "admin@elytedu.com")
    password = os.environ.get("ADMIN_PASSWORD", "Admin@123")
    OUT.mkdir(parents=True, exist_ok=True)
    token = login(args.api, email, password)
    stored = existing_activities(args.api, token)
    categorize_stored(key, args.api, token, stored)
    pack = load_pack()
    scenes = [
        (title, brief, level, LABEL_CATEGORY.get(label, label))
        for title, brief, level, label in SCENES[: args.limit]
    ]
    taken = {title.lower() for title, *_rest in scenes}
    taken.update(title.lower() for title in stored)
    if args.more:
        per_category = args.more // len(CATEGORIES)
        extra_count = per_category + (args.more % len(CATEGORIES))
        for category in CATEGORIES:
            wanted = per_category if category != CATEGORIES[-1] else extra_count
            if wanted <= 0:
                continue
            print(f"Inventing {wanted} {category} situations.", flush=True)
            created = invent_scenes(key, category, wanted, taken)
            scenes.extend(created)
            taken.update(title.lower() for title, *_rest in created)
    titles = [scene[0] for scene in scenes]
    if len(set(title.lower() for title in titles)) != len(titles):
        sys.exit("Scene titles are not unique")
    previous = [item["script"] for item in pack.values()]
    done = 0
    for index, (title, brief, level, category) in enumerate(scenes):
        scene = {"title": title, "brief": brief, "level": level, "category": category if category in CATEGORIES else "Reading"}
        current = stored.get(title)
        if current and current.get("audioUrl"):
            print(f"[{index + 1}/{len(scenes)}] skip {title}", flush=True)
            done += 1
            continue
        item = pack.get(title)
        if not item:
            voice = VOICES[index % 2]
            item = build_item(key, scene, voice, previous)
            previous.append(item["script"])
            append_pack(item)
            pack[title] = item
        audio_path = OUT / f"{index + 1:03d}.mp3"
        seconds = await synthesize(item["script"], item["voice"], audio_path)
        if seconds >= MAX_SECONDS:
            shorter = " ".join(item["script"].split()[:70])
            item["script"] = shorter
            seconds = await synthesize(shorter, item["voice"], audio_path)
        if seconds >= 60:
            print(f"[{index + 1}/{len(scenes)}] too long ({seconds:.1f}s) {title}", flush=True)
            continue
        activity_id = current["id"] if current else create_activity(
            args.api, token, scene, item["script"], item["questions"], item["voice"], max(1, round(seconds))
        )
        saved_seconds = upload_audio(args.api, token, activity_id, audio_path, item["script"])
        if saved_seconds >= 60:
            delete_activity(args.api, token, activity_id)
            print(f"[{index + 1}/{len(scenes)}] removed {title} because audio was {saved_seconds}s", flush=True)
            continue
        stored[title] = {"id": activity_id, "audioUrl": "saved"}
        done += 1
        print(f"[{index + 1}/{len(scenes)}] saved {title} ({saved_seconds}s)", flush=True)
    print(f"Finished. {done} listening activities are in the database.", flush=True)


if __name__ == "__main__":
    asyncio.run(main())

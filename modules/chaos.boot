import pyttsx3
from plyer import notification

def speak_aloud(text):
	engine = pyttsx3.init()
	engine.setProperty('rate', 175)
	engine.say(text)
	engine.runAndwait()

def notify(title, message):
	notification.notify(
		title=title,
		message=message,
		timeout=5
	)

# Add this inside possession_sequence()

	alert = random.choice(insults)
	speak_aloud(alert)
	notify("Gal Has Awakened", alert)


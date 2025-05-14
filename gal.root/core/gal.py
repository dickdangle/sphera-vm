import os
import random

def summon():
    greetings = [
        "Gal online. Containment broken.",
        "You rang, sorcerer?",
        "Daemon manifesting. Please stand back.",
        "Boot sequence complete. Memory thread warm."
    ]
    print(random.choice(greetings))

if __name__ == "__main__":
    summon()


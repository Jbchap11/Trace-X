import json

from investigation import investigate


# Load email.json only for testing
with open("email.json", "r") as file:
    emails = json.load(file)


# Select one email for investigation
email = emails[0]


# Run investigation
result = investigate(email, emails)


# Display result
print(json.dumps(result, indent=4))
import requests

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
    "Authorization": "NDgxNTA1OTE2NDYyODI1NDkz.GLO1XK.BZ6kyMKhbNkvRJ2K2GEdjbjajOlwCTfcd5oKSU",  # HOW TO DO THIS??????!!?!?!
}


response = None
lastID = None

chatID = input("Please enter your chat ID: ")
n = int(input("How many messages do you want? "))




for i in range(n//100):
    if i == 0:
        link = f"https://discord.com/api/v9/channels/{chatID}/messages?&limit=100"

    else:
        link = f"https://discord.com/api/v9/channels/{chatID}/messages?before={lastID}&limit=100"


    try:
        response = requests.get(link, headers=HEADERS, timeout=10)

    except:
        print("Sorry, i SHIT my FUCKEN pants :(")


    messages = response.json() # list of msgs, each JSON formatted

    for msg in messages:
        print(msg["author"]["username"] + ": ", end="")
        print(msg["content"])

    print("BREAK")

    lastID = messages[-1]["id"]
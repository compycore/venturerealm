# VentureRealm

[![Man Hours](https://img.shields.io/endpoint?url=https%3A%2F%2Fmh.jessemillar.com%2Fhours%3Frepo%3Dhttps%3A%2F%2Fgithub.com%2Fcompycore%2Fventurerealm.git)](https://jessemillar.com/r/man-hours)

![VentureRealm Screenshot](screenshot.jpg)

VentureRealm is a hyper-realistic digital simulation developed by CompyCore. Set out on an epic adventure into a text-based land of magic, unknown, and danger!

VentureRealm was created during [Jesse Millar's](https://jessemillar.com) college days for a class project that mandated a server backend and a web component frontend (yes, the Windows 98-style window in the screenshot above is actually a part of a website).

## Setup

1. Create an account with [Auth0](https://auth0.com/)
1. Create an application in your Auth0 dashboard
1. Set the `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, and `AUTH0_DOMAIN` environment variables to the values supplied by Auth0
1. Optionally set `AUTH0_CALLBACK_URL` if you're using a server other than `http://localhost:8080`
1. Make sure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed

## Usage

1. Start the backend (add a `-d` flag if you don't care about server output):

	```
	docker-compose up
	```

1. Navigate to [http://localhost:8080](http://localhost:8080)
1. Login (or create an account)
1. Play!

## Notes

- Entirely text based
- Money system
	- Purchase from shopkeepers
- Simple inventory
	- Limited slots
	- Sell on the fly
- Randomly generated map
	- Treat the map like the Carcassone board game
- Interact with players

## Commands

- Directions (n, s, e, w, nw, ne, se, sw)
- look
- get
- fight
- examine
- inventory

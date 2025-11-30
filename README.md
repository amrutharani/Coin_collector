Coin Clash Multiplayer
<img width="1856" height="1055" alt="image" src="https://github.com/user-attachments/assets/6db7a4c3-2a75-4b0f-abb7-c7b77e34d2a5" />

This is a real-time multiplayer browser game where two players compete to collect as many yellow coins as possible before the timer ends.
This project was created as part of an Associate Game Developer Test for demonstrating multiplayer state synchronization without using any third-party networking engines.

What I Implemented:

✔ Authoritative Server Design
The server controls all gameplay logic including:
– Player movement
– Coin spawning
– Validating collisions
– Score updates
Clients only send input, not positions → prevents cheating

✔ Real-Time Multiplayer using WebSockets
Both players connect to one server and receive synchronized game state updates.

✔ Smooth Player Movement with Interpolation
Even with delayed updates, players move smoothly instead of teleporting.

✔ 200ms Simulated Network Latency
I intentionally delay both:
– sending inputs
– sending server updates
to show how interpolation keeps gameplay smooth.

✔ Game Rules & Loop
– Lobby state: Game starts only when both press START
– 60 seconds match timer
– Yellow coins spawn at random positions
– Player touching a coin gets +1 score
– At time up → highest score wins

✔ Canvas Rendering UI
I designed a simple game board with:
– Player avatars
– Coins
– Scoreboard
– Countdown timer
– Overlay introduction ("Press START to begin")

How to Play:

Controls (Player Input):

W → Go Up
A → Go Left
S → Go Down
D → Go Right


Goal:

Collect more yellow coins than the opponent before the timer finishes.

How to Run

Install dependencies:

npm install


Start the game server:

node server/server.js


Run a static web server for client(not required)
npx http-server ./client -p 3000

Open two browser tabs:

http://localhost:3000


Press START on each → match begins.

Tech I Used:

Node.js (backend)

WebSockets (networking)

HTML5 Canvas (visual rendering)

Vanilla JavaScript (logic & input)
➡ No Unity networking packages or auto-sync tools used

Developer:
Amrutha Rani(22b0957)
Final Year CSE, IIT Bombay

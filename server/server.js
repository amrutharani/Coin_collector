import { WebSocketServer } from "ws";
import GameState from "./game.js";

const wss = new WebSocketServer({ port: 8080 });
console.log("SERVER READY → ws://localhost:8080");

const LATENCY_MS = 200;
const game = new GameState();

let last = Date.now();
let timeLeft = 60;
let gameStarted = false;

function broadcast(obj) {
    const data = JSON.stringify(obj);
    setTimeout(() => {
        wss.clients.forEach(c => {
            if (c.readyState === 1) c.send(data);
        });
    }, LATENCY_MS);
}

wss.on("connection", (ws) => {
    const id = game.addPlayer(ws);
    ws.send(JSON.stringify({ type: "id", id }));
    console.log("Player connected:", id);

    ws.on("message", msg => {
        let data; try { data = JSON.parse(msg); } catch { return; }

        if (data.type === "ready") {
            game.setReady(id);
            if (!gameStarted && game.allReady()) {
                console.log("All ready → GAME START!");
                gameStarted = true;
            }
            return;
        }

        setTimeout(() => {
            if (gameStarted && timeLeft > 0) game.handleInput(id, data);
        }, LATENCY_MS);
    });

    ws.on("close", () => game.removePlayer(id));
});

setInterval(() => {
    const now = Date.now();
    const dt = (now - last) / 1000;
    last = now;

    if (gameStarted && timeLeft > 0)
        timeLeft = Math.max(0, timeLeft - dt);

    if (Math.random() < 0.02) game.spawnCoin();
    if (gameStarted && timeLeft > 0) game.update(dt);

    broadcast(game.getSnapshot(Math.floor(timeLeft), gameStarted));
}, 50);

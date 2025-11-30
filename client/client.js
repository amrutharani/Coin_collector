const socket = new WebSocket(`ws://${location.hostname}:8080`);

let players = {};
let coins = [];
let timeLeft = 60;
let gameStarted = false;
let myPlayerId = null;
let localReady = false;

socket.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    if (data.type === "id") {
        myPlayerId = data.id;
        console.log("My ID:", myPlayerId);
        return;
    }

    if (data.type === "state") {
        gameStarted = data.gameStarted;
        timeLeft = data.timeLeft;

        players = {};
        data.players.forEach(p => players[p.id] = p);
        coins = data.coins;

        if (gameStarted){
            document.getElementById("startBtn").style.display = "none";
        }
    }
};

document.getElementById("startBtn").onclick = () => {
    if (!localReady) {
        localReady = true;
        socket.send(JSON.stringify({ type: "ready" }));
        document.getElementById("startBtn").innerText = "WAITING...";
    }
};

const input = { up:0,down:0,left:0,right:0 };

window.addEventListener("keydown", e => send(e,1));
window.addEventListener("keyup", e => send(e,0));

function send(e, state) {
    if (!gameStarted || timeLeft <= 0) return;
    if (e.key === "w") input.up = state;
    if (e.key === "s") input.down = state;
    if (e.key === "a") input.left = state;
    if (e.key === "d") input.right = state;
    socket.send(JSON.stringify(input));
}

window.getPlayers = ()=> players;
window.getCoins = ()=> coins;
window.getTimeLeft = ()=> timeLeft;
window.getMyPlayerId = ()=> myPlayerId;
window.getGameStarted = ()=> gameStarted;
window.getLocalReady = ()=> localReady;

import { v4 as uuidv4 } from "uuid";

class GameState {
    constructor() {
        this.players = {};
        this.coins = [];
        this.mapSize = 600;

        for (let i = 0; i < 20; i++) this.spawnCoin();
    }

    addPlayer(ws) {
        const id = uuidv4();
        const index = Object.keys(this.players).length + 1;

        this.players[id] = {
            id,
            index,
            x: Math.random() * this.mapSize,
            y: Math.random() * this.mapSize,
            score: 0,
            ws,
            ready: false,
            lastInput: { up:0,down:0,left:0,right:0 }
        };

        return id;
    }

    removePlayer(id) {
        delete this.players[id];
    }

    handleInput(id, input) {
        if (this.players[id]) this.players[id].lastInput = input;
    }

    setReady(id) {
        if (this.players[id]) this.players[id].ready = true;
    }

    allReady() {
        const arr = Object.values(this.players);
        return arr.length >= 2 && arr.every(p => p.ready);
    }

    update(dt) {
        const speed = 140;

        Object.values(this.players).forEach(p => {
            if (p.lastInput.up) p.y -= speed * dt;
            if (p.lastInput.down) p.y += speed * dt;
            if (p.lastInput.left) p.x -= speed * dt;
            if (p.lastInput.right) p.x += speed * dt;

            p.x = Math.max(0, Math.min(this.mapSize, p.x));
            p.y = Math.max(0, Math.min(this.mapSize, p.y));
        });

        this.checkCollisions();
    }

    spawnCoin() {
        this.coins.push({
            id: uuidv4(),
            x: Math.random() * this.mapSize,
            y: Math.random() * this.mapSize
        });
    }

    checkCollisions() {
        Object.values(this.players).forEach(p => {
            this.coins = this.coins.filter(c => {
                if (Math.hypot(c.x - p.x, c.y - p.y) < 20) {
                    p.score += 1;
                    return false;
                }
                return true;
            });
        });
    }

    getSnapshot(timeLeft, gameStarted) {
        return {
            type: "state",
            gameStarted,
            timeLeft,
            players: Object.values(this.players),
            coins: this.coins
        };
    }
}

export default GameState;

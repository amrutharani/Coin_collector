const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const lerp = (a,b,t)=> a+(b-a)*t;
const smooth = {};
const BLUE = "#00bfff"; // brighter player color

function render() {
    ctx.clearRect(0,0,600,600);

    const players = getPlayers();
    const coins = getCoins();
    const timeLeft = getTimeLeft();
    const gameStarted = getGameStarted();
    const myId = getMyPlayerId();
    const localReady = getLocalReady();

    const sorted = Object.values(players).sort((a,b)=>a.index - b.index);

    // Scoreboard Formatting
    document.getElementById("scores").textContent =
        sorted.length > 0 ?
        "Score — " + sorted.map(p => `P${p.index}: ${p.score}`).join(" | ") :
        "Score — Waiting...";


    /* 🚫 GAME NOT STARTED — Show overlay */
    if (!gameStarted) {
        document.getElementById("timer").style.visibility = "hidden";
        document.getElementById("scores").style.visibility = "hidden";

        document.getElementById("startBtn").style.display = "block";

        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fillRect(0,0,600,600);

        if (myId && players[myId]) {
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            
            let y = 240;

            ctx.font = "28px Poppins";
            ctx.fillText(`You are Player ${players[myId].index}`, 300, y);

            ctx.font = "22px Poppins";
            y += 45;
            ctx.fillText("🎯 Collect as many yellow coins as possible!", 300, y);

            y += 45;
            ctx.fillText(localReady ?
                "Waiting for other player..." :
                "Press START to begin!",
                300, y
            );
        }

        requestAnimationFrame(render);
        return;
    }


    /* 🎮 GAME RUNNING */
    document.getElementById("timer").style.visibility = "visible";
    document.getElementById("scores").style.visibility = "visible";
    document.getElementById("timer").textContent = `⏱ ${timeLeft}s`;
    document.getElementById("startBtn").style.display = "none";


    /* 🏁 GAME OVER */
    if (timeLeft <= 0) {
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(0,0,600,600);

        ctx.fillStyle = "white";
        ctx.font = "34px Poppins";
        ctx.textAlign = "center";

        const winner = [...sorted].sort((a,b)=>b.score-a.score);

        if (winner[0].score === winner[1].score)
            ctx.fillText("🤝 It's a Draw!", 300, 300);
        else
            ctx.fillText(`🏆 Player ${winner[0].index} Wins!`, 300, 300);

        requestAnimationFrame(render);
        return;
    }


    /* 👤 Render Players */
    sorted.forEach(p => {
        if (!smooth[p.id]) smooth[p.id] = {x:p.x, y:p.y};
        smooth[p.id].x = lerp(smooth[p.id].x, p.x, 0.12);
        smooth[p.id].y = lerp(smooth[p.id].y, p.y, 0.12);

        ctx.beginPath();
        ctx.arc(smooth[p.id].x, smooth[p.id].y, 16, 0, Math.PI*2);
        ctx.fillStyle = BLUE;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.font = "14px Poppins";
        ctx.fillText(`P${p.index}`, smooth[p.id].x - 10, smooth[p.id].y - 25);
    });


    /* 💰 Render Coins */
    coins.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, 10, 0, Math.PI*2);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.strokeStyle = "#444";
        ctx.stroke();
    });


    requestAnimationFrame(render);
}
render();

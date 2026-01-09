let cards = [];
let targetNumber;
let attempts;
let canGuess = false;

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");
const shuffleSound = document.getElementById("shuffleSound");
  
function startGame() {
    const difficulty = document.getElementById("difficulty").value;
    const container = document.getElementById("cardContainer");

    container.innerHTML = "";
    document.getElementById("message").textContent = "";

    attempts = 3;
    updateAttempts();

    cards = [1, 2, 3, 4, 5, 6];
    cards.sort(() => Math.random() - 0.5);

    targetNumber = cards[Math.floor(Math.random() * 6)];
    document.getElementById("target").textContent =
        "Find Card Number: " + targetNumber;

    cards.forEach((number, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.style.left = `${index * 90}px`;

        const inner = document.createElement("div");
        inner.classList.add("card-inner");

        const front = document.createElement("div");
        front.classList.add("card-face", "card-front");
        front.textContent = "?";

        const back = document.createElement("div");
        back.classList.add("card-face", "card-back");
        back.textContent = number;

        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);

        card.addEventListener("click", () => handleGuess(card, number));

        container.appendChild(card);
    });

    const cardElements = document.querySelectorAll(".card");

    cardElements.forEach(card => card.classList.add("flipped"));

    setTimeout(async () => {
        await shuffleCards(cardElements, 3000, 200, difficulty);

        cardElements.forEach(card => card.classList.remove("flipped"));
        canGuess = true;
    }, 2000);
}
function shuffleCards(cards, duration = 3000, interval = 150, difficulty = "normal") {
    return new Promise(resolve => {
        if (difficulty === "easy") interval = 200;
        if (difficulty === "normal") interval = 150;
        if (difficulty === "hard") interval = 80;

        let elapsed = 0;
        const shuffleInterval = setInterval(() => {
            cards.forEach(card => {
                const maxX = 400;
                const maxY = 20;
                const randomX = Math.random() * maxX - maxX / 2;
                const randomY = Math.random() * maxY - maxY / 2;
                card.style.transform = `translate(${randomX}px, ${randomY}px)`;
            });

            playSound(shuffleSound);

            elapsed += interval;
            if (elapsed >= duration) {
                clearInterval(shuffleInterval);
                cards.forEach(card => card.style.transform = "translate(0,0)");
                resolve();
            }
        }, interval);
    });
}

function playSound(sound) {
    sound.pause();
    sound.currentTime = 0;
    sound.play();
}

function handleGuess(card, number) {
    if (!canGuess) return;

    clickSound.play();
    card.classList.add("flipped");

    if (number === targetNumber) {
        card.classList.add("win");
        document.getElementById("message").textContent = "🎉 YOU WIN!";
        winSound.play();
        canGuess = false;
        return;
    }

    attempts--;
    updateAttempts();

    if (attempts === 0) {
        document.getElementById("message").textContent =
    "❌ YOU LOSE! The correct card was " + targetNumber;

        loseSound.play();
        revealAll();
        canGuess = false;
    } else {
        card.classList.add("lose");
    }
}

function updateAttempts() {
    document.getElementById("attempts").textContent =
        "Attempts Left: " + attempts;
}

function revealAll() {
    document.querySelectorAll(".card").forEach(card => {
        card.classList.add("flipped");
    });
}

function restartGame() {
    canGuess = false;
    document.getElementById("cardContainer").innerHTML = "";
    document.getElementById("message").textContent = "";
    document.getElementById("target").textContent = "";
    document.getElementById("attempts").textContent = "";
    startGame();
}

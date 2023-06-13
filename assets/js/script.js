const choices = ["Rock", "Paper", "Scissors"];
let pWinCount = 0;
let cWinCount = 0;

const buttons = document.querySelectorAll("button");
const roundResult = document.querySelector(".roundResult");
const gameResultDiv = document.querySelector("#gameResult");
const pScore = document.querySelector(".pScore span");
const cScore = document.querySelector(".cScore span");
const resultContainer = document.querySelector("#main .row.results #rock #paper #scissors");

const elts = {
    text1: document.getElementById("text1"),
    text2: document.getElementById("text2")
};

const texts = [
    "Rock",
    "Paper",
    "Scissors"
];

const morphTime = 1;
const cooldownTime = 0.25;

let textIndex = texts.length - 1;
let time = new Date();
let morph = 0;
let cooldown = cooldownTime;

elts.text1.textContent = texts[textIndex % texts.length];
elts.text2.textContent = texts[(textIndex + 1) % texts.length];

function doMorph() {
    morph -= cooldown;
    cooldown = 0;

    let fraction = morph / morphTime;

    if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
    }

    setMorph(fraction);
}

function setMorph(fraction) {
    elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    fraction = 1 - fraction;
    elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    elts.text1.textContent = texts[textIndex % texts.length];
    elts.text2.textContent = texts[(textIndex + 1) % texts.length];
}

function doCooldown() {
    morph = 0;

    elts.text2.style.filter = "";
    elts.text2.style.opacity = "100%";

    elts.text1.style.filter = "";
    elts.text1.style.opacity = "0%";
}

function animate() {
    requestAnimationFrame(animate);

    let newTime = new Date();
    let shouldIncrementIndex = cooldown > 0;
    let dt = (newTime - time) / 1000;
    time = newTime;

    cooldown -= dt;

    if (cooldown <= 0) {
        if (shouldIncrementIndex) {
            textIndex++;
        }

        doMorph();
    } else {
        doCooldown();
    }
}

animate();

buttons.forEach((btn) => {
    btn.addEventListener("click", getPlayerChoice);
    btn.addEventListener("transitionend", removeRotation);
});
roundResult.addEventListener("transitionend", removeScale);

function removeRotation(e) {
    if (e.propertyName !== "transform") return;
    this.classList.remove("chosen");
}

function removeScale(e) {
    if (e.propertyName !== "transform") return;
    this.classList.remove("announced");
}

function getPlayerChoice() {
    if (gameResultDiv.textContent) return;
    const playerSelection = this.dataset.choice;
    const computerSelection = getComputerChoice();

    roundResult.textContent = playRound(playerSelection, computerSelection);
    pScore.textContent = pWinCount;
    cScore.textContent = cWinCount;
    this.classList.add("chosen");
    roundResult.classList.add("announced");
    checkForWinner();
}

function checkForWinner() {
    if (pWinCount == 5 || cWinCount == 5) {
        gameResultDiv.textContent = getWinner(pWinCount, cWinCount);

        const playAgainBtn = document.createElement("button");
        playAgainBtn.classList.add("playAgainBtn")
        playAgainBtn.textContent = "Play again?";
        playAgainBtn.addEventListener("click", resetGame);

        resultContainer.appendChild(playAgainBtn);
    }
}

function resetGame() {
    pWinCount = 0;
    cWinCount = 0;
    pScore.textContent = pWinCount;
    cScore.textContent = cWinCount;
    gameResultDiv.textContent = "";
    roundResult.textContent = "Click on a button to make a choice!";

    resultContainer.removeChild(document.querySelector(".playAgainBtn"));
    document.body.style.background = "rgb(53, 53, 53)";
    buttons.forEach((btn) => {
        if (btn.classList.contains("chosen")) btn.classList.remove("chosen");
    })
    if (roundResult.classList.contains("announced")) roundResult.classList.remove("announced");
}

function getComputerChoice() {
    let randomNum = Math.floor(Math.random()*choices.length);
    const choice = choices[randomNum];
    return choice;
}

function playRound(playerSelection, computerSelection) {
    if (playerSelection === computerSelection) {
        changeBg("tie");
        return `It's a tie! ${playerSelection} ties with ${computerSelection}`;
    } else if (playerSelection === "Rock" && computerSelection === "Scissors") {
        pWinCount++;
        changeBg("won");
        return "You win! Rock beats Scissors";
    } else if (playerSelection === "Paper" && computerSelection === "Rock") {
        pWinCount++;
        changeBg("won");
        return "You win! Paper beats Rock";
    } else if (playerSelection === "Scissors" && computerSelection === "Paper") {
        pWinCount++;
        changeBg("won");
        return "You win! Scissors beats Paper";
    } else {
        cWinCount++;
        changeBg("lost");
        return `You lose! ${computerSelection} beats ${playerSelection}`;    
    }
}

function getWinner(pWin, cWin) {
    const winText = `You're the winner! You won the game!`;
    const loseText = `You lost the game!`;
    const tieText = `The game ended with a tie!`;

    if (pWin > cWin) return winText;
    else if (pWin == cWin) return tieText;
    else return loseText;
}

// Dynameos background code easter egg
let dynameos = false;
const keyPattern = ["d", "y", "n", "a", "m", "e", "o", "s"];
let current = 0;
document.addEventListener('keydown', keyHandler, false);

function keyHandler(e) {
    if (keyPattern.indexOf(e.key) < 0 || e.key !== keyPattern[current]) {
        current = 0;
        return;
    }

    current++;
    if (keyPattern.length === current) dynameos = true;
};

function changeBg(bgType="") {
    if (dynameos)
        document.body.style.backgroundImage = `url(assets/images/${bgType}.jpg)`;
    else return;
}
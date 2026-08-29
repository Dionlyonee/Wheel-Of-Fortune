let currentAnswer = "";
let currentCategory = "";
let revealedLetters = [];

let timer = 60;
let timerInterval = null;

let gameRunning = false;
let gamePaused = false;


// -------------------------------------
// HOST ELEMENTS
// -------------------------------------

const categorySelect = document.getElementById("category");
const customAnswerInput = document.getElementById("customAnswer");

const randomPuzzleBtn = document.getElementById("randomPuzzleBtn");
const startBtn = document.getElementById("startBtn");

const hostPuzzle = document.getElementById("hostPuzzle");
const hostAnswer = document.getElementById("hostAnswer");
const displayCategory = document.getElementById("displayCategory");

const timerDisplay = document.getElementById("timer");
const gameStatus = document.getElementById("gameStatus");

const revealLetterBtn = document.getElementById("revealLetterBtn");
const pauseBtn = document.getElementById("pauseBtn");
const revealAnswerBtn = document.getElementById("revealAnswerBtn");

const winnerName = document.getElementById("winnerName");
const winnerBtn = document.getElementById("winnerBtn");

const newRoundBtn = document.getElementById("newRoundBtn");


// -------------------------------------
// STREAM ELEMENTS
// -------------------------------------

const streamCategory = document.getElementById("streamCategory");
const streamPuzzle = document.getElementById("streamPuzzle");
const streamTimer = document.getElementById("streamTimer");
const streamMessage = document.getElementById("streamMessage");

const winnerDisplay = document.getElementById("winnerDisplay");
const streamWinner = document.getElementById("streamWinner");
const winningAnswer = document.getElementById("winningAnswer");


// -------------------------------------
// RANDOM PUZZLE
// -------------------------------------

if (randomPuzzleBtn) {

    randomPuzzleBtn.addEventListener("click", () => {

        const selectedCategory = categorySelect.value;

        let category = selectedCategory;

        if (selectedCategory === "Random") {

            const categories = Object.keys(puzzles);

            category =
                categories[
                    Math.floor(Math.random() * categories.length)
                ];
        }

        const categoryPuzzles = puzzles[category];

        const randomAnswer =
            categoryPuzzles[
                Math.floor(Math.random() * categoryPuzzles.length)
            ];

        customAnswerInput.value = randomAnswer;

        categorySelect.value = category;

    });

}


// -------------------------------------
// START GAME
// -------------------------------------

if (startBtn) {

    startBtn.addEventListener("click", () => {

        let answer = customAnswerInput.value.trim();

        let category = categorySelect.value;


        // If no custom answer was entered,
        // automatically choose one.

        if (!answer) {

            if (category === "Random") {

                const categories = Object.keys(puzzles);

                category =
                    categories[
                        Math.floor(Math.random() * categories.length)
                    ];
            }

            const categoryPuzzles = puzzles[category];

            answer =
                categoryPuzzles[
                    Math.floor(Math.random() * categoryPuzzles.length)
                ];
        }


        currentAnswer = answer.toUpperCase();

        currentCategory = category;

        revealedLetters = [];

        timer = 60;

        gameRunning = true;

        gamePaused = false;


        updatePuzzle();

        updateTimer();

        updateStatus("PLAYING");

        startTimer();

        saveGameState();

    });

}


// -------------------------------------
// CREATE PUZZLE DISPLAY
// -------------------------------------

function createPuzzleDisplay() {

    return currentAnswer
        .split("")
        .map(character => {

            // Spaces stay visible
            if (character === " ") {
                return "&nbsp;&nbsp;";
            }

            // Punctuation stays visible
            if (!/[A-Z0-9]/.test(character)) {
                return character;
            }

            // Revealed letters
            if (revealedLetters.includes(character)) {
                return character;
            }

            return "_";

        })
        .join(" ");

}


// -------------------------------------
// UPDATE PUZZLE
// -------------------------------------

function updatePuzzle() {

    if (!currentAnswer) return;

    const puzzleDisplay = createPuzzleDisplay();


    if (hostPuzzle) {
        hostPuzzle.innerHTML = puzzleDisplay;
    }


    if (hostAnswer) {
        hostAnswer.textContent = currentAnswer;
    }


    if (displayCategory) {
        displayCategory.textContent = currentCategory;
    }


    if (streamPuzzle) {
        streamPuzzle.innerHTML = puzzleDisplay;
    }


    if (streamCategory) {
        streamCategory.textContent = currentCategory;
    }

}


// -------------------------------------
// REVEAL LETTER
// -------------------------------------

function revealLetter() {

    if (!currentAnswer || !gameRunning) {
        return;
    }


    const hiddenLetters = [
        ...new Set(
            currentAnswer
                .split("")
                .filter(character =>
                    /[A-Z0-9]/.test(character) &&
                    !revealedLetters.includes(character)
                )
        )
    ];


    if (hiddenLetters.length === 0) {

        revealAnswer();

        return;
    }


    const randomLetter =
        hiddenLetters[
            Math.floor(Math.random() * hiddenLetters.length)
        ];


    revealedLetters.push(randomLetter);

    updatePuzzle();

    timer = 60;

    updateTimer();

    saveGameState();

}


// -------------------------------------
// REVEAL LETTER BUTTON
// -------------------------------------

if (revealLetterBtn) {

    revealLetterBtn.addEventListener(
        "click",
        revealLetter
    );

}


// -------------------------------------
// TIMER
// -------------------------------------

function startTimer() {

    clearInterval(timerInterval);


    timerInterval = setInterval(() => {

        if (!gameRunning || gamePaused) {
            return;
        }


        timer--;

        updateTimer();


        if (timer <= 0) {

            revealLetter();

        }

    }, 1000);

}


// -------------------------------------
// UPDATE TIMER DISPLAY
// -------------------------------------

function updateTimer() {

    if (timerDisplay) {
        timerDisplay.textContent = timer;
    }


    if (streamTimer) {
        streamTimer.textContent = timer;
    }

}


// -------------------------------------
// PAUSE
// -------------------------------------

if (pauseBtn) {

    pauseBtn.addEventListener("click", () => {

        if (!gameRunning) return;


        gamePaused = !gamePaused;


        if (gamePaused) {

            pauseBtn.textContent = "▶ RESUME";

            updateStatus("PAUSED");

        } else {

            pauseBtn.textContent = "⏸ PAUSE";

            updateStatus("PLAYING");

        }

    });

}


// -------------------------------------
// REVEAL ANSWER
// -------------------------------------

function revealAnswer() {

    if (!currentAnswer) return;


    revealedLetters = [
        ...new Set(
            currentAnswer
                .split("")
                .filter(character =>
                    /[A-Z0-9]/.test(character)
                )
        )
    ];


    updatePuzzle();


    if (streamMessage) {
        streamMessage.textContent =
            "🎉 THE ANSWER IS...";
    }


    clearInterval(timerInterval);

    gameRunning = false;

    updateStatus("ANSWER REVEALED");

    saveGameState();

}


if (revealAnswerBtn) {

    revealAnswerBtn.addEventListener(
        "click",
        revealAnswer
    );

}


// -------------------------------------
// WINNER
// -------------------------------------

if (winnerBtn) {

    winnerBtn.addEventListener("click", () => {

        const name =
            winnerName.value.trim();


        if (!name) {

            alert("Enter the winner's name first.");

            return;
        }


        if (streamWinner) {
            streamWinner.textContent =
                name;
        }


        if (winningAnswer) {
            winningAnswer.textContent =
                currentAnswer;
        }


        if (winnerDisplay) {
            winnerDisplay.classList.remove("hidden");
        }


        if (streamMessage) {
            streamMessage.textContent =
                "🎉 WE HAVE A WINNER!";
        }


        gameRunning = false;

        clearInterval(timerInterval);

        updateStatus("WINNER");

        saveGameState();

    });

}


// -------------------------------------
// NEW ROUND
// -------------------------------------

if (newRoundBtn) {

    newRoundBtn.addEventListener("click", () => {

        clearInterval(timerInterval);


        currentAnswer = "";

        currentCategory = "";

        revealedLetters = [];

        timer = 60;

        gameRunning = false;

        gamePaused = false;


        if (customAnswerInput) {
            customAnswerInput.value = "";
        }


        if (winnerName) {
            winnerName.value = "";
        }


        if (winnerDisplay) {
            winnerDisplay.classList.add("hidden");
        }


        if (streamMessage) {
            streamMessage.textContent =
                "GUESS THE ANSWER!";
        }


        if (hostPuzzle) {
            hostPuzzle.innerHTML =
                "_ _ _ _ _ _ _";
        }


        if (hostAnswer) {
            hostAnswer.textContent =
                "---";
        }


        if (displayCategory) {
            displayCategory.textContent =
                "---";
        }


        if (streamPuzzle) {
            streamPuzzle.innerHTML =
                "_ _ _ _ _ _ _";
        }


        if (streamCategory) {
            streamCategory.textContent =
                "WAITING FOR GAME";
        }


        updateTimer();

        updateStatus("WAITING");

        saveGameState();

    });

}


// -------------------------------------
// STATUS
// -------------------------------------

function updateStatus(status) {

    if (gameStatus) {
        gameStatus.textContent =
            status;
    }

}


// -------------------------------------
// SAVE GAME STATE
// -------------------------------------

function saveGameState() {

    const state = {

        answer: currentAnswer,

        category: currentCategory,

        revealedLetters: revealedLetters,

        timer: timer,

        running: gameRunning,

        paused: gamePaused

    };


    localStorage.setItem(
        "dionlyoneeWheelGame",
        JSON.stringify(state)
    );

}


// -------------------------------------
// LOAD GAME STATE
// -------------------------------------

function loadGameState() {

    const saved =
        localStorage.getItem(
            "dionlyoneeWheelGame"
        );


    if (!saved) return;


    try {

        const state =
            JSON.parse(saved);


        currentAnswer =
            state.answer || "";

        currentCategory =
            state.category || "";

        revealedLetters =
            state.revealedLetters || [];

        timer =
            state.timer || 60;

        gameRunning =
            state.running || false;

        gamePaused =
            state.paused || false;


        if (currentAnswer) {

            updatePuzzle();

            updateTimer();

        }


    } catch (error) {

        console.error(
            "Could not load saved game.",
            error
        );

    }

}


// -------------------------------------
// INITIALIZE
// -------------------------------------

loadGameState();

updateTimer();

// ============================================
// DIONLYONEE PLAYGROUND
// WHEEL OF FORTUNE
// ============================================

const channel = new BroadcastChannel("dionlyonee-wheel");

let currentAnswer = "";
let currentCategory = "";
let revealedLetters = [];

let timer = 60;
let timerInterval = null;

let gameRunning = false;
let gamePaused = false;


// ============================================
// GET ELEMENTS
// ============================================

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


// STREAM SCREEN

const streamCategory = document.getElementById("streamCategory");
const streamPuzzle = document.getElementById("streamPuzzle");
const streamTimer = document.getElementById("streamTimer");
const streamMessage = document.getElementById("streamMessage");

const winnerDisplay = document.getElementById("winnerDisplay");
const streamWinner = document.getElementById("streamWinner");
const winningAnswer = document.getElementById("winningAnswer");


// ============================================
// GAME STATE
// ============================================

function getGameState() {

    return {
        answer: currentAnswer,
        category: currentCategory,
        revealedLetters: revealedLetters,
        timer: timer,
        running: gameRunning,
        paused: gamePaused
    };

}


// ============================================
// SEND STATE TO STREAM SCREEN
// ============================================

function sendState(extra = {}) {

    channel.postMessage({
        type: "GAME_UPDATE",

        state: getGameState(),

        ...extra
    });

}


// ============================================
// RECEIVE STATE
// ============================================

channel.onmessage = function(event) {

    if (!event.data) return;


    if (event.data.type === "GAME_UPDATE") {

        const state = event.data.state;


        currentAnswer =
            state.answer || "";

        currentCategory =
            state.category || "";

        revealedLetters =
            state.revealedLetters || [];

        timer =
            state.timer ?? 60;

        gameRunning =
            state.running || false;

        gamePaused =
            state.paused || false;


        updatePuzzle();

        updateTimer();


        if (event.data.winner) {

            showWinner(
                event.data.winner
            );

        }


        if (event.data.message) {

            updateStreamMessage(
                event.data.message
            );

        }

    }

};


// ============================================
// RANDOM PUZZLE
// ============================================

if (randomPuzzleBtn) {

    randomPuzzleBtn.addEventListener("click", () => {

        let category =
            categorySelect.value;


        if (category === "Random") {

            const categories =
                Object.keys(puzzles);


            category =
                categories[
                    Math.floor(
                        Math.random() *
                        categories.length
                    )
                ];

        }


        const categoryPuzzles =
            puzzles[category];


        if (!categoryPuzzles) {

            alert("No puzzles found for this category.");

            return;

        }


        const answer =
            categoryPuzzles[
                Math.floor(
                    Math.random() *
                    categoryPuzzles.length
                )
            ];


        customAnswerInput.value =
            answer;


        categorySelect.value =
            category;

    });

}


// ============================================
// START ROUND
// ============================================

if (startBtn) {

    startBtn.addEventListener("click", () => {

        let answer =
            customAnswerInput.value.trim();


        let category =
            categorySelect.value;


        // Automatically choose puzzle
        // if host didn't type one.

        if (!answer) {

            if (category === "Random") {

                const categories =
                    Object.keys(puzzles);


                category =
                    categories[
                        Math.floor(
                            Math.random() *
                            categories.length
                        )
                    ];

            }


            const categoryPuzzles =
                puzzles[category];


            answer =
                categoryPuzzles[
                    Math.floor(
                        Math.random() *
                        categoryPuzzles.length
                    )
                ];

        }


        if (!answer) {

            alert("Please enter or select a puzzle.");

            return;

        }


        currentAnswer =
            answer
                .toUpperCase()
                .trim();


        currentCategory =
            category;


        revealedLetters = [];


        timer = 60;

        gameRunning = true;

        gamePaused = false;


        if (winnerDisplay) {

            winnerDisplay.classList.add("hidden");

        }


        if (winnerName) {

            winnerName.value = "";

        }


        if (pauseBtn) {

            pauseBtn.textContent =
                "⏸ PAUSE";

        }


        updatePuzzle();

        updateTimer();

        updateStatus("PLAYING");


        updateStreamMessage(
            "GUESS THE ANSWER!"
        );


        startTimer();

        sendState();

    });

}


// ============================================
// CREATE PUZZLE
// ============================================

function createPuzzleDisplay() {

    if (!currentAnswer) {

        return "_ _ _ _ _";

    }


    return currentAnswer
        .split("")
        .map(character => {

            // SPACE
            if (character === " ") {

                return "&nbsp;&nbsp;&nbsp;";

            }


            // PUNCTUATION
            if (!/[A-Z0-9]/.test(character)) {

                return character;

            }


            // REVEALED
            if (
                revealedLetters.includes(character)
            ) {

                return character;

            }


            return "_";

        })
        .join(" ");

}


// ============================================
// UPDATE PUZZLE
// ============================================

function updatePuzzle() {

    const display =
        createPuzzleDisplay();


    // HOST

    if (hostPuzzle) {

        hostPuzzle.innerHTML =
            display;

    }


    if (hostAnswer) {

        hostAnswer.textContent =
            currentAnswer || "---";

    }


    if (displayCategory) {

        displayCategory.textContent =
            currentCategory || "---";

    }


    // STREAM

    if (streamPuzzle) {

        streamPuzzle.innerHTML =
            display;

    }


    if (streamCategory) {

        streamCategory.textContent =
            currentCategory ||
            "WAITING FOR GAME";

    }

}


// ============================================
// REVEAL LETTER
// ============================================

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


    // No letters left

    if (hiddenLetters.length === 0) {

        revealAnswer();

        return;

    }


    const letter =
        hiddenLetters[
            Math.floor(
                Math.random() *
                hiddenLetters.length
            )
        ];


    revealedLetters.push(letter);


    timer = 60;


    updatePuzzle();

    updateTimer();


    sendState({

        message:
            `LETTER REVEALED: ${letter}`

    });

}


// ============================================
// REVEAL LETTER BUTTON
// ============================================

if (revealLetterBtn) {

    revealLetterBtn.addEventListener(
        "click",
        revealLetter
    );

}


// ============================================
// TIMER
// ============================================

function startTimer() {

    clearInterval(timerInterval);


    timerInterval =
        setInterval(() => {

            if (
                !gameRunning ||
                gamePaused
            ) {

                return;

            }


            timer--;


            updateTimer();


            // Keep stream synchronized

            sendState();


            if (timer <= 0) {

                revealLetter();

            }

        }, 1000);

}


// ============================================
// TIMER DISPLAY
// ============================================

function updateTimer() {

    if (timerDisplay) {

        timerDisplay.textContent =
            timer;

    }


    if (streamTimer) {

        streamTimer.textContent =
            timer;

    }

}


// ============================================
// PAUSE / RESUME
// ============================================

if (pauseBtn) {

    pauseBtn.addEventListener(
        "click",
        () => {

            if (!gameRunning) {

                return;

            }


            gamePaused =
                !gamePaused;


            if (gamePaused) {

                pauseBtn.textContent =
                    "▶ RESUME";

                updateStatus("PAUSED");

                updateStreamMessage(
                    "⏸ GAME PAUSED"
                );

            } else {

                pauseBtn.textContent =
                    "⏸ PAUSE";

                updateStatus("PLAYING");

                updateStreamMessage(
                    "GUESS THE ANSWER!"
                );

            }


            sendState();

        }
    );

}


// ============================================
// REVEAL ANSWER
// ============================================

function revealAnswer() {

    if (!currentAnswer) {

        return;

    }


    revealedLetters = [
        ...new Set(
            currentAnswer
                .split("")
                .filter(character =>
                    /[A-Z0-9]/.test(character)
                )
        )
    ];


    gameRunning = false;

    gamePaused = false;


    clearInterval(timerInterval);


    updatePuzzle();


    updateStatus(
        "ANSWER REVEALED"
    );


    updateStreamMessage(
        "🎉 THE ANSWER IS..."
    );


    sendState({

        message:
            "🎉 THE ANSWER IS..."

    });

}


if (revealAnswerBtn) {

    revealAnswerBtn.addEventListener(
        "click",
        revealAnswer
    );

}


// ============================================
// WINNER
// ============================================

if (winnerBtn) {

    winnerBtn.addEventListener(
        "click",
        () => {

            const name =
                winnerName.value.trim();


            if (!name) {

                alert(
                    "Enter the winner's name first."
                );

                return;

            }


            gameRunning = false;

            gamePaused = false;


            clearInterval(
                timerInterval
            );


            updateStatus(
                "WINNER"
            );


            showWinner(name);


            sendState({

                winner: name,

                message:
                    "🎉 WE HAVE A WINNER!"

            });

        }
    );

}


// ============================================
// SHOW WINNER
// ============================================

function showWinner(name) {

    if (streamWinner) {

        streamWinner.textContent =
            name;

    }


    if (winningAnswer) {

        winningAnswer.textContent =
            currentAnswer;

    }


    if (winnerDisplay) {

        winnerDisplay.classList.remove(
            "hidden"
        );

    }


    updateStreamMessage(
        "🎉 WE HAVE A WINNER!"
    );

}


// ============================================
// STREAM MESSAGE
// ============================================

function updateStreamMessage(message) {

    if (streamMessage) {

        streamMessage.textContent =
            message;

    }

}


// ============================================
// STATUS
// ============================================

function updateStatus(status) {

    if (gameStatus) {

        gameStatus.textContent =
            status;

    }

}


// ============================================
// NEW ROUND
// ============================================

if (newRoundBtn) {

    newRoundBtn.addEventListener(
        "click",
        () => {

            clearInterval(
                timerInterval
            );


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

                winnerDisplay.classList.add(
                    "hidden"
                );

            }


            if (pauseBtn) {

                pauseBtn.textContent =
                    "⏸ PAUSE";

            }


            updatePuzzle();

            updateTimer();

            updateStatus(
                "WAITING"
            );


            updateStreamMessage(
                "GUESS THE ANSWER!"
            );


            sendState({

                message:
                    "WAITING FOR NEXT ROUND"

            });

        }
    );

}


// ============================================
// INITIALIZE STREAM SCREEN
// ============================================

if (streamPuzzle) {

    // Tell the host that the stream
    // screen has opened.

    channel.postMessage({

        type: "STREAM_CONNECTED"

    });

}


// ============================================
// HOST SENDS CURRENT STATE WHEN
// STREAM SCREEN CONNECTS
// ============================================

channel.addEventListener(
    "message",
    event => {

        if (
            event.data &&
            event.data.type ===
            "STREAM_CONNECTED"
        ) {

            // Only the host needs
            // to respond.

            if (hostPuzzle) {

                sendState();

            }

        }

    }
);

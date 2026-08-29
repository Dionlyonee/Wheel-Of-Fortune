// ======================================================
// DIONLYONEE PLAYGROUND
// WHEEL OF FORTUNE
// ======================================================

// ------------------------------------------------------
// STORAGE KEY
// ------------------------------------------------------

const GAME_KEY = "dionlyonee_wheel_game";


// ------------------------------------------------------
// DEFAULT GAME STATE
// ------------------------------------------------------

const defaultGame = {

    answer: "",

    category: "",

    revealedLetters: [],

    revealTime: 30,

    timer: 30,

    running: false,

    paused: false,

    message: "WAITING FOR ROUND"

};


// ------------------------------------------------------
// LOAD GAME
// ------------------------------------------------------

function loadGame() {

    const saved =
        localStorage.getItem(GAME_KEY);

    if (!saved) {

        return {
            ...defaultGame
        };

    }

    try {

        return JSON.parse(saved);

    } catch (error) {

        console.error(
            "Could not load game:",
            error
        );

        return {
            ...defaultGame
        };

    }

}


// ------------------------------------------------------
// SAVE GAME
// ------------------------------------------------------

function saveGame(game) {

    localStorage.setItem(
        GAME_KEY,
        JSON.stringify(game)
    );

}


// ------------------------------------------------------
// CURRENT GAME
// ------------------------------------------------------

let game = loadGame();


// ------------------------------------------------------
// PAGE DETECTION
// ------------------------------------------------------

const isHost =
    document.body.classList.contains(
        "host-page"
    );

const isStream =
    document.body.classList.contains(
        "stream-page"
    );


// ======================================================
// HOST ELEMENTS
// ======================================================

const category =
    document.getElementById("category");

const customAnswer =
    document.getElementById(
        "customAnswer"
    );

const revealTime =
    document.getElementById(
        "revealTime"
    );

const randomPuzzleBtn =
    document.getElementById(
        "randomPuzzleBtn"
    );

const startBtn =
    document.getElementById(
        "startBtn"
    );

const revealLetterBtn =
    document.getElementById(
        "revealLetterBtn"
    );

const pauseBtn =
    document.getElementById(
        "pauseBtn"
    );

const revealAnswerBtn =
    document.getElementById(
        "revealAnswerBtn"
    );

const newRoundBtn =
    document.getElementById(
        "newRoundBtn"
    );

const hostPuzzle =
    document.getElementById(
        "hostPuzzle"
    );

const hostAnswer =
    document.getElementById(
        "hostAnswer"
    );

const displayCategory =
    document.getElementById(
        "displayCategory"
    );

const hostTimer =
    document.getElementById(
        "timer"
    );

const gameStatus =
    document.getElementById(
        "gameStatus"
    );


// ======================================================
// STREAM ELEMENTS
// ======================================================

const streamPuzzle =
    document.getElementById(
        "streamPuzzle"
    );

const streamCategory =
    document.getElementById(
        "streamCategory"
    );

const streamTimer =
    document.getElementById(
        "streamTimer"
    );

const streamMessage =
    document.getElementById(
        "streamMessage"
    );


// ======================================================
// CREATE PUZZLE DISPLAY
// ======================================================

function createPuzzle() {

    if (!game.answer) {

        return "—";

    }


    return game.answer
        .split("")
        .map(function(letter) {

            // SPACE

            if (letter === " ") {

                return "&nbsp;&nbsp;&nbsp;";

            }


            // PUNCTUATION

            if (
                !/[A-Z0-9]/.test(letter)
            ) {

                return letter;

            }


            // REVEALED

            if (
                game.revealedLetters
                    .includes(letter)
            ) {

                return letter;

            }


            // HIDDEN

            return "_";

        })
        .join(" ");

}


// ======================================================
// UPDATE DISPLAY
// ======================================================

function updateDisplay() {

    const puzzle =
        createPuzzle();


    // HOST

    if (hostPuzzle) {

        hostPuzzle.innerHTML =
            puzzle;

    }


    if (hostAnswer) {

        hostAnswer.textContent =
            game.answer || "---";

    }


    if (displayCategory) {

        displayCategory.textContent =
            game.category || "---";

    }


    if (hostTimer) {

        hostTimer.textContent =
            game.timer;

    }


    if (gameStatus) {

        if (!game.running) {

            gameStatus.textContent =
                "WAITING";

        } else if (game.paused) {

            gameStatus.textContent =
                "PAUSED";

        } else {

            gameStatus.textContent =
                "PLAYING";

        }

    }


    // STREAM

    if (streamPuzzle) {

        streamPuzzle.innerHTML =
            puzzle;

    }


    if (streamCategory) {

        streamCategory.textContent =
            game.category ||
            "WAITING FOR GAME";

    }


    if (streamTimer) {

        streamTimer.textContent =
            game.timer;

    }


    if (streamMessage) {

        streamMessage.textContent =
            game.message;

    }


    // PAUSE BUTTON

    if (pauseBtn) {

        pauseBtn.textContent =
            game.paused
                ? "▶ RESUME"
                : "⏸ PAUSE";

    }

}


// ======================================================
// START ROUND
// ======================================================

if (startBtn) {

    startBtn.addEventListener(
        "click",
        function() {

            let answer =
                customAnswer.value.trim();


            let selectedCategory =
                category.value;


            // ------------------------------------------
            // RANDOM CATEGORY
            // ------------------------------------------

            if (
                selectedCategory ===
                "Random"
            ) {

                const categories =
                    Object.keys(puzzles);


                selectedCategory =
                    categories[
                        Math.floor(
                            Math.random() *
                            categories.length
                        )
                    ];

            }


            // ------------------------------------------
            // RANDOM ANSWER
            // ------------------------------------------

            if (!answer) {

                const list =
                    puzzles[
                        selectedCategory
                    ];


                if (
                    !list ||
                    list.length === 0
                ) {

                    alert(
                        "No puzzles are available for this category."
                    );

                    return;

                }


                answer =
                    list[
                        Math.floor(
                            Math.random() *
                            list.length
                        )
                    ];

            }


            // ------------------------------------------
            // REVEAL TIME
            // ------------------------------------------

            const selectedTime =
                Number(
                    revealTime.value
                ) || 30;


            // ------------------------------------------
            // CREATE GAME
            // ------------------------------------------

            game = {

                answer:
                    answer
                        .toUpperCase()
                        .trim(),

                category:
                    selectedCategory,

                revealedLetters: [],

                revealTime:
                    selectedTime,

                timer:
                    selectedTime,

                running: true,

                paused: false,

                message:
                    "GUESS THE ANSWER!"

            };


            saveGame(game);


            updateDisplay();


            console.log(
                "ROUND STARTED",
                game
            );

        }
    );

}


// ======================================================
// RANDOM PUZZLE
// ======================================================

if (randomPuzzleBtn) {

    randomPuzzleBtn.addEventListener(
        "click",
        function() {

            let selectedCategory =
                category.value;


            if (
                selectedCategory ===
                "Random"
            ) {

                const categories =
                    Object.keys(puzzles);


                selectedCategory =
                    categories[
                        Math.floor(
                            Math.random() *
                            categories.length
                        )
                    ];

            }


            const list =
                puzzles[
                    selectedCategory
                ];


            if (
                !list ||
                list.length === 0
            ) {

                alert(
                    "No puzzles found."
                );

                return;

            }


            const answer =
                list[
                    Math.floor(
                        Math.random() *
                        list.length
                    )
                ];


            customAnswer.value =
                answer;


            category.value =
                selectedCategory;

        }
    );

}


// ======================================================
// REVEAL LETTER
// ======================================================

function revealLetter() {

    if (
        !game.running ||
        !game.answer
    ) {

        return;

    }


    const hiddenLetters =
        [
            ...new Set(

                game.answer
                    .split("")
                    .filter(function(letter) {

                        return (
                            /[A-Z0-9]/.test(letter)
                            &&
                            !game.revealedLetters
                                .includes(letter)
                        );

                    })

            )
        ];


    // NOTHING LEFT

    if (
        hiddenLetters.length === 0
    ) {

        revealAnswer();

        return;

    }


    // RANDOM HIDDEN LETTER

    const letter =
        hiddenLetters[
            Math.floor(
                Math.random() *
                hiddenLetters.length
            )
        ];


    game.revealedLetters.push(
        letter
    );


    // RESET TIMER

    game.timer =
        game.revealTime;


    game.message =
        `LETTER REVEALED: ${letter}`;


    saveGame(game);


    updateDisplay();

}


// ======================================================
// REVEAL LETTER BUTTON
// ======================================================

if (revealLetterBtn) {

    revealLetterBtn.addEventListener(
        "click",
        revealLetter
    );

}


// ======================================================
// PAUSE / RESUME
// ======================================================

if (pauseBtn) {

    pauseBtn.addEventListener(
        "click",
        function() {

            if (!game.running) {

                return;

            }


            game.paused =
                !game.paused;


            game.message =
                game.paused
                    ? "⏸ GAME PAUSED"
                    : "GUESS THE ANSWER!";


            saveGame(game);


            updateDisplay();

        }
    );

}


// ======================================================
// REVEAL ANSWER
// ======================================================

function revealAnswer() {

    if (!game.answer) {

        return;

    }


    game.revealedLetters =
        [
            ...new Set(

                game.answer
                    .split("")
                    .filter(function(letter) {

                        return /[A-Z0-9]/.test(
                            letter
                        );

                    })

            )
        ];


    game.running = false;

    game.paused = false;

    game.message =
        "🎉 THE ANSWER IS...";


    saveGame(game);


    updateDisplay();

}


if (revealAnswerBtn) {

    revealAnswerBtn.addEventListener(
        "click",
        revealAnswer
    );

}


// ======================================================
// NEW ROUND
// ======================================================

if (newRoundBtn) {

    newRoundBtn.addEventListener(
        "click",
        function() {

            game = {

                ...defaultGame

            };


            saveGame(game);


            updateDisplay();

        }
    );

}


// ======================================================
// TIMER
// ======================================================

let lastTick =
    Date.now();


setInterval(
    function() {

        if (
            !isHost
        ) {

            return;

        }


        if (
            !game.running ||
            game.paused
        ) {

            lastTick =
                Date.now();

            return;

        }


        const now =
            Date.now();


        const elapsed =
            Math.floor(
                (now - lastTick) / 1000
            );


        if (
            elapsed < 1
        ) {

            return;

        }


        lastTick =
            now;


        game.timer -=
            elapsed;


        // ------------------------------------------
        // TIME IS UP
        // ------------------------------------------

        if (
            game.timer <= 0
        ) {

            game.timer =
                game.revealTime;


            revealLetter();


            return;

        }


        saveGame(game);


        updateDisplay();

    },
    250
);


// ======================================================
// STREAM LISTENER
// ======================================================

window.addEventListener(
    "storage",
    function(event) {

        if (
            event.key === GAME_KEY
        ) {

            game =
                loadGame();


            updateDisplay();

        }

    }
);


// ======================================================
// INITIAL DISPLAY
// ======================================================

updateDisplay();

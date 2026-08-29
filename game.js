// =====================================================
// DIONLYONEE PLAYGROUND
// WHEEL OF FORTUNE
// GAME ENGINE
// =====================================================


// =====================================================
// COMMUNICATION
// =====================================================

const channel =
    new BroadcastChannel("dionlyonee-wheel");


// =====================================================
// GAME VARIABLES
// =====================================================

let currentAnswer = "";

let currentCategory = "";

let revealedLetters = [];

let timer = 60;

let timerInterval = null;

let gameRunning = false;

let gamePaused = false;


// =====================================================
// HOST ELEMENTS
// =====================================================

const categorySelect =
    document.getElementById("category");

const customAnswerInput =
    document.getElementById("customAnswer");

const randomPuzzleBtn =
    document.getElementById("randomPuzzleBtn");

const startBtn =
    document.getElementById("startBtn");

const hostPuzzle =
    document.getElementById("hostPuzzle");

const hostAnswer =
    document.getElementById("hostAnswer");

const displayCategory =
    document.getElementById("displayCategory");

const timerDisplay =
    document.getElementById("timer");

const gameStatus =
    document.getElementById("gameStatus");

const revealLetterBtn =
    document.getElementById("revealLetterBtn");

const pauseBtn =
    document.getElementById("pauseBtn");

const revealAnswerBtn =
    document.getElementById("revealAnswerBtn");

const newRoundBtn =
    document.getElementById("newRoundBtn");


// =====================================================
// STREAM ELEMENTS
// =====================================================

const streamCategory =
    document.getElementById("streamCategory");

const streamPuzzle =
    document.getElementById("streamPuzzle");

const streamTimer =
    document.getElementById("streamTimer");

const streamMessage =
    document.getElementById("streamMessage");


// =====================================================
// CHECK WHICH PAGE WE ARE ON
// =====================================================

const isHostPage =
    startBtn !== null;

const isStreamPage =
    streamPuzzle !== null;


// =====================================================
// SEND GAME STATE
// =====================================================

function sendGameState(message = null) {

    channel.postMessage({

        type: "GAME_STATE",

        answer: currentAnswer,

        category: currentCategory,

        revealedLetters:
            revealedLetters,

        timer: timer,

        running: gameRunning,

        paused: gamePaused,

        message: message

    });

}


// =====================================================
// RECEIVE GAME STATE
// =====================================================

channel.addEventListener(
    "message",
    function(event) {

        const data =
            event.data;


        if (!data) {
            return;
        }


        if (
            data.type ===
            "GAME_STATE"
        ) {

            currentAnswer =
                data.answer || "";

            currentCategory =
                data.category || "";

            revealedLetters =
                data.revealedLetters || [];

            timer =
                data.timer ?? 60;

            gameRunning =
                data.running || false;

            gamePaused =
                data.paused || false;


            updateEverything();


            if (
                data.message &&
                streamMessage
            ) {

                streamMessage.textContent =
                    data.message;

            }

        }

    }
);


// =====================================================
// RANDOM PUZZLE
// =====================================================

if (randomPuzzleBtn) {

    randomPuzzleBtn.addEventListener(
        "click",
        function() {

            let category =
                categorySelect.value;


            // RANDOM CATEGORY

            if (
                category ===
                "Random"
            ) {

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


            const list =
                puzzles[category];


            if (
                !list ||
                list.length === 0
            ) {

                alert(
                    "There are no puzzles in this category."
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


            customAnswerInput.value =
                answer;


            categorySelect.value =
                category;

        }
    );

}


// =====================================================
// START ROUND
// =====================================================

if (startBtn) {

    startBtn.addEventListener(
        "click",
        function() {

            console.log(
                "START ROUND clicked"
            );


            let answer =
                customAnswerInput.value.trim();


            let category =
                categorySelect.value;


            // -----------------------------------------
            // NO CUSTOM ANSWER
            // -----------------------------------------

            if (!answer) {

                if (
                    category ===
                    "Random"
                ) {

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


                const list =
                    puzzles[category];


                if (
                    !list ||
                    list.length === 0
                ) {

                    alert(
                        "No puzzles found."
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


            // -----------------------------------------
            // CREATE GAME
            // -----------------------------------------

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


            // -----------------------------------------
            // UPDATE SCREEN
            // -----------------------------------------

            updateEverything();


            updateStatus(
                "PLAYING"
            );


            if (streamMessage) {

                streamMessage.textContent =
                    "GUESS THE ANSWER!";

            }


            // -----------------------------------------
            // START TIMER
            // -----------------------------------------

            startTimer();


            // -----------------------------------------
            // SEND TO STREAM
            // -----------------------------------------

            sendGameState(
                "GUESS THE ANSWER!"
            );


            console.log(
                "ROUND STARTED:",
                currentAnswer
            );

        }
    );

}


// =====================================================
// BUILD PUZZLE
// =====================================================

function buildPuzzle() {

    if (!currentAnswer) {

        return "_ _ _ _ _ _ _";

    }


    return currentAnswer
        .split("")
        .map(
            function(character) {

                // SPACE

                if (
                    character === " "
                ) {

                    return "&nbsp;&nbsp;";

                }


                // PUNCTUATION

                if (
                    !/[A-Z0-9]/.test(
                        character
                    )
                ) {

                    return character;

                }


                // REVEALED LETTER

                if (
                    revealedLetters.includes(
                        character
                    )
                ) {

                    return character;

                }


                // HIDDEN LETTER

                return "_";

            }
        )
        .join(" ");

}


// =====================================================
// UPDATE EVERYTHING
// =====================================================

function updateEverything() {

    const puzzle =
        buildPuzzle();


    // HOST

    if (hostPuzzle) {

        hostPuzzle.innerHTML =
            puzzle;

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
            puzzle;

    }


    if (streamCategory) {

        streamCategory.textContent =
            currentCategory ||
            "WAITING FOR GAME";

    }


    updateTimer();

}


// =====================================================
// TIMER
// =====================================================

function startTimer() {

    clearInterval(
        timerInterval
    );


    timerInterval =
        setInterval(
            function() {

                if (
                    !gameRunning ||
                    gamePaused
                ) {

                    return;

                }


                timer--;


                updateTimer();


                sendGameState();


                // -------------------------------------
                // TIME'S UP
                // -------------------------------------

                if (
                    timer <= 0
                ) {

                    revealLetter();

                }

            },
            1000
        );

}


// =====================================================
// UPDATE TIMER
// =====================================================

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


// =====================================================
// REVEAL LETTER
// =====================================================

function revealLetter() {

    if (
        !currentAnswer ||
        !gameRunning
    ) {

        return;

    }


    const availableLetters =
        [
            ...new Set(
                currentAnswer
                    .split("")
                    .filter(
                        function(character) {

                            return (
                                /[A-Z0-9]/.test(
                                    character
                                ) &&
                                !revealedLetters.includes(
                                    character
                                )
                            );

                        }
                    )
            )
        ];


    // NO LETTERS LEFT

    if (
        availableLetters.length === 0
    ) {

        revealAnswer();

        return;

    }


    // PICK RANDOM LETTER

    const letter =
        availableLetters[
            Math.floor(
                Math.random() *
                availableLetters.length
            )
        ];


    revealedLetters.push(
        letter
    );


    timer = 60;


    updateEverything();


    sendGameState(
        `LETTER REVEALED: ${letter}`
    );

}


// =====================================================
// REVEAL LETTER BUTTON
// =====================================================

if (revealLetterBtn) {

    revealLetterBtn.addEventListener(
        "click",
        revealLetter
    );

}


// =====================================================
// PAUSE
// =====================================================

if (pauseBtn) {

    pauseBtn.addEventListener(
        "click",
        function() {

            if (!gameRunning) {

                return;

            }


            gamePaused =
                !gamePaused;


            if (gamePaused) {

                pauseBtn.textContent =
                    "▶ RESUME";

                updateStatus(
                    "PAUSED"
                );


                sendGameState(
                    "⏸ GAME PAUSED"
                );

            } else {

                pauseBtn.textContent =
                    "⏸ PAUSE";

                updateStatus(
                    "PLAYING"
                );


                sendGameState(
                    "GUESS THE ANSWER!"
                );

            }

        }
    );

}


// =====================================================
// REVEAL ANSWER
// =====================================================

if (revealAnswerBtn) {

    revealAnswerBtn.addEventListener(
        "click",
        revealAnswer
    );

}


function revealAnswer() {

    if (!currentAnswer) {

        return;

    }


    revealedLetters =
        [
            ...new Set(
                currentAnswer
                    .split("")
                    .filter(
                        function(character) {

                            return /[A-Z0-9]/.test(
                                character
                            );

                        }
                    )
            )
        ];


    gameRunning = false;


    gamePaused = false;


    clearInterval(
        timerInterval
    );


    updateEverything();


    updateStatus(
        "ANSWER REVEALED"
    );


    sendGameState(
        "🎉 THE ANSWER IS..."
    );

}


// =====================================================
// NEW ROUND
// =====================================================

if (newRoundBtn) {

    newRoundBtn.addEventListener(
        "click",
        function() {

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

                customAnswerInput.value =
                    "";

            }


            if (pauseBtn) {

                pauseBtn.textContent =
                    "⏸ PAUSE";

            }


            updateEverything();


            updateStatus(
                "WAITING"
            );


            if (streamMessage) {

                streamMessage.textContent =
                    "WAITING FOR ROUND";

            }


            sendGameState(
                "WAITING FOR ROUND"
            );

        }
    );

}


// =====================================================
// INITIALIZE
// =====================================================

updateEverything();


// =====================================================
// STREAM SCREEN REQUESTS CURRENT GAME
// =====================================================

if (isStreamPage) {

    channel.postMessage({

        type:
            "STREAM_REQUEST_STATE"

    });

}


// =====================================================
// HOST RESPONDS TO STREAM
// =====================================================

channel.addEventListener(
    "message",
    function(event) {

        if (
            event.data &&
            event.data.type ===
            "STREAM_REQUEST_STATE"
        ) {

            if (isHostPage) {

                sendGameState();

            }

        }

    }
);

```javascript
/* =====================================================
   DIONLYONEE PLAYGROUND
   WHEEL OF FORTUNE
   AUTOMATIC GAME ENGINE
===================================================== */


/* =====================================================
   PUZZLE DATABASE
===================================================== */

const puzzles = {

    "ANIMALS": [

        "ELEPHANT",
        "GIRAFFE",
        "LION",
        "TIGER",
        "MONKEY",
        "BUTTERFLY",
        "DOLPHIN",
        "CROCODILE",
        "GOLDEN RETRIEVER",
        "POLAR BEAR",
        "KANGAROO",
        "HIPPOPOTAMUS",
        "CHEETAH",
        "GORILLA",
        "ZEBRA"

    ],


    "COUNTRIES": [

        "JAMAICA",
        "CANADA",
        "UNITED STATES",
        "BRAZIL",
        "JAPAN",
        "MEXICO",
        "BAHAMAS",
        "BARBADOS",
        "TRINIDAD AND TOBAGO",
        "UNITED KINGDOM",
        "AUSTRALIA",
        "GERMANY",
        "FRANCE",
        "ITALY",
        "SOUTH AFRICA"

    ],


    "JAMAICAN PHRASES": [

        "WAH GWAAN",
        "WEH YUH A SEH",
        "MI DEH YA",
        "EVERYTING IRIE",
        "NO PROBLEM",
        "BIG UP",
        "YEAH MON",
        "WALK GOOD",
        "MI SOON COME",
        "NUH WORRY YUHSELF",
        "IRIE VIBES",
        "WE A RUN TINGS"

    ],


    "FOOD": [

        "JERK CHICKEN",
        "RICE AND PEAS",
        "FRIED CHICKEN",
        "PIZZA",
        "HAMBURGER",
        "MACARONI AND CHEESE",
        "CHOCOLATE CAKE",
        "ICE CREAM",
        "FRENCH FRIES",
        "PANCAKES",
        "CHEESEBURGER",
        "FISH AND CHIPS"

    ],


    "MOVIES": [

        "THE LION KING",
        "BLACK PANTHER",
        "HOME ALONE",
        "TOY STORY",
        "THE MATRIX",
        "AVATAR",
        "JURASSIC PARK",
        "THE DARK KNIGHT",
        "FRIDAY",
        "COMING TO AMERICA",
        "BAD BOYS",
        "MEN IN BLACK"

    ],


    "MUSIC": [

        "ONE LOVE",
        "NO WOMAN NO CRY",
        "THRILLER",
        "PURPLE RAIN",
        "BOHEMIAN RHAPSODY",
        "BILLIE JEAN",
        "ISLAND IN THE SUN",
        "THREE LITTLE BIRDS",
        "RED RED WINE",
        "COULD YOU BE LOVED"

    ],


    "VIDEO GAMES": [

        "MARIO KART",
        "SUPER MARIO",
        "MINECRAFT",
        "FORTNITE",
        "GRAND THEFT AUTO",
        "CALL OF DUTY",
        "SONIC THE HEDGEHOG",
        "THE LEGEND OF ZELDA",
        "MORTAL KOMBAT",
        "STREET FIGHTER"

    ],


    "SPORTS": [

        "BASKETBALL",
        "FOOTBALL",
        "CRICKET",
        "BASEBALL",
        "TENNIS",
        "BOXING",
        "TRACK AND FIELD",
        "SWIMMING",
        "VOLLEYBALL",
        "GOLF"

    ],


    "PLACES": [

        "NEW YORK CITY",
        "KINGSTON",
        "MONTEGO BAY",
        "MIAMI",
        "LOS ANGELES",
        "LONDON",
        "PARIS",
        "TOKYO",
        "LAS VEGAS",
        "ORLANDO",
        "DUBAI",
        "TORONTO"

    ]

};


/* =====================================================
   SETTINGS
===================================================== */

let revealInterval = 30;

let cooldownLength = 10;


/* =====================================================
   GAME STATE
===================================================== */

let currentCategory = "";

let currentAnswer = "";

let revealedLetters = [];

let timer = 30;

let gameRunning = false;

let cooldownRunning = false;

let gameTimer = null;

let cooldownTimer = null;


/* =====================================================
   HTML ELEMENTS
===================================================== */

const categoryDisplay =
    document.getElementById(
        "categoryDisplay"
    );


const puzzleDisplay =
    document.getElementById(
        "puzzleDisplay"
    );


const timerDisplay =
    document.getElementById(
        "timerDisplay"
    );


const gameMessage =
    document.getElementById(
        "gameMessage"
    );


const startGameButton =
    document.getElementById(
        "startGameButton"
    );


const timeButtons =
    document.querySelectorAll(
        ".time-button"
    );


const cooldownButtons =
    document.querySelectorAll(
        ".cooldown-button"
    );


const settingsPanel =
    document.getElementById(
        "settingsPanel"
    );


const cooldownDisplay =
    document.getElementById(
        "cooldownDisplay"
    );


const cooldownTimerDisplay =
    document.getElementById(
        "cooldownTimer"
    );


/* =====================================================
   SELECT REVEAL TIME
===================================================== */

timeButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                if (gameRunning) {

                    return;

                }


                timeButtons.forEach(
                    function(item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                revealInterval =
                    Number(
                        button.dataset.time
                    );


                timerDisplay.textContent =
                    revealInterval;

            }
        );

    }
);


/* =====================================================
   SELECT COOLDOWN
===================================================== */

cooldownButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                if (gameRunning) {

                    return;

                }


                cooldownButtons.forEach(
                    function(item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                cooldownLength =
                    Number(
                        button.dataset.cooldown
                    );

            }
        );

    }
);


/* =====================================================
   GET RANDOM CATEGORY
===================================================== */

function getRandomCategory() {

    const categories =
        Object.keys(
            puzzles
        );


    return categories[
        Math.floor(
            Math.random() *
            categories.length
        )
    ];

}


/* =====================================================
   GET RANDOM PUZZLE
===================================================== */

function getRandomPuzzle(
    category
) {

    const categoryPuzzles =
        puzzles[
            category
        ];


    return categoryPuzzles[
        Math.floor(
            Math.random() *
            categoryPuzzles.length
        )
    ];

}


/* =====================================================
   START GAME
===================================================== */

startGameButton.addEventListener(
    "click",
    function() {

        if (gameRunning) {

            return;

        }


        startGame();

    }
);


/* =====================================================
   START ROUND
===================================================== */

function startGame() {

    clearInterval(
        gameTimer
    );


    clearInterval(
        cooldownTimer
    );


    cooldownRunning =
        false;


    cooldownDisplay.classList.add(
        "hidden"
    );


    // -----------------------------------------------
    // SELECT CATEGORY
    // -----------------------------------------------

    currentCategory =
        getRandomCategory();


    // -----------------------------------------------
    // SELECT ANSWER
    // -----------------------------------------------

    currentAnswer =
        getRandomPuzzle(
            currentCategory
        );


    // -----------------------------------------------
    // RESET LETTERS
    // -----------------------------------------------

    revealedLetters = [];


    // -----------------------------------------------
    // RESET TIMER
    // -----------------------------------------------

    timer =
        revealInterval;


    // -----------------------------------------------
    // GAME STATE
    // -----------------------------------------------

    gameRunning =
        true;


    // -----------------------------------------------
    // UPDATE SCREEN
    // -----------------------------------------------

    categoryDisplay.textContent =
        currentCategory;


    gameMessage.textContent =
        "GUESS THE ANSWER IN CHAT!";


    timerDisplay.textContent =
        timer;


    renderPuzzle();


    // -----------------------------------------------
    // HIDE SETTINGS
    // -----------------------------------------------

    settingsPanel.style.display =
        "none";


    // -----------------------------------------------
    // START COUNTDOWN
    // -----------------------------------------------

    startCountdown();

});


/* =====================================================
   RENDER PUZZLE
===================================================== */

function renderPuzzle() {

    puzzleDisplay.innerHTML =
        "";


    currentAnswer
        .split("")
        .forEach(
            function(character) {

                // -------------------------------------
                // SPACE BETWEEN WORDS
                // -------------------------------------

                if (
                    character === " "
                ) {

                    const space =
                        document.createElement(
                            "div"
                        );


                    space.className =
                        "word-space";


                    puzzleDisplay.appendChild(
                        space
                    );


                    return;

                }


                // -------------------------------------
                // CREATE LETTER BOX
                // -------------------------------------

                const box =
                    document.createElement(
                        "div"
                    );


                box.className =
                    "letter-box";


                // -------------------------------------
                // LETTER IS REVEALED
                // -------------------------------------

                if (
                    revealedLetters.includes(
                        character
                    )
                ) {

                    box.classList.add(
                        "revealed"
                    );


                    box.textContent =
                        character;

                }


                // -------------------------------------
                // LETTER IS HIDDEN
                // -------------------------------------

                else {

                    box.classList.add(
                        "hidden"
                    );


                    box.textContent =
                        character;

                }


                puzzleDisplay.appendChild(
                    box
                );

            }
        );

}


/* =====================================================
   START COUNTDOWN
===================================================== */

function startCountdown() {

    clearInterval(
        gameTimer
    );


    gameTimer =
        setInterval(
            function() {

                if (!gameRunning) {

                    return;

                }


                timer--;


                timerDisplay.textContent =
                    timer;


                // -------------------------------------
                // WARNING
                // -------------------------------------

                if (
                    timer <= 5
                ) {

                    timerDisplay.classList.add(
                        "warning"
                    );

                } else {

                    timerDisplay.classList.remove(
                        "warning"
                    );

                }


                // -------------------------------------
                // TIME UP
                // -------------------------------------

                if (
                    timer <= 0
                ) {

                    timerDisplay.classList.remove(
                        "warning"
                    );


                    revealNextLetter();

                }

            },
            1000
        );

}


/* =====================================================
   REVEAL NEXT LETTER
===================================================== */

function revealNextLetter() {

    clearInterval(
        gameTimer
    );


    // -----------------------------------------------
    // FIND LETTERS THAT HAVE NOT BEEN REVEALED
    // -----------------------------------------------

    const availableLetters =
        [
            ...new Set(

                currentAnswer
                    .split("")
                    .filter(
                        function(letter) {

                            return (
                                /[A-Z0-9]/.test(
                                    letter
                                )
                                &&
                                !revealedLetters
                                    .includes(
                                        letter
                                    )
                            );

                        }
                    )

            )
        ];


    // -----------------------------------------------
    // NO LETTERS LEFT
    // -----------------------------------------------

    if (
        availableLetters.length === 0
    ) {

        finishRound();

        return;

    }


    // -----------------------------------------------
    // PICK A LETTER
    // -----------------------------------------------

    const letter =
        availableLetters[
            Math.floor(
                Math.random() *
                availableLetters.length
            )
        ];


    // -----------------------------------------------
    // SAVE LETTER
    // -----------------------------------------------

    revealedLetters.push(
        letter
    );


    // -----------------------------------------------
    // UPDATE PUZZLE
    // -----------------------------------------------

    renderPuzzle();


    // -----------------------------------------------
    // MESSAGE
    // -----------------------------------------------

    gameMessage.textContent =
        `LETTER REVEALED: ${letter}`;


    // -----------------------------------------------
    // CHECK IF PUZZLE IS COMPLETE
    // -----------------------------------------------

    if (
        isPuzzleComplete()
    ) {

        finishRound();

        return;

    }


    // -----------------------------------------------
    // RESET TIMER
    // -----------------------------------------------

    timer =
        revealInterval;


    timerDisplay.textContent =
        timer;


    // -----------------------------------------------
    // START AGAIN
    // -----------------------------------------------

    startCountdown();

}


/* =====================================================
   CHECK PUZZLE
===================================================== */

function isPuzzleComplete() {

    const letters =
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


    return letters.every(
        function(letter) {

            return revealedLetters.includes(
                letter
            );

        }
    );

}


/* =====================================================
   FINISH ROUND
===================================================== */

function finishRound() {

    clearInterval(
        gameTimer
    );


    gameRunning =
        false;


    timerDisplay.classList.remove(
        "warning"
    );


    // -----------------------------------------------
    // SHOW COMPLETE ANSWER
    // -----------------------------------------------

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


    renderPuzzle();


    // -----------------------------------------------
    // MESSAGE
    // -----------------------------------------------

    gameMessage.textContent =
        "🎉 ANSWER REVEALED!";


    // -----------------------------------------------
    // START COOLDOWN
    // -----------------------------------------------

    startCooldown();

}


/* =====================================================
   COOLDOWN
===================================================== */

function startCooldown() {

    cooldownRunning =
        true;


    let remaining =
        cooldownLength;


    cooldownDisplay.classList.remove(
        "hidden"
    );


    cooldownTimerDisplay.textContent =
        remaining;


    cooldownTimer =
        setInterval(
            function() {

                remaining--;


                cooldownTimerDisplay.textContent =
                    remaining;


                if (
                    remaining <= 0
                ) {

                    clearInterval(
                        cooldownTimer
                    );


                    cooldownRunning =
                        false;


                    cooldownDisplay.classList.add(
                        "hidden"
                    );


                    startNextRound();

                }

            },
            1000
        );

}


/* =====================================================
   NEXT ROUND
===================================================== */

function startNextRound() {

    // Keep game running automatically

    startGame();

}


/* =====================================================
   INITIAL SCREEN
===================================================== */

categoryDisplay.textContent =
    "GET READY!";


puzzleDisplay.innerHTML =
    "";


timerDisplay.textContent =
    revealInterval;


gameMessage.textContent =
    "CHOOSE YOUR SETTINGS AND START";


/* =====================================================
   PREVENT RIGHT CLICK
   Optional for stream screen
===================================================== */

document.addEventListener(
    "contextmenu",
    function(event) {

        event.preventDefault();

    }
);
```

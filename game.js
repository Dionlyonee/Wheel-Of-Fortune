```javascript
/* =====================================================
   DIONLYONEE PLAYGROUND
   WHEEL OF FORTUNE
   AUTOMATIC GAME
===================================================== */


/* =====================================================
   PUZZLES
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


/* =====================================================
   TIMERS
===================================================== */

let gameTimer = null;

let cooldownTimer = null;


/* =====================================================
   ELEMENTS
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


const topStartButton =
    document.getElementById(
        "topStartButton"
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


const timeButtons =
    document.querySelectorAll(
        ".time-button"
    );


const cooldownButtons =
    document.querySelectorAll(
        ".cooldown-button"
    );


/* =====================================================
   REVEAL TIME BUTTONS
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
   COOLDOWN BUTTONS
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
   START BUTTON FUNCTION
===================================================== */

function handleStartGame() {

    if (gameRunning) {

        return;

    }


    startGame();

}


/* =====================================================
   START BUTTONS
===================================================== */

startGameButton.addEventListener(
    "click",
    handleStartGame
);


topStartButton.addEventListener(
    "click",
    handleStartGame
);


/* =====================================================
   KEYBOARD
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            handleStartGame();

        }

    }
);


/* =====================================================
   RANDOM CATEGORY
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
   RANDOM PUZZLE
===================================================== */

function getRandomPuzzle(
    category
) {

    const list =
        puzzles[
            category
        ];


    return list[
        Math.floor(
            Math.random() *
            list.length
        )
    ];

}


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


    cooldownDisplay.classList.add(
        "hidden"
    );


    currentCategory =
        getRandomCategory();


    currentAnswer =
        getRandomPuzzle(
            currentCategory
        );


    revealedLetters = [];


    timer =
        revealInterval;


    gameRunning =
        true;


    categoryDisplay.textContent =
        currentCategory;


    gameMessage.textContent =
        "GUESS THE ANSWER IN CHAT!";


    timerDisplay.textContent =
        timer;


    timerDisplay.classList.remove(
        "warning"
    );


    renderPuzzle();


    settingsPanel.style.display =
        "none";


    startCountdown();

}


/* =====================================================
   DRAW PUZZLE
===================================================== */

function renderPuzzle() {

    puzzleDisplay.innerHTML =
        "";


    currentAnswer
        .split("")
        .forEach(
            function(character) {

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


                const box =
                    document.createElement(
                        "div"
                    );


                box.className =
                    "letter-box";


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

                } else {

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
   COUNTDOWN
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


                if (
                    timer <= 5
                ) {

                    timerDisplay.classList.add(
                        "warning"
                    );

                }


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
   REVEAL LETTER
===================================================== */

function revealNextLetter() {

    clearInterval(
        gameTimer
    );


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
                                !revealedLetters.includes(
                                    letter
                                )
                            );

                        }
                    )

            )
        ];


    if (
        availableLetters.length === 0
    ) {

        finishRound();

        return;

    }


    const randomIndex =
        Math.floor(
            Math.random() *
            availableLetters.length
        );


    const letter =
        availableLetters[
            randomIndex
        ];


    revealedLetters.push(
        letter
    );


    renderPuzzle();


    gameMessage.textContent =
        `LETTER REVEALED: ${letter}`;


    if (
        isPuzzleComplete()
    ) {

        finishRound();

        return;

    }


    timer =
        revealInterval;


    timerDisplay.textContent =
        timer;


    startCountdown();

}


/* =====================================================
   CHECK COMPLETE
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


    timerDisplay.classList.remove(
        "warning"
    );


    timerDisplay.textContent =
        "✓";


    gameMessage.textContent =
        "🎉 ANSWER REVEALED!";


    startCooldown();

}


/* =====================================================
   COOLDOWN
===================================================== */

function startCooldown() {

    let remaining =
        cooldownLength;


    cooldownDisplay.classList.remove(
        "hidden"
    );


    cooldownTimerDisplay.textContent =
        remaining;


    clearInterval(
        cooldownTimer
    );


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

    startGame();

}
```

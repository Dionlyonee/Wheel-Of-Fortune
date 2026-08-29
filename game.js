```javascript
/* =====================================================
   DIONLYONEE PLAYGROUND
   WHEEL OF FORTUNE
   AUTOMATIC GAME
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Dionlyonee Playground loaded!");

    /* =================================================
       PUZZLES
    ================================================= */

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


    /* =================================================
       SETTINGS
    ================================================= */

    let revealInterval = 30;
    let cooldownLength = 10;


    /* =================================================
       GAME STATE
    ================================================= */

    let currentCategory = "";
    let currentAnswer = "";
    let revealedLetters = [];

    let timer = 30;

    let gameRunning = false;

    let gameTimer = null;
    let cooldownTimer = null;


    /* =================================================
       FIND HTML ELEMENTS
    ================================================= */

    const categoryDisplay =
        document.getElementById("categoryDisplay");

    const puzzleDisplay =
        document.getElementById("puzzleDisplay");

    const timerDisplay =
        document.getElementById("timerDisplay");

    const gameMessage =
        document.getElementById("gameMessage");

    const startGameButton =
        document.getElementById("startGameButton");

    const topStartButton =
        document.getElementById("topStartButton");

    const settingsPanel =
        document.getElementById("settingsPanel");

    const cooldownDisplay =
        document.getElementById("cooldownDisplay");

    const cooldownTimerDisplay =
        document.getElementById("cooldownTimer");

    const timeButtons =
        document.querySelectorAll(".time-button");

    const cooldownButtons =
        document.querySelectorAll(".cooldown-button");


    /* =================================================
       CHECK HTML
    ================================================= */

    console.log("Checking game buttons...");

    console.log(
        "Main Start Button:",
        startGameButton
    );

    console.log(
        "Top Start Button:",
        topStartButton
    );


    /* =================================================
       RANDOM CATEGORY
    ================================================= */

    function getRandomCategory() {

        const categories =
            Object.keys(puzzles);

        return categories[
            Math.floor(
                Math.random() * categories.length
            )
        ];

    }


    /* =================================================
       RANDOM PUZZLE
    ================================================= */

    function getRandomPuzzle(category) {

        const list =
            puzzles[category];

        return list[
            Math.floor(
                Math.random() * list.length
            )
        ];

    }


    /* =================================================
       START GAME
    ================================================= */

    function startGame() {

        console.log("START GAME PRESSED");

        clearInterval(gameTimer);
        clearInterval(cooldownTimer);


        if (cooldownDisplay) {

            cooldownDisplay.classList.add("hidden");

        }


        /* SELECT CATEGORY */

        currentCategory =
            getRandomCategory();


        /* SELECT PUZZLE */

        currentAnswer =
            getRandomPuzzle(
                currentCategory
            );


        /* RESET */

        revealedLetters = [];

        timer = revealInterval;

        gameRunning = true;


        console.log(
            "Category:",
            currentCategory
        );

        console.log(
            "New game started!"
        );


        /* UPDATE SCREEN */

        if (categoryDisplay) {

            categoryDisplay.textContent =
                currentCategory;

        }


        if (gameMessage) {

            gameMessage.textContent =
                "GUESS THE ANSWER IN CHAT!";

        }


        if (timerDisplay) {

            timerDisplay.textContent =
                timer;

            timerDisplay.classList.remove(
                "warning"
            );

        }


        /* DRAW PUZZLE */

        renderPuzzle();


        /* HIDE SETTINGS */

        if (settingsPanel) {

            settingsPanel.style.display =
                "none";

        }


        /* START TIMER */

        startCountdown();

    }


    /* =================================================
       DRAW PUZZLE
    ================================================= */

    function renderPuzzle() {

        if (!puzzleDisplay) {

            console.error(
                "ERROR: puzzleDisplay was not found."
            );

            return;

        }


        puzzleDisplay.innerHTML = "";


        for (
            let i = 0;
            i < currentAnswer.length;
            i++
        ) {

            const character =
                currentAnswer[i];


            /* SPACE BETWEEN WORDS */

            if (character === " ") {

                const space =
                    document.createElement("div");

                space.className =
                    "word-space";

                puzzleDisplay.appendChild(
                    space
                );

                continue;

            }


            /* LETTER BOX */

            const box =
                document.createElement("div");

            box.className =
                "letter-box";


            /* REVEALED */

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


            /* HIDDEN */

            else {

                box.classList.add(
                    "hidden"
                );

                /*
                   We deliberately leave
                   the text empty.
                */

                box.textContent = "";

            }


            puzzleDisplay.appendChild(
                box
            );

        }

    }


    /* =================================================
       COUNTDOWN
    ================================================= */

    function startCountdown() {

        clearInterval(gameTimer);


        gameTimer =
            setInterval(
                function () {

                    if (!gameRunning) {

                        return;

                    }


                    timer--;


                    if (timerDisplay) {

                        timerDisplay.textContent =
                            timer;

                    }


                    /* LAST 5 SECONDS */

                    if (timer <= 5) {

                        if (timerDisplay) {

                            timerDisplay.classList.add(
                                "warning"
                            );

                        }

                    }


                    /* TIME TO REVEAL */

                    if (timer <= 0) {

                        if (timerDisplay) {

                            timerDisplay.classList.remove(
                                "warning"
                            );

                        }

                        revealNextLetter();

                    }

                },
                1000
            );

    }


    /* =================================================
       REVEAL NEXT LETTER
    ================================================= */

    function revealNextLetter() {

        clearInterval(gameTimer);


        /* FIND HIDDEN LETTERS */

        const availableLetters = [
            ...new Set(

                currentAnswer
                    .split("")
                    .filter(
                        function (letter) {

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


        /* NO LETTERS LEFT */

        if (
            availableLetters.length === 0
        ) {

            finishRound();

            return;

        }


        /* PICK RANDOM LETTER */

        const randomIndex =
            Math.floor(
                Math.random() *
                availableLetters.length
            );


        const letter =
            availableLetters[randomIndex];


        /* SAVE LETTER */

        revealedLetters.push(
            letter
        );


        console.log(
            "Revealed letter:",
            letter
        );


        /* UPDATE SCREEN */

        renderPuzzle();


        if (gameMessage) {

            gameMessage.textContent =
                "LETTER REVEALED!";

        }


        /* CHECK PUZZLE */

        if (
            isPuzzleComplete()
        ) {

            finishRound();

            return;

        }


        /* RESET TIMER */

        timer =
            revealInterval;


        if (timerDisplay) {

            timerDisplay.textContent =
                timer;

        }


        /* CONTINUE */

        startCountdown();

    }


    /* =================================================
       CHECK PUZZLE
    ================================================= */

    function isPuzzleComplete() {

        const letters =
            [
                ...new Set(

                    currentAnswer
                        .split("")
                        .filter(
                            function (character) {

                                return /[A-Z0-9]/.test(
                                    character
                                );

                            }
                        )

                )
            ];


        return letters.every(
            function (letter) {

                return revealedLetters.includes(
                    letter
                );

            }
        );

    }


    /* =================================================
       FINISH ROUND
    ================================================= */

    function finishRound() {

        clearInterval(gameTimer);


        gameRunning = false;


        /* REVEAL EVERYTHING */

        revealedLetters =
            [
                ...new Set(

                    currentAnswer
                        .split("")
                        .filter(
                            function (character) {

                                return /[A-Z0-9]/.test(
                                    character
                                );

                            }
                        )

                )
            ];


        renderPuzzle();


        if (timerDisplay) {

            timerDisplay.textContent =
                "✓";

        }


        if (gameMessage) {

            gameMessage.textContent =
                "ANSWER REVEALED!";

        }


        startCooldown();

    }


    /* =================================================
       COOLDOWN
    ================================================= */

    function startCooldown() {

        let remaining =
            cooldownLength;


        if (cooldownDisplay) {

            cooldownDisplay.classList.remove(
                "hidden"
            );

        }


        if (cooldownTimerDisplay) {

            cooldownTimerDisplay.textContent =
                remaining;

        }


        clearInterval(cooldownTimer);


        cooldownTimer =
            setInterval(
                function () {

                    remaining--;


                    if (cooldownTimerDisplay) {

                        cooldownTimerDisplay.textContent =
                            remaining;

                    }


                    if (remaining <= 0) {

                        clearInterval(
                            cooldownTimer
                        );


                        if (cooldownDisplay) {

                            cooldownDisplay.classList.add(
                                "hidden"
                            );

                        }


                        startGame();

                    }

                },
                1000
            );

    }


    /* =================================================
       START BUTTON
    ================================================= */

    function handleStart() {

        console.log(
            "Start command received!"
        );


        if (gameRunning) {

            console.log(
                "Game is already running."
            );

            return;

        }


        startGame();

    }


    /* =================================================
       MAIN START BUTTON
    ================================================= */

    if (startGameButton) {

        startGameButton.addEventListener(
            "click",
            handleStart
        );

        console.log(
            "Main START button connected."
        );

    }
    else {

        console.error(
            "Main START button NOT FOUND."
        );

    }


    /* =================================================
       TOP START BUTTON
    ================================================= */

    if (topStartButton) {

        topStartButton.addEventListener(
            "click",
            handleStart
        );

        console.log(
            "Top START button connected."
        );

    }
    else {

        console.warn(
            "Top START button not found."
        );

    }


    /* =================================================
       ENTER KEY
    ================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                console.log(
                    "ENTER KEY PRESSED"
                );

                handleStart();

            }

        }
    );


    /* =================================================
       REVEAL TIME SETTINGS
    ================================================= */

    timeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    if (gameRunning) {

                        return;

                    }


                    timeButtons.forEach(
                        function (item) {

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


                    timer =
                        revealInterval;


                    if (timerDisplay) {

                        timerDisplay.textContent =
                            revealInterval;

                    }

                }
            );

        }
    );


    /* =================================================
       COOLDOWN SETTINGS
    ================================================= */

    cooldownButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    if (gameRunning) {

                        return;

                    }


                    cooldownButtons.forEach(
                        function (item) {

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


    /* =================================================
       INITIAL SCREEN
    ================================================= */

    if (categoryDisplay) {

        categoryDisplay.textContent =
            "GET READY!";

    }


    if (timerDisplay) {

        timerDisplay.textContent =
            revealInterval;

    }


    if (gameMessage) {

        gameMessage.textContent =
            "CHOOSE YOUR SETTINGS AND PRESS ENTER";

    }


    console.log(
        "Dionlyonee Wheel of Fortune is READY!"
    );

});
```

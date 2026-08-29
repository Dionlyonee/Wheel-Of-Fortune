```javascript
/* ==================================================
   DIONLYONEE PLAYGROUND
   WHEEL OF FORTUNE

   AUTOMATIC STREAM GAME
================================================== */


/* ==================================================
   PUZZLES
================================================== */

const puzzles = {

    "ANIMALS": [

        "ELEPHANT",
        "GIRAFFE",
        "LION",
        "TIGER",
        "MONKEY",
        "DOLPHIN",
        "CROCODILE",
        "KANGAROO",
        "CHEETAH",
        "GORILLA",
        "ZEBRA",
        "HIPPOPOTAMUS"

    ],


    "COUNTRIES": [

        "JAMAICA",
        "CANADA",
        "BRAZIL",
        "JAPAN",
        "MEXICO",
        "BAHAMAS",
        "BARBADOS",
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
        "ICE CREAM",
        "FRENCH FRIES",
        "PANCAKES",
        "CHOCOLATE CAKE",
        "CHEESEBURGER"

    ],


    "MOVIES": [

        "THE LION KING",
        "BLACK PANTHER",
        "HOME ALONE",
        "TOY STORY",
        "THE MATRIX",
        "AVATAR",
        "JURASSIC PARK",
        "BAD BOYS",
        "MEN IN BLACK",
        "COMING TO AMERICA"

    ],


    "MUSIC": [

        "ONE LOVE",
        "THRILLER",
        "PURPLE RAIN",
        "BILLIE JEAN",
        "ISLAND IN THE SUN",
        "THREE LITTLE BIRDS",
        "RED RED WINE",
        "COULD YOU BE LOVED"

    ],


    "SPORTS": [

        "BASKETBALL",
        "FOOTBALL",
        "CRICKET",
        "BASEBALL",
        "TENNIS",
        "BOXING",
        "GOLF",
        "SWIMMING",
        "VOLLEYBALL"

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
        "ORLANDO"

    ]

};


/* ==================================================
   SETTINGS
================================================== */

let revealTime = 30;

let cooldownTime = 10;


/* ==================================================
   GAME STATE
================================================== */

let currentAnswer = "";

let currentCategory = "";

let revealedLetters = [];

let seconds = 30;

let gameRunning = false;

let gameTimer = null;

let cooldownTimer = null;


/* ==================================================
   HTML ELEMENTS
================================================== */

const startGameButton =
    document.getElementById(
        "startGame"
    );

const startTopButton =
    document.getElementById(
        "startTop"
    );

const categoryElement =
    document.getElementById(
        "category"
    );

const puzzleElement =
    document.getElementById(
        "puzzle"
    );

const timerElement =
    document.getElementById(
        "timer"
    );

const messageElement =
    document.getElementById(
        "message"
    );

const controlsElement =
    document.getElementById(
        "controls"
    );

const cooldownElement =
    document.getElementById(
        "cooldown"
    );

const cooldownNumberElement =
    document.getElementById(
        "cooldownNumber"
    );


/* ==================================================
   GET RANDOM CATEGORY
================================================== */

function randomCategory() {

    const categories =
        Object.keys(
            puzzles
        );


    const randomIndex =
        Math.floor(
            Math.random() *
            categories.length
        );


    return categories[
        randomIndex
    ];

}


/* ==================================================
   GET RANDOM ANSWER
================================================== */

function randomAnswer(category) {

    const list =
        puzzles[
            category
        ];


    const randomIndex =
        Math.floor(
            Math.random() *
            list.length
        );


    return list[
        randomIndex
    ];

}


/* ==================================================
   START GAME
================================================== */

function startGame() {

    console.log(
        "Starting game..."
    );


    /* Stop existing timers */

    clearInterval(
        gameTimer
    );

    clearInterval(
        cooldownTimer
    );


    /* Hide cooldown */

    cooldownElement.classList.add(
        "hidden"
    );


    /* Pick category */

    currentCategory =
        randomCategory();


    /* Pick answer */

    currentAnswer =
        randomAnswer(
            currentCategory
        );


    /* Reset letters */

    revealedLetters = [];


    /* Reset timer */

    seconds =
        revealTime;


    /* Game active */

    gameRunning = true;


    /* Update category */

    categoryElement.textContent =
        currentCategory;


    /* Update timer */

    timerElement.textContent =
        seconds;


    timerElement.classList.remove(
        "warning"
    );


    /* Update message */

    messageElement.textContent =
        "GUESS THE ANSWER IN CHAT!";


    /* Hide controls */

    controlsElement.style.display =
        "none";


    /* Draw puzzle */

    drawPuzzle();


    /* Start countdown */

    startTimer();

}


/* ==================================================
   DRAW PUZZLE
================================================== */

function drawPuzzle() {

    puzzleElement.innerHTML =
        "";


    for (
        let i = 0;
        i < currentAnswer.length;
        i++
    ) {

        const character =
            currentAnswer[i];


        /* WORD SPACE */

        if (
            character === " "
        ) {

            const space =
                document.createElement(
                    "div"
                );


            space.className =
                "word-space";


            puzzleElement.appendChild(
                space
            );


            continue;

        }


        /* LETTER */

        const letter =
            document.createElement(
                "div"
            );


        letter.className =
            "letter";


        /* Is revealed? */

        if (
            revealedLetters.includes(
                character
            )
        ) {

            letter.textContent =
                character;


            letter.classList.add(
                "revealed"
            );

        }


        puzzleElement.appendChild(
            letter
        );

    }

}


/* ==================================================
   START TIMER
================================================== */

function startTimer() {

    clearInterval(
        gameTimer
    );


    gameTimer =
        setInterval(
            function() {

                seconds--;


                timerElement.textContent =
                    seconds;


                /* Warning */

                if (
                    seconds <= 5
                ) {

                    timerElement.classList.add(
                        "warning"
                    );

                }


                /* Reveal */

                if (
                    seconds <= 0
                ) {

                    revealLetter();

                }

            },
            1000
        );

}


/* ==================================================
   REVEAL LETTER
================================================== */

function revealLetter() {

    clearInterval(
        gameTimer
    );


    /* Find hidden letters */

    const hiddenLetters =
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


    /* No letters remaining */

    if (
        hiddenLetters.length === 0
    ) {

        finishGame();

        return;

    }


    /* Pick random letter */

    const randomIndex =
        Math.floor(
            Math.random() *
            hiddenLetters.length
        );


    const letter =
        hiddenLetters[
            randomIndex
        ];


    /* Reveal */

    revealedLetters.push(
        letter
    );


    console.log(
        "Letter revealed:",
        letter
    );


    /* Redraw */

    drawPuzzle();


    messageElement.textContent =
        "A LETTER HAS BEEN REVEALED!";


    /* Check if complete */

    if (
        puzzleComplete()
    ) {

        finishGame();

        return;

    }


    /* Reset timer */

    seconds =
        revealTime;


    timerElement.textContent =
        seconds;


    timerElement.classList.remove(
        "warning"
    );


    /* Continue */

    startTimer();

}


/* ==================================================
   CHECK PUZZLE
================================================== */

function puzzleComplete() {

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


/* ==================================================
   FINISH GAME
================================================== */

function finishGame() {

    clearInterval(
        gameTimer
    );


    gameRunning = false;


    /* Reveal entire answer */

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


    drawPuzzle();


    timerElement.classList.remove(
        "warning"
    );


    timerElement.textContent =
        "✓";


    messageElement.textContent =
        "ANSWER REVEALED!";


    /* Start cooldown */

    startCooldown();

}


/* ==================================================
   COOLDOWN
================================================== */

function startCooldown() {

    let remaining =
        cooldownTime;


    cooldownElement.classList.remove(
        "hidden"
    );


    cooldownNumberElement.textContent =
        remaining;


    clearInterval(
        cooldownTimer
    );


    cooldownTimer =
        setInterval(
            function() {

                remaining--;


                cooldownNumberElement.textContent =
                    remaining;


                if (
                    remaining <= 0
                ) {

                    clearInterval(
                        cooldownTimer
                    );


                    cooldownElement.classList.add(
                        "hidden"
                    );


                    startGame();

                }

            },
            1000
        );

}


/* ==================================================
   TIME BUTTONS
================================================== */

const timeButtons =
    document.querySelectorAll(
        ".time-option"
    );


timeButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                if (
                    gameRunning
                ) {

                    return;

                }


                /* Remove selection */

                timeButtons.forEach(
                    function(item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                /* Select button */

                button.classList.add(
                    "selected"
                );


                /* Save time */

                revealTime =
                    Number(
                        button.dataset.time
                    );


                /* Update timer */

                seconds =
                    revealTime;


                timerElement.textContent =
                    revealTime;


                messageElement.textContent =
                    `LETTERS REVEAL EVERY ${revealTime} SECONDS`;

            }
        );

    }
);


/* ==================================================
   COOLDOWN BUTTONS
================================================== */

const cooldownButtons =
    document.querySelectorAll(
        ".cooldown-option"
    );


cooldownButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                if (
                    gameRunning
                ) {

                    return;

                }


                /* Remove selection */

                cooldownButtons.forEach(
                    function(item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                /* Select */

                button.classList.add(
                    "selected"
                );


                /* Save */

                cooldownTime =
                    Number(
                        button.dataset.cooldown
                    );


                messageElement.textContent =
                    `NEXT PUZZLE IN ${cooldownTime} SECONDS AFTER EACH ROUND`;

            }
        );

    }
);


/* ==================================================
   START GAME BUTTON
================================================== */

startGameButton.addEventListener(
    "click",
    function() {

        startGame();

    }
);


/* ==================================================
   TOP START BUTTON
================================================== */

startTopButton.addEventListener(
    "click",
    function() {

        startGame();

    }
);


/* ==================================================
   ENTER KEY
================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();


            if (
                !gameRunning
            ) {

                startGame();

            }

        }

    }
);


/* ==================================================
   INITIAL SCREEN
================================================== */

timerElement.textContent =
    revealTime;


messageElement.textContent =
    "CHOOSE YOUR TIME AND PRESS ENTER";


console.log(
    "================================="
);

console.log(
    "DIONLYONEE PLAYGROUND READY"
);

console.log(
    "Reveal time:",
    revealTime
);

console.log(
    "Cooldown:",
    cooldownTime
);

console.log(
    "================================="
);
```

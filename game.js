```javascript
/* =====================================================
   DIONLYONEE PLAYGROUND
   WHEEL OF FORTUNE
===================================================== */


/* =====================================================
   GAME DATA
===================================================== */

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
        "GORILLA"
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
        "FRANCE"
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
        "IRIE VIBES"
    ],

    "FOOD": [
        "JERK CHICKEN",
        "RICE AND PEAS",
        "FRIED CHICKEN",
        "PIZZA",
        "HAMBURGER",
        "ICE CREAM",
        "FRENCH FRIES",
        "PANCAKES"
    ],

    "MOVIES": [
        "THE LION KING",
        "BLACK PANTHER",
        "HOME ALONE",
        "TOY STORY",
        "THE MATRIX",
        "AVATAR",
        "JURASSIC PARK",
        "BAD BOYS"
    ],

    "MUSIC": [
        "ONE LOVE",
        "THRILLER",
        "PURPLE RAIN",
        "BILLIE JEAN",
        "ISLAND IN THE SUN",
        "THREE LITTLE BIRDS"
    ]

};


/* =====================================================
   SETTINGS
===================================================== */

let revealTime = 30;
let cooldownTime = 10;


/* =====================================================
   GAME STATE
===================================================== */

let answer = "";
let category = "";
let revealed = [];

let seconds = 30;

let playing = false;

let timer = null;
let cooldownTimer = null;


/* =====================================================
   HTML ELEMENTS
===================================================== */

const startButton =
    document.getElementById("startGameButton");

const topButton =
    document.getElementById("topStartButton");

const categoryBox =
    document.getElementById("categoryDisplay");

const puzzleBox =
    document.getElementById("puzzleDisplay");

const timerBox =
    document.getElementById("timerDisplay");

const messageBox =
    document.getElementById("gameMessage");

const settings =
    document.getElementById("settingsPanel");

const cooldownBox =
    document.getElementById("cooldownDisplay");

const cooldownTimerBox =
    document.getElementById("cooldownTimer");


/* =====================================================
   TIME BUTTONS
===================================================== */

const timeButtons =
    document.querySelectorAll(".time-button");


timeButtons.forEach(function(button) {

    button.addEventListener("click", function(event) {

        event.preventDefault();
        event.stopPropagation();

        console.log(
            "TIME BUTTON CLICKED:",
            button.dataset.time
        );


        /* Don't change settings during a game */

        if (playing) {
            return;
        }


        /* Remove active from all */

        timeButtons.forEach(function(item) {

            item.classList.remove("active");

        });


        /* Make this one active */

        button.classList.add("active");


        /* Save time */

        revealTime =
            Number(button.dataset.time);


        /* Update timer */

        seconds =
            revealTime;


        timerBox.textContent =
            revealTime;


        messageBox.textContent =
            `LETTERS REVEAL EVERY ${revealTime} SECONDS`;


        console.log(
            "Reveal time set to:",
            revealTime
        );

    });

});


/* =====================================================
   COOLDOWN BUTTONS
===================================================== */

const cooldownButtons =
    document.querySelectorAll(".cooldown-button");


cooldownButtons.forEach(function(button) {

    button.addEventListener("click", function(event) {

        event.preventDefault();
        event.stopPropagation();

        console.log(
            "COOLDOWN BUTTON CLICKED:",
            button.dataset.cooldown
        );


        /* Don't change during game */

        if (playing) {
            return;
        }


        /* Remove active */

        cooldownButtons.forEach(function(item) {

            item.classList.remove("active");

        });


        /* Activate selected */

        button.classList.add("active");


        /* Save cooldown */

        cooldownTime =
            Number(button.dataset.cooldown);


        messageBox.textContent =
            `NEXT ROUND COOLDOWN: ${cooldownTime} SECONDS`;


        console.log(
            "Cooldown set to:",
            cooldownTime
        );

    });

});


/* =====================================================
   RANDOM CATEGORY
===================================================== */

function getRandomCategory() {

    const categories =
        Object.keys(puzzles);

    return categories[
        Math.floor(
            Math.random() *
            categories.length
        )
    ];

}


/* =====================================================
   RANDOM ANSWER
===================================================== */

function getRandomAnswer(categoryName) {

    const list =
        puzzles[categoryName];

    return list[
        Math.floor(
            Math.random() *
            list.length
        )
    ];

}


/* =====================================================
   START GAME
===================================================== */

function startGame() {

    console.log("================================");
    console.log("STARTING GAME");
    console.log("Reveal time:", revealTime);
    console.log("Cooldown:", cooldownTime);
    console.log("================================");


    clearInterval(timer);
    clearInterval(cooldownTimer);


    /* Pick category */

    category =
        getRandomCategory();


    /* Pick answer */

    answer =
        getRandomAnswer(category);


    /* Reset */

    revealed = [];

    seconds = revealTime;

    playing = true;


    /* Category */

    categoryBox.textContent =
        category;


    /* Timer */

    timerBox.textContent =
        seconds;


    /* Message */

    messageBox.textContent =
        "GUESS THE ANSWER IN CHAT!";


    /* Hide settings */

    settings.style.display =
        "none";


    /* Draw */

    drawPuzzle();


    /* Start */

    startTimer();

}


/* =====================================================
   DRAW PUZZLE
===================================================== */

function drawPuzzle() {

    puzzleBox.innerHTML = "";


    for (
        let i = 0;
        i < answer.length;
        i++
    ) {

        const character =
            answer[i];


        /* WORD SPACE */

        if (character === " ") {

            const space =
                document.createElement("div");

            space.className =
                "word-space";

            puzzleBox.appendChild(
                space
            );

            continue;

        }


        /* LETTER BOX */

        const box =
            document.createElement("div");

        box.className =
            "letter-box";


        /* Revealed */

        if (
            revealed.includes(character)
        ) {

            box.classList.add(
                "revealed"
            );

            box.textContent =
                character;

        }


        /* Hidden */

        else {

            box.classList.add(
                "hidden"
            );

            box.textContent =
                "";

        }


        puzzleBox.appendChild(
            box
        );

    }

}


/* =====================================================
   TIMER
===================================================== */

function startTimer() {

    clearInterval(timer);


    timer =
        setInterval(function() {

            seconds--;


            timerBox.textContent =
                seconds;


            if (seconds <= 5) {

                timerBox.classList.add(
                    "warning"
                );

            }


            if (seconds <= 0) {

                timerBox.classList.remove(
                    "warning"
                );

                revealLetter();

            }

        }, 1000);

}


/* =====================================================
   REVEAL LETTER
===================================================== */

function revealLetter() {

    clearInterval(timer);


    const hiddenLetters =
        [
            ...new Set(

                answer
                    .split("")
                    .filter(function(letter) {

                        return (
                            /[A-Z0-9]/.test(letter)
                            &&
                            !revealed.includes(letter)
                        );

                    })

            )
        ];


    /* No letters left */

    if (
        hiddenLetters.length === 0
    ) {

        finishGame();

        return;

    }


    /* Random letter */

    const randomIndex =
        Math.floor(
            Math.random() *
            hiddenLetters.length
        );


    const letter =
        hiddenLetters[randomIndex];


    /* Save */

    revealed.push(letter);


    console.log(
        "Revealed:",
        letter
    );


    /* Update */

    drawPuzzle();


    messageBox.textContent =
        "A LETTER HAS BEEN REVEALED!";


    /* Check */

    if (
        puzzleComplete()
    ) {

        finishGame();

        return;

    }


    /* Reset timer */

    seconds =
        revealTime;


    timerBox.textContent =
        seconds;


    startTimer();

}


/* =====================================================
   CHECK COMPLETE
===================================================== */

function puzzleComplete() {

    const letters =
        [
            ...new Set(

                answer
                    .split("")
                    .filter(function(character) {

                        return /[A-Z0-9]/.test(
                            character
                        );

                    })

            )
        ];


    return letters.every(function(letter) {

        return revealed.includes(letter);

    });

}


/* =====================================================
   FINISH GAME
===================================================== */

function finishGame() {

    clearInterval(timer);


    playing = false;


    /* Reveal all */

    revealed =
        [
            ...new Set(

                answer
                    .split("")
                    .filter(function(character) {

                        return /[A-Z0-9]/.test(
                            character
                        );

                    })

            )
        ];


    drawPuzzle();


    timerBox.textContent =
        "✓";


    messageBox.textContent =
        "ANSWER REVEALED!";


    startCooldown();

}


/* =====================================================
   COOLDOWN
===================================================== */

function startCooldown() {

    let remaining =
        cooldownTime;


    cooldownBox.classList.remove(
        "hidden"
    );


    cooldownTimerBox.textContent =
        remaining;


    clearInterval(
        cooldownTimer
    );


    cooldownTimer =
        setInterval(function() {

            remaining--;


            cooldownTimerBox.textContent =
                remaining;


            if (remaining <= 0) {

                clearInterval(
                    cooldownTimer
                );


                cooldownBox.classList.add(
                    "hidden"
                );


                startGame();

            }

        }, 1000);

}


/* =====================================================
   START BUTTON
===================================================== */

startButton.addEventListener(
    "click",
    function(event) {

        event.preventDefault();

        console.log(
            "MAIN START BUTTON CLICKED"
        );

        if (!playing) {

            startGame();

        }

    }
);


/* =====================================================
   TOP START BUTTON
===================================================== */

topButton.addEventListener(
    "click",
    function(event) {

        event.preventDefault();

        console.log(
            "TOP START BUTTON CLICKED"
        );

        if (!playing) {

            startGame();

        }

    }
);


/* =====================================================
   ENTER KEY
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();


            console.log(
                "ENTER KEY PRESSED"
            );


            if (!playing) {

                startGame();

            }

        }

    }
);


/* =====================================================
   INITIAL STATE
===================================================== */

categoryBox.textContent =
    "GET READY!";


timerBox.textContent =
    revealTime;


messageBox.textContent =
    "CHOOSE YOUR SETTINGS AND PRESS ENTER";


console.log(
    "DIONLYONEE PLAYGROUND READY"
);

console.log(
    "Time buttons found:",
    timeButtons.length
);

console.log(
    "Cooldown buttons found:",
    cooldownButtons.length
);
```

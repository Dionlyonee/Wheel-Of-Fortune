```javascript
/* =========================================
   DIONLYONEE PLAYGROUND
   WHEEL OF FORTUNE
========================================= */


/* =========================================
   PUZZLES
========================================= */

const puzzles = {

    Animals: [
        "ELEPHANT",
        "GIRAFFE",
        "MONKEY",
        "DOLPHIN",
        "CROCODILE",
        "KANGAROO"
    ],

    Countries: [
        "JAMAICA",
        "CANADA",
        "BRAZIL",
        "JAPAN",
        "MEXICO",
        "BAHAMAS"
    ],

    "Jamaican Phrases": [
        "WAH GWAAN",
        "WEH YUH A SEH",
        "MI DEH YA",
        "EVERYTING IRIE",
        "BIG UP",
        "WALK GOOD"
    ],

    Food: [
        "JERK CHICKEN",
        "RICE AND PEAS",
        "PIZZA",
        "HAMBURGER",
        "ICE CREAM"
    ]

};


/* =========================================
   SETTINGS
========================================= */

let revealTime = 30;

let cooldownTime = 10;


/* =========================================
   GAME VARIABLES
========================================= */

let answer = "";

let category = "";

let revealed = [];

let timer = null;

let seconds = 30;

let running = false;


/* =========================================
   GET HTML ELEMENTS
========================================= */

const startButton =
    document.getElementById("start");


const categoryElement =
    document.getElementById("category");


const puzzleElement =
    document.getElementById("puzzle");


const timerElement =
    document.getElementById("timer");


const messageElement =
    document.getElementById("message");


/* =========================================
   TIME BUTTONS
========================================= */

const timeButtons =
    document.querySelectorAll(".time-button");


timeButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        if (running) {
            return;
        }


        timeButtons.forEach(function(item) {

            item.classList.remove("active");

        });


        button.classList.add("active");


        revealTime =
            Number(button.dataset.time);


        timerElement.textContent =
            revealTime;


        seconds =
            revealTime;


        messageElement.textContent =
            "REVEAL TIME: " +
            revealTime +
            " SECONDS";


        console.log(
            "Reveal time:",
            revealTime
        );

    });

});


/* =========================================
   COOLDOWN BUTTONS
========================================= */

const cooldownButtons =
    document.querySelectorAll(".cooldown-button");


cooldownButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        if (running) {
            return;
        }


        cooldownButtons.forEach(function(item) {

            item.classList.remove("active");

        });


        button.classList.add("active");


        cooldownTime =
            Number(button.dataset.time);


        messageElement.textContent =
            "COOLDOWN: " +
            cooldownTime +
            " SECONDS";


        console.log(
            "Cooldown:",
            cooldownTime
        );

    });

});


/* =========================================
   START BUTTON
========================================= */

startButton.addEventListener(
    "click",
    function() {

        startGame();

    }
);


/* =========================================
   ENTER KEY
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
            &&
            !running
        ) {

            startGame();

        }

    }
);


/* =========================================
   START GAME
========================================= */

function startGame() {

    console.log(
        "STARTING GAME"
    );


    clearInterval(timer);


    /* Pick category */

    const categories =
        Object.keys(puzzles);


    const randomCategory =
        Math.floor(
            Math.random() *
            categories.length
        );


    category =
        categories[randomCategory];


    /* Pick answer */

    const words =
        puzzles[category];


    const randomWord =
        Math.floor(
            Math.random() *
            words.length
        );


    answer =
        words[randomWord];


    /* Reset */

    revealed = [];

    running = true;

    seconds = revealTime;


    /* Display */

    categoryElement.textContent =
        category;


    timerElement.textContent =
        seconds;


    messageElement.textContent =
        "GUESS THE ANSWER IN CHAT!";


    /* Draw */

    drawPuzzle();


    /* Start timer */

    timer =
        setInterval(
            countdown,
            1000
        );

}


/* =========================================
   DRAW PUZZLE
========================================= */

function drawPuzzle() {

    puzzleElement.innerHTML = "";


    for (
        let i = 0;
        i < answer.length;
        i++
    ) {

        const character =
            answer[i];


        /* Space */

        if (
            character === " "
        ) {

            const space =
                document.createElement("div");


            space.className =
                "space";


            puzzleElement.appendChild(
                space
            );


            continue;

        }


        /* Letter box */

        const box =
            document.createElement("div");


        box.className =
            "letter";


        if (
            revealed.includes(character)
        ) {

            box.textContent =
                character;


            box.classList.add(
                "revealed"
            );

        }


        puzzleElement.appendChild(
            box
        );

    }

}


/* =========================================
   COUNTDOWN
========================================= */

function countdown() {

    seconds--;


    timerElement.textContent =
        seconds;


    if (
        seconds <= 0
    ) {

        revealLetter();

    }

}


/* =========================================
   REVEAL LETTER
========================================= */

function revealLetter() {

    clearInterval(timer);


    /* Find hidden letters */

    const hidden =
        [
            ...new Set(

                answer
                    .split("")
                    .filter(function(letter) {

                        return (
                            letter !== " "
                            &&
                            !revealed.includes(letter)
                        );

                    })

            )
        ];


    /* If nothing left */

    if (
        hidden.length === 0
    ) {

        finishGame();

        return;

    }


    /* Pick random letter */

    const random =
        Math.floor(
            Math.random() *
            hidden.length
        );


    const letter =
        hidden[random];


    revealed.push(
        letter
    );


    console.log(
        "Revealed:",
        letter
    );


    /* Redraw */

    drawPuzzle();


    /* Check complete */

    if (
        puzzleComplete()
    ) {

        finishGame();

        return;

    }


    /* Restart timer */

    seconds =
        revealTime;


    timerElement.textContent =
        seconds;


    timer =
        setInterval(
            countdown,
            1000
        );

}


/* =========================================
   CHECK PUZZLE
========================================= */

function puzzleComplete() {

    for (
        let i = 0;
        i < answer.length;
        i++
    ) {

        const character =
            answer[i];


        if (
            character === " "
        ) {

            continue;

        }


        if (
            !revealed.includes(character)
        ) {

            return false;

        }

    }


    return true;

}


/* =========================================
   FINISH GAME
========================================= */

function finishGame() {

    clearInterval(timer);


    running = false;


    /* Reveal everything */

    revealed =
        [
            ...new Set(
                answer
                    .split("")
                    .filter(function(letter) {

                        return letter !== " ";

                    })
            )
        ];


    drawPuzzle();


    timerElement.textContent =
        "✓";


    messageElement.textContent =
        "ANSWER REVEALED!";


    /* Wait for next round */

    setTimeout(
        function() {

            startGame();

        },
        cooldownTime * 1000
    );

}


/* =========================================
   READY
========================================= */

console.log(
    "DIONLYONEE PLAYGROUND READY"
);
```

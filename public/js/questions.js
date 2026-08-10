// ===============================
// Love4U - Questions Engine V2
// ===============================

// ---------- Questions ----------

const questions = [
    {
        key: "name",
        question: "What's your name?",
        type: "text"
    },

    {
        key: "age",
        question: "How old are you?",
        type: "text"
    },

    {
        key: "favorite_color",
        question: "What's your favorite color?",
        type: "text"
    },

    {
        key: "favorite_food",
        question: "What's your favorite food?",
        type: "text"
    },

    {
        key: "favorite_dessert",
        question: "What's your favorite dessert?",
        type: "text"
    },

    {
        key: "date_type",
        question: "Movie or Picnic?",
        type: "multiple",

        options: [
            "Movie",
            "Picnic"
        ]
    },

    {
        key: "favorite_activity",
        question: "If you had a free Saturday, what would you want to do?",
        type: "multiple",

        options: [
            "Visit a cozy café",
            "Watch a movie",
            "Walk in a park",
            "Read at a bookstore"
        ]
    },

    {
        key: "ideal_time",
        question: "What's your ideal time for going out?",
        type: "multiple",

        options: [
            "Morning",
            "Afternoon",
            "Evening"
        ]
    }
];


// ---------- State ----------


const state = {

    currentQuestion: 0,

    attempts: 0,

    maxAttempts: 50,

    answers: {},

    yesScale: 1,

    coffeeStep: 0,

    canCatchNo: false,

    responseId: null,

    coffeeAtmosphere: null

};


// ---------- Elements ----------

const container = document.getElementById("question-container");

const questionText = document.getElementById("question-text");

const optionsContainer = document.getElementById("options-container");

const suspenseMessage = document.getElementById("suspense-message");

const typingIndicator = document.getElementById("typing-indicator");

const body = document.body;

let yesButton;

let noButton;

let coffeeMessage;


// ---------- Funny NO Button ----------

const playfulLines = [

    "Are you sure? 🥺",

    "Really sure? 😭",

    "It's only one coffee ☕",

    "I'll even buy dessert 🍰",

    "Please? ",

];

// ===============================
// Show Current Question
// ===============================

function showQuestion() {

    if (state.currentQuestion >= questions.length) {
        triggerSuspense();
        return;
    }

    const current = questions[state.currentQuestion];

    container.classList.remove("fade-in");
    container.classList.add("fade-out");
    container.classList.remove("coffee-mode");

    setTimeout(() => {

        questionText.textContent = current.question;

        optionsContainer.innerHTML = "";

        if (current.type === "text") {

            renderTextQuestion();

        } else {

            renderMultipleChoice(current);

        }

        container.classList.remove("fade-out");
        container.classList.add("fade-in");

    }, 500);

}

function renderTextQuestion() {

    optionsContainer.innerHTML = `

        <input
            type="text"
            id="text-answer"
            placeholder="Type your answer..."
        >

        <button id="next-button">

            Next

        </button>

    `;

    document
        .getElementById("text-answer")
        .focus();

    document
        .getElementById("text-answer")
        .addEventListener("keydown",(event)=>{

            if(event.key==="Enter"){

                saveTextAnswer();

            }

        });

    document
        .getElementById("next-button")
        .addEventListener("click",saveTextAnswer);

}

function renderMultipleChoice(question){

    question.options.forEach(option=>{

        const button=document.createElement("button");

        button.textContent=option;

        button.addEventListener("click",()=>{

            saveChoiceAnswer(option);

        });

        optionsContainer.appendChild(button);

    });

}

function saveAnswer(value){

    const current = questions[state.currentQuestion];

    state.answers[current.key] = value;

    nextQuestion();

}

function saveTextAnswer(){

    const input = document.getElementById("text-answer");

    const value = input.value.trim();

    if(value===""){

        input.focus();
        return;

    }

    saveAnswer(value);

}

function saveChoiceAnswer(choice){

    saveAnswer(choice);

}

async function nextQuestion() {

    state.currentQuestion++;

    if (state.currentQuestion >= questions.length) {

        const saved = await submitResponses();

        if (!saved) {
            return;
        }

        triggerSuspense();

        return;
    }

    showQuestion();
}

async function submitResponses() {

    try {

        const response = await fetch("/api/responses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(state.answers)
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message);
        }

        state.responseId = result.responseId;

        console.log(
            "❤️ Responses saved!",
            state.answers
        );

        console.log(
            "🆔 Response ID:",
            state.responseId
        );

        return true;

    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong while saving your answers."
        );

        return false;
    }
}

async function saveCoffeeDecision(decision) {

    if (!state.responseId) {
        console.error("❌ No response ID available.");
        return false;
    }

    try {

        const response = await fetch(
            `/api/responses/${state.responseId}/coffee`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    accepted: decision
                })
            }
        );

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message);
        }

        console.log(
            "☕ Coffee response saved:",
            decision,
            "ID:",
            state.responseId
        );

        return true;

    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong while saving the coffee response."
        );

        return false;
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function triggerSuspense() {

    container.classList.add("fade-out");

    await wait(700);

    container.style.display = "none";

    // Romantic suspense background
    body.classList.add("romantic-suspense");

    suspenseMessage.style.opacity = "0";
    suspenseMessage.style.display = "block";

    // First message
    await showSuspenseMessage("Thank you... ❤️", 1800);

    // Second message
    await showSuspenseMessage(
        "You've answered every question.",
        2200
    );

    // Third message
    await showSuspenseMessage(
        "There's just...",
        1600
    );

    await showSuspenseMessage(
        "one last thing.",
        2200
    );

    // Final build-up
    await showSuspenseMessage(
        "I've been wanting to ask you something...",
        2800
    );

    // Hide suspense
    suspenseMessage.style.opacity = "0";

    await wait(900);

    body.classList.remove("romantic-suspense");

    showCoffeeQuestion();
}

async function showSuspenseMessage(message, duration) {

    suspenseMessage.style.opacity = "0";

    await wait(500);

    suspenseMessage.textContent = message;

    suspenseMessage.style.opacity = "1";

    await wait(duration);

    suspenseMessage.style.opacity = "0";

    await wait(500);
}

function createCoffeeAtmosphere() {

    // Create a sparkle every ~500ms
    const sparkleInterval = setInterval(() => {

        const sparkle = document.createElement("div");

        sparkle.className = "coffee-sparkle";

        sparkle.style.left = `${Math.random() * 100}vw`;
        sparkle.style.top = `${Math.random() * 100}vh`;

        sparkle.style.animationDelay = "0s";

        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 5000);

    }, 500);


    // Create an occasional floating heart
    const heartInterval = setInterval(() => {

        const heart = document.createElement("div");

        heart.className = "coffee-heart";
        heart.textContent = "♥";

        heart.style.left = `${Math.random() * 100}vw`;

        const size = 12 + Math.random() * 16;
        heart.style.fontSize = `${size}px`;

        const opacity = 0.35 + Math.random() * 0.4;
        heart.style.setProperty("--heart-opacity", opacity);

        const duration = 5 + Math.random() * 4;
        heart.style.animationDuration = `${duration}s`;

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, (duration + 1) * 1000);

    }, 2200);


    // Keep the intervals available so we can stop them later
    state.coffeeAtmosphere = {
        sparkleInterval,
        heartInterval
    };
}

function showCoffeeQuestion() {

    // Keep the romantic suspense background
    body.classList.add("romantic-suspense");

    container.style.display = "block";

    container.classList.remove("fade-out");
    container.classList.add("fade-in");
    container.classList.add("coffee-mode");

    questionText.textContent =
        "Will you go on a coffee date with me? ☕";

    optionsContainer.innerHTML = `

        <div id="coffee-buttons">

            <button id="yes-button">
                YES ❤️
            </button>

            <button id="no-button">
                NO
            </button>

        </div>

        <p id="coffee-message"></p>

    `;

    setupCoffeeButtons();

    createCoffeeAtmosphere();

}

function setupCoffeeButtons() {

    yesButton = document.getElementById("yes-button");
    noButton = document.getElementById("no-button");
    coffeeMessage = document.getElementById("coffee-message");

    yesButton.addEventListener("click", handleYes);

    noButton.addEventListener("click", handleNoClick);

    // Desktop: watch the cursor
    document.addEventListener("mousemove", handleCursorMove);

}

function handleCursorMove(event) {

    if (!noButton) return;

    if (state.canCatchNo) return;

    const buttonRect = noButton.getBoundingClientRect();

    const buttonCenterX =
        buttonRect.left + buttonRect.width / 2;

    const buttonCenterY =
        buttonRect.top + buttonRect.height / 2;

    const distanceX =
        event.clientX - buttonCenterX;

    const distanceY =
        event.clientY - buttonCenterY;

    const distance =
        Math.sqrt(
            distanceX * distanceX +
            distanceY * distanceY
        );

    const escapeDistance = 180;

    if (distance < escapeDistance) {

        dodgeFromCursor(
            event.clientX,
            event.clientY
        );

    }

}

function dodgeFromCursor(cursorX, cursorY) {

    if (state.canCatchNo) return;

    const buttonRect =
        noButton.getBoundingClientRect();

    const buttonCenterX =
        buttonRect.left + buttonRect.width / 2;

    const buttonCenterY =
        buttonRect.top + buttonRect.height / 2;

    // Direction AWAY from the cursor
    let directionX =
        buttonCenterX - cursorX;

    let directionY =
        buttonCenterY - cursorY;

    const length =
        Math.sqrt(
            directionX * directionX +
            directionY * directionY
        );

    // Prevent division by zero
    if (length === 0) {

        directionX = 1;
        directionY = 0;

    } else {

        directionX /= length;
        directionY /= length;

    }

    const moveDistance = 200;

    let newX =
        buttonRect.left +
        directionX * moveDistance;

    let newY =
        buttonRect.top +
        directionY * moveDistance;

    const padding = 20;

    const maxX =
        window.innerWidth -
        noButton.offsetWidth -
        padding;

    const maxY =
        window.innerHeight -
        noButton.offsetHeight -
        padding;

    // Keep it inside the screen
    newX = Math.max(
        padding,
        Math.min(newX, maxX)
    );

    newY = Math.max(
        padding,
        Math.min(newY, maxY)
    );

    noButton.style.position = "fixed";

    noButton.style.left = `${newX}px`;

    noButton.style.top = `${newY}px`;

}

function updateCoffeeMessage() {

    const index = Math.min(
        state.coffeeStep,
        playfulLines.length - 1
    );

    coffeeMessage.textContent = playfulLines[index];

    state.coffeeStep++;

}

async function handleYes() {

    const saved = await saveCoffeeDecision("yes");

    if (!saved) {
        return;
    }

    yesButton.textContent = "YAY!! ❤️";

    setTimeout(() => {
        window.location.href =
            `date_plan.html?id=${state.responseId}`;
        
    }, 1000);

}

async function handleNoClick(event) {

    if (state.canCatchNo) {

        coffeeMessage.textContent =
            "Aww... that's okay ❤️";

        return;

    }

    state.attempts++;

    growYesButton();

    updateCoffeeMessage();

    if (state.attempts >= state.maxAttempts) {

        state.canCatchNo = true;

        coffeeMessage.textContent =
            "Fine... you win 😭";

        noButton.style.position = "static";

        noButton.style.left = "";
        noButton.style.top = "";

        const saved = await saveCoffeeDecision("no");

        if (!saved) {
            return;
        }

    }

}

///not used anymore but I wanna keep
function moveNoButton() {

    const padding = 20;

    const x =
        Math.random() *
        (window.innerWidth - noButton.offsetWidth - padding);

    const y =
        Math.random() *
        (window.innerHeight - noButton.offsetHeight - padding);

    noButton.style.position = "fixed";

    noButton.style.left = `${x}px`;

    noButton.style.top = `${y}px`;

}


function growYesButton() {

    state.yesScale += 0.15;

    yesButton.style.transform = `scale(${state.yesScale})`;

}


document.addEventListener("DOMContentLoaded", () => {
    showQuestion();
});

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

    canCatchNo: false

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

    "Please? 🥹",

    "You're making this difficult 😂",

    "Almost caught me!",

    "You're really determined!",

    "Fine... one last chance 😭"

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

        await submitResponses();

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

        console.log("❤️ Responses saved!", state.answers);

    } catch (error) {
        console.error(error);
        alert("Something went wrong while saving your answers.");
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



function showCoffeeQuestion() {

    body.style.backgroundColor = "#f7f2eb";

    container.style.display = "block";

    container.classList.remove("fade-out");
    container.classList.add("fade-in");

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

    const escapeDistance = 120;

    if (distance < escapeDistance) {

        dodgeFromCursor(
            event.clientX,
            event.clientY
        );

    }

}

function dodgeFromCursor(cursorX, cursorY) {

    if (state.canCatchNo) return;

    state.attempts++;

    growYesButton();

    updateCoffeeMessage();

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

    const moveDistance = 180;

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

function handleYes() {

    yesButton.textContent = "YAY!! ❤️";

    setTimeout(() => {

        window.location.href = "date_plan.html";

    }, 1000);

}

function handleNoClick(event) {

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

    }

}

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

    state.yesScale += 0.001;

    yesButton.style.transform = `scale(${state.yesScale})`;

}


document.addEventListener("DOMContentLoaded", () => {
    showQuestion();
});
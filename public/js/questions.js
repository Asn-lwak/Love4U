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
    answers: {}
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


// ---------- Funny NO Button ----------

const playfulLines = [

    "Are you really going to say no?",

    "Come on, just a coffee!",

    "It's getting harder to catch me 😭",

    "Think carefully about this choice...",

    "Perhaps fate is trying to tell you something!"

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

function triggerSuspense() {
    container.classList.add('fade-out');
    body.style.backgroundColor = '#000'; // Fade to black

    setTimeout(() => {
        container.style.display = 'none';
        suspenseMessage.style.opacity = 1;
        typingIndicator.style.display = 'inline';
        
        // Part 3: "typing..." animation and final question reveal
        setTimeout(() => {
            typingIndicator.style.display = 'none';
            suspenseMessage.innerHTML = "There's actually one last question...";
            
            setTimeout(() => {
                // Final Question
                suspenseMessage.style.opacity = 0;
                body.style.backgroundColor = '#f0f0f0';
                
                setTimeout(() => {
                    container.style.display = 'block';
                    questionText.textContent = "Will you go on a coffee date with me?";
                    optionsContainer.innerHTML = `
                        <button id="yes-button">YES</button>
                        <button id="no-button">NO</button>
                    `;
                    noButton = document.getElementById('no-button');
                    yesButton = document.getElementById('yes-button');

                    yesButton.addEventListener("click", handleYes);

                    noButton.addEventListener("click", handleNoClick);

                    noButton.addEventListener("mouseover", dodge);
                    
                    container.classList.remove('fade-out');
                    container.classList.add('fade-in');
                    
                    // Part 4: Dodging Button setup
                    noButton.style.position = 'relative';
                    
                }, 1000);
            }, 3000);
        }, 2000);
    }, 1000);
}

function handleYes() {
    window.location.href = 'date_plan.html';
}

function handleNoClick() {
    // Playful response if clicked
    alert("oh okayyy 😭");
    state.attempts = state.maxAttempts; // Finalize the state
    noButton.textContent = "oh okayyy";
    noButton.onmouseover = null;
    noButton.style.position = 'static';
    noButton.style.transform = 'none';
}

// Part 4: THE DODGING BUTTON logic refined with constrained movement
function dodge(event) {
    state.attempts++;

    if (state.attempts >= state.maxAttempts) {
        noButton.textContent = "oh okayyy"; // Final playful conclusion
        noButton.onmouseover = null;
        noButton.style.position = 'static'; // Stop dodging
        noButton.style.transform = 'none';
        return;
    }

    // Change text content based on attempts
    if (state.attempts >= 10 && state.attempts < state.maxAttempts) {
        const lineIndex = Math.floor(Math.random() * playfulLines.length);
        noButton.textContent = playfulLines[lineIndex];
    } else if (state.attempts === 7) {
        noButton.textContent = "Are you sureeeeee?";
    } else if (state.attempts === 8) {
        noButton.textContent = "Really sure?";
    } else if (state.attempts === 9) {
        noButton.textContent = "Last chance...";
    }

    // Calculate new position constrained within the visible container bounds
    const maxX = window.innerWidth - noButton.offsetWidth - 20;
    const maxY = window.innerHeight - noButton.offsetHeight - 20;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    noButton.style.position = "absolute";
    noButton.style.left = `${x}px`;
    noButton.style.top = `${y}px`;
}

document.addEventListener("DOMContentLoaded", () => {
    showQuestion();
});
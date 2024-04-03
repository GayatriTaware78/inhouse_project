let navbar = document.querySelector('.header .navbar');
let loginForm = document.querySelector('.login-form');
let quizContainer = document.getElementById('quiz-container');

document.querySelector('#menu-btn').onclick = () =>{
  navbar.classList.toggle('active');
  loginForm.classList.remove('active');
}

document.querySelector('#login-btn').onclick = () =>{
  loginForm.classList.toggle('active');
  navbar.classList.remove('active');
}

document.getElementById('start-btn').addEventListener('click', function() {
    navbar.classList.remove('active');
    loginForm.classList.remove('active');
    
    document.getElementById('home').style.display = 'none';
    quizContainer.style.display = 'block';
});

let quiz = document.querySelector(".quiz");
let result = document.querySelector(".result");
let quest = document.querySelector(".quest");
let ans = document.querySelector(".ans");
let submit = document.querySelector(".submit");
let next = document.querySelector(".next");
let score = document.querySelector(".score");
let reset = document.querySelector(".reset");
let prevScore = ~~localStorage.getItem('score');
score.textContent = `Score : ${prevScore}`;

let currentQuestion = 1;
let totalQuestions = 15;
let operation = '+';

function generateQuestion() {
    let r1 = ~~(Math.random() * 10); // For simplicity, using numbers up to 10
    let r2 = ~~(Math.random() * 10);
    
    switch (operation) {
        case '+':
            quest.textContent = `${r1} + ${r2}`;
            break;
        case '-':
            quest.textContent = `${r1} - ${r2}`;
            break;
        case '*':
            quest.textContent = `${r1} * ${r2}`;
            break;
        case '/':
            // Avoid division by zero
            if (r2 === 0) {
                r2 = 1;
            }
            quest.textContent = `${r1 * r2} / ${r2}`;
            break;
    }
}

function evaluateAnswer(correctAnswer, userAnswer) {
    return correctAnswer === parseInt(userAnswer);
}

generateQuestion();

quiz.addEventListener('submit', (e) => {
    e.preventDefault();
    submit.style.display = "none";
    next.style.display = "block";
    
    let [operand1, operator, operand2] = quest.textContent.split(' ');
    let correctAnswer;
    
    switch (operator) {
        case '+':
            correctAnswer = parseInt(operand1) + parseInt(operand2);
            break;
        case '-':
            correctAnswer = parseInt(operand1) - parseInt(operand2);
            break;
        case '*':
            correctAnswer = parseInt(operand1) * parseInt(operand2);
            break;
        case '/':
            correctAnswer = parseInt(operand1);
            break;
    }
    
    if (evaluateAnswer(correctAnswer, ans.value)) {
        result.textContent = 'Wow Score Added!';
        let scr = prevScore + 1;
        prevScore = scr;
        localStorage.setItem("score", prevScore);
        score.textContent = `Score : ${prevScore}`;
    } else {
        result.textContent = `Oops! Correct ans is ${correctAnswer}`;
    }
});

next.addEventListener('click', () => {
  generateQuestion(); // Generate next question
  submit.style.display = "block";
  next.style.display = "none";
});

function openQuizModal(quizType) {
    generateQuiz(quizType);
    document.getElementById('quiz-modal').style.display = 'block';
}

function closeQuizModal() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = ''; // Reset quiz container content
    document.getElementById('quiz-modal').style.display = 'none'; // Hide modal
}

function restartQuiz() {
    const quizType = document.getElementById('quiz-container').dataset.quizType;
    generateQuiz(quizType);
}

function generateQuiz(quizType) {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = ''; // Clear previous quiz
    quizContainer.dataset.quizType = quizType;

    let num1, num2, operation;
    switch (quizType) {
        case 'addition':
            operation = '+';
            break;
        case 'subtraction':
            operation = '-';
            break;
        case 'multiplication':
            operation = '×';
            break;
        case 'division':
            operation = '÷';
            break;
        default:
            break;
    }

    let score = 0;
    for (let i = 0; i < 5; i++) {
        switch (quizType) {
            case 'addition':
                num1 = Math.floor(Math.random() * 10) + 1; // Limit to 1-10
                num2 = Math.floor(Math.random() * 10) + 1; // Limit to 1-10
                break;
            case 'subtraction':
                num1 = Math.floor(Math.random() * 10) + 1; // Limit to 1-10
                num2 = Math.floor(Math.random() * num1) + 1; // Limit to 1-10
                break;
            case 'multiplication':
                num1 = Math.floor(Math.random() * 10) + 1; // Limit to 1-10
                num2 = Math.floor(Math.random() * 10) + 1; // Limit to 1-10
                break;
            case 'division':
                num2 = Math.floor(Math.random() * 9) + 1; // Divisor between 1 and 10
                num1 = num2 * (Math.floor(Math.random() * 10) + 1); // Ensure quotient is an integer
                break;
            default:
                break;
        }
        const question = `What is ${num1} ${operation} ${num2}?`;
        const correctAnswer = evaluateAnswer(quizType, num1, num2);
        const userAnswer = parseInt(prompt(question)); // Use prompt for simplicity
        if (!isNaN(userAnswer) && userAnswer === correctAnswer) {
            score++;
        }
    }

    // Display final score
    const scoreMessage = document.createElement('p');
    scoreMessage.textContent = `Your score: ${score}/5`;
    if (score === 5) {
        scoreMessage.classList.add('flash'); // Flash effect if all answers are correct
    }
    quizContainer.appendChild(scoreMessage);
}

function evaluateAnswer(quizType, num1, num2) {
    switch (quizType) {
        case 'addition':
            return num1 + num2;
        case 'subtraction':
            return num1 - num2;
        case 'multiplication':
            return num1 * num2;
        case 'division':
            return num1 / num2;
        default:
            return null;
    }
}

let model = null, webcam = null, maxPredictions = null;
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

    // Start webcam and open quiz modal
    startWebcamAndOpenQuiz('addition'); // You can specify the quiz type here
});

async function startWebcamAndOpenQuiz(quizType) {
    if (quizType === 'addition' || quizType === 'subtraction') {
        await initWebcam(); // Start webcam if the quiz type is addition or subtraction
    }
    openQuizModal(quizType); // Open quiz modal after webcam is initialized (if needed)
}

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
let totalQuestions = 5; // Changed to 5 questions as specified
let operation = '+';
let operand1 = null, operand2 = null;

function generateQuestion() {
    let r1 = ~~(Math.random() * 10); // For simplicity, using numbers up to 10
    let r2 = ~~(Math.random() * 10);

    operand1 = r1;
    operand2 = r2;

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

    let correctAnswer;

    switch (operation) {
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
    stopWebcam(); // Stop webcam when closing modal
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = ''; // Reset quiz container content
    document.getElementById('quiz-modal').style.display = 'none'; // Hide modal
}

function restartQuiz() {
    const quizType = document.getElementById('quiz-container').dataset.quizType;
    generateQuiz(quizType);
}

async function generateQuiz(quizType) {
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
            case 'subtraction':
                if (webcam) {
                    await startWebcamAndOpenQuiz(quizType); // Start webcam and open quiz modal if the quiz type is addition or subtraction
                }
                break;
            case 'multiplication':
            case 'division':
                num1 = Math.floor(Math.random() * 10) + 1; // Limit to 1-10
                num2 = Math.floor(Math.random() * 10) + 1; // Limit to 1-10
                break;
            default:
                break;
        }
        
        const correctAnswer = evaluateAnswer(quizType, num1, num2);
        
        // Add code to process webcam input and evaluate the answer
        // You'll need to handle user input from the webcam and compare it with the correct answer
        
        if (/* condition to check if user's answer is correct */) {
            score++;
        }
    }

    // Display final score
    const scoreMessage = document.createElement('p');
    scoreMessage.textContent = `Your score: ${score}/5`;
    if (score === 5) {
        scoreMessage.classList.add('flash'); 
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

async function initWebcam() {
    const URL = "https://teachablemachine.withgoogle.com/models/BuaJhz4Qj/";
    model = await tmImage.load(URL + "model.json");
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip); // Initialize webcam
    await webcam.setup(); // Setup webcam
    await webcam.play(); // Start webcam feed
    document.getElementById('webcam-container').appendChild(webcam.canvas); // Add webcam feed to the container
    window.requestAnimationFrame(loop); // Start sign language detection loop
}

function loop() {
    webcam.update(); // Update webcam feed
    predict(); // Predict sign language
    window.requestAnimationFrame(loop); // Continue loop
}

function predict() {
    const prediction = model.predict(webcam.canvas); // Predict sign language
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className;
        if (prediction[i].probability.toFixed(2) > 0.7) {
            handleGesture(classPrediction); // Handle detected sign language gesture
            break;
        }
    }
}

function handleGesture(signNumber) {
    if (currentQuestion <= totalQuestions) {
        let userAnswer = parseInt(signNumber);
        let correctAnswer;

        switch (operation) {
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

        if (userAnswer === correctAnswer) {
            result.textContent = 'Wow Score Added!';
            let scr = prevScore + 1;
            prevScore = scr;
            localStorage.setItem("score", prevScore);
            score.textContent = `Score : ${prevScore}`;
        } else {
            result.textContent = `Oops! Correct ans is ${correctAnswer}`;
        }

        currentQuestion++;

        if (currentQuestion <= totalQuestions) {
            generateQuestion();
        } else {
            result.textContent = `Quiz Over! Your final score is: ${prevScore}`;
            const restartButton = document.createElement('button');
            restartButton.textContent = 'Restart Quiz';
            restartButton.addEventListener('click', function() {
                currentQuestion = 1;
                prevScore = 0;
                score.textContent = `Score : ${prevScore}`;
                generateQuestion();
            });
            quiz.appendChild(restartButton);
        }
    }
}

async function stopWebcam() {
    if (webcam) {
        webcam.pause(); // Pause webcam feed
        await webcam.stop(); // Stop webcam feed
        webcam = null; // Release webcam resources
    }
}

document.getElementById('webcam-container').addEventListener('click', function() {
    document.getElementById('webcam-container').removeEventListener('click', this);
    webcam.update(); // Initial webcam update
    window.requestAnimationFrame(loop); // Start sign language detection loop
});




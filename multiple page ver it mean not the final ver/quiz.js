let selectedCategory = localStorage.getItem('selectedCategory');
let selectedDifficulty = localStorage.getItem('selectedDifficulty');
let questions;
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let correctAnswers = [];
let incorrectAnswers = [];
let timer;
let selectedOption = null;

// Fetch quiz data from API based on selected category and difficulty
fetch(`https://opentdb.com/api.php?amount=10&category=${selectedCategory}&difficulty=${selectedDifficulty}&type=multiple`)
    .then(response => response.json())
    .then(data => {
        questions = data.results;
        displayQuestion(currentQuestionIndex);
        startTimer();
    });

function displayQuestion(index) {
    let question = questions[index];
    let quizContainer = document.getElementById('quiz');
    quizContainer.innerHTML = '';

    // Add question text
    let questionText = document.createElement('p');
    questionText.textContent = `Q${index + 1}: ${question.question}`;
    quizContainer.appendChild(questionText);
    
    // Create a shuffled array of all answers
    let answers = question.incorrect_answers.concat(question.correct_answer);
    answers = answers.sort(() => Math.random() - 0.5);
    
    // Add options
    answers.forEach(answer => {
        let answerOption = document.createElement('button');
        answerOption.textContent = answer;
        answerOption.addEventListener('click', () => {
            // Unselect previously selected option, if any
            if (selectedOption) {
                selectedOption.style.backgroundColor = '';
            }

            // If the same option was clicked, unselect it
            if (selectedOption === answerOption) {
                selectedOption = null;
            } else {
                selectedOption = answerOption;
                selectedOption.style.backgroundColor = 'grey';
            }
        });
        quizContainer.appendChild(answerOption);
    });

    // Add Next, Back and End buttons
    let nextBackContainer = document.createElement('div');
    nextBackContainer.className = "button-container";

    if (currentQuestionIndex > 0) {
        let backButton = document.createElement('button');
        backButton.textContent = 'Back';
        backButton.addEventListener('click', () => {
            processAnswer(question);
            currentQuestionIndex--;
            displayQuestion(currentQuestionIndex);
        });
        nextBackContainer.appendChild(backButton);
    }

    if (currentQuestionIndex < questions.length - 1) {
        let nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => {
            processAnswer(question);
            currentQuestionIndex++;
            displayQuestion(currentQuestionIndex);
        });
        nextBackContainer.appendChild(nextButton);
    }

    if (currentQuestionIndex == questions.length - 1) {
        let endButton = document.createElement('button');
        endButton.textContent = 'End Quiz';
        endButton.addEventListener('click', () => {
            processAnswer(question);
            endQuiz();
        });
        nextBackContainer.appendChild(endButton);
    }

    quizContainer.appendChild(nextBackContainer);
}

function processAnswer(question) {
    if (selectedOption) {
        if (selectedOption.textContent === question.correct_answer) {
            correctAnswersCount++;
            correctAnswers.push(question.question);
        } else {
            incorrectAnswers.push(question.question);
        }
    }
}

function startTimer() {
    let timeRemaining = 300;  // 5 minutes in seconds
    let timerElement = document.getElementById('timer');
    
    timer = setInterval(() => {
        timeRemaining--;
        let minutes = Math.floor(timeRemaining / 60);
        let seconds = timeRemaining % 60;
        timerElement.textContent = `Time Remaining: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        
        if (timeRemaining <= 0) {
            endQuiz();
        }
    }, 1000);
}

function endQuiz() {
    clearInterval(timer);
    localStorage.setItem('score', correctAnswersCount);
    localStorage.setItem('correctAnswers', JSON.stringify(correctAnswers));
    localStorage.setItem('incorrectAnswers', JSON.stringify(incorrectAnswers));
    window.location.href = "result.html";
}

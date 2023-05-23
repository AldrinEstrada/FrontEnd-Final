let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer = null;
let selectedOption = null;
let userAnswers = [];

function decodeHtml(html) {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}


window.addEventListener('load', function() {
    fetch('https://opentdb.com/api_category.php')
    .then(response => response.json())
    .then(data => {
        let categorySelect = document.getElementById('category');
        data.trivia_categories.sort((a, b) => a.name.localeCompare(b.name))
        .forEach(category => {
            let option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    });
});

document.getElementById('start-button').addEventListener('click', function() {
    let category = document.getElementById('category').value;
    let difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    fetch(`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`)
    .then(response => response.json())
    .then(data => {
        questions = data.results;
        currentQuestionIndex = 0;
        score = 0;
        startQuiz();
    })
    .catch(error => console.error('Error:', error));
});

function startQuiz() {
    document.getElementById('start-section').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'block';
    document.getElementById('timer').style.display = 'block';
    displayQuestion();
    startTimer();
}

// Display a question
function displayQuestion() {
    let questionElement = document.getElementById('question');
    let optionsElement = document.getElementById('options');
    let currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = decodeHtml(currentQuestion.question);
    while (optionsElement.firstChild) {
        optionsElement.firstChild.remove();
    }
    let options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    shuffleArray(options);
    options.forEach(option => {
        let optionElement = document.createElement('button');
        optionElement.textContent = decodeHtml(option);
        optionElement.addEventListener('click', function(event) {
            if (selectedOption) {
                selectedOption.classList.remove('selected');
            }
            selectedOption = event.target;
            selectedOption.classList.add('selected');
            userAnswers[currentQuestionIndex] = {question: currentQuestion.question, chosen: selectedOption.textContent, correct: currentQuestion.correct_answer};
        });
        optionElement.classList.add('option-button');
        optionsElement.appendChild(optionElement);
    });

}



document.getElementById('next-button').addEventListener('click', function() {
    if (selectedOption && selectedOption.textContent === decodeHtml(questions[currentQuestionIndex].correct_answer)) {
        score++;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        finishQuiz();
    }
    selectedOption = null;
});

document.getElementById('previous-button').addEventListener('click', function() {
    // Only go back if there is a previous question
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
});


function startTimer() {
    let timerElement = document.getElementById('timer');
    let timeRemaining = 5 * 60;
    timerElement.textContent = formatTime(timeRemaining);
    timer = setInterval(function() {
        timeRemaining--;
        timerElement.textContent = formatTime(timeRemaining);
        if (timeRemaining <= 0) {
            alert("Time's up!"); // add the alart
            finishQuiz();
        }
    }, 1000);
}

function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function finishQuiz() {
    clearInterval(timer);
    timer = null;
    document.getElementById('timer').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'none';
    document.getElementById('end-section').style.display = 'block';
    document.getElementById('score').textContent = score;
    let resultsElement = document.getElementById('results');
    //descrive the sentence of final
    userAnswers.forEach((userAnswer, index) => {
        let resultElement = document.createElement('div');
        resultElement.textContent = `${index + 1}. ${decodeHtml(userAnswer.question)} - Your answer: ${decodeHtml(userAnswer.chosen)}`;
    
        if (userAnswer.chosen !== userAnswer.correct) {
            resultElement.textContent += ` - Correct answer: ${decodeHtml(userAnswer.correct)}`;
            resultElement.classList.add('incorrect');  // Add the 'incorrect' class if the answer is incorrect
        }
    
        resultElement.classList.add('result-item');
        resultsElement.appendChild(resultElement);
    });
    
}

document.getElementById('play-again-button').addEventListener('click', function() {
    document.getElementById('start-section').style.display = 'block';
    document.getElementById('end-section').style.display = 'none';
    document.getElementById('results').textContent = '';
    userAnswers = [];
});

// document.getElementById('exit-button').addEventListener('click', function() {
//     var confirmExit = window.confirm("Are you sure you want to exit the quiz? Your progress will be lost.");

//     if (confirmExit) {
//         location.reload();
//     }
// });


//this area below is for the exit quiz button

var exitButton = document.getElementById("exit-button");
var confirmationModal = document.getElementById("confirmation-modal");
var confirmationResetButton = document.getElementById("confirm-reset");
var cancelResetButton = document.getElementById("cancel-reset");

exitButton.addEventListener("click", function() {
    confirmationModal.style.display = "block";
});

confirmationResetButton.addEventListener("click", function() {
    location.reload();
    confirmationModal.style.display = "none";
});

cancelResetButton.addEventListener("click", function() {
    confirmationModal.style.display = "none";
});

const backButton = document.getElementById('backButton');






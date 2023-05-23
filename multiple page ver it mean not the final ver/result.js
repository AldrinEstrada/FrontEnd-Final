let score = localStorage.getItem('score');
let correctAnswers = JSON.parse(localStorage.getItem('correctAnswers'));
let incorrectAnswers = JSON.parse(localStorage.getItem('incorrectAnswers'));

let resultContainer = document.getElementById('result');
let resultText = document.createElement('p');
resultText.textContent = `Your Score: ${score}/10`;
resultContainer.appendChild(resultText);

let correctAnswersList = document.createElement('ul');
correctAnswersList.textContent = 'Correctly Answered Questions:';
correctAnswers.forEach(question => {
    let listItem = document.createElement('li');
    listItem.textContent = question;
    correctAnswersList.appendChild(listItem);
});
resultContainer.appendChild(correctAnswersList);

let incorrectAnswersList = document.createElement('ul');
incorrectAnswersList.textContent = 'Incorrectly Answered Questions:';
incorrectAnswers.forEach(question => {
    let listItem = document.createElement('li');
    listItem.textContent = question;
    incorrectAnswersList.appendChild(listItem);
});
resultContainer.appendChild(incorrectAnswersList);

let playAgainButton = document.createElement('button');
playAgainButton.textContent = 'Play Again';
playAgainButton.addEventListener('click', () => {
    window.location.href = "index.html";
});
resultContainer.appendChild(playAgainButton);

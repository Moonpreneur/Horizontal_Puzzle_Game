const startGameBtn1 = document.getElementById('startGameBtn1');
const startGameBtn2 = document.getElementById('startGameBtn2');
const resetGameBtn = document.getElementById('resetGameBtn');
const restartGameBtn = document.getElementById('restartGameBtn');
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const page3 = document.getElementById('page3');
const gameOverPage = document.getElementById('gameOverPage');
const finalScoreElement = document.getElementById('finalScore');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const result = document.getElementById('result');
const draggableContainer = document.getElementById('draggableContainer');

let score = 0;
let timeRemaining = 60; 
let timerInterval;

const draggableValues = [
    { id: "value1", value: "(2)<sup>-7</sup>" },
    { id: "value3", value: "(2)<sup>-4</sup>"  },
    { id: "value5", value: "(2)<sup>-13</sup>"  },
    { id: "value4", value: "(2)<sup>-1</sup>" },
    { id: "value2", value: "(2)<sup>-10</sup>" },            
];

const correctSound = new Audio('correct.mp3');
const incorrectSound = new Audio('incorrect.mp3');


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateDraggableElements() {
    draggableContainer.innerHTML = ''; // Clear previous elements
    shuffleArray(draggableValues); // Shuffle draggable values
    draggableValues.forEach(item => {
        const div = document.createElement('div');
        div.className = 'draggable';
        div.draggable = true;
        div.id = item.id;
        div.innerHTML = item.value;
        draggableContainer.appendChild(div);
    });

    // Add event listeners to new draggable elements
    const draggables = document.querySelectorAll('.draggable');
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', dragStart);
    });
}

// Show Page 2 (Instructions)
startGameBtn1.addEventListener('click', () => {
    page1.classList.add('hidden');
    page2.classList.remove('hidden');
});

// Show Page 3 (Game Board)
startGameBtn2.addEventListener('click', () => {
    page2.classList.add('hidden');
    page3.classList.remove('hidden');
    generateDraggableElements(); // Generate elements when game starts
    startTimer();
});

// Reset to Page 1
resetGameBtn.addEventListener('click', () => {
    page3.classList.add('hidden');
    page1.classList.remove('hidden');
    resetGame();
});

// Restart Game from Game Over
restartGameBtn.addEventListener('click', () => {
    gameOverPage.classList.add('hidden');
    page1.classList.remove('hidden');
    resetGame();
});

// Game Logic
const circles = document.querySelectorAll('.circle');

circles.forEach(circle => {
    circle.addEventListener('dragover', dragOver);
    circle.addEventListener('drop', drop);
});

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const draggableId = e.dataTransfer.getData('text');
    const draggableElement = document.getElementById(draggableId);
    const correctId = e.target.getAttribute('data-correct');

    if (draggableId === correctId) {
        e.target.innerHTML = draggableElement.innerHTML;
        // Don't remove the draggable element
        result.textContent = "Correct!";
        result.style.color = "green";
        correctSound.play(); // Play correct sound
        score++;
    } else {
        result.textContent = "Incorrect, try again!";
        result.style.color = "red";
        incorrectSound.play(); // Play incorrect sound
        score--;
    }
    scoreElement.textContent = `Score: ${score}`;
}

function startTimer() {
    timeRemaining = 60;
    timerElement.textContent = `Time Remaining: ${timeRemaining}`;
    timerInterval = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = `Time Remaining: ${timeRemaining}`;
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            gameOver();
        }
    }, 1000);
}

function gameOver() {
    page3.classList.add('hidden');
    gameOverPage.classList.remove('hidden');
    finalScoreElement.textContent = `Your Score: ${score}`;
}

function resetGame() {
    clearInterval(timerInterval);
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    result.textContent = '';
    circles.forEach(circle => circle.textContent = '');
    generateDraggableElements();
}
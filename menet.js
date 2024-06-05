const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const gameContainer = document.getElementById('gameContainer');
const applyButton = document.getElementById('apply');
const controls = document.getElementById('controls');

let a = 'A';
let s = 'S';
let d = 'D';
let f = 'F';

let keys = [a, s, d, f];

let notes = [];
let noteSpeed = 2;
let noteFrequency = 750; // Milliseconds
const keyPositions = [100, 250, 400, 550]; // x positions for notes
const keyColors = ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db'];

const hitZoneY = canvas.height - 100; // Y position of the hit zone
const hitZoneHeight = 15; // Height of the hit zone

let lastNoteTime = Date.now();
let score = 0;
let misses = 0;
const maxMisses = 5;
let gameOver = false;
let gameStarted = false;
let hitStreak = 0;
let hitstreakhold = 0;

function drawNote(note) {
    ctx.fillStyle = note.color;
    ctx.fillRect(note.x, note.y, note.width, note.height);
}

function moveNotes() {
    for (let note of notes) {
        note.y += noteSpeed;
    }
}
function createNote() {
    const keyIndex = Math.floor(Math.random() * keys.length);
    const note = {
        x: keyPositions[keyIndex],
        y: 0,
        width: 100,
        height: 20,
        key: keys[keyIndex],
        color: keyColors[keyIndex],
        hit: false
    };
    notes.push(note); // miafaszez
}

function updateGameSpeed() {
    if (hitStreak >= hitstreakhold + 5) {
        noteSpeed += 1;
        noteFrequency = Math.max(100, noteFrequency - 100); // Prevent frequency from becoming too fast
        hitstreakhold = hitStreak;
    }
}

document.addEventListener('keydown', (event) => {
    if (gameOver || !gameStarted) return;

    const key = event.key.toUpperCase();
    const noteIndex = notes.findIndex(note => note.key === key && note.y > hitZoneY - 50 && note.y < hitZoneY + hitZoneHeight);
    if (noteIndex !== -1) {
        notes[noteIndex].hit = true;
        score += 10;
        hitStreak++;
        gameContainer.classList.add('glow');
        setTimeout(() => gameContainer.classList.remove('glow'), 100);
    } else {
        misses++;
        hitStreak = 0;
    }
    updateGameSpeed();

    if (misses >= maxMisses) {
        gameOver = true;
    }
});

function draw() {
    if (!gameStarted) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the vertical lines between columns
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    for (let i = 0; i < keyPositions.length; i++) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(keyPositions[i] + 50, 0);
        ctx.lineTo(keyPositions[i] + 50, canvas.height);
        ctx.stroke();
    }

    // Draw the hit zone
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(0, hitZoneY, canvas.width, hitZoneHeight);

    moveNotes();
    for (let note of notes) {
        drawNote(note);
        if (note.hit) {
            const columnColor = keyColors[note.columnIndex];
            ctx.fillStyle = columnColor;
            ctx.fillRect(note.x, hitZoneY, note.width, canvas.height);
        }
    }

    const now = Date.now();
    if (now - lastNoteTime > noteFrequency) {
        createNote();
        lastNoteTime = now;
    }

    // Filter out hit or missed notes
    notes = notes.filter(note => {
        if (note.y >= canvas.height && !note.hit) {
            misses++;
            hitStreak = 0;
        }
        return note.y < canvas.height && !note.hit;
    });

    updateGameSpeed();

    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillText(`Misses: ${misses}`, 20, 60);
    ctx.fillText(`Streak: ${hitStreak}`, 20, 90);

    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '48px Arial';
        ctx.fillText(`Game Over!`, canvas.width / 2 - 100, canvas.height / 2);
        ctx.font = '24px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 75, canvas.height / 2 + 50);
        restartButton.style.display = 'block';
        document.getElementById('controls').style.display = 'inline';
        return;
    }

    requestAnimationFrame(draw);
}


applyButton.addEventListener('click', () => {
    keys = [
        document.getElementById('key-a').value.toUpperCase(),
        document.getElementById('key-s').value.toUpperCase(),
        document.getElementById('key-d').value.toUpperCase(),
        document.getElementById('key-f').value.toUpperCase()
      ];

    controls.style.display = 'none';
    window.alert("Az ön gombjai:" + keys[0]+ "; " + keys[1]+ "; " + keys[2]+ "; " + keys[3]);
});


startButton.addEventListener('click', () => {
    gameStarted = true;
    gameOver = false;
    score = 0;
    misses = 0;
    notes = [];
    hitStreak = 0;
    noteSpeed = 2; // Reset speed
    noteFrequency = 750; // Reset frequency
    lastNoteTime = Date.now();
    canvas.style.display = 'block';
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    controls.style.display = 'none';
    window.alert("Az ön gombjai:" + keys[0]+ "; " + keys[1]+ "; " + keys[2]+ "; " + keys[3]);
    draw();
});

restartButton.addEventListener('click', () => {
    gameStarted = true;
    gameOver = false;
    score = 0;
    misses = 0;
    notes = [];
    hitStreak = 0;
    noteSpeed = 2; // Reset speed
    noteFrequency = 750; // Reset frequency
    lastNoteTime = Date.now();
    restartButton.style.display = 'none';
    controls.style.display = 'none';
    window.alert("Az ön gombjai:" + keys[0]+ "; " + keys[1]+ "; " + keys[2]+ "; " + keys[3]);
    draw();
});

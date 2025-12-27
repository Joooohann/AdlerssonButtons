let currentAudio = null;
let currentButton = null;
let currentCard = null;
let isAutoplay = false;

function toggleAutoplay() {
    const checkbox = document.getElementById('autoplay-toggle');
    isAutoplay = checkbox.checked;
}

function playSound(audioFile, cardElement) {
    const btn = cardElement.querySelector('.btn');

    if (currentAudio && currentButton === btn && !currentAudio.paused) {
        stopSound();
        return;
    }

    stopSound();

    currentAudio = new Audio(audioFile);
    currentButton = btn;
    currentCard = cardElement;
    currentCard.classList.add('playing');

    if (btn) btn.textContent = 'II';

    currentAudio.play().catch(error => {
        console.log("Audio-Wiedergabe fehlgeschlagen. Interagiere zuerst mit der Seite.");
        resetButton(btn);
    });

    currentAudio.onended = () => {
        stopSound();
        if (isAutoplay && currentCard) {
            playNextPlayable(currentCard);
        }
    };
}

function playNextPlayable(startCard) {
    let nextCard = startCard.nextElementSibling;
    let attempts = 0;
    const maxAttempts = document.querySelectorAll('.sound-card').length;

    while (attempts < maxAttempts) {
        // Wrap around if we reached the end
        if (!nextCard || !nextCard.classList.contains('sound-card')) {
            nextCard = document.querySelector('.sound-card');
        }

        // Check if this card should be played
        // It should NOT be 'test.mp3' for autoplay
        const onclickAttr = nextCard.getAttribute('onclick');
        if (onclickAttr && !onclickAttr.includes("'test.mp3'")) {
            // Found a valid card
            nextCard.click();
            return;
        }

        // If it is test.mp3, skip it
        nextCard = nextCard.nextElementSibling;
        attempts++;
    }
}

function stopSound() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    if (currentButton) {
        resetButton(currentButton);
        currentButton = null;
    }
    if (currentCard) {
        currentCard.classList.remove('playing');
    }
    currentAudio = null;
}

function resetButton(btn) {
    if (btn) {
        btn.textContent = '▶';
    }
}

// Initialize: Disable test.mp3 buttons (except the last one)
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.sound-card');
    const lastIndex = cards.length - 1;

    cards.forEach((card, index) => {
        const onclickAttr = card.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes("'test.mp3'")) {
            // Exception for the very last card
            if (index !== lastIndex) {
                card.classList.add('disabled');
                card.removeAttribute('onclick');
            }
        }
    });
});
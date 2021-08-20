class AudioController {
    constructor() {
        this.bgMusic = new Audio();
        this.flipSound = new Audio ('Assets/Audio/flip.wav');
        this.matchSound = new Audio ('Assets/Audio/match.wav');
        this.incredibleJobSound = new Audio ('Assets/Audio/incredibleJob.mp3');
        this.wrongSound = new Audio ('Assets/Audio/wrongSoundEffect.mp3')
        this.victorySound = new Audio ('Assets/Audio/victory.wav');
        this.congratsSound = new Audio ('Assets/Audio/congrats.wav');
        this.gameOverSound = new Audio ('Assets/Audio/gameOver.wav');
        this.bgMusic.volume = 0.5;
        this.bgMusic.loop = true;
    }
    startMusic() {
        this.stopMusic();
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.congratsSound.pause()
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    rightAnswer() {
        this.incredibleJobSound.play();
    }
    wrongAnswer() {
        this.wrongSound.play()
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    congrats() {
        this.congratsSound.play()
    }
    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }
}

class MixOrMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.popUp = document.getElementById('modal')
        this.overlayPopUp = document.getElementById('overlay-popup')
        this.textAnswer = document.getElementById('modal-input').value
        this.submit = document.getElementById('modal-submit')
        this.audioController = new AudioController();
    }
    startGame() {
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;
        setTimeout (() => {
            this.audioController.startMusic();
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck) {
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }
    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck)) {
            this.cardMatch(card, this.cardToCheck)
        } else {
            this.cardMisMatch(card, this.cardToCheck)
        }
        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        setTimeout(() => {
            this.popUp.classList.add('active');
            this.popUp.classList.remove('right');
            this.popUp.classList.remove('wrong');
            this.overlayPopUp.classList.add('active');
            document.getElementById('title-id').innerText = "What is this animal called?"
            document.getElementById('modal-input').focus();
        }, 1000)
        this.checkAnswer()
        
        // if( (this.matchedCards.length === this.cardsArray.length) && (this.busy = true)) {
        //     this.victory()
        // } 
    }
    checkAnswer() {
        this.submit.addEventListener('click', (e) => {
            e.preventDefault();
            this.busy = false;
            if( this.matchedCards[this.matchedCards.length - 1].dataset.framework === document.getElementById('modal-input').value.toLowerCase()) {
                this.busy = true
                document.getElementById('title-id').innerText = "Correct!"
                this.popUp.classList.remove('wrong')
                this.popUp.classList.add('right')
                this.audioController.rightAnswer()
                setTimeout(() => {
                    this.popUp.classList.remove('active');
                    this.overlayPopUp.classList.remove('active');
                    document.getElementById('modal-input').value = ""
                }, 1000)                              
            } else {
                this.audioController.wrongAnswer()
                this.busy = false
                setTimeout(() => {document.getElementById('title-id').innerText = "Wrong! Try again!"
                this.popUp.classList.add('wrong')}, 500)
                
            }

            if( (this.matchedCards.length === this.cardsArray.length) && (this.busy = true) && (this.matchedCards[this.matchedCards.length - 1].dataset.framework === document.getElementById('modal-input').value.toLowerCase())) {
                setTimeout(() => {this.victory()}, 1000)
                
            } 
            this.busy = false
        })
        
    }
    cardMisMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000)
    }
    // getAnswer() {
    //     return 
    // }
    getCardType(card) {
        // return card.getElementsByClassName('card-value')[0].src;
        return card.dataset.framework
    }
    startCountDown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0) {
                this.gameOver()};
        }, 1000);
    }
    gameOver() {
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }
    victory() {
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
        setTimeout(() => {
            this.audioController.congrats()
        }, 1700);

    }

    shuffleCards() {
        for(let i = this.cardsArray.length - 1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
            this.cardsArray[randomIndex].style.order = i;
            this.cardsArray[i].style.order = randomIndex;
        }
    }

    canFlipCard(card) {
        return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck)
    }
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(600, cards)

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}

// document.getElementById('modal-submit').addEventListener('click', (e) => { e.preventDefault()
//     let answer = document.getElementById('modal-input').value
//     console.log(answer)}
// );



// let audioController = new AudioController();
//             audioController.startMusic();
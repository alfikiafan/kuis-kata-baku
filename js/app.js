let tidakBaku = [];
let baku = [];

// mengambil file JSON menggunakan Fetch API
fetch('https://raw.githubusercontent.com/lantip/baku-tidak-baku/main/daftar_baku_lantip.json')
  .then(response => response.json())
  .then(jsonData => {
    // mendapatkan array kunci dan nilai dari objek JSON
    tidakBaku = Object.keys(jsonData);
    baku = Object.values(jsonData);

    // mencetak array kunci dan nilai
    console.log(tidakBaku);
    console.log(baku);

    const loading = document.querySelector('.loading');
    const mainContainer = document.querySelector('.main-container');

    loading.style.display = 'none';
    setQuestions();
    mainContainer.style.display = 'block';
  })
  .catch(error => console.error('Error:', error));

$('.btn-1').on('click', answer);
$('.btn-2').on('click', answer);

const numRightAnswers = $('.right-count');
const numWrongAnswers = $('.wrong-count');

const answerText = $('.answer-text');

let lastIndex = -1;
let index = -1;

let rightCount = 0;
let wrongCount = 0;

const rightSound = new Audio("audio/right.mp3");
const wrongSound = new Audio("audio/wrong.mp3");

const soundButton = $('.btn-sound');
let sound = true;

soundButton.on('click', function () {
  const icon = soundButton.find('i');
  icon.toggleClass("fa-volume-up fa-volume-mute");
  sound = !sound;
});

function setQuestions() {
    while (index === lastIndex) {
        index = Math.floor(Math.random() * baku.length);
    }
    const rightButton = Math.floor(Math.random() * 2);
    if (rightButton === 0) {
        $('.btn-1').text(baku[index]);
        $('.btn-2').text(tidakBaku[index]);
    } else {
        $('.btn-1').text(tidakBaku[index]);
        $('.btn-2').text(baku[index]);
    }
    lastIndex = index;
}

function answer(e) {
    if ($(e.currentTarget).text() === baku[lastIndex]) {
        const answerString = `Jawaban Anda, "${$(e.currentTarget).text()}", benar!`;
        answerText.text(answerString);
        answerText.removeClass('wrong');
        answerText.addClass('right');
        rightCount += 1;
        numRightAnswers.text(rightCount);
        if (sound) {
            rightSound.pause();
            rightSound.currentTime = 0;
            rightSound.play();
        }
        setQuestions();
    } else {
        console.log('clicked on wrong answer!');
        const answerString = `Jawaban Anda, "${$(e.currentTarget).text()}", salah!`;
        answerText.text(answerString);
        answerText.removeClass('right');
        answerText.addClass('wrong');
        wrongCount += 1;
        numWrongAnswers.text(wrongCount);
        if (sound) {
            rightSound.pause();
            rightSound.currentTime = 0;
            wrongSound.play();
        }
        setQuestions();
    }
}

setQuestions();
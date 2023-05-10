$(document).ready(function() {

    let tidakBaku = [];
    let baku = [];

    const loading = $('.loading');
    const mainContainer = $('.main-container');

    // mengambil file JSON menggunakan Fetch API
    fetch('https://raw.githubusercontent.com/alfikiafan/Kata-Baku/master/data/data.json')
    .then(response => response.json())
    .then(jsonData => {
        tidakBaku = Object.keys(jsonData);
        baku = Object.values(jsonData);

        loading.hide();
        setQuestions();
        mainContainer.show();
    })
    .catch(error => console.error('Error:', error));

    const startButton = $('.btn-start');
    const start = $('.start');
    const kuis = $('.kuis');
    const mainParagraph = $('.main-paragraph');
    const overlay = $('.overlay');
    const scoreDisplay = $('#score');
    const restartBtn = $('.btn-restart');

    startButton.on('click', function() {
        start.hide();
        kuis.show();
    });

    $('.btn-1').on('click', answer);
    $('.btn-2').on('click', answer);

    const numRightAnswers = $('.right-count');
    const numWrongAnswers = $('.wrong-count');

    const answerText = $('.answer-text');

    let lastIndex = -1;
    let index = -1;
    let questionCount = -1;
    let score = 0;

    let rightCount = 0;
    let wrongCount = 0;

    const rightSound = new Audio("audio/right.mp3");
    const wrongSound = new Audio("audio/wrong.mp3");

    const soundButton = $('.btn-sound');
    let sound = true;

    soundButton.on('click', function() {
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
        questionCount++;
        mainParagraph.text(`Soal ${questionCount} dari 20`);
    }

    function resetVariables() {
        lastIndex = -1;
        index = -1;
        questionCount = -1;
        score = 0;
    
        rightCount = 0;
        wrongCount = 0;
        answerText.text('');
        numRightAnswers.text(rightCount);
        numWrongAnswers.text(wrongCount);
    }

    function showPopup(score) {
        scoreDisplay.text(score);
        overlay.show();
    }
    
    function hidePopup() {
        overlay.hide();
    }
    restartBtn.on("click", function() {
        hidePopup();
        kuis.hide();
        start.show();
        resetVariables();
        setQuestions();
    });
    

    function answer(e) {
        const correctAnswer = baku[lastIndex];
        if ($(e.currentTarget).text() === baku[lastIndex]) {
            rightCount += 1;
            answerText.text(`Jawaban Anda, "${$(e.currentTarget).text()}", benar!`);
            answerText.removeClass('wrong');
            answerText.addClass('right');
            numRightAnswers.text(rightCount);
            if (sound) {
                rightSound.pause();
                rightSound.currentTime = 0;
                rightSound.play();
            }
            setQuestions();
        } else {
            wrongCount += 1;
            answerText.text(`Jawaban Anda, "${$(e.currentTarget).text()}", salah! Jawaban yang benar adalah "${correctAnswer}".`);
            answerText.removeClass('right');
            answerText.addClass('wrong');
            numWrongAnswers.text(wrongCount);
            if (sound) {
                rightSound.pause();
                rightSound.currentTime = 0;
                wrongSound.play();
            }
            setQuestions();
        }
        score = (rightCount / 20 * 100).toFixed(0);
        if (questionCount === 20) {
            showPopup(score);
        }
    }
});
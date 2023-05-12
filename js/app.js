$(function() {
    let tidakBaku = [];
    let baku = [];
    const loading = $('.loading');
    const mainContainer = $('.main-container');

    fetch('https://raw.githubusercontent.com/alfikiafan/Kuis-Kata-Baku/master/data/data.json')
        .then(response => response.json())
        .then(jsonData => {
            tidakBaku = Object.keys(jsonData);
            baku = Object.values(jsonData);
            setTimeout(() => {
                loading.hide();
                generateQuestion();
                mainContainer.show();
            }, 2000);
        })
        .catch(error => console.error('Error:', error));

    const startButton = $('.btn-start');
    const start = $('.start');
    const kuis = $('.kuis');
    const btn1 = $('.btn-1');
    const btn2 = $('.btn-2');
    const questionNumber = $('.question-number');
    const questionButton = $('.btn-container');
    const questionLoaderView = $('.question-loader');
    const countDownText = $('.countdown');
    const soundButton = $('.btn-sound');
    const resetButton = $('.btn-reset');
    const answerText = $('.answer-text');
    const kbbiLink = $('.kbbi-link');
    const numRightAnswers = $('.right-count');
    const numWrongAnswers = $('.wrong-count');
    const rightSound = new Audio("audio/right.mp3");
    const wrongSound = new Audio("audio/wrong.mp3");
    const overlay = $('.overlay');
    const scoreDisplay = $('#score');
    const restartBtn = $('.btn-restart');

    let isCountdownStarted = false;
    let countdown;
    let timeLeft = 10;
    let lastIndex = -1;
    let index = -1;
    let questionCount = 1;
    let score = 0;
    let rightCount = 0;
    let wrongCount = 0;
    let sound = true;

    startButton.on('click', () => {
        start.hide();
        kuis.show();
        countDown();
        isCountdownStarted = true;
    });
    btn1.on('click', answer);
    btn2.on('click', answer);

    soundButton.on('click', () => {
        const icon = soundButton.find('i');
        icon.toggleClass('fa-volume-up fa-volume-mute');
        sound = !sound;
    });

    resetButton.on('click', resetQuiz);
    restartBtn.on('click', resetQuiz);

    function wrongAnswerHandler(e, timeUp) {
        timeLeft = 10;
        const correctAnswer = baku[lastIndex];
        wrongCount += 1;
        answerText.css('color', '#f44336');
        if (timeUp) {
            answerText.text(`Waktu habis! Jawaban yang benar adalah "${correctAnswer}".`);
        } else {
            answerText.text(`Jawaban Anda, "${$(e.currentTarget).text()}", salah! Jawaban yang benar adalah "${correctAnswer}".`);
        }
        answerText.removeClass('right');
        answerText.addClass('wrong');
        numWrongAnswers.text(wrongCount);
        if (sound) {
            rightSound.pause();
            rightSound.currentTime = 0;
            wrongSound.play();
        }
        kbbiLink.attr("href", `https://kbbi.kemdikbud.go.id/entri/${correctAnswer}`);
        kbbiLink.text(`Cek arti/makna dari kata "${correctAnswer}"`);
        generateQuestion();
    }

    function countDown() {
        clearInterval(countdown);
        let timeUp = false;
        let answerClicked = false;

        function setAnswerClicked() {
            answerClicked = true;
            if (timeLeft > 0) {
                timeLeft = 10;
            }
        }

        btn1.on('click', setAnswerClicked);
        btn2.on('click', setAnswerClicked);

        countdown = setInterval(function() {
            timeLeft--;
            var minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            var seconds = (timeLeft % 60).toString().padStart(2, '0');
            var display = minutes + ":" + seconds;
            countDownText.html(display);
            if (timeLeft == 0) {
                timeUp = true;
                wrongAnswerHandler(answer, timeUp);
                questionLoader();
            }
            if (answerClicked) {
                timeLeft = 10;
                answerClicked = false;
                countDownText.html('00:10');
                setTimeout(countDownText, 1000);
            }
        }, 1000);
    }
    $(document).on("visibilitychange", function() {
        if (document.hidden) {
            clearInterval(countdown);
        } else {
            countDown();
        }
    });

    function resetQuiz() {
        clearInterval(countdown);
        hidePopup();
        kuis.hide();
        start.show();
        resetVariables();
        generateQuestion();
    }

    function questionLoader() {
        clearInterval(countdown);
        countDownText.html('00:10');
        questionButton.hide();
        questionLoaderView.show();
        setTimeout(function() {
            questionLoaderView.hide();
            questionButton.show();
            generateQuestion();
            countDown();
        }, 1000);
    }

    function generateQuestion() {
        let isQuizEnded = false;
        while (index === lastIndex) {
            index = Math.floor(Math.random() * baku.length);
        }
        const rightButton = Math.floor(Math.random() * 2);
        if (rightButton === 0) {
            btn1.text(baku[index]);
            btn2.text(tidakBaku[index]);
        } else {
            btn1.text(tidakBaku[index]);
            btn2.text(baku[index]);
        }
        lastIndex = index;
        if (questionCount <= 21) {
            if (questionCount <= 20) {
                questionNumber.text(`Soal ${questionCount} dari 20`);
            }
            questionCount++;
        }
        score = (rightCount / 20 * 100).toFixed(0);
        if (questionCount === 22) {
            showPopup(score);
            isQuizEnded = true;
        }
        if (isCountdownStarted && !isQuizEnded) {
            countDown();
        }
    }

    const resetVariables = () => {
        isCountdownStarted = false;
        timeLeft = 10;
        lastIndex = -1;
        index = -1;
        questionCount = 1;
        score = 0;
        rightCount = 0;
        wrongCount = 0;
        countDownText.html('00:10');
        answerText.text('Selamat belajar!');
        answerText.css('color', '#546e7a');
        numRightAnswers.text(rightCount);
        numWrongAnswers.text(wrongCount);
    }

    function showPopup(score) {
        scoreDisplay.text(score);
        overlay.show();
        clearInterval(countdown);
    }

    const hidePopup = () => {
        overlay.hide();
    };

    function answer(e) {
        const correctAnswer = baku[lastIndex];
        if ($(e.currentTarget).text() === baku[lastIndex]) {
            rightCount += 1;
            answerText.css('color', '#4caf50');
            answerText.text(`Jawaban Anda, "${$(e.currentTarget).text()}", benar!`);
            answerText.removeClass('wrong');
            answerText.addClass('right');
            numRightAnswers.text(rightCount);
            if (sound) {
                rightSound.pause();
                rightSound.currentTime = 0;
                rightSound.play();
            }
            kbbiLink.attr("href", `https://kbbi.kemdikbud.go.id/entri/${correctAnswer}`);
            kbbiLink.text(`Cek arti/makna dari kata "${correctAnswer}"`);
            generateQuestion();
            questionLoader();
        } else {
            wrongAnswerHandler(e, false);
            questionLoader();
        }
    }
});
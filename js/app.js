$(document).ready(function() {

	let tidakBaku = [];
	let baku = [];

	const loading = $('.loading');
	const mainContainer = $('.main-container');

	fetch('https://raw.githubusercontent.com/alfikiafan/Kata-Baku/master/data/data.json')
		.then(response => response.json())
		.then(jsonData => {
			tidakBaku = Object.keys(jsonData);
			baku = Object.values(jsonData);
			setTimeout(function() {
                loading.hide();
                setQuestions();
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
	const soundButton = $('.btn-sound');
	const resetButton = $('.btn-reset');
	const answerText = $('.answer-text');
	const numRightAnswers = $('.right-count');
	const numWrongAnswers = $('.wrong-count');
	const rightSound = new Audio("audio/right.mp3");
	const wrongSound = new Audio("audio/wrong.mp3");
	const overlay = $('.overlay');
	const scoreDisplay = $('#score');
	const restartBtn = $('.btn-restart');

	startButton.on('click', function() {
		start.hide();
		kuis.show();
	});

	btn1.on('click', answer);
	btn2.on('click', answer);

	let lastIndex = -1;
	let index = -1;
	let questionCount = 1;
	let score = 0;
	let rightCount = 0;
	let wrongCount = 0;
	let sound = true;

	soundButton.on('click', function() {
		const icon = soundButton.find('i');
		icon.toggleClass('fa-volume-up fa-volume-mute');
		sound = !sound;
	});

	resetButton.on('click', resetQuiz);
	restartBtn.on('click', resetQuiz);

	function resetQuiz() {
		hidePopup();
		kuis.hide();
		start.show();
		resetVariables();
		setQuestions();
	}		

	function setQuestions() {
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
		}
	}

	function resetVariables() {
		lastIndex = -1;
		index = -1;
		questionCount = 1;
		score = 0;

		rightCount = 0;
		wrongCount = 0;
		answerText.text('Selamat belajar!');
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
	}
});
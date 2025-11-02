import { makeHand } from "./logic/yaku_generator.js";
import { calcFu } from "./logic/calcFu.js";
import { calcHan } from "./logic/calcHan.js";
import { calculatePoint } from "./logic/point_culculator.js";
import { chance } from "./logic/utils.js";


const introSection = document.getElementById('intro');
const questionSection_tumo_ko = document.getElementById('question_tumo_ko');
const questionSection_ron_ko = document.getElementById('question_ron_ko');
const questionSection_tumo_oya = document.getElementById('question_tumo_oya');
const questionSection_ron_oya = document.getElementById('question_ron_oya');
const resultSection = document.getElementById('result');
const resultMessage = document.getElementById('result-message');
const resultQuestion = document.getElementById('result-question');
const resultHan = document.getElementById('result-han');
const resultFu = document.getElementById('result-fu');
const resultPointDisplay = document.getElementById('result-point');
const startButton = document.getElementById('start-button');
const retryButton = document.getElementById('retry-button');
const answerButtons = document.querySelectorAll('.answer-button');

function showSection(section) {
    [
        introSection,
        questionSection_tumo_ko,
        questionSection_ron_ko,
        questionSection_tumo_oya,
        questionSection_ron_oya,
        resultSection
    ].forEach((el) => {
        el.classList.toggle('active', el === section);
    });
    window.scrollTo({ top: 0, behavior: "instant" });

}

document.querySelectorAll('.back-to-intro').forEach(btn => {
    btn.addEventListener('click', () => {
        showSection(introSection);
    });
});


let currentHand = null;
let currentPoint = null;
let currentFu = null;
let currentHan = null;
let currentWinType = null;
let currentHandstate = null;
let currentSeat = null;
let currentQuestionHtml = '';



function startNewQuiz() {
    // 役・ドラ・状態をまとめて生成
    currentHand = makeHand();
    currentFu = calcFu(currentHand);
    currentHan = calcHan(currentHand);
    currentHandstate = currentHand.state.state;
    currentWinType = currentHand.state.winType;
    currentSeat = chance(0.25) ? "親" : "子";
    currentPoint = calculatePoint(currentHan, currentFu, currentWinType, currentSeat);

    // どちらのセクションか決める
    const section = (currentWinType === "ツモ")
        ? (currentSeat === "親" ? questionSection_tumo_oya : questionSection_tumo_ko)
        : (currentSeat === "親" ? questionSection_ron_oya : questionSection_ron_ko);
    const questionList = section.querySelector(".question-list");

    const questionHtml = `
      <p>席：<strong>${currentSeat}</strong></p>
      <p>和了り方：<strong>${currentHandstate}${currentWinType}</strong></p>
      <p>役：</p>
      <ul>${currentHand.yaku.map(y => `<li>${y.name}</li>`).join("")}</ul>
    `;

    questionList.innerHTML = questionHtml;
    currentQuestionHtml = questionHtml;

    // 前回の回答結果をリセット
    answerButtons.forEach((btn) => {
        btn.classList.remove('correct', 'incorrect');
        btn.disabled = false;
    });
    resultMessage.textContent = '';
    resultMessage.className = 'result-message';
    resultQuestion.innerHTML = '';
    resultHan.textContent = '';
    resultFu.textContent = '';
    resultPointDisplay.textContent = '';

    showSection(section);
}


startButton.addEventListener('click', () => {
    startNewQuiz();
});


retryButton.addEventListener('click', () => {
    startNewQuiz();
});

answerButtons.forEach((button) => {
    button.addEventListener('click', () => {
        answerButtons.forEach((btn) => {
            btn.disabled = true;
            if (btn.dataset.score === currentPoint.point) {
                btn.classList.add('correct');
            }
        });

        const isCorrect = button.dataset.score === currentPoint.point;
        resultMessage.className = 'result-message';

        if (isCorrect) {
            resultMessage.textContent = `正解です！「${currentPoint.point}」です。`;
            resultMessage.classList.add('success');
        } else {
            button.classList.add('incorrect');
            resultMessage.textContent = `残念！正解は「${currentPoint.point}」です。`;
            resultMessage.classList.add('failure');
        }

        resultQuestion.innerHTML = currentQuestionHtml;
        resultHan.textContent = `${currentHan}飜`;
        resultFu.textContent = `${currentFu}符`;
        resultPointDisplay.textContent = currentPoint.point;

        showSection(resultSection);
    });
});

document.querySelectorAll('.score-box').forEach((box) => {
    const slider = box.querySelector('.score-zoom-slider');
    const valueLabel = box.querySelector('.score-zoom-value');
    const shrinkButton = box.querySelector('.score-zoom-button[data-zoom="out"]');
    const minZoom = parseFloat(slider?.min ?? "0.4");
    const maxZoom = parseFloat(slider?.max ?? "1");
    const stepZoom = parseFloat(slider?.step ?? "0.05");

    if (!slider) {
        return;
    }

    const clampZoom = (value) => Math.min(maxZoom, Math.max(minZoom, value));
    const tolerance = 0.0001;

    const updateZoom = (nextValue) => {
        const parsed = parseFloat(nextValue);
        const baseValue = Number.isFinite(parsed) ? parsed : 1;
        const clamped = clampZoom(baseValue);
        const rounded = Math.round(clamped * 100) / 100;
        box.style.setProperty('--score-zoom', rounded);
        slider.value = rounded.toFixed(2);
        if (valueLabel) {
            valueLabel.textContent = `${Math.round(rounded * 100)}%`;
        }
        if (shrinkButton) {
            shrinkButton.disabled = rounded <= minZoom + tolerance;
        }
    };

    slider.addEventListener('input', (event) => {
        updateZoom(event.target.value);
    });

    if (shrinkButton) {
        shrinkButton.addEventListener('click', () => {
            const current = parseFloat(slider.value);
            updateZoom(current - stepZoom);
        });
    }

    if (valueLabel) {
        valueLabel.addEventListener('click', () => {
            updateZoom(1);
        });
    }

    updateZoom(parseFloat(slider.value));
});

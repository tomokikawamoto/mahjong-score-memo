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

// シンプルなWeb Audioベースの効果音プレーヤー
const feedbackPlayer = (() => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    let context = null;

    const ensureContext = () => {
        if (!AudioContextClass) {
            return null;
        }
        if (!context) {
            context = new AudioContextClass();
        }
        if (context.state === "suspended" && typeof context.resume === "function") {
            context.resume();
        }
        return context;
    };

    const sequences = {
        correct: [
            { frequency: 880, duration: 0.18, wave: "triangle" },
            { frequency: 1175, duration: 0.22, wave: "triangle" },
        ],
        incorrect: [
            { frequency: 220, duration: 0.28, wave: "sawtooth" },
            { frequency: 196, duration: 0.32, wave: "sawtooth" },
        ],
    };

    return {
        play(type) {
            const ctx = ensureContext();
            const sequence = sequences[type];
            if (!ctx || !sequence) {
                return;
            }

            let start = ctx.currentTime;
            sequence.forEach(({ frequency, duration, wave }) => {
                const oscillator = ctx.createOscillator();
                const gain = ctx.createGain();

                oscillator.type = wave;
                oscillator.frequency.value = frequency;

                const attack = Math.min(0.04, duration * 0.35);
                gain.gain.setValueAtTime(0.001, start);
                gain.gain.exponentialRampToValueAtTime(0.2, start + attack);
                gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

                oscillator.connect(gain);
                gain.connect(ctx.destination);

                oscillator.start(start);
                oscillator.stop(start + duration);

                start += duration * 0.8;
            });
        }
    };
})();

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

const buildQuestionHtml = (options = {}) => {
    const { includeHan = false } = options;
    if (!currentHand) {
        return "";
    }
    const yakuItems = currentHand.yaku.map((y) => {
        const hanLabel = includeHan ? `<span class="yaku-han">(${y.han}飜)</span>` : "";
        return `<li>${y.name}${hanLabel}</li>`;
    }).join("");
    return `
      <p>席：<strong>${currentSeat}</strong></p>
      <p>和了り方：<strong>${currentHandstate}${currentWinType}</strong></p>
      <p>役：</p>
      <ul>${yakuItems}</ul>
    `;
};



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

    questionList.innerHTML = buildQuestionHtml({ includeHan: false });

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

        feedbackPlayer.play(isCorrect ? "correct" : "incorrect");

        resultQuestion.innerHTML = buildQuestionHtml({ includeHan: true });
        resultHan.textContent = `${currentHan}飜`;
        resultFu.textContent = `${currentFu}符`;
        resultPointDisplay.textContent = currentPoint.point;

        showSection(resultSection);
    });
});

document.querySelectorAll('.score-box').forEach((box) => {
    const slider = box.querySelector('.score-zoom-slider');

    if (!slider) {
        return;
    }

    const minZoom = parseFloat(slider.min ?? "0.2");
    const maxZoom = parseFloat(slider.max ?? "1");
    const defaultZoom = parseFloat(slider.getAttribute('value') ?? "0.6");

    const clampZoom = (value) => Math.min(maxZoom, Math.max(minZoom, value));
    const updateZoom = (nextValue) => {
        const parsed = parseFloat(nextValue);
        const baseValue = Number.isFinite(parsed) ? parsed : defaultZoom;
        const clamped = clampZoom(baseValue);
        const rounded = Math.round(clamped * 100) / 100;
        box.style.setProperty('--score-zoom', rounded);
        slider.value = rounded.toFixed(2);
    };

    slider.addEventListener('input', (event) => {
        updateZoom(event.target.value);
    });

    slider.addEventListener('dblclick', () => {
        updateZoom(defaultZoom);
    });

    updateZoom(parseFloat(slider.value));
});

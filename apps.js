import { makeHand } from "./logic/yaku_generator.js";
import { calculatePoint } from "./logic/point_culculator.js";


const introSection = document.getElementById('intro');
const questionSection_tumo = document.getElementById('question-tumo');
const questionSection_ron = document.getElementById('question_ron');
const resultSection = document.getElementById('result');
const resultMessage = document.getElementById('result-message');
const startButton = document.getElementById('start-button');
const retryButton = document.getElementById('retry-button');
const answerButtons = document.querySelectorAll('.answer-button');

function showSection(section) {
    [introSection, questionSection_tumo, questionSection_ron, resultSection].forEach((el) => {
        el.classList.toggle('active', el === section);
    });
}


let currentHand = null;
let currentPoint = null;

function startNewQuiz() {
    // 役・ドラ・状態をまとめて生成
    currentHand = makeHand();
    currentPoint = calculatePoint(currentHand);
    const hand = currentHand;

    // どちらのセクションか決める
    const section =
        hand.state.winType === "ロン" ? questionSection_ron : questionSection_tumo;
    const questionList = section.querySelector(".question-list");

    // 役一覧のHTML生成
    const yakuHTML = hand.yaku.map(y => `<li>${y.name}</li>`).join("");

    // UIへ反映
    questionList.innerHTML = `
      <p>ロン or ツモ：<strong>${hand.state.winType}</strong></p>
      <p>門前 or 風露手：<strong>${hand.state.state}</strong></p>
      <p>役：</p>
      <ul>${yakuHTML}</ul>
    `;

    // 前回の回答結果をリセット
    answerButtons.forEach((btn) => {
        btn.classList.remove('correct', 'incorrect');
        btn.disabled = false;
    });
    resultMessage.textContent = '';
    resultMessage.className = 'result-message';

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
            if (btn.dataset.score === currentPoint) {
                btn.classList.add('correct');
            }
        });

        if (button.dataset.score === currentPoint) {
            resultMessage.textContent = `正解です！「${currentPoint}」です。`;
            resultMessage.classList.add('success');
        } else {
            button.classList.add('incorrect');
            resultMessage.textContent = `残念！正解は「${currentPoint}」です。
            ${currentHand.yaku.map(y => y.name).join(", ")}は${currentPoint}になります。`;
            resultMessage.classList.add('failure');
        }

        showSection(resultSection);
    });
});


const cover = document.querySelector('.cover');
const startBtn = document.querySelector('.start');
const startWrap = document.querySelector('.start-wrap');
startBtn.addEventListener('click', init);

const display = document.querySelector('.display');
const heartList = document.querySelector('.heart-wrap');
const stageBox = document.querySelector('.stage-box');
const resultBox = document.querySelector('.result-box');

// 레벨이 올라가는 스테이지 단위
const levelUpCount = 7;
const MAX_TIME = 10; // 초단위
const timer = document.querySelector('.timer');
let interval;

let TIME = MAX_TIME;
let stage = 1;
let level = 1;
let failCount = 0;
let colorPoint = 0;
let baseColor = '';
let targetColor = '';
let targetIndex = {
  x: Math.floor(Math.random() * (level + 1)),
  y: Math.floor(Math.random() * (level + 1)),
};

function start() {
  heartList.innerHTML = `<i class="fas fa-heart"></i>
  <i class="fas fa-heart"></i>
  <i class="fas fa-heart"></i>
  <i class="fas fa-heart"></i>
  <i class="fas fa-heart"></i>`;
  stageBox.textContent = `stage : ${stage}`;
  next();
}

function setDisplay() {
  for (let i = 0; i < level + 1; i++) {
    const row = document.createElement('div');
    row.style.height = `${100 / (level + 1)}%`;

    for (let j = 0; j < level + 1; j++) {
      const rowItem = document.createElement('div');
      rowItem.classList += 'item';
      rowItem.style.width = `${100 / (level + 1)}%`;
      // 타겟은 다른색 & 다른 이벤트
      if (isTarget(i, j)) {
        rowItem.classList += ' target';
        rowItem.style.backgroundColor = targetColor;
        rowItem.onclick = success;
      } else {
        rowItem.style.backgroundColor = baseColor;
        rowItem.onclick = fail;
      }
      row.appendChild(rowItem);
    }
    display.appendChild(row);
  }
}

function next() {
  resetTimer();
  startTimer();
  clearDisplay();
  setBaseColor();
  setTarget();
  setDisplay();
}

function init() {
  startWrap.remove();
  start();
}

function clearDisplay() {
  while (display.hasChildNodes()) {
    display.removeChild(display.firstChild);
  }
}

function setBaseColor() {
  colorPoint = ~~(360 * Math.random());
  baseColor = `hsla(${colorPoint},100%,70%,0.4)`;
}

function setTarget() {
  // 위치
  targetIndex.x = Math.floor(Math.random() * (level + 1));
  targetIndex.y = Math.floor(Math.random() * (level + 1));
  // 타겟 컬러 설정
  // 가중치 k 에 따라 baseColor 와의 차이 조절
  let k = (200 / level) * (1 - level / 20);
  if (colorPoint - k < 0) colorPoint += k;
  else colorPoint -= k;
  targetColor = `hsla(${colorPoint},100%,70%,0.4)`;
}

function isTarget(i, j) {
  if (targetIndex.y === i && targetIndex.x === j) return true;
  return false;
}

function success() {
  stage++;
  stageBox.textContent = `stage : ${stage}`;
  if (stage % levelUpCount === 0) {
    level++;
  }
  next();
}

function fail() {
  console.log('fail');
  heartList.children[heartList.childElementCount - 1 - failCount].classList += ' heart-empty';
  failCount++;
  if (failCount === 5) {
    clearInterval(interval);
    end();
    result();
  }
}

// 타이머 관련
function resetTimer() {
  clearInterval(interval);
  TIME = MAX_TIME;
  timer.textContent = Math.floor(TIME);
}

// 타이머 시작 (리셋 및 시간줄이기)
function startTimer() {
  // .5초마다 수행
  interval = setInterval(updateTimer, 500);
}

function updateTimer() {
  timer.textContent = Math.floor(TIME);
  TIME -= 0.5;
  if (TIME < 0) {
    fail();
    if (failCount < 5) {
      success();
    }
  }
}

function end() {
  const target = document.querySelector('.target');
  target.style.boxShadow = `inset 0px 0px ${20 / level + 2}px #000000`;
  cover.style.zIndex = '10';
}

function result() {
  let result = '';
  if (stage >= levelUpCount * 15) result = '내 사이트를 해킹하지 마십시오.';
  else if (stage >= levelUpCount * 10) result = '당신은 혹시.. 신입니까?';
  else if (stage >= levelUpCount * 9) result = '당신의 감각은 인류의 자랑거리입니다.';
  else if (stage >= levelUpCount * 8) result = '당신의 어쩌면.. 맹금류입니다.';
  else if (stage >= levelUpCount * 6) result = '당신의 야생동물적인 감각을 가지고 있습니다.';
  else if (stage >= levelUpCount * 4) result = '당신의 컬러감각은 미대생 수준입니다.';
  else if (stage >= levelUpCount * 2) result = '당신의 컬러감각은 일반적인 수준입니다.';
  else if (stage >= levelUpCount) result = '당신은 초보수준 컬러감각을 가지고 있습니다.';
  else result = '음.. 조금만 제대로 플레이 해보시겠습니까?';

  resultBox.innerHTML = `최종 스테이지 : ${stage}<br>
  <p class="result-text">${result}</p>
  <button class="restart">다시 도전</button>`;
  const restartBtn = document.querySelector('.restart');
  restartBtn.addEventListener('click', restart);
}

function restart() {
  TIME = MAX_TIME;
  stage = 1;
  level = 1;
  failCount = 0;
  colorPoint = 0;
  baseColor = '';
  targetColor = '';
  targetIndex = {
    x: Math.floor(Math.random() * (level + 1)),
    y: Math.floor(Math.random() * (level + 1)),
  };
  cover.style.zIndex = '-10';
  resultBox.innerHTML = '';
  start();
}

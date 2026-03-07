// 单词赛车游戏 - 核心逻辑
// 版本：1.0

// 游戏配置
const RACE_CONFIG = {
    trackLength: 100, // 赛道长度百分比
    baseSpeed: 10, // 基础速度
    boostSpeed: 25, // 加速速度
    enemyBaseSpeed: 8, // 敌人基础速度
    lapCount: 3, // 总圈数
    difficulties: {
        easy: { wordLength: [3, 4], enemySpeed: 0.7, time: 120 },
        normal: { wordLength: [4, 5], enemySpeed: 1.0, time: 90 },
        hard: { wordLength: [5, 7], enemySpeed: 1.3, time: 60 }
    }
};

// 单词库
const WORD_DATABASE = {
    3: ['CAT', 'DOG', 'SUN', 'MOON', 'STAR', 'TREE', 'FISH', 'BIRD', 'BOOK', 'BALL', 'RED', 'BLUE', 'GREEN', 'HAPPY', 'FAST'],
    4: ['TIGER', 'RABBIT', 'MONKEY', 'PANDA', 'APPLE', 'BANANA', 'ORANGE', 'WATER', 'FIRE', 'EARTH', 'WIND', 'RAIN', 'SNOW', 'JUMP', 'RUN'],
    5: ['ELEPHANT', 'GIRAFFE', 'DOLPHIN', 'BUTTERFLY', 'DRAGON', 'KNIGHT', 'CASTLE', 'FOREST', 'MOUNTAIN', 'RIVER', 'OCEAN', 'PLANET', 'ROCKET', 'ROBOT', 'MUSIC'],
    6: ['DINOSAUR', 'UNICORN', 'PHOENIX', 'WIZARD', 'PRINCESS', 'KANGAROO', 'PENGUIN', 'VOLCANO', 'THUNDER', 'LIGHTNING', 'RAINBOW', 'CRYSTAL', 'DIAMOND', 'GOLDEN', 'SILVER'],
    7: ['ADVENTURE', 'DISCOVERY', 'EXPLORER', 'CHAMPION', 'VICTORY', 'TRIUMPH', 'POWERFUL', 'MAGICAL', 'MYSTERIOUS', 'FANTASTIC', 'INCREDIBLE', 'AMAZING', 'WONDERFUL', 'BEAUTIFUL', 'BRILLIANT']
};

// 游戏状态
let raceState = {
    isRacing: false,
    difficulty: 'normal',
    playerPosition: 0,
    enemy1Position: 0,
    enemy2Position: 0,
    currentLap: 1,
    score: 0,
    speed: 0,
    maxSpeed: 0,
    currentWord: '',
    currentInput: '',
    wordsTyped: 0,
    startTime: 0,
    elapsedTime: 0,
    timer: null,
    enemyTimer: null,
    rank: 1
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initRace();
    setupInput();
});

function initRace() {
    resetRaceState();
    updateDisplay();
    showCountdown();
}

function resetRaceState() {
    raceState = {
        isRacing: false,
        difficulty: raceState.difficulty || 'normal',
        playerPosition: 0,
        enemy1Position: 0,
        enemy2Position: 0,
        currentLap: 1,
        score: 0,
        speed: 0,
        maxSpeed: 0,
        currentWord: '',
        currentInput: '',
        wordsTyped: 0,
        startTime: 0,
        elapsedTime: 0,
        timer: null,
        enemyTimer: null,
        rank: 1
    };
}

function setDifficulty(level) {
    raceState.difficulty = level;
    
    // 更新按钮状态
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function showCountdown() {
    const track = document.getElementById('race-track');
    const countdowns = [3, 2, 1];
    
    let count = 0;
    const interval = setInterval(() => {
        if (count >= countdowns.length) {
            clearInterval(interval);
            startRace();
            return;
        }
        
        // 移除旧倒计时
        const old = track.querySelector('.countdown');
        if (old) old.remove();
        
        // 显示新倒计时
        const el = document.createElement('div');
        el.className = 'countdown';
        el.textContent = countdowns[count];
        track.appendChild(el);
        
        count++;
    }, 1000);
}

function startRace() {
    raceState.isRacing = true;
    raceState.startTime = Date.now();
    
    // 启用输入
    const input = document.getElementById('typing-input-race');
    input.disabled = false;
    input.focus();
    
    // 启动计时器
    const config = RACE_CONFIG.difficulties[raceState.difficulty];
    let timeLeft = config.time;
    
    raceState.timer = setInterval(() => {
        timeLeft--;
        raceState.elapsedTime = config.time - timeLeft;
        
        document.getElementById('lap').textContent = `${raceState.currentLap}/${RACE_CONFIG.lapCount}`;
        
        // 敌人移动
        moveEnemies();
        
        if (timeLeft <= 0) {
            endRace();
        }
    }, 1000);
    
    // 启动敌人 AI
    raceState.enemyTimer = setInterval(() => {
        if (raceState.isRacing) {
            moveEnemies();
        }
    }, 500);
    
    loadNewWord();
}

function loadNewWord() {
    const config = RACE_CONFIG.difficulties[raceState.difficulty];
    const wordLengths = config.wordLength;
    
    // 随机选择单词长度
    const length = wordLengths[Math.floor(Math.random() * wordLengths.length)];
    const words = WORD_DATABASE[length];
    
    // 随机选择单词
    raceState.currentWord = words[Math.floor(Math.random() * words.length)];
    raceState.currentInput = '';
    
    // 显示提示
    const hints = ['加速！', '快点！', '你能行！', '冲刺！', '加油！'];
    document.getElementById('word-hint').textContent = hints[Math.floor(Math.random() * hints.length)];
    
    // 渲染单词
    renderWordLetters();
    
    // 清空输入
    const input = document.getElementById('typing-input-race');
    input.value = '';
    input.focus();
    
    // 禁用加速按钮
    document.getElementById('boost-button').disabled = true;
}

function renderWordLetters() {
    const container = document.getElementById('word-letters');
    const word = raceState.currentWord;
    const input = raceState.currentInput;
    
    container.innerHTML = word.split('').map((char, index) => {
        let className = 'letter-tile';
        if (index < input.length) {
            if (input[index] === char) {
                className += ' correct';
            } else {
                className += ' wrong';
            }
        }
        if (index === input.length) {
            className += ' current';
        }
        return `<div class="${className}">${char}</div>`;
    }).join('');
}

function setupInput() {
    const input = document.getElementById('typing-input-race');
    
    input.addEventListener('input', function() {
        if (!raceState.isRacing) return;
        
        raceState.currentInput = this.value.toUpperCase().replace(/[^A-Z]/g, '');
        this.value = raceState.currentInput;
        
        renderWordLetters();
        
        // 检查是否完成
        if (raceState.currentInput === raceState.currentWord) {
            document.getElementById('boost-button').disabled = false;
            playSound('ready');
        } else {
            document.getElementById('boost-button').disabled = true;
            
            // 检查错误
            const word = raceState.currentWord;
            const lastCharIndex = raceState.currentInput.length - 1;
            
            if (lastCharIndex >= 0 && raceState.currentInput[lastCharIndex] !== word[lastCharIndex]) {
                playSound('wrong');
                showFeedback('error');
            }
        }
    });
    
    // 回车加速
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !document.getElementById('boost-button').disabled) {
            boost();
        }
    });
}

function boost() {
    if (!raceState.isRacing) return;
    
    // 计算速度
    const wordLength = raceState.currentWord.length;
    const baseBoost = RACE_CONFIG.boostSpeed;
    const lengthBonus = wordLength * 2;
    raceState.speed = baseBoost + lengthBonus;
    
    if (raceState.speed > raceState.maxSpeed) {
        raceState.maxSpeed = raceState.speed;
    }
    
    // 玩家前进
    const distance = (raceState.speed / 100) * (RACE_CONFIG.trackLength / 10);
    raceState.playerPosition += distance;
    
    // 增加分数
    const points = wordLength * 10 + raceState.speed;
    raceState.score += points;
    raceState.wordsTyped++;
    
    // 播放音效
    playSound('boost');
    
    // 显示速度线效果
    showSpeedLines();
    
    // 更新显示
    updateDisplay();
    updateCarPositions();
    updateRank();
    
    // 检查是否完成一圈
    if (raceState.playerPosition >= 100) {
        completeLap();
    } else {
        loadNewWord();
    }
}

function moveEnemies() {
    const config = RACE_CONFIG.difficulties[raceState.difficulty];
    const enemySpeed = RACE_CONFIG.enemyBaseSpeed * config.enemySpeed;
    
    // 敌人随机移动
    const move1 = (Math.random() * enemySpeed) + (enemySpeed * 0.5);
    const move2 = (Math.random() * enemySpeed) + (enemySpeed * 0.5);
    
    raceState.enemy1Position = Math.min(100, raceState.enemy1Position + move1);
    raceState.enemy2Position = Math.min(100, raceState.enemy2Position + move2);
    
    updateCarPositions();
    updateRank();
}

function completeLap() {
    raceState.currentLap++;
    raceState.playerPosition = 0;
    
    if (raceState.currentLap > RACE_CONFIG.lapCount) {
        // 完成比赛
        endRace(true);
    } else {
        // 进入下一圈
        showFeedback('lap');
        loadNewWord();
    }
    
    updateDisplay();
}

function updateCarPositions() {
    const playerCar = document.getElementById('player-car');
    const enemy1Car = document.getElementById('enemy-car-1');
    const enemy2Car = document.getElementById('enemy-car-2');
    
    playerCar.style.left = `${raceState.playerPosition}%`;
    enemy1Car.style.left = `${raceState.enemy1Position}%`;
    enemy2Car.style.left = `${raceState.enemy2Position}%`;
}

function updateRank() {
    const positions = [
        { name: '你', pos: raceState.playerPosition },
        { name: '对手 1', pos: raceState.enemy1Position },
        { name: '对手 2', pos: raceState.enemy2Position }
    ];
    
    positions.sort((a, b) => b.pos - a.pos);
    
    const yourRank = positions.findIndex(p => p.name === '你') + 1;
    raceState.rank = yourRank;
    
    const rankEmojis = ['🥇', '🥈', '🥉'];
    const rankText = yourRank === 1 ? '你' : `落后第 1 名 ${Math.round(positions[0].pos - raceState.playerPosition)}%`;
    
    document.getElementById('position-display').innerHTML = `
        <div class="position-item ${yourRank === 1 ? 'first' : ''}">
            <span>${rankEmojis[yourRank - 1] || '🏁'} 第 ${yourRank} 名</span>
            <span id="position-text">${rankText}</span>
        </div>
    `;
}

function updateDisplay() {
    document.getElementById('score').textContent = raceState.score;
    document.getElementById('speed').textContent = `${Math.round(raceState.speed)} km/h`;
    document.getElementById('lap').textContent = `${raceState.currentLap}/${RACE_CONFIG.lapCount}`;
}

function showSpeedLines() {
    const track = document.getElementById('race-track');
    
    for (let i = 0; i < 10; i++) {
        const line = document.createElement('div');
        line.className = 'speed-line';
        line.style.left = `${Math.random() * 100}%`;
        line.style.animationDelay = `${Math.random() * 0.5}s`;
        track.appendChild(line);
        
        setTimeout(() => line.remove(), 500);
    }
}

function showFeedback(type) {
    const input = document.getElementById('typing-input-race');
    
    if (type === 'error') {
        input.style.borderColor = '#d63031';
        setTimeout(() => {
            input.style.borderColor = '#667eea';
        }, 300);
    } else if (type === 'lap') {
        // 圈数完成提示
        input.style.borderColor = '#00b894';
        setTimeout(() => {
            input.style.borderColor = '#667eea';
        }, 500);
    }
}

function endRace(won = false) {
    raceState.isRacing = false;
    clearInterval(raceState.timer);
    clearInterval(raceState.enemyTimer);
    
    if (won || raceState.rank === 1) {
        // 胜利
        showVictory();
    } else {
        // 失败
        showDefeat();
    }
}

function showVictory() {
    playSound('victory');
    
    document.getElementById('complete-title').textContent = '🏆 冠军！';
    document.getElementById('complete-trophy').textContent = '🏆';
    document.getElementById('final-score-race').textContent = raceState.score;
    document.getElementById('final-time-race').textContent = `${raceState.elapsedTime}s`;
    document.getElementById('final-words-race').textContent = raceState.wordsTyped;
    document.getElementById('final-speed-race').textContent = `${Math.round(raceState.maxSpeed)} km/h`;
    
    document.getElementById('race-complete-modal').style.display = 'flex';
}

function showDefeat() {
    playSound('gameover');
    
    const rankEmojis = ['🥇', '🥈', '🥉'];
    const rankEmoji = rankEmojis[raceState.rank - 1] || '🏁';
    
    document.getElementById('game-over-trophy').textContent = rankEmoji;
    document.getElementById('game-over-message').textContent = `你获得了第 ${raceState.rank} 名`;
    
    document.getElementById('race-game-over-modal').style.display = 'flex';
}

function restartRace() {
    document.getElementById('race-complete-modal').style.display = 'none';
    document.getElementById('race-game-over-modal').style.display = 'none';
    
    // 重置车辆位置
    raceState.playerPosition = 0;
    raceState.enemy1Position = 0;
    raceState.enemy2Position = 0;
    updateCarPositions();
    
    resetRaceState();
    updateDisplay();
    showCountdown();
}

function goBack() {
    window.location.href = 'index.html';
}

// 音效系统
function playSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        const now = audioContext.currentTime;
        
        switch(type) {
            case 'boost':
                oscillator.frequency.setValueAtTime(400, now);
                oscillator.frequency.setValueAtTime(800, now + 0.2);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                oscillator.start(now);
                oscillator.stop(now + 0.4);
                break;
            case 'ready':
                oscillator.frequency.setValueAtTime(800, now);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
                break;
            case 'wrong':
                oscillator.frequency.setValueAtTime(200, now);
                oscillator.frequency.setValueAtTime(150, now + 0.1);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                oscillator.start(now);
                oscillator.stop(now + 0.2);
                break;
            case 'victory':
                [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    osc.connect(gain);
                    gain.connect(audioContext.destination);
                    osc.frequency.value = freq;
                    gain.gain.setValueAtTime(0.2, now + i * 0.15);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.4);
                    osc.start(now + i * 0.15);
                    osc.stop(now + i * 0.15 + 0.4);
                });
                break;
            case 'gameover':
                oscillator.frequency.setValueAtTime(400, now);
                oscillator.frequency.setValueAtTime(300, now + 0.2);
                oscillator.frequency.setValueAtTime(200, now + 0.4);
                gainNode.gain.setValueAtTime(0.3, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
                oscillator.start(now);
                oscillator.stop(now + 0.6);
                break;
        }
    } catch (e) {
        console.log('音效播放失败:', e);
    }
}

console.log('🏎️ 单词赛车游戏已加载！准备比赛！');

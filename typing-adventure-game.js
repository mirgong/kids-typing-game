// 打字冒险游戏 - 核心逻辑
// 版本：1.0

// 游戏配置
const ADVENTURE_CONFIG = {
    basePlayerHealth: 100,
    baseMonsterHealth: 50,
    baseDamage: 10,
    comboBonus: 0.2, // 20% 伤害加成 per combo
    maxCombo: 10
};

// 关卡数据
const LEVELS = [
    {
        level: 1,
        monster: '🐉',
        monsterName: '小恶龙',
        monsterHealth: 50,
        playerSprite: '🧙‍♂️',
        rescuedAnimal: '🐰',
        words: ['CAT', 'DOG', 'SUN', 'MOON', 'STAR']
    },
    {
        level: 2,
        monster: '👹',
        monsterName: '食人魔',
        monsterHealth: 80,
        playerSprite: '🧙‍♂️',
        rescuedAnimal: '🐱',
        words: ['TREE', 'FISH', 'BIRD', 'BOOK', 'BALL']
    },
    {
        level: 3,
        monster: '👻',
        monsterName: '幽灵',
        monsterHealth: 100,
        playerSprite: '🧙‍♀️',
        rescuedAnimal: '🐶',
        words: ['HAPPY', 'SMILE', 'DANCE', 'MUSIC', 'PARTY']
    },
    {
        level: 4,
        monster: '🤖',
        monsterName: '机器人',
        monsterHealth: 120,
        playerSprite: '🦸',
        rescuedAnimal: '🐼',
        words: ['ROBOT', 'LASER', 'POWER', 'METAL', 'FUTURE']
    },
    {
        level: 5,
        monster: '🐲',
        monsterName: '龙王',
        monsterHealth: 150,
        playerSprite: '🦸‍♀️',
        rescuedAnimal: '🦄',
        words: ['DRAGON', 'FIRE', 'WINGS', 'TREASURE', 'LEGEND']
    },
    {
        level: 6,
        monster: '👾',
        monsterName: '外星魔王',
        monsterHealth: 200,
        playerSprite: '🧙‍♂️',
        rescuedAnimal: '🌟',
        words: ['UNIVERSE', 'GALAXY', 'PLANET', 'ASTRONAUT', 'SPACESHIP']
    }
];

// 游戏状态
let gameState = {
    currentLevel: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    rescued: 0,
    playerHealth: 100,
    monsterHealth: 50,
    currentWord: '',
    currentInput: '',
    isPlaying: false,
    monsterAttackTimer: null,
    wordIndex: 0
};

// 初始化游戏
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    setupInput();
});

function initGame() {
    gameState.currentLevel = 0;
    gameState.score = 0;
    gameState.combo = 0;
    gameState.maxCombo = 0;
    gameState.rescued = 0;
    gameState.isPlaying = true;
    
    startLevel(0);
}

function startLevel(levelIndex) {
    if (levelIndex >= LEVELS.length) {
        // 通关所有关卡
        showVictory();
        return;
    }
    
    gameState.currentLevel = levelIndex;
    const level = LEVELS[levelIndex];
    
    // 设置玩家
    gameState.playerHealth = ADVENTURE_CONFIG.basePlayerHealth;
    document.getElementById('player-sprite').textContent = level.playerSprite;
    
    // 设置怪物
    gameState.monsterHealth = level.monsterHealth;
    document.getElementById('monster-sprite').textContent = level.monster;
    document.getElementById('monster-name').textContent = level.monsterName;
    document.getElementById('rescued-animal').textContent = level.rescuedAnimal;
    
    // 重置 UI
    updateHealthBars();
    updateStats();
    
    // 开始新单词
    gameState.wordIndex = 0;
    loadNewWord();
    
    // 启动怪物攻击定时器
    startMonsterAttacks();
}

function loadNewWord() {
    const level = LEVELS[gameState.currentLevel];
    const words = level.words;
    
    // 随机选择一个单词
    gameState.currentWord = words[Math.floor(Math.random() * words.length)];
    gameState.currentInput = '';
    
    // 显示单词
    renderWordDisplay();
    
    // 清空输入框
    const input = document.getElementById('typing-input-adventure');
    input.value = '';
    input.focus();
    
    // 禁用攻击按钮
    document.getElementById('attack-button').disabled = true;
}

function renderWordDisplay() {
    const display = document.getElementById('word-display');
    const word = gameState.currentWord;
    const input = gameState.currentInput;
    
    display.innerHTML = word.split('').map((char, index) => {
        let className = 'letter-box';
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
    const input = document.getElementById('typing-input-adventure');
    
    input.addEventListener('input', function() {
        if (!gameState.isPlaying) return;
        
        gameState.currentInput = this.value.toUpperCase().replace(/[^A-Z]/g, '');
        this.value = gameState.currentInput;
        
        renderWordDisplay();
        
        // 检查是否完成输入
        if (gameState.currentInput === gameState.currentWord) {
            document.getElementById('attack-button').disabled = false;
            playSound('ready');
        } else {
            document.getElementById('attack-button').disabled = true;
            
            // 检查输入是否正确
            const word = gameState.currentWord;
            const lastCharIndex = gameState.currentInput.length - 1;
            
            if (lastCharIndex >= 0 && gameState.currentInput[lastCharIndex] !== word[lastCharIndex]) {
                // 输入错误
                playSound('wrong');
                showFeedback('❌ 错了！', 'error');
                resetCombo();
            }
        }
    });
    
    // 支持回车键攻击
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !document.getElementById('attack-button').disabled) {
            attack();
        }
    });
}

function attack() {
    if (!gameState.isPlaying) return;
    
    const level = LEVELS[gameState.currentLevel];
    
    // 计算伤害
    let damage = ADVENTURE_CONFIG.baseDamage;
    damage += gameState.combo * ADVENTURE_CONFIG.comboBonus * damage;
    damage = Math.floor(damage);
    
    // 连击加成
    if (gameState.combo > 0) {
        damage += Math.floor(gameState.combo * 2);
    }
    
    // 增加连击
    gameState.combo++;
    if (gameState.combo > gameState.maxCombo) {
        gameState.maxCombo = gameState.combo;
    }
    
    // 更新连击显示
    updateComboDisplay();
    
    // 扣除怪物生命值
    gameState.monsterHealth = Math.max(0, gameState.monsterHealth - damage);
    
    // 增加分数
    const points = damage * 10;
    gameState.score += points;
    
    // 播放音效
    playSound('attack');
    
    // 显示伤害数字
    showDamageNumber(damage);
    
    // 怪物受击动画
    const monsterSprite = document.getElementById('monster-sprite');
    monsterSprite.classList.add('hit');
    setTimeout(() => monsterSprite.classList.remove('hit'), 500);
    
    // 更新 UI
    updateHealthBars();
    updateStats();
    
    // 检查怪物是否被击败
    if (gameState.monsterHealth <= 0) {
        monsterDefeated();
    } else {
        // 加载新单词
        loadNewWord();
    }
}

function monsterDefeated() {
    gameState.isPlaying = false;
    clearInterval(gameState.monsterAttackTimer);
    
    gameState.rescued++;
    
    // 播放胜利音效
    playSound('victory');
    
    // 显示拯救的动物
    const level = LEVELS[gameState.currentLevel];
    const rescuedAnimal = document.getElementById('rescued-animal');
    rescuedAnimal.style.display = 'block';
    
    // 显示关卡完成弹窗
    setTimeout(() => {
        document.getElementById('level-complete-modal').style.display = 'flex';
    }, 1000);
}

function nextLevel() {
    document.getElementById('level-complete-modal').style.display = 'none';
    document.getElementById('rescued-animal').style.display = 'none';
    
    startLevel(gameState.currentLevel + 1);
}

function startMonsterAttacks() {
    clearInterval(gameState.monsterAttackTimer);
    
    const level = LEVELS[gameState.currentLevel];
    const attackInterval = Math.max(3000, 8000 - gameState.currentLevel * 1000); // 随关卡缩短间隔
    
    gameState.monsterAttackTimer = setInterval(() => {
        if (!gameState.isPlaying) return;
        
        monsterAttack();
    }, attackInterval);
}

function monsterAttack() {
    const damage = 10 + gameState.currentLevel * 5; // 随关卡增加伤害
    gameState.playerHealth = Math.max(0, gameState.playerHealth - damage);
    
    // 玩家受击动画
    const playerSprite = document.getElementById('player-sprite');
    playerSprite.style.animation = 'monsterHit 0.5s';
    setTimeout(() => {
        playerSprite.style.animation = 'playerIdle 2s infinite';
    }, 500);
    
    // 显示玩家受到的伤害
    showPlayerDamageNumber(damage);
    
    // 重置连击
    resetCombo();
    
    updateHealthBars();
    updateStats();
    
    // 检查玩家是否失败
    if (gameState.playerHealth <= 0) {
        gameOver();
    }
}

function resetCombo() {
    gameState.combo = 0;
    document.getElementById('combo-display').classList.remove('show');
    updateStats();
}

function updateComboDisplay() {
    if (gameState.combo >= 3) {
        const comboDisplay = document.getElementById('combo-display');
        document.getElementById('combo-count').textContent = gameState.combo;
        comboDisplay.classList.add('show');
    }
}

function showDamageNumber(damage) {
    const monster = document.querySelector('.monster');
    const damageEl = document.createElement('div');
    damageEl.className = 'damage-number';
    damageEl.textContent = `-${damage}`;
    damageEl.style.left = '70%';
    damageEl.style.top = '30%';
    
    monster.appendChild(damageEl);
    
    setTimeout(() => damageEl.remove(), 1000);
}

function showPlayerDamageNumber(damage) {
    const player = document.querySelector('.player');
    const damageEl = document.createElement('div');
    damageEl.className = 'damage-number';
    damageEl.textContent = `-${damage}`;
    damageEl.style.color = '#ff6b6b';
    damageEl.style.left = '20%';
    damageEl.style.top = '30%';
    
    player.appendChild(damageEl);
    
    setTimeout(() => damageEl.remove(), 1000);
}

function updateHealthBars() {
    const playerPercent = (gameState.playerHealth / ADVENTURE_CONFIG.basePlayerHealth) * 100;
    const monsterPercent = (gameState.monsterHealth / LEVELS[gameState.currentLevel].monsterHealth) * 100;
    
    document.getElementById('player-health-bar').style.width = `${playerPercent}%`;
    document.getElementById('monster-health-bar').style.width = `${monsterPercent}%`;
    
    document.getElementById('player-health-text').textContent = `${gameState.playerHealth}/${ADVENTURE_CONFIG.basePlayerHealth}`;
    document.getElementById('monster-health-text').textContent = `${gameState.monsterHealth}/${LEVELS[gameState.currentLevel].monsterHealth}`;
}

function updateStats() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('combo').textContent = gameState.combo;
    document.getElementById('current-level').textContent = gameState.currentLevel + 1;
    document.getElementById('rescued').textContent = `${gameState.rescued}/${LEVELS.length}`;
}

function gameOver() {
    gameState.isPlaying = false;
    clearInterval(gameState.monsterAttackTimer);
    
    playSound('gameover');
    
    // 显示游戏结束弹窗
    document.getElementById('game-over-title').textContent = '💀 游戏结束';
    document.getElementById('final-score-modal').textContent = gameState.score;
    document.getElementById('final-combo-modal').textContent = gameState.maxCombo;
    document.getElementById('final-rescued-modal').textContent = gameState.rescued;
    document.getElementById('final-level-modal').textContent = gameState.currentLevel + 1;
    
    const level = LEVELS[gameState.currentLevel];
    document.getElementById('game-over-animal').textContent = level.rescuedAnimal;
    
    document.getElementById('game-over-modal').style.display = 'flex';
}

function showVictory() {
    playSound('victory');
    
    document.getElementById('game-over-title').textContent = '🏆 恭喜通关！';
    document.getElementById('final-score-modal').textContent = gameState.score;
    document.getElementById('final-combo-modal').textContent = gameState.maxCombo;
    document.getElementById('final-rescued-modal').textContent = gameState.rescued;
    document.getElementById('final-level-modal').textContent = LEVELS.length;
    document.getElementById('game-over-animal').textContent = '🌟';
    
    document.getElementById('game-over-modal').style.display = 'flex';
}

function restartGame() {
    document.getElementById('game-over-modal').style.display = 'none';
    initGame();
}

function goBack() {
    // 返回主页
    window.location.href = 'index.html';
}

function showFeedback(message, type) {
    // 简单的反馈显示（可以通过输入框颜色变化等实现）
    const input = document.getElementById('typing-input-adventure');
    if (type === 'error') {
        input.style.borderColor = '#d63031';
        setTimeout(() => {
            input.style.borderColor = 'rgba(255,255,255,0.3)';
        }, 300);
    }
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
            case 'attack':
                oscillator.frequency.setValueAtTime(400, now);
                oscillator.frequency.setValueAtTime(600, now + 0.1);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                oscillator.start(now);
                oscillator.stop(now + 0.2);
                break;
            case 'hit':
                oscillator.frequency.setValueAtTime(200, now);
                oscillator.frequency.setValueAtTime(150, now + 0.1);
                gainNode.gain.setValueAtTime(0.3, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                oscillator.start(now);
                oscillator.stop(now + 0.3);
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
            case 'wrong':
                oscillator.frequency.setValueAtTime(150, now);
                oscillator.frequency.setValueAtTime(100, now + 0.1);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                oscillator.start(now);
                oscillator.stop(now + 0.2);
                break;
            case 'ready':
                oscillator.frequency.setValueAtTime(800, now);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
                break;
        }
    } catch (e) {
        console.log('音效播放失败:', e);
    }
}

console.log('🐉 打字冒险游戏已加载！准备好战斗了吗？');

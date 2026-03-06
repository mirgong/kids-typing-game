// 游戏数据
const gameData = {
    currentSection: 'home',
    score: 0,
    timeLeft: 60,
    accuracy: 100,
    totalWords: 0,
    lessonsCompleted: 0,
    currentLesson: null,
    timer: null,
    currentChallengeIndex: 0,
    
    // 课程数据
    lessons: {
        1: {
            title: '字母探险',
            challenges: [
                { type: 'letter', target: 'A', hint: '请按下 A 键' },
                { type: 'letter', target: 'S', hint: '请按下 S 键' },
                { type: 'letter', target: 'D', hint: '请按下 D 键' },
                { type: 'letter', target: 'F', hint: '请按下 F 键' },
                { type: 'letter', target: 'J', hint: '请按下 J 键' },
                { type: 'letter', target: 'K', hint: '请按下 K 键' },
                { type: 'letter', target: 'L', hint: '请按下 L 键' },
                { type: 'letter', target: ';', hint: '请按下 ; 键' }
            ]
        },
        2: {
            title: '单词森林',
            challenges: [
                { type: 'word', target: 'CAT', hint: '请输入单词: CAT' },
                { type: 'word', target: 'DOG', hint: '请输入单词: DOG' },
                { type: 'word', target: 'SUN', hint: '请输入单词: SUN' },
                { type: 'word', target: 'MOON', hint: '请输入单词: MOON' },
                { type: 'word', target: 'STAR', hint: '请输入单词: STAR' },
                { type: 'word', target: 'TREE', hint: '请输入单词: TREE' },
                { type: 'word', target: 'FISH', hint: '请输入单词: FISH' },
                { type: 'word', target: 'BIRD', hint: '请输入单词: BIRD' }
            ]
        },
        3: {
            title: '句子城堡',
            challenges: [
                { type: 'sentence', target: 'I LIKE CAT.', hint: '请输入句子: I LIKE CAT.' },
                { type: 'sentence', target: 'THE SUN IS HOT.', hint: '请输入句子: THE SUN IS HOT.' },
                { type: 'sentence', target: 'MY DOG RUNS FAST.', hint: '请输入句子: MY DOG RUNS FAST.' },
                { type: 'sentence', target: 'WE PLAY IN THE PARK.', hint: '请输入句子: WE PLAY IN THE PARK.' },
                { type: 'sentence', target: 'SHE HAS A RED BALL.', hint: '请输入句子: SHE HAS A RED BALL.' }
            ]
        }
    },
    
    // 游戏数据
    games: {
        'falling-letters': {
            title: '字母雨',
            description: '接住掉落的字母'
        },
        'word-race': {
            title: '单词赛车',
            description: '输入单词让赛车前进'
        },
        'typing-adventure': {
            title: '打字冒险',
            description: '打败怪物拯救小动物'
        }
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    updateStats();
    setupTypingInput();
});

// 导航功能
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // 更新活动状态
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // 显示对应区域
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
            
            gameData.currentSection = targetId;
        });
    });
}

// 开始学习
function startLearning() {
    showSection('lessons');
    document.querySelector('.nav-link[href="#lessons"]').click();
}

// 开始课程
function startLesson(level) {
    gameData.currentLesson = level;
    gameData.currentChallengeIndex = 0;
    gameData.score = 0;
    gameData.timeLeft = 60;
    gameData.accuracy = 100;
    
    const lesson = gameData.lessons[level];
    document.getElementById('practice-title').textContent = lesson.title;
    
    showSection('typing-practice');
    updateChallenge();
    startTimer();
    updateStats();
}

// 开始游戏
function startGame(gameId) {
    const game = gameData.games[gameId];
    alert(`开始游戏: ${game.title}\n${game.description}\n\n游戏功能正在开发中...`);
}

// 显示区域
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
        if (section.id === sectionId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

// 返回
function goBack() {
    showSection(gameData.currentSection);
}

// 更新挑战
function updateChallenge() {
    if (!gameData.currentLesson) return;
    
    const lesson = gameData.lessons[gameData.currentLesson];
    const challenge = lesson.challenges[gameData.currentChallengeIndex];
    
    if (!challenge) {
        completeLesson();
        return;
    }
    
    document.getElementById('target-text').innerHTML = challenge.hint.replace(
        challenge.target, 
        `<span class="highlight-key">${challenge.target}</span>`
    );
    
    document.getElementById('typing-input').value = '';
    document.getElementById('typing-input').focus();
    
    // 更新进度
    const progress = ((gameData.currentChallengeIndex + 1) / lesson.challenges.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('progress-percent').textContent = `${Math.round(progress)}%`;
    
    // 高亮对应的键盘键
    highlightKeyboardKey(challenge.target.charAt(0));
}

// 高亮键盘键
function highlightKeyboardKey(key) {
    document.querySelectorAll('.keyboard-display .key').forEach(k => {
        k.classList.remove('active');
        if (k.dataset.key === key.toUpperCase()) {
            k.classList.add('active');
        }
    });
}

// 设置打字输入
function setupTypingInput() {
    const typingInput = document.getElementById('typing-input');
    const feedback = document.getElementById('feedback');
    
    typingInput.addEventListener('input', function() {
        if (!gameData.currentLesson) return;
        
        const lesson = gameData.lessons[gameData.currentLesson];
        const challenge = lesson.challenges[gameData.currentChallengeIndex];
        const userInput = this.value.toUpperCase();
        
        if (userInput === challenge.target) {
            // 正确
            gameData.score += 10;
            gameData.totalWords++;
            
            feedback.innerHTML = '<i class="fas fa-thumbs-up"></i> 做得好！继续加油！';
            feedback.className = 'feedback show';
            feedback.style.background = '#d4edda';
            feedback.style.color = '#155724';
            
            // 播放正确音效（模拟）
            playSound('correct');
            
            // 延迟后进入下一个挑战
            setTimeout(() => {
                gameData.currentChallengeIndex++;
                updateChallenge();
                updateStats();
            }, 500);
        } else if (challenge.target.startsWith(userInput)) {
            // 输入中
            feedback.innerHTML = '<i class="fas fa-spinner"></i> 继续输入...';
            feedback.className = 'feedback show';
            feedback.style.background = '#fff3cd';
            feedback.style.color = '#856404';
        } else {
            // 错误
            feedback.innerHTML = '<i class="fas fa-exclamation-triangle"></i> 再试一次！';
            feedback.className = 'feedback show';
            feedback.style.background = '#f8d7da';
            feedback.style.color = '#721c24';
            
            // 播放错误音效（模拟）
            playSound('wrong');
        }
    });
    
    // 监听键盘事件
    document.addEventListener('keydown', function(e) {
        if (gameData.currentSection === 'typing-practice') {
            const key = e.key.toUpperCase();
            highlightKeyboardKey(key);
        }
    });
    
    document.addEventListener('keyup', function() {
        document.querySelectorAll('.keyboard-display .key').forEach(k => {
            k.classList.remove('active');
        });
    });
}

// 下一个挑战
function nextChallenge() {
    if (!gameData.currentLesson) return;
    
    const lesson = gameData.lessons[gameData.currentLesson];
    if (gameData.currentChallengeIndex < lesson.challenges.length - 1) {
        gameData.currentChallengeIndex++;
        updateChallenge();
    } else {
        completeLesson();
    }
}

// 开始计时器
function startTimer() {
    clearInterval(gameData.timer);
    
    gameData.timer = setInterval(() => {
        gameData.timeLeft--;
        updateStats();
        
        if (gameData.timeLeft <= 0) {
            clearInterval(gameData.timer);
            completeLesson();
        }
    }, 1000);
}

// 更新统计
function updateStats() {
    document.getElementById('score').textContent = `得分: ${gameData.score}`;
    document.getElementById('time').textContent = `时间: ${gameData.timeLeft}s`;
    document.getElementById('accuracy').textContent = `准确率: ${gameData.accuracy}%`;
    
    document.getElementById('total-words').textContent = gameData.totalWords;
    document.getElementById('avg-speed').textContent = Math.round(gameData.totalWords / 60);
    document.getElementById('best-score').textContent = gameData.score;
    document.getElementById('lessons-completed').textContent = gameData.lessonsCompleted;
}

// 完成课程
function completeLesson() {
    clearInterval(gameData.timer);
    
    // 计算准确率
    const lesson = gameData.lessons[gameData.currentLesson];
    const totalChallenges = lesson.challenges.length;
    const completedChallenges = gameData.currentChallengeIndex + 1;
    gameData.accuracy = Math.round((completedChallenges / totalChallenges) * 100);
    
    // 更新完成课程数
    if (completedChallenges === totalChallenges) {
        gameData.lessonsCompleted++;
    }
    
    // 显示完成弹窗
    document.getElementById('final-score').textContent = gameData.score;
    document.getElementById('final-accuracy').textContent = `${gameData.accuracy}%`;
    document.getElementById('final-time').textContent = `${60 - gameData.timeLeft}s`;
    document.getElementById('completion-message').textContent = 
        `恭喜完成${lesson.title}！你的表现很棒！`;
    
    document.getElementById('completion-modal').classList.add('show');
    
    // 播放完成音效（模拟）
    playSound('complete');
}

// 继续学习
function continueLearning() {
    closeModal();
    if (gameData.currentLesson < 3) {
        startLesson(gameData.currentLesson + 1);
    } else {
        showSection('progress');
        document.querySelector('.nav-link[href="#progress"]').click();
    }
}

// 关闭弹窗
function closeModal() {
    document.getElementById('completion-modal').classList.remove('show');
}

// 播放音效（模拟）
function playSound(type) {
    // 在实际应用中，这里会播放真实的音效文件
    console.log(`播放音效: ${type}`);
    
    // 创建简单的音效
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(type) {
            case 'correct':
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                break;
            case 'wrong':
                oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime); // F4
                break;
            case 'complete':
                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
                break;
        }
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('音效播放失败:', e);
    }
}

// 添加一些动画效果
function addAnimations() {
    // 为动物图标添加浮动动画
    const animals = document.querySelectorAll('.animal');
    animals.forEach((animal, index) => {
        animal.style.animationDelay = `${index * 0.2}s`;
    });
    
    // 为键盘键添加随机浮动
    const keys = document.querySelectorAll('.keyboard-illustration .key');
    keys.forEach((key, index) => {
        key.style.animationDelay = `${index * 0.1}s`;
    });
}

// 初始化动画
addAnimations();
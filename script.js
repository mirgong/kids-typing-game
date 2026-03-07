// 小键盘探险家 - 增强版游戏逻辑
// 版本：2.0 - 添加更多游戏功能和改进

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
    correctCount: 0,
    wrongCount: 0,
    achievements: [],
    
    // 课程数据 - 扩展版
    lessons: {
        1: {
            title: '字母探险',
            icon: '🔤',
            color: '#2ecc71',
            challenges: [
                { type: 'letter', target: 'A', hint: '请按下 A 键', animal: '🐵' },
                { type: 'letter', target: 'S', hint: '请按下 S 键', animal: '🐼' },
                { type: 'letter', target: 'D', hint: '请按下 D 键', animal: '🐰' },
                { type: 'letter', target: 'F', hint: '请按下 F 键', animal: '🐱' },
                { type: 'letter', target: 'G', hint: '请按下 G 键', animal: '🐶' },
                { type: 'letter', target: 'H', hint: '请按下 H 键', animal: '🦊' },
                { type: 'letter', target: 'J', hint: '请按下 J 键', animal: '🐸' },
                { type: 'letter', target: 'K', hint: '请按下 K 键', animal: '🐷' },
                { type: 'letter', target: 'L', hint: '请按下 L 键', animal: '🐵' },
                { type: 'letter', target: ';', hint: '请按下 ; 键', animal: '🐼' }
            ]
        },
        2: {
            title: '单词森林',
            icon: '🌲',
            color: '#f39c12',
            challenges: [
                { type: 'word', target: 'CAT', hint: '小猫', animal: '🐱' },
                { type: 'word', target: 'DOG', hint: '小狗', animal: '🐶' },
                { type: 'word', target: 'SUN', hint: '太阳', animal: '☀️' },
                { type: 'word', target: 'MOON', hint: '月亮', animal: '🌙' },
                { type: 'word', target: 'STAR', hint: '星星', animal: '⭐' },
                { type: 'word', target: 'TREE', hint: '树木', animal: '🌲' },
                { type: 'word', target: 'FISH', hint: '小鱼', animal: '🐟' },
                { type: 'word', target: 'BIRD', hint: '小鸟', animal: '🐦' },
                { type: 'word', target: 'BOOK', hint: '书本', animal: '📚' },
                { type: 'word', target: 'BALL', hint: '球', animal: '⚽' }
            ]
        },
        3: {
            title: '句子城堡',
            icon: '🏰',
            color: '#e74c3c',
            challenges: [
                { type: 'sentence', target: 'I LIKE CATS.', hint: '我喜欢猫咪', animal: '🐱' },
                { type: 'sentence', target: 'THE SUN IS HOT.', hint: '太阳很热', animal: '☀️' },
                { type: 'sentence', target: 'MY DOG RUNS FAST.', hint: '我的狗跑得很快', animal: '🐶' },
                { type: 'sentence', target: 'WE PLAY IN THE PARK.', hint: '我们在公园玩耍', animal: '🌳' },
                { type: 'sentence', target: 'SHE HAS A RED BALL.', hint: '她有一个红色的球', animal: '⚽' },
                { type: 'sentence', target: 'THE BIRD CAN FLY.', hint: '小鸟会飞', animal: '🐦' },
                { type: 'sentence', target: 'I LOVE TO READ BOOKS.', hint: '我喜欢读书', animal: '📚' }
            ]
        },
        4: {
            title: '数字乐园',
            icon: '🔢',
            color: '#9b59b6',
            challenges: [
                { type: 'number', target: '123', hint: '请输入数字：123', animal: '🔢' },
                { type: 'number', target: '456', hint: '请输入数字：456', animal: '🔢' },
                { type: 'number', target: '789', hint: '请输入数字：789', animal: '🔢' },
                { type: 'number', target: '2026', hint: '请输入年份：2026', animal: '📅' },
                { type: 'number', target: '100', hint: '请输入数字：100', animal: '💯' }
            ]
        },
        5: {
            title: '混合挑战',
            icon: '🎯',
            color: '#1abc9c',
            challenges: [
                { type: 'mixed', target: 'HELLO WORLD', hint: '你好世界', animal: '🌍' },
                { type: 'mixed', target: 'I AM 10 YEARS OLD', hint: '我 10 岁了', animal: '🎂' },
                { type: 'mixed', target: 'THERE ARE 7 DAYS', hint: '有 7 天', animal: '📅' },
                { type: 'mixed', target: 'MY SCORE IS 100', hint: '我的分数是 100', animal: '💯' }
            ]
        }
    },
    
    // 成就系统
    achievementsList: [
        { id: 'first_letter', name: '字母新手', icon: '🔤', desc: '完成第一个字母练习', unlocked: false },
        { id: 'first_word', name: '单词达人', icon: '📝', desc: '完成第一个单词练习', unlocked: false },
        { id: 'first_sentence', name: '句子大师', icon: '📖', desc: '完成第一个句子练习', unlocked: false },
        { id: 'perfect_score', name: '完美表现', icon: '💯', desc: '一次练习全对', unlocked: false },
        { id: 'speed_typist', name: '快手打字员', icon: '⚡', desc: '30 秒内完成练习', unlocked: false },
        { id: 'all_lessons', name: '全能学霸', icon: '🏆', desc: '完成所有课程', unlocked: false }
    ],
    
    // 游戏数据
    games: {
        'falling-letters': {
            title: '字母雨',
            icon: '🍎',
            description: '接住掉落的字母，输入正确的键',
            status: 'ready'
        },
        'word-race': {
            title: '单词赛车',
            icon: '🏎️',
            description: '输入单词让赛车前进',
            status: 'ready'
        },
        'typing-adventure': {
            title: '打字冒险',
            icon: '🐉',
            description: '打败怪物，拯救小动物',
            status: 'ready'
        },
        'keyboard-hero': {
            title: '键盘英雄',
            icon: '🎸',
            description: '跟随节奏敲击键盘',
            status: 'coming-soon'
        }
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    loadProgress();
    updateStats();
    setupTypingInput();
    renderLessons();
    renderAchievements();
    showWelcomeMessage();
});

// 显示欢迎消息
function showWelcomeMessage() {
    const lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toDateString();
    
    if (lastVisit !== today) {
        localStorage.setItem('lastVisit', today);
        showFeedback('欢迎回来！继续加油！', 'success');
    }
}

// 导航功能
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
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

// 渲染课程卡片
function renderLessons() {
    const container = document.querySelector('.lessons-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.values(gameData.lessons).forEach((lesson, index) => {
        const level = index + 1;
        const card = document.createElement('div');
        card.className = 'lesson-card';
        card.onclick = () => startLesson(level);
        
        const progress = getLessonProgress(level);
        
        card.innerHTML = `
            <div class="lesson-badge" style="background: ${lesson.color}">${lesson.icon} ${getLevelName(level)}</div>
            <h3>${lesson.title}</h3>
            <p>${lesson.challenges.length} 个挑战</p>
            <div class="lesson-stats">
                <span><i class="fas fa-key"></i> ${lesson.challenges.length}个练习</span>
                <span><i class="fas fa-clock"></i> ${lesson.challenges.length * 2}分钟</span>
            </div>
            <div class="lesson-progress">
                <div class="progress-bar" style="width: ${progress}%; background: ${lesson.color}"></div>
            </div>
            ${progress === 100 ? '<div class="completed-badge"><i class="fas fa-check-circle"></i> 已完成</div>' : ''}
        `;
        
        container.appendChild(card);
    });
}

// 获取等级名称
function getLevelName(level) {
    const names = ['初级', '中级', '高级', '专家', '大师'];
    return names[level - 1] || '未知';
}

// 获取课程进度
function getLessonProgress(level) {
    const key = `lesson_${level}_progress`;
    return parseInt(localStorage.getItem(key) || '0');
}

// 保存课程进度
function saveLessonProgress(level, progress) {
    const key = `lesson_${level}_progress`;
    localStorage.setItem(key, progress.toString());
}

// 开始课程
function startLesson(level) {
    gameData.currentLesson = level;
    gameData.currentChallengeIndex = 0;
    gameData.score = 0;
    gameData.timeLeft = 60;
    gameData.accuracy = 100;
    gameData.correctCount = 0;
    gameData.wrongCount = 0;
    
    const lesson = gameData.lessons[level];
    document.getElementById('practice-title').textContent = `${lesson.icon} ${lesson.title}`;
    
    showSection('typing-practice');
    updateChallenge();
    startTimer();
    updateStats();
    
    // 播放开始音效
    playSound('start');
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
    clearInterval(gameData.timer);
    showSection('lessons');
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
    
    const targetText = document.getElementById('target-text');
    targetText.innerHTML = `
        <div class="challenge-animal">${challenge.animal || '🌟'}</div>
        <div class="challenge-hint">${challenge.hint}</div>
        <div class="challenge-target">
            ${challenge.target.split('').map(char => 
                `<span class="char-box" data-char="${char}">${char}</span>`
            ).join('')}
        </div>
    `;
    
    document.getElementById('typing-input').value = '';
    document.getElementById('typing-input').focus();
    
    // 更新进度
    const progress = ((gameData.currentChallengeIndex) / lesson.challenges.length) * 100;
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
    
    if (!typingInput) return;
    
    typingInput.addEventListener('input', function() {
        if (!gameData.currentLesson) return;
        
        const lesson = gameData.lessons[gameData.currentLesson];
        const challenge = lesson.challenges[gameData.currentChallengeIndex];
        const userInput = this.value.toUpperCase();
        const target = challenge.target;
        
        // 更新字符框状态
        updateCharBoxes(userInput, target);
        
        if (userInput === target) {
            // 正确
            handleCorrectAnswer(challenge);
        } else if (target.startsWith(userInput)) {
            // 输入中
            showFeedback('继续输入...', 'info');
        } else {
            // 错误
            handleWrongAnswer();
        }
    });
    
    // 监听键盘事件
    document.addEventListener('keydown', function(e) {
        if (gameData.currentSection === 'typing-practice') {
            const key = e.key.toUpperCase();
            highlightKeyboardKey(key);
            
            // 添加按键动画
            addKeyPressEffect(key);
        }
    });
    
    document.addEventListener('keyup', function() {
        document.querySelectorAll('.keyboard-display .key').forEach(k => {
            k.classList.remove('active');
        });
    });
}

// 更新字符框状态
function updateCharBoxes(input, target) {
    const charBoxes = document.querySelectorAll('.char-box');
    charBoxes.forEach((box, index) => {
        if (index < input.length) {
            if (input[index] === target[index]) {
                box.classList.add('correct');
                box.classList.remove('wrong');
            } else {
                box.classList.add('wrong');
                box.classList.remove('correct');
            }
        } else {
            box.classList.remove('correct');
            box.classList.remove('wrong');
        }
    });
}

// 处理正确答案
function handleCorrectAnswer(challenge) {
    gameData.score += 10;
    gameData.correctCount++;
    gameData.totalWords++;
    
    showFeedback('太棒了！继续加油！', 'success');
    playSound('correct');
    
    // 解锁成就
    unlockAchievement('first_letter');
    if (challenge.type === 'word') unlockAchievement('first_word');
    if (challenge.type === 'sentence') unlockAchievement('first_sentence');
    
    // 延迟后进入下一个挑战
    setTimeout(() => {
        gameData.currentChallengeIndex++;
        updateChallenge();
        updateStats();
        saveProgress();
    }, 800);
}

// 处理错误答案
function handleWrongAnswer() {
    gameData.wrongCount++;
    showFeedback('再试一次！你可以的！', 'warning');
    playSound('wrong');
}

// 显示反馈
function showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    if (!feedback) return;
    
    const icons = {
        success: 'fas fa-thumbs-up',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle',
        error: 'fas fa-times-circle'
    };
    
    const colors = {
        success: { bg: '#d4edda', color: '#155724' },
        warning: { bg: '#fff3cd', color: '#856404' },
        info: { bg: '#d1ecf1', color: '#0c5460' },
        error: { bg: '#f8d7da', color: '#721c24' }
    };
    
    feedback.innerHTML = `<i class="${icons[type]}"></i> ${message}`;
    feedback.style.background = colors[type].bg;
    feedback.style.color = colors[type].color;
    feedback.className = 'feedback show';
    
    // 2 秒后隐藏
    setTimeout(() => {
        feedback.classList.remove('show');
    }, 2000);
}

// 开始计时器
function startTimer() {
    clearInterval(gameData.timer);
    
    gameData.timer = setInterval(() => {
        gameData.timeLeft--;
        updateStats();
        
        if (gameData.timeLeft <= 10) {
            // 最后 10 秒提醒
            playSound('tick');
        }
        
        if (gameData.timeLeft <= 0) {
            clearInterval(gameData.timer);
            completeLesson();
        }
    }, 1000);
}

// 更新统计
function updateStats() {
    const scoreEl = document.getElementById('score');
    const timeEl = document.getElementById('time');
    const accuracyEl = document.getElementById('accuracy');
    
    if (scoreEl) scoreEl.textContent = `得分：${gameData.score}`;
    if (timeEl) timeEl.textContent = `时间：${gameData.timeLeft}s`;
    
    // 计算准确率
    const total = gameData.correctCount + gameData.wrongCount;
    gameData.accuracy = total > 0 ? Math.round((gameData.correctCount / total) * 100) : 100;
    if (accuracyEl) accuracyEl.textContent = `准确率：${gameData.accuracy}%`;
    
    // 更新仪表盘统计
    updateDashboard();
}

// 更新仪表盘
function updateDashboard() {
    const totalWordsEl = document.getElementById('total-words');
    const avgSpeedEl = document.getElementById('avg-speed');
    const bestScoreEl = document.getElementById('best-score');
    const lessonsCompletedEl = document.getElementById('lessons-completed');
    
    if (totalWordsEl) totalWordsEl.textContent = gameData.totalWords;
    if (avgSpeedEl) avgSpeedEl.textContent = Math.round(gameData.totalWords / 60);
    if (bestScoreEl) bestScoreEl.textContent = Math.max(parseInt(bestScoreEl.textContent) || 0, gameData.score);
    if (lessonsCompletedEl) lessonsCompletedEl.textContent = gameData.lessonsCompleted;
}

// 完成课程
function completeLesson() {
    clearInterval(gameData.timer);
    
    const lesson = gameData.lessons[gameData.currentLesson];
    const totalChallenges = lesson.challenges.length;
    const completedChallenges = gameData.currentChallengeIndex;
    
    // 保存进度
    const progress = (completedChallenges / totalChallenges) * 100;
    saveLessonProgress(gameData.currentLesson, progress);
    
    // 检查是否完成所有课程
    if (completedChallenges === totalChallenges) {
        gameData.lessonsCompleted++;
        unlockAchievement('all_lessons');
    }
    
    // 检查完美表现
    if (gameData.wrongCount === 0 && gameData.correctCount > 0) {
        unlockAchievement('perfect_score');
    }
    
    // 检查速度
    const timeSpent = 60 - gameData.timeLeft;
    if (timeSpent <= 30 && gameData.correctCount > 0) {
        unlockAchievement('speed_typist');
    }
    
    // 显示完成弹窗
    document.getElementById('final-score').textContent = gameData.score;
    document.getElementById('final-accuracy').textContent = `${gameData.accuracy}%`;
    document.getElementById('final-time').textContent = `${timeSpent}s`;
    document.getElementById('completion-message').textContent = 
        `🎉 恭喜完成${lesson.icon} ${lesson.title}！你的表现很棒！`;
    
    document.getElementById('completion-modal').classList.add('show');
    
    playSound('complete');
    saveProgress();
}

// 继续学习
function continueLearning() {
    closeModal();
    if (gameData.currentLesson < Object.keys(gameData.lessons).length) {
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

// 播放音效
function playSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        const now = audioContext.currentTime;
        
        switch(type) {
            case 'correct':
                oscillator.frequency.setValueAtTime(523.25, now);
                oscillator.frequency.setValueAtTime(659.25, now + 0.1);
                oscillator.frequency.setValueAtTime(783.99, now + 0.2);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                oscillator.start(now);
                oscillator.stop(now + 0.3);
                break;
            case 'wrong':
                oscillator.frequency.setValueAtTime(349.23, now);
                oscillator.frequency.setValueAtTime(311.13, now + 0.1);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                oscillator.start(now);
                oscillator.stop(now + 0.2);
                break;
            case 'complete':
                [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    osc.connect(gain);
                    gain.connect(audioContext.destination);
                    osc.frequency.value = freq;
                    gain.gain.setValueAtTime(0.2, now + i * 0.15);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.3);
                    osc.start(now + i * 0.15);
                    osc.stop(now + i * 0.15 + 0.3);
                });
                break;
            case 'start':
                oscillator.frequency.setValueAtTime(440, now);
                oscillator.frequency.setValueAtTime(554.37, now + 0.1);
                gainNode.gain.setValueAtTime(0.15, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                oscillator.start(now);
                oscillator.stop(now + 0.2);
                break;
            case 'tick':
                oscillator.frequency.setValueAtTime(880, now);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                oscillator.start(now);
                oscillator.stop(now + 0.05);
                break;
        }
    } catch (e) {
        console.log('音效播放失败:', e);
    }
}

// 添加按键效果
function addKeyPressEffect(key) {
    const effect = document.createElement('div');
    effect.className = 'key-press-effect';
    effect.textContent = key;
    effect.style.position = 'fixed';
    effect.style.left = '50%';
    effect.style.top = '50%';
    effect.style.transform = 'translate(-50%, -50%)';
    effect.style.fontSize = '2rem';
    effect.style.color = '#4ecdc4';
    effect.style.pointerEvents = 'none';
    effect.style.animation = 'floatUp 0.5s ease-out forwards';
    effect.style.zIndex = '1000';
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 500);
}

// 保存进度
function saveProgress() {
    const progress = {
        score: gameData.score,
        totalWords: gameData.totalWords,
        lessonsCompleted: gameData.lessonsCompleted,
        achievements: gameData.achievements,
        lastPlayed: new Date().toISOString()
    };
    localStorage.setItem('typingGameProgress', JSON.stringify(progress));
}

// 加载进度
function loadProgress() {
    const saved = localStorage.getItem('typingGameProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        gameData.score = progress.score || 0;
        gameData.totalWords = progress.totalWords || 0;
        gameData.lessonsCompleted = progress.lessonsCompleted || 0;
        gameData.achievements = progress.achievements || [];
    }
}

// 渲染成就
function renderAchievements() {
    const container = document.querySelector('.achievements');
    if (!container) return;
    
    container.innerHTML = '';
    
    gameData.achievementsList.forEach(achievement => {
        const div = document.createElement('div');
        div.className = `achievement ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        div.innerHTML = `
            <i class="fas ${achievement.unlocked ? 'fa-check-circle' : 'fa-lock'}"></i>
            <div class="achievement-info">
                <strong>${achievement.name}</strong>
                <small>${achievement.desc}</small>
            </div>
        `;
        container.appendChild(div);
    });
}

// 解锁成就
function unlockAchievement(id) {
    const achievement = gameData.achievementsList.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        gameData.achievements.push(id);
        showFeedback(`🏆 解锁成就：${achievement.name}！`, 'success');
        playSound('complete');
        renderAchievements();
        saveProgress();
    }
}

// 开始游戏
function startGame(gameId) {
    const game = gameData.games[gameId];
    if (game.status === 'coming-soon') {
        alert(`${game.icon} ${game.title}\n${game.description}\n\n游戏开发中，敬请期待！`);
    } else {
        alert(`${game.icon} ${game.title}\n${game.description}\n\n游戏功能即将推出！`);
    }
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

// 添加 CSS 动画
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -150%) scale(1.5);
        }
    }
    
    .char-box {
        display: inline-block;
        width: 40px;
        height: 50px;
        margin: 5px;
        border: 2px solid #ddd;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
        transition: all 0.2s ease;
    }
    
    .char-box.correct {
        background: #d4edda;
        border-color: #28a745;
        color: #28a745;
        animation: pulse 0.3s ease;
    }
    
    .char-box.wrong {
        background: #f8d7da;
        border-color: #dc3545;
        color: #dc3545;
        animation: shake 0.3s ease;
    }
    
    .challenge-animal {
        font-size: 3rem;
        margin-bottom: 10px;
        animation: bounce 2s infinite;
    }
    
    .challenge-hint {
        font-size: 1.2rem;
        color: #666;
        margin-bottom: 15px;
    }
    
    .challenge-target {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .completed-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        background: #28a745;
        color: white;
        padding: 5px 10px;
        border-radius: 20px;
        font-size: 0.8rem;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

console.log('🎮 小键盘探险家 v2.0 已加载');
console.log('🚀 准备好开始打字冒险了吗？');
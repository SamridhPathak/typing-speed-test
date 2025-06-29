const easyQuotes = [
      "The quick brown fox jumps over the lazy dog.",
      "Typing is fun.",
      "Practice daily.",
      "Be consistent.",
      "Keep going."
    ];
    const mediumQuotes = [
      "Typing is a skill that improves with regular practice.",
      "Stay motivated and improve your accuracy.",
      "JavaScript coding is both fun and challenging.",
      "Take small breaks while learning.",
      "Focus on your goals."
    ];
    const hardQuotes = [
      "The beauty of programming lies in the art of turning logic into reality.",
      "Typing speed tests are a fun way to enhance your muscle memory.",
      "An algorithm must be seen to be believed.",
      "Debugging is twice as hard as writing the code in the first place.",
      "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday’s code."
    ];

    const quoteEl = document.getElementById('quote');
    const inputEl = document.getElementById('input');
    const timerEl = document.getElementById('timer');
    const wpmEl = document.getElementById('wpm');
    const accEl = document.getElementById('accuracy');
    const leaderboardList = document.getElementById('leaderboard-list');
    const levelSelect = document.getElementById('level');

    let startTime = null;
    let timerInterval;
    let currentQuote = '';
    let sound = new Audio('https://www.soundjay.com/buttons/button-16.mp3');

    function getQuoteByLevel() {
      const level = levelSelect.value;
      if (level === 'easy') return easyQuotes[Math.floor(Math.random() * easyQuotes.length)];
      if (level === 'medium') return mediumQuotes[Math.floor(Math.random() * mediumQuotes.length)];
      return hardQuotes[Math.floor(Math.random() * hardQuotes.length)];
    }

    function renderQuote(quote) {
      quoteEl.innerHTML = '';
      quote.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        quoteEl.appendChild(span);
      });
    }

    function startTimer() {
      startTime = new Date();
      timerInterval = setInterval(() => {
        const elapsed = Math.floor((new Date() - startTime) / 1000);
        timerEl.textContent = elapsed;
      }, 1000);
    }

    function stopTimer() {
      clearInterval(timerInterval);
    }

    function calculateWPM(correctChars, timeInSec) {
      return timeInSec > 0 ? Math.round((correctChars / 5) / (timeInSec / 60)) : 0;
    }

    function calculateAccuracy(correct, total) {
      return total > 0 ? Math.round((correct / total) * 100) : 100;
    }

    function updateLeaderboard(wpm) {
      let scores = JSON.parse(localStorage.getItem('leaderboard')) || [];
      scores.push(wpm);
      scores.sort((a, b) => b - a);
      scores = scores.slice(0, 5);
      localStorage.setItem('leaderboard', JSON.stringify(scores));
      leaderboardList.innerHTML = '';
      scores.forEach(score => {
        const li = document.createElement('li');
        li.textContent = `${score} WPM`;
        leaderboardList.appendChild(li);
      });
    }

    inputEl.addEventListener('input', () => {
      if (!startTime) startTimer();
      sound.currentTime = 0;
      sound.play();

      const input = inputEl.value;
      const quoteSpans = quoteEl.querySelectorAll('span');

      let correctChars = 0;
      input.split('').forEach((char, idx) => {
        if (!quoteSpans[idx]) return;
        if (char === quoteSpans[idx].textContent) {
          quoteSpans[idx].className = 'highlight-correct';
          correctChars++;
        } else {
          quoteSpans[idx].className = 'highlight-wrong';
        }
      });

      for (let i = input.length; i < quoteSpans.length; i++) {
        quoteSpans[i].className = '';
      }

      const elapsed = Math.floor((new Date() - startTime) / 1000);
      wpmEl.textContent = calculateWPM(correctChars, elapsed);
      accEl.textContent = calculateAccuracy(correctChars, input.length);

      if (input === currentQuote) {
        stopTimer();
        updateLeaderboard(parseInt(wpmEl.textContent));
      }
    });

    function resetTest() {
      inputEl.value = '';
      stopTimer();
      timerEl.textContent = '0';
      wpmEl.textContent = '0';
      accEl.textContent = '100';
      startTime = null;
      currentQuote = getQuoteByLevel();
      renderQuote(currentQuote);
      displayLeaderboard();
    }

    function displayLeaderboard() {
      const scores = JSON.parse(localStorage.getItem('leaderboard')) || [];
      leaderboardList.innerHTML = '';
      scores.forEach(score => {
        const li = document.createElement('li');
        li.textContent = `${score} WPM`;
        leaderboardList.appendChild(li);
      });
    }

    resetTest();
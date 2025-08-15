// Type Racer JS Activity

document.addEventListener("DOMContentLoaded", function () {
  // Always keep typing box focused using interval
  setInterval(function () {
    const active = document.activeElement;
    if (
      active !== typingTextarea &&
      !["input", "select", "button", "textarea"].includes(
        active.tagName.toLowerCase()
      ) &&
      !active.closest(".modal")
    ) {
      typingTextarea.focus();
    }
  }, 500);

  let firstKeyPressed = false;
  let isRunning = false;
  const difficultySelect = document.getElementById("difficulty");
  const promptInput = document.querySelector("input.form-control.mb-2");
  const typingTextarea = document.querySelector("textarea.form-control");
  const startBtn = document.querySelectorAll(".btn-outline-warning")[0];
  const stopBtn = document.querySelectorAll(".btn-outline-warning")[1];
  const retryBtn = document.querySelectorAll(".btn-outline-warning")[2];
  const resultTime = document.getElementById("result-time");
  const resultLevel = document.getElementById("result-level");
  const resultWpm = document.getElementById("result-wpm");

  // Large collection of sentences
  const prompts = {
    Easy: [
      "the cat sat on the mat",
      "dogs bark at night",
      "fish swim in water",
      "birds fly in the sky",
      "books are fun to read",
      "rain falls from clouds",
      "the sun is bright",
      "kids play in parks",
      "milk is good for you",
      "apples are red",
      "the dog chased the ball",
      "flowers grow in gardens",
      "the grass is green",
      "the bird sang a song",
      "the rabbit hopped away",
      "the child drew a picture",
      "the frog jumped in the pond",
      "the bee buzzed by",
      "the mouse found cheese",
      "the horse ran fast",
      "the turtle moved slowly",
      "the cow ate grass",
      "the sheep followed the flock",
      "the duck swam in the lake",
      "the pig rolled in mud",
      "the fox hid in the bush",
      "the squirrel climbed the tree",
      "the goat jumped the fence",
      "the hen laid an egg",
      "the rooster crowed at dawn",
      "the lamb slept peacefully",
    ],
    Medium: [
      "practice makes perfect",
      "typing is a useful skill",
      "speed helps accuracy",
      "learning new things is fun",
      "the quick brown fox jumps over the lazy dog",
      "reading improves your mind",
      "music can lift your mood",
      "exercise keeps you healthy",
      "travel broadens horizons",
      "cooking is an art",
      "the library is full of books",
      "the teacher explained the lesson",
      "students study every day",
      "the computer is on the desk",
      "the internet connects people",
      "the phone rang loudly",
      "the car stopped at the light",
      "the train arrived on time",
      "the airplane flew high",
      "the boat sailed across the lake",
      "the bus picked up passengers",
      "the bicycle is parked outside",
      "the runner finished the race",
      "the swimmer crossed the pool",
      "the climber reached the top",
      "the artist painted a mural",
      "the chef prepared a meal",
      "the gardener planted seeds",
      "the mechanic fixed the engine",
      "the doctor helped the patient",
      "the nurse cared for the sick",
    ],
    Hard: [
      "speed boosts skill",
      "javascript powers the web",
      "challenge yourself daily",
      "creativity leads to innovation",
      "persistence overcomes obstacles",
      "technology changes rapidly",
      "knowledge is power",
      "success requires effort",
      "mistakes teach lessons",
      "opportunities are everywhere",
      "the universe is vast and mysterious",
      "quantum physics explores tiny particles",
      "the mitochondria is the powerhouse of the cell",
      "evolution shapes all living things",
      "the brain processes complex information",
      "artificial intelligence is advancing quickly",
      "renewable energy powers the future",
      "climate change affects the planet",
      "the stock market fluctuates daily",
      "cryptocurrency is a digital asset",
      "the economy depends on supply and demand",
      "philosophy questions existence",
      "psychology studies human behavior",
      "sociology examines society",
      "the telescope reveals distant galaxies",
      "the microscope shows tiny organisms",
      "the algorithm solves the problem",
      "the engineer designs solutions",
      "the mathematician proves the theorem",
      "the linguist studies language",
    ],
  };

  function getRandomPrompt(level) {
    const arr = prompts[level] || prompts.Easy;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function setPromptAndPlaceholder(level) {
    firstKeyPressed = false;
    const sentence = getRandomPrompt(level);
    promptInput.value = sentence;
    typingTextarea.placeholder = sentence;
    resultLevel.textContent = level;
    typingTextarea.value = "";
    currentPrompt = sentence;
  }

  // Timer logic
  let timer = null;
  let seconds = 0;
  let currentPrompt = "";

  function updateTimerDisplay() {
    resultTime.textContent = seconds + "s";
  }

  function startTimer() {
    if (timer) return;
    timer = setInterval(function () {
      seconds++;
      updateTimerDisplay();
    }, 1000);
    isRunning = true;
  }

  function stopTimer() {
    clearInterval(timer);
    timer = null;
    isRunning = false;
  }

  function resetTimer() {
    stopTimer();
    seconds = 0;
    updateTimerDisplay();
  }

  // Difficulty change
  difficultySelect.addEventListener("change", function () {
    setPromptAndPlaceholder(difficultySelect.value);
    resetTimer();
    typingTextarea.value = "";
    currentPrompt = promptInput.value;
    var avgWpmDiv = document.getElementById("result-wpm-avg");
    if (avgWpmDiv) {
      avgWpmDiv.textContent = "Average WPM: " + getAverageWPM();
    }
    typingTextarea.focus();
    var instructionsModal = document.getElementById("instructionsModal");
    if (instructionsModal) {
      instructionsModal.addEventListener("hidden.bs.modal", function () {
        typingTextarea.focus();
      });
    }
  });

  // Start button
  startBtn.addEventListener("click", function () {
    resetTimer();
    startTimer();
    typingTextarea.value = "";
    typingTextarea.focus();
    currentPrompt = promptInput.value;
    firstKeyPressed = true;
  });

  // Stop button
  stopBtn.addEventListener("click", function () {
    stopTimer();
  });

  // Retry button
  retryBtn.addEventListener("click", function () {
    localStorage.removeItem("typeRacerWPMAll");
    window.location.reload();
  });

  // Initial setup
  setPromptAndPlaceholder(difficultySelect.value);
  resetTimer();
  currentPrompt = promptInput.value;

  // WPM calculation and localStorage
  function calculateWPM(sentence, timeSeconds) {
    if (!sentence || timeSeconds === 0) return 0;
    const words = sentence.trim().split(/\s+/).length;
    return Math.round((words / timeSeconds) * 60);
  }

  function saveWPM(wpm) {
    let wpmList = JSON.parse(localStorage.getItem("typeRacerWPMAll")) || [];
    wpmList.push(wpm);
    localStorage.setItem("typeRacerWPMAll", JSON.stringify(wpmList));
  }

  function getAverageWPM() {
    let wpmList = JSON.parse(localStorage.getItem("typeRacerWPMAll")) || [];
    if (wpmList.length === 0) return 0;
    const sum = wpmList.reduce((a, b) => a + b, 0);
    return Math.round(sum / wpmList.length);
  }

  // Detect completion
  typingTextarea.addEventListener("input", function () {
    if (typingTextarea.value.trim() === currentPrompt.trim() && isRunning) {
      stopTimer();
      const wpm = calculateWPM(currentPrompt, seconds);
      resultWpm.textContent = wpm;
      saveWPM(wpm);
      var avgWpmDiv = document.getElementById("result-wpm-avg");
      if (avgWpmDiv) {
        avgWpmDiv.textContent = "Average WPM: " + getAverageWPM();
      }
      setPromptAndPlaceholder(difficultySelect.value);
      resetTimer();
      typingTextarea.value = "";
      typingTextarea.focus();
      firstKeyPressed = false;
    }
  });

  typingTextarea.addEventListener("keydown", function (e) {
    if (!firstKeyPressed && !isRunning && e.key.length === 1) {
      firstKeyPressed = true;
      resetTimer();
      startTimer();
      typingTextarea.value = "";
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (!isRunning) {
        resetTimer();
        startTimer();
        typingTextarea.value = "";
        firstKeyPressed = true;
      } else {
        stopTimer();
      }
    }
  });
});

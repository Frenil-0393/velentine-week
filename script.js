const unlockBtn = document.getElementById("unlockBtn");
const unlockHelper = document.getElementById("unlockHelper");
const todayDisplay = document.getElementById("todayDisplay");

const proposeReveal = document.getElementById("proposeReveal");
const proposeMessage = document.getElementById("proposeMessage");
const promiseReveal = document.getElementById("promiseReveal");
const promiseList = document.getElementById("promiseList");
const memoryNext = document.getElementById("memoryNext");
const memorySlider = document.getElementById("memorySlider");
const musicToggle = document.getElementById("musicToggle");
const roseCards = Array.from(document.querySelectorAll(".rose-card"));
const proposeMusicToggle = document.getElementById("proposeMusicToggle");
const bgMusic = document.getElementById("bgMusic");
const revealBlocks = Array.from(document.querySelectorAll(".reveal-block"));
const answerInput = document.getElementById("answerInput");
const sendWhatsapp = document.getElementById("sendWhatsapp");
const whatsappStatus = document.getElementById("whatsappStatus");

const fireworksCanvas = document.getElementById("fireworks");
const ctx = fireworksCanvas ? fireworksCanvas.getContext("2d") : null;
let fireworksActive = false;
let musicPlaying = false;
let audioContext;
let musicInterval;

const dayMap = {
  7: "rose",
  8: "propose",
  9: "chocolate",
  10: "teddy",
  11: "promise",
  12: "hug",
  13: "valentine",
};

const pageFileMap = {
  rose: "rose-1.html",
  propose: "propose-1.html",
  chocolate: "chocolate-1.html",
  teddy: "teddy-1.html",
  promise: "promise-1.html",
  hug: "hug-1.html",
  valentine: "valentine-1.html",
};

const today = new Date();
const month = today.getMonth();
const day = today.getDate();

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const displayDate = `${monthNames[month]} ${day}, ${today.getFullYear()}`;
if (todayDisplay) {
  todayDisplay.textContent = displayDate;
}

function revealPromise() {
  const items = promiseList.querySelectorAll("li");
  const next = Array.from(items).find((item) => !item.classList.contains("visible"));
  if (next) {
    next.classList.add("visible");
  }
}

function nextMemory() {
  const memories = memorySlider.querySelectorAll(".memory");
  const currentIndex = Array.from(memories).findIndex((m) => m.classList.contains("active"));
  memories[currentIndex].classList.remove("active");
  const nextIndex = (currentIndex + 1) % memories.length;
  memories[nextIndex].classList.add("active");
}

function canUnlockToday() {
  return month === 1 && day >= 7 && day <= 13;
}

unlockBtn?.addEventListener("click", () => {
  if (canUnlockToday()) {
    const pageId = dayMap[day];
    window.location.href = pageFileMap[pageId];
  } else {
    unlockHelper.textContent = "This surprise unlocks from Feb 7 to Feb 13.";
  }
});

proposeReveal?.addEventListener("click", () => {
  proposeMessage.classList.toggle("show");
});

promiseReveal?.addEventListener("click", revealPromise);

memoryNext?.addEventListener("click", nextMemory);

musicToggle?.addEventListener("click", () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (musicPlaying) {
    clearInterval(musicInterval);
    musicPlaying = false;
    musicToggle.textContent = "Play Romantic Music";
    return;
  }
  const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66];
  let index = 0;
  musicInterval = setInterval(() => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = "sine";
    osc.frequency.value = notes[index % notes.length];
    gain.gain.value = 0.07;
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + 0.35);
    index += 1;
  }, 420);
  musicPlaying = true;
  musicToggle.textContent = "Pause Romantic Music";
});

roseCards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("active");
  });
});

function resizeCanvas() {
  if (!fireworksCanvas) return;
  fireworksCanvas.width = fireworksCanvas.offsetWidth;
  fireworksCanvas.height = fireworksCanvas.offsetHeight;
}

const fireworks = [];

function createFirework() {
  const x = Math.random() * fireworksCanvas.width;
  const y = Math.random() * (fireworksCanvas.height / 2);
  const colors = ["#ff6b9e", "#ffd1e8", "#ffb7c5", "#c77dff"];
  const particles = Array.from({ length: 24 }, () => ({
    x,
    y,
    angle: Math.random() * Math.PI * 2,
    speed: Math.random() * 3 + 1,
    life: 60,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
  fireworks.push(...particles);
}

function updateFireworks() {
  if (!ctx || !fireworksCanvas) return;
  ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
  for (let i = fireworks.length - 1; i >= 0; i--) {
    const p = fireworks[i];
    p.x += Math.cos(p.angle) * p.speed;
    p.y += Math.sin(p.angle) * p.speed;
    p.life -= 1;
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.max(p.life / 60, 0);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
    if (p.life <= 0) {
      fireworks.splice(i, 1);
    }
  }
  ctx.globalAlpha = 1;
  if (fireworksActive) {
    if (Math.random() < 0.05) {
      createFirework();
    }
    requestAnimationFrame(updateFireworks);
  }
}

function startFireworks() {
  if (!fireworksActive) {
    fireworksActive = true;
    updateFireworks();
  }
}

function stopFireworks() {
  fireworksActive = false;
  if (ctx && fireworksCanvas) {
    ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
  }
}

if (fireworksCanvas) {
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
}

if (document.body.dataset.page === "valentine") {
  startFireworks();
}

if (promiseList) {
  revealPromise();
}

if (document.body.dataset.page === "propose") {
  let musicStarted = false;
  const startMusicOnScroll = async () => {
    if (!bgMusic || musicStarted) return;
    try {
      await bgMusic.play();
      if (proposeMusicToggle) proposeMusicToggle.textContent = "Pause Music";
      musicStarted = true;
    } catch (error) {
      // Autoplay was prevented
    }
    window.removeEventListener("scroll", startMusicOnScroll);
  };
  window.addEventListener("scroll", startMusicOnScroll);

  if (revealBlocks.length) {
    const updateRevealStates = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const focusStart = scrollTop + windowHeight * 0.4;
      const focusEnd = scrollTop + windowHeight * 0.7;

      revealBlocks.forEach((block) => {
        const rect = block.getBoundingClientRect();
        const elementTop = scrollTop + rect.top;
        const elementMiddle = elementTop + rect.height / 2;

        // Check if element is in focus zone
        if (elementMiddle >= focusStart && elementMiddle <= focusEnd) {
          block.classList.add("is-focused");
          block.classList.remove("is-passed");
        }
        // Element is above focus zone (already read)
        else if (elementMiddle < focusStart) {
          block.classList.remove("is-focused");
          block.classList.add("is-passed");
        }
        // Element is below focus zone (not yet reached)
        else {
          block.classList.remove("is-focused");
          block.classList.remove("is-passed");
        }
      });
    };

    // Run on scroll, resize, and initial load
    window.addEventListener("scroll", updateRevealStates, { passive: true });
    window.addEventListener("resize", updateRevealStates, { passive: true });
    // Initial call with slight delay to ensure page is loaded
    setTimeout(updateRevealStates, 100);
  }

  proposeMusicToggle?.addEventListener("click", async () => {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      try {
        await bgMusic.play();
        proposeMusicToggle.textContent = "Pause Music";
        musicStarted = true;
        window.removeEventListener("scroll", startMusicOnScroll);
      } catch (error) {
        if (whatsappStatus) {
          whatsappStatus.textContent = "Tap again to allow music playback.";
        }
      }
    } else {
      bgMusic.pause();
      proposeMusicToggle.textContent = "Play Music";
    }
  });

  sendWhatsapp?.addEventListener("click", () => {
    const message = answerInput?.value.trim();
    const rawNumber = document.body.dataset.whatsapp || "";
    const number = rawNumber.replace(/\D/g, "");

    if (!number) {
      if (whatsappStatus) {
        whatsappStatus.textContent = "Add your WhatsApp number in script.js to send.";
      }
      return;
    }

    if (!message) {
      if (whatsappStatus) {
        whatsappStatus.textContent = "Please type your answer first.";
      }
      return;
    }

    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
  });
}

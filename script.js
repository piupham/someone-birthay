"use strict";

/* =========================================
   THEME
========================================= */

const themePalettes = {
  midnight: {
    colors: [
      "#ff0080",
      "#7928ca",
      "#ff1493",
      "#ff69b4",
      "#da70d6",
      "#c71585"
    ]
  },

  golden: {
    colors: [
      "#ff9900",
      "#ffaa00",
      "#ff0055",
      "#ff6600",
      "#ffcc00",
      "#ff7733"
    ]
  },

  cyber: {
    colors: [
      "#00f2fe",
      "#4facfe",
      "#7928ca",
      "#00d2ff",
      "#a18cd1",
      "#38f9d7"
    ]
  },

  emerald: {
    colors: [
      "#00b09b",
      "#96c93d",
      "#00e6a8",
      "#2ecc71",
      "#1abc9c",
      "#55efc4"
    ]
  },

  velvet: {
    colors: [
      "#ff0844",
      "#ffb199",
      "#d63031",
      "#e84118",
      "#c0392b",
      "#e84393"
    ]
  }
};

let savedTheme = null;

try {
  savedTheme = localStorage.getItem("heartfill_theme");
} catch (error) {
  savedTheme = null;
}

let currentTheme =
  savedTheme && themePalettes[savedTheme]
    ? savedTheme
    : "midnight";

let heartColors = [...themePalettes[currentTheme].colors];

/* =========================================
   HELPERS
========================================= */

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function choose(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/* =========================================
   APPLY THEME
========================================= */

function applyTheme(themeKey) {

  if (!themePalettes[themeKey]) {
    return;
  }

  currentTheme = themeKey;

  heartColors = [
    ...themePalettes[themeKey].colors
  ];

  document.body.setAttribute(
    "data-theme",
    themeKey
  );

  try {
    localStorage.setItem(
      "heartfill_theme",
      themeKey
    );
  } catch (error) {
    // Ignore localStorage errors
  }

  document
    .querySelectorAll(".theme-btn")
    .forEach((button) => {

      button.classList.toggle(
        "active",
        button.dataset.theme === themeKey
      );
    });

  updateStars();
}

/* =========================================
   THEME BUTTONS
========================================= */

document
  .querySelectorAll(".theme-btn")
  .forEach((button) => {

    button.addEventListener("click", () => {

      applyTheme(button.dataset.theme);

    });

  });

applyTheme(currentTheme);

/* =========================================
   FLOATING STARS
========================================= */

const starsContainer =
  document.getElementById("stars");

const STAR_COUNT = 95;

const stars = [];

function createStars() {

  if (!starsContainer) {
    return;
  }

  starsContainer.innerHTML = "";

  stars.length = 0;

  for (let i = 0; i < STAR_COUNT; i++) {

    const star =
      document.createElement("div");

    star.className = "star";

    if (Math.random() < 0.13) {
      star.classList.add("big");
    }

    if (Math.random() < 0.08) {
      star.classList.add("cross");
    }

    const size = random(1.2, 3.4);

    const opacity = random(0.35, 0.9);

    const left = random(1, 99);

    const top = random(1, 99);

    const moveX = random(-30, 30);

    const moveY = random(-40, 40);

    const floatTime = random(5, 11);

    const twinkleTime = random(1.4, 3.5);

    const delay = random(-8, 0);

    star.style.left = `${left}%`;

    star.style.top = `${top}%`;

    star.style.setProperty(
      "--size",
      `${size}px`
    );

    star.style.setProperty(
      "--opacity",
      opacity
    );

    star.style.setProperty(
      "--move-x",
      `${moveX}px`
    );

    star.style.setProperty(
      "--move-y",
      `${moveY}px`
    );

    star.style.setProperty(
      "--float-time",
      `${floatTime}s`
    );

    star.style.setProperty(
      "--twinkle-time",
      `${twinkleTime}s`
    );

    star.style.setProperty(
      "--delay",
      `${delay}s`
    );

    starsContainer.appendChild(star);

    stars.push(star);
  }
}

function updateStars() {

  stars.forEach((star) => {

    star.style.boxShadow =
      `
      0 0 4px white,
      0 0 10px var(--accent)
      `;

  });
}

createStars();
updateStars();

/* =========================================
   HEART CANVAS
========================================= */

const canvas =
  document.getElementById("heartCanvas");

const ctx =
  canvas.getContext("2d");

let width = 0;
let height = 0;

let particles = [];

const PARTICLE_COUNT = 700;

/* Heart mathematical function */

function heartPoint(t, scale) {

  const x =
    16 * Math.pow(Math.sin(t), 3);

  const y =
    -(
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
    );

  return {
    x: x * scale,
    y: y * scale
  };
}

/* Check whether point is inside heart */

function insideHeart(x, y, scale) {

  const normalizedX =
    x / scale;

  const normalizedY =
    -y / scale;

  const equation =
    Math.pow(
      normalizedX * normalizedX +
      normalizedY * normalizedY -
      1,
      3
    ) -
    normalizedX * normalizedX *
      Math.pow(normalizedY, 3);

  return equation <= 0;
}

/* Resize canvas */

function resizeCanvas() {

  const rect =
    canvas.parentElement.getBoundingClientRect();

  width = Math.max(300, rect.width);

  height = Math.max(300, rect.height);

  const ratio =
    Math.min(window.devicePixelRatio || 1, 2);

  canvas.width =
    width * ratio;

  canvas.height =
    height * ratio;

  canvas.style.width =
    `${width}px`;

  canvas.style.height =
    `${height}px`;

  ctx.setTransform(
    ratio,
    0,
    0,
    ratio,
    0,
    0
  );

  createParticles();
}

/* Create heart particles */

function createParticles() {

  particles = [];

  const scale =
    Math.min(width, height) / 39;

  for (
    let i = 0;
    i < PARTICLE_COUNT;
    i++
  ) {

    let x;
    let y;

    do {

      x = random(-18, 18);

      y = random(-16, 17);

    } while (!insideHeart(x, y, 1));

    particles.push({
      x: x * scale,
      y: y * scale,
      baseX: x * scale,
      baseY: y * scale,

      speed: random(0.25, 0.8),

      drift: random(-0.25, 0.25),

      size: random(0.7, 2.2),

      color: choose(heartColors),

      alpha: random(0.45, 1),

      phase: random(0, Math.PI * 2)
    });
  }
}

/* Draw heart particles */

function drawHeart(time) {

  ctx.clearRect(
    0,
    0,
    width,
    height
  );

  const centerX =
    width / 2;

  const centerY =
    height / 2 + 15;

  const scale =
    Math.min(width, height) / 39;

  /* Glow */

  ctx.save();

  ctx.shadowBlur = 30;

  ctx.shadowColor = getComputedStyle(
    document.body
  ).getPropertyValue("--accent");

  for (const particle of particles) {

    const wave =
      Math.sin(
        time * 0.0015 +
        particle.phase
      ) * 2;

    let x =
      particle.baseX +
      Math.sin(
        time * 0.001 +
        particle.phase
      ) *
      2;

    let y =
      particle.baseY +
      wave;

    /*
      Slowly move particles upward.
      When they leave the heart,
      they return to the bottom.
    */

    particle.baseY -=
      particle.speed;

    if (
      particle.baseY <
      -17 * scale
    ) {

      particle.baseY =
        random(10, 17) * scale;

    }

    x +=
      Math.sin(
        time * 0.0012 +
        particle.phase
      ) *
      particle.drift *
      10;

    y =
      particle.baseY +
      wave;

    const color =
      particle.color;

    ctx.globalAlpha =
      particle.alpha;

    ctx.fillStyle = color;

    ctx.beginPath();

    ctx.arc(
      centerX + x,
      centerY + y,
      particle.size,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  ctx.restore();

  /* Soft outer heart glow */

  ctx.save();

  ctx.globalAlpha = 0.18;

  ctx.strokeStyle =
    getComputedStyle(
      document.body
    ).getPropertyValue("--accent");

  ctx.shadowBlur = 35;

  ctx.shadowColor =
    getComputedStyle(
      document.body
    ).getPropertyValue("--accent");

  ctx.lineWidth = 2;

  ctx.beginPath();

  const steps = 180;

  for (let i = 0; i <= steps; i++) {

    const t =
      (Math.PI * 2 * i) /
      steps;

    const point =
      heartPoint(t, scale);

    const x =
      centerX + point.x;

    const y =
      centerY + point.y;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();

  ctx.stroke();

  ctx.restore();
}

/* Animation */

function animate(time) {

  drawHeart(time);

  requestAnimationFrame(animate);
}

/* =========================================
   MUSIC
========================================= */

const music =
  document.getElementById(
    "birthdayMusic"
  );

const musicBtn =
  document.getElementById(
    "musicBtn"
  );

const musicIcon =
  document.getElementById(
    "musicIcon"
  );

const musicText =
  document.getElementById(
    "musicText"
  );

let musicPlaying = false;

if (music) {
  music.volume = 0.35;
}

function updateMusicButton() {

  if (musicPlaying) {

    musicBtn.classList.add("playing");

    musicIcon.textContent = "🔊";

    musicText.textContent = "Playing";

  } else {

    musicBtn.classList.remove("playing");

    musicIcon.textContent = "🎵";

    musicText.textContent = "Music";
  }
}

async function playMusic() {

  if (!music) {
    return;
  }

  try {

    await music.play();

    musicPlaying = true;

    updateMusicButton();

  } catch (error) {

    console.log(
      "Music playback was blocked by the browser."
    );

  }
}

function pauseMusic() {

  if (!music) {
    return;
  }

  music.pause();

  musicPlaying = false;

  updateMusicButton();
}

if (musicBtn) {

  musicBtn.addEventListener(
    "click",
    () => {

      if (musicPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }

    }
  );
}

/*
  First click anywhere on the page
  attempts to start the music.
*/

let firstInteraction = false;

document.addEventListener(
  "click",
  () => {

    if (firstInteraction) {
      return;
    }

    firstInteraction = true;

    if (!musicPlaying) {
      playMusic();
    }

  },
  { once: true }
);

/* =========================================
   START
========================================= */

window.addEventListener(
  "resize",
  resizeCanvas
);

resizeCanvas();

requestAnimationFrame(animate);

updateMusicButton();

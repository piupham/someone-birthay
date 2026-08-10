"use strict";

/* =========================================================
   HAPPY BIRTHDAY KIK
   Animated Particle Heart
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("heartCanvas");
  const ctx = canvas.getContext("2d");

  const starsContainer = document.getElementById("stars");
  const themeButtons = document.querySelectorAll(".theme-btn");

  /* =======================================================
     THEME PALETTES
  ======================================================= */

  const themes = {
    midnight: {
      colors: [
        "#ff0080",
        "#ff1493",
        "#ff69b4",
        "#da70d6",
        "#c71585",
        "#7928ca"
      ]
    },

    golden: {
      colors: [
        "#ff9900",
        "#ffaa00",
        "#ffcc00",
        "#ff7733",
        "#ff0055",
        "#e67e22"
      ]
    },

    cyber: {
      colors: [
        "#00f2fe",
        "#4facfe",
        "#00d2ff",
        "#38f9d7",
        "#00c6ff",
        "#a18cd1"
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

  let currentTheme = localStorage.getItem("birthday_theme");

  if (!themes[currentTheme]) {
    currentTheme = "midnight";
  }

  let colors = themes[currentTheme].colors;

  /* =======================================================
     CANVAS
  ======================================================= */

  let width = 0;
  let height = 0;
  let dpr = 1;

  function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = rect.width;
    height = rect.height;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);

  /* =======================================================
     HEART PARTICLES
  ======================================================= */

  const particles = [];

  const PARTICLE_COUNT = 1300;

  /*
    Parametric heart equation

    x = 16 sin³(t)

    y =
      13 cos(t)
      - 5 cos(2t)
      - 2 cos(3t)
      - cos(4t)
  */

  function heartPoint(t, scale) {

    const x =
      16 *
      Math.pow(Math.sin(t), 3);

    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    return {
      x: x * scale,
      y: -y * scale
    };
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randomColor() {
    return colors[
      Math.floor(Math.random() * colors.length)
    ];
  }

  /*
    Create particles inside the heart
  */

  for (let i = 0; i < PARTICLE_COUNT; i++) {

    const t =
      Math.random() * Math.PI * 2;

    const fill =
      Math.sqrt(Math.random());

    const base = heartPoint(t, 1);

    const particle = {

      t: t,

      fill: fill,

      baseX: base.x,
      baseY: base.y,

      x: 0,
      y: 0,

      size: random(0.7, 2.2),

      alpha: random(0.25, 0.95),

      speed: random(0.00015, 0.00065),

      phase: random(0, Math.PI * 2),

      drift: random(0.5, 2.5),

      color: randomColor()
    };

    particles.push(particle);
  }

  /* =======================================================
     EXTRA OUTLINE PARTICLES
  ======================================================= */

  const outlineParticles = [];

  const OUTLINE_COUNT = 500;

  for (let i = 0; i < OUTLINE_COUNT; i++) {

    const t =
      (i / OUTLINE_COUNT) *
      Math.PI *
      2;

    const point = heartPoint(t, 1);

    outlineParticles.push({

      t: t,

      x: point.x,
      y: point.y,

      size: random(1, 2.5),

      alpha: random(0.45, 1),

      phase: random(0, Math.PI * 2),

      speed: random(0.0002, 0.0007),

      color: randomColor()
    });
  }

  /* =======================================================
     FLOATING PARTICLES
  ======================================================= */

  const floatingParticles = [];

  for (let i = 0; i < 100; i++) {

    floatingParticles.push({

      x: random(0, 1),

      y: random(0, 1),

      size: random(0.5, 2),

      speed: random(0.00005, 0.0002),

      phase: random(0, Math.PI * 2),

      color: randomColor(),

      alpha: random(0.15, 0.7)
    });
  }

  /* =======================================================
     DRAW GLOW
  ======================================================= */

  function drawGlow(cx, cy, scale, pulse) {

    const glowSize =
      scale * 18 * pulse;

    const gradient =
      ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        glowSize
      );

    gradient.addColorStop(
      0,
      hexToRgba(colors[0], 0.20)
    );

    gradient.addColorStop(
      0.35,
      hexToRgba(colors[0], 0.10)
    );

    gradient.addColorStop(
      1,
      "rgba(0,0,0,0)"
    );

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.arc(
      cx,
      cy,
      glowSize,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  /* =======================================================
     HEX → RGBA
  ======================================================= */

  function hexToRgba(hex, alpha) {

    const value = hex.replace("#", "");

    const r =
      parseInt(value.substring(0, 2), 16);

    const g =
      parseInt(value.substring(2, 4), 16);

    const b =
      parseInt(value.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /* =======================================================
     DRAW HEART
  ======================================================= */

  let time = 0;

  function drawHeart() {

    ctx.clearRect(
      0,
      0,
      width,
      height
    );

    time += 1;

    /*
      Heart center
    */

    const cx = width / 2;

    /*
      Move heart slightly downward
      so it does not cover the message
    */

    const cy = height * 0.56;

    /*
      Responsive scale
    */

    const scale =
      Math.min(width, height) * 0.0175;

    /*
      Heart beat
    */

    const pulse =
      1 +
      Math.sin(time * 0.055) * 0.025;

    const actualScale =
      scale * pulse;

    /* ---------------------------------------------
       Large glow
    --------------------------------------------- */

    drawGlow(
      cx,
      cy,
      actualScale,
      pulse
    );

    /* ---------------------------------------------
       Floating particles
    --------------------------------------------- */

    floatingParticles.forEach((p) => {

      p.phase += p.speed * 10;

      const x =
        p.x * width +
        Math.sin(p.phase) * 20;

      const y =
        p.y * height +
        Math.cos(p.phase * 0.8) * 20;

      ctx.beginPath();

      ctx.globalAlpha = p.alpha;

      ctx.fillStyle = p.color;

      ctx.shadowBlur = 8;

      ctx.shadowColor = p.color;

      ctx.arc(
        x,
        y,
        p.size,
        0,
        Math.PI * 2
      );

      ctx.fill();
    });

    /* ---------------------------------------------
       Heart interior particles
    --------------------------------------------- */

    particles.forEach((p) => {

      p.t += p.speed;

      const point =
        heartPoint(
          p.t,
          actualScale
        );

      /*
        Fill interpolation.

        Smaller fill = closer to center.
        Larger fill = closer to outline.
      */

      let x =
        point.x * p.fill;

      let y =
        point.y * p.fill;

      /*
        Add gentle organic movement
      */

      const wave =
        Math.sin(
          time * 0.025 +
          p.phase
        );

      x +=
        wave *
        p.drift *
        (1 - p.fill);

      y +=
        Math.cos(
          time * 0.022 +
          p.phase
        ) *
        p.drift *
        (1 - p.fill);

      const px = cx + x;
      const py = cy + y;

      const flicker =
        0.65 +
        Math.sin(
          time * 0.05 +
          p.phase
        ) *
        0.35;

      ctx.globalAlpha =
        Math.max(
          0.08,
          p.alpha * flicker
        );

      ctx.fillStyle = p.color;

      ctx.shadowBlur =
        p.size > 1.5 ? 10 : 5;

      ctx.shadowColor =
        p.color;

      ctx.beginPath();

      ctx.arc(
        px,
        py,
        p.size,
        0,
        Math.PI * 2
      );

      ctx.fill();
    });

    /* ---------------------------------------------
       Bright heart outline
    --------------------------------------------- */

    outlineParticles.forEach((p) => {

      p.t += p.speed;

      const point =
        heartPoint(
          p.t,
          actualScale * 1.02
        );

      const wave =
        Math.sin(
          time * 0.045 +
          p.phase
        );

      const px =
        cx +
        point.x +
        wave * 1.3;

      const py =
        cy +
        point.y +
        Math.cos(
          time * 0.04 +
          p.phase
        ) *
        1.3;

      const flicker =
        0.7 +
        Math.sin(
          time * 0.06 +
          p.phase
        ) *
        0.3;

      ctx.globalAlpha =
        p.alpha * flicker;

      ctx.fillStyle =
        p.color;

      ctx.shadowBlur = 12;

      ctx.shadowColor =
        p.color;

      ctx.beginPath();

      ctx.arc(
        px,
        py,
        p.size,
        0,
        Math.PI * 2
      );

      ctx.fill();
    });

    /* ---------------------------------------------
       Small glowing particles around heart
    --------------------------------------------- */

    for (let i = 0; i < 18; i++) {

      const angle =
        time * 0.002 +
        i * (Math.PI * 2 / 18);

      const radius =
        Math.min(width, height) *
        0.28;

      const x =
        cx +
        Math.cos(angle) * radius;

      const y =
        cy +
        Math.sin(angle) *
        radius *
        0.78;

      const size =
        1.2 +
        Math.sin(
          time * 0.04 + i
        ) *
        0.7;

      ctx.globalAlpha = 0.55;

      ctx.fillStyle =
        colors[i % colors.length];

      ctx.shadowBlur = 12;

      ctx.shadowColor =
        ctx.fillStyle;

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        size,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }

    ctx.globalAlpha = 1;

    ctx.shadowBlur = 0;

    requestAnimationFrame(drawHeart);
  }

  /* =======================================================
     STARS
  ======================================================= */

  function createStars() {

    starsContainer.innerHTML = "";

    const count =
      Math.min(
        180,
        Math.floor(
          window.innerWidth *
          window.innerHeight /
          7000
        )
      );

    for (let i = 0; i < count; i++) {

      const star =
        document.createElement("div");

      star.className = "star";

      star.style.left =
        `${Math.random() * 100}%`;

      star.style.top =
        `${Math.random() * 100}%`;

      star.style.width =
        `${Math.random() * 2 + 1}px`;

      star.style.height =
        star.style.width;

      star.style.setProperty(
        "--duration",
        `${1.5 + Math.random() * 4}s`
      );

      star.style.setProperty(
        "--float-duration",
        `${8 + Math.random() * 15}s`
      );

      star.style.setProperty(
        "--delay",
        `${Math.random() * 5}s`
      );

      star.style.setProperty(
        "--move-x",
        `${Math.random() * 30 - 15}px`
      );

      star.style.setProperty(
        "--move-y",
        `${Math.random() * 30 - 15}px`
      );

      starsContainer.appendChild(star);
    }
  }

  createStars();

  window.addEventListener(
    "resize",
    createStars
  );

  /* =======================================================
     THEME
  ======================================================= */

  function applyTheme(themeName) {

    if (!themes[themeName]) {
      return;
    }

    currentTheme =
      themeName;

    colors =
      themes[themeName].colors;

    localStorage.setItem(
      "birthday_theme",
      themeName
    );

    document.body.setAttribute(
      "data-theme",
      themeName
    );

    /*
      Update particles with new colors
    */

    particles.forEach((p) => {
      p.color = randomColor();
    });

    outlineParticles.forEach((p) => {
      p.color = randomColor();
    });

    floatingParticles.forEach((p) => {
      p.color = randomColor();
    });

    /*
      Update active button
    */

    themeButtons.forEach((button) => {

      button.classList.toggle(
        "active",
        button.dataset.theme === themeName
      );

    });
  }

  themeButtons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        applyTheme(
          button.dataset.theme
        );

      }
    );

  });

  /* =======================================================
     START
  ======================================================= */

  applyTheme(currentTheme);

  drawHeart();

});

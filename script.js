"use strict";

(() => {

  const music = document.getElementById("birthdayMusic");
  const musicButton = document.getElementById("musicButton");

  /* =========================
     MUSIC
  ========================= */

  let musicStarted = false;

  function updateMusicButton() {
    if (!music) return;

    musicButton.textContent = music.paused ? "🎵" : "🔊";
  }

  async function startMusic() {
    if (!music) return;

    try {
      await music.play();
      musicStarted = true;
      updateMusicButton();
    } catch (error) {
      updateMusicButton();
    }
  }

  if (musicButton) {
    musicButton.addEventListener("click", async () => {

      if (music.paused) {
        await startMusic();
      } else {
        music.pause();
        updateMusicButton();
      }

    });
  }

  /*
    Trình duyệt thường chặn autoplay có tiếng.
    Thử phát ngay khi trang load.
  */

  window.addEventListener("load", () => {
    setTimeout(startMusic, 500);
  });

  /*
    Nếu autoplay bị chặn,
    lần tương tác đầu tiên của người dùng sẽ bật nhạc.
  */

  const unlockMusic = () => {
    if (!musicStarted) {
      startMusic();
    }

    document.removeEventListener("click", unlockMusic);
    document.removeEventListener("touchstart", unlockMusic);
    document.removeEventListener("keydown", unlockMusic);
  };

  document.addEventListener("click", unlockMusic, {
    once: true
  });

  document.addEventListener("touchstart", unlockMusic, {
    once: true
  });

  document.addEventListener("keydown", unlockMusic, {
    once: true
  });


  /* =========================
     THEME SYSTEM
  ========================= */

  const themePalettes = {

    midnight: {
      fill: "#ff2a85",
      glow: "rgba(255,0,128,.6)"
    },

    golden: {
      fill: "#ffaa00",
      glow: "rgba(255,153,0,.6)"
    },

    cyber: {
      fill: "#00f2fe",
      glow: "rgba(0,242,254,.6)"
    },

    emerald: {
      fill: "#00e6a8",
      glow: "rgba(0,176,155,.6)"
    },

    velvet: {
      fill: "#ff2855",
      glow: "rgba(255,8,68,.6)"
    }

  };

  const savedTheme =
    localStorage.getItem("birthday_theme");

  let currentTheme =
    themePalettes[savedTheme]
      ? savedTheme
      : "midnight";


  function applyTheme(theme) {

    if (!themePalettes[theme]) return;

    currentTheme = theme;

    document.body.dataset.theme = theme;

    localStorage.setItem(
      "birthday_theme",
      theme
    );

    document
      .querySelectorAll(".theme-btn")
      .forEach(button => {

        button.classList.toggle(
          "active",
          button.dataset.theme === theme
        );

      });
  }


  document
    .querySelectorAll(".theme-btn")
    .forEach(button => {

      button.addEventListener("click", () => {

        applyTheme(
          button.dataset.theme
        );

      });

    });


  applyTheme(currentTheme);


  /* =========================
     MATTER.JS CENTRAL HEART
  ========================= */

  if (!window.Matter) {
    console.error("Matter.js failed to load.");
    return;
  }

  const {
    Engine,
    Render,
    Runner,
    Common,
    Bodies,
    Body,
    Composite,
    Mouse,
    MouseConstraint
  } = Matter;


  const width = 512;
  const height = 512;

  const engine = Engine.create();

  const world = engine.world;

  engine.gravity.scale = 0;
  engine.gravity.x = 0;
  engine.gravity.y = 0;


  const render = Render.create({

    element: document.body,

    engine: engine,

    options: {
      width: width,
      height: height,
      wireframes: false,
      background: "transparent",
      pixelRatio: 1
    }

  });


  /*
    Central heart.
    Dùng polygon nhiều điểm để giữ hình trái tim
    mềm hơn và đẹp hơn.
  */

  const heartPath = [
    { x: 0, y: -150 },

    { x: -45, y: -185 },
    { x: -100, y: -180 },
    { x: -150, y: -140 },

    { x: -175, y: -80 },
    { x: -170, y: -20 },

    { x: -145, y: 40 },
    { x: -105, y: 90 },

    { x: -55, y: 140 },
    { x: 0, y: 185 },

    { x: 55, y: 140 },
    { x: 105, y: 90 },

    { x: 145, y: 40 },
    { x: 170, y: -20 },

    { x: 175, y: -80 },
    { x: 150, y: -140 },

    { x: 100, y: -180 },
    { x: 45, y: -185 }
  ];


  const initialColor =
    themePalettes[currentTheme].fill;


  const heart = Bodies.fromVertices(

    width / 2,

    height / 2 + 20,

    [heartPath],

    {
      restitution: 0.65,

      friction: 0.01,

      frictionAir: 0.01,

      density: 0.002,

      render: {
        fillStyle: initialColor,
        strokeStyle: initialColor,
        lineWidth: 2
      }

    },

    true

  );


  Body.scale(
    heart,
    0.72,
    0.72
  );


  Composite.add(
    world,
    heart
  );


  /* =========================
     INVISIBLE WALLS
  ========================= */

  const wall = 30;

  Composite.add(world, [

    Bodies.rectangle(
      width / 2,
      -wall / 2,
      width,
      wall,
      {
        isStatic: true,
        render: { visible: false }
      }
    ),

    Bodies.rectangle(
      width / 2,
      height + wall / 2,
      width,
      wall,
      {
        isStatic: true,
        render: { visible: false }
      }
    ),

    Bodies.rectangle(
      -wall / 2,
      height / 2,
      wall,
      height,
      {
        isStatic: true,
        render: { visible: false }
      }
    ),

    Bodies.rectangle(
      width + wall / 2,
      height / 2,
      wall,
      height,
      {
        isStatic: true,
        render: { visible: false }
      }
    )

  ]);


  /* =========================
     MOUSE INTERACTION
  ========================= */

  const mouse =
    Mouse.create(render.canvas);

  const mouseConstraint =
    MouseConstraint.create(
      engine,
      {
        mouse: mouse,

        constraint: {
          stiffness: 0.15,

          render: {
            visible: false
          }
        }
      }
    );


  Composite.add(
    world,
    mouseConstraint
  );

  render.mouse = mouse;


  /* =========================
     HEART MOTION
  ========================= */

  let angle = 0;

  setInterval(() => {

    angle += 0.018;

    Body.setPosition(
      heart,
      {
        x: width / 2 +
          Math.sin(angle) * 4,

        y: height / 2 +
          20 +
          Math.sin(angle * 1.5) * 5
      }
    );

    Body.setAngle(
      heart,
      Math.sin(angle) * 0.025
    );

  }, 30);


  /* =========================
     FLOATING PARTICLES
  ========================= */

  function createParticle() {

    const colors = {
      midnight: ["#ff0080", "#ff69b4", "#da70d6"],
      golden: ["#ff9900", "#ffcc00", "#ff7733"],
      cyber: ["#00f2fe", "#4facfe", "#38f9d7"],
      emerald: ["#00b09b", "#96c93d", "#55efc4"],
      velvet: ["#ff0844", "#ffb199", "#e84393"]
    };

    const colorList =
      colors[currentTheme];

    const color =
      Common.choose(colorList);


    const particle =
      Bodies.circle(

        width / 2 +
          Common.random(-25, 25),

        height / 2 +
          Common.random(-20, 20),

        Common.random(2, 5),

        {
          restitution: 0.9,

          friction: 0,

          frictionAir: 0.01,

          render: {
            fillStyle: color,
            strokeStyle: color,
            lineWidth: 0
          }
        }

      );


    Body.setVelocity(
      particle,
      {
        x: Common.random(-1.5, 1.5),
        y: Common.random(-1.5, 1.5)
      }
    );


    Composite.add(
      world,
      particle
    );


    setTimeout(() => {

      Composite.remove(
        world,
        particle
      );

    }, 5000);

  }


  setInterval(
    createParticle,
    180
  );


  /* =========================
     UPDATE HEART COLOR
  ========================= */

  setInterval(() => {

    const color =
      themePalettes[currentTheme].fill;

    heart.render.fillStyle = color;
    heart.render.strokeStyle = color;

    heart.parts.forEach(part => {

      part.render.fillStyle = color;
      part.render.strokeStyle = color;

    });

  }, 100);


  /* =========================
     START MATTER
  ========================= */

  const runner =
    Runner.create();

  Runner.run(
    runner,
    engine
  );

  Render.run(
    render
  );


})();

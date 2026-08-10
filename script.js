```javascript
"use strict";

(() => {

  /* =========================
     MATTER.JS
  ========================= */

  const {
    Engine,
    Render,
    Runner,
    Bodies,
    Body,
    Composite,
    Common,
    Mouse,
    MouseConstraint,
    Svg
  } = Matter;

  let engine;
  let world;
  let render;
  let runner;

  const WIDTH = 512;
  const HEIGHT = 512;

  let centerX = WIDTH / 2;
  let centerY = HEIGHT / 2;

  /* =========================
     HEART-SHAPED BOUNDARY
  ========================= */

  const svg_terrain =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512px' height='512px' viewBox='0 0 512 512'%3E%3Cpath fill='none' d='M 256.75,151.50 C 256.75,151.50 263.33,132.67 263.33,132.67 263.33,132.67 272.00,110.67 272.00,110.67 272.00,110.67 283.33,97.33 283.33,97.33 283.33,97.33 296.67,81.33 296.67,81.33 296.67,81.33 314.67,66.00 314.67,66.00 314.67,66.00 332.67,56.67 332.67,56.67 332.67,56.67 350.67,52.00 350.67,52.00 350.67,52.00 374.00,46.00 374.00,46.00 374.00,46.00 392.67,47.33 392.67,47.33 392.67,47.33 416.67,51.33 416.67,51.33 416.67,51.33 435.33,57.33 435.33,57.33 435.33,57.33 456.67,67.33 456.67,67.33 456.67,67.33 472.00,80.00 472.00,80.00 472.00,80.00 485.33,96.67 485.33,96.67 485.33,96.67 495.33,114.67 495.33,114.67 495.33,114.67 504.00,132.67 504.00,132.67 504.00,132.67 510.00,152.67 510.00,152.67 510.00,152.67 509.33,176.00 509.33,176.00 509.33,176.00 508.00,207.33 508.00,207.33 508.00,207.33 497.33,252.67 497.33,252.67 497.33,252.67 484.00,285.33 484.00,285.33 484.00,285.33 467.33,318.00 467.33,318.00 467.33,318.00 446.67,343.33 446.67,343.33 446.67,343.33 426.67,365.33 426.67,365.33 426.67,365.33 404.67,384.67 404.67,384.67 404.67,384.67 380.67,402.00 380.67,402.00 380.67,402.00 358.67,418.67 358.67,418.67 358.67,418.67 328.67,433.33 328.67,433.33 328.67,433.33 307.33,446.67 307.33,446.67 307.33,446.67 284.67,454.00 284.67,454.00 284.67,454.00 257.33,464.67 257.33,464.67 257.33,464.67 224.00,450.67 224.00,450.67 224.00,450.67 194.00,438.67 194.00,438.67 194.00,438.67 173.33,428.00 173.33,428.00 173.33,428.00 146.00,412.00 146.00,412.00 146.00,412.00 122.67,393.33 122.67,393.33 122.67,393.33 95.33,374.00 95.33,374.00 95.33,374.00 72.00,351.33 72.00,351.33 72.00,351.33 50.67,325.33 50.67,325.33 50.67,325.33 39.33,307.33 39.33,307.33 39.33,307.33 25.33,285.33 25.33,285.33 25.33,285.33 14.00,259.33 14.00,259.33 14.00,259.33 4.00,229.33 4.00,229.33 4.00,229.33 2.00,209.33 2.00,209.33 2.00,209.33 0.67,175.33 0.67,175.33 0.67,175.33 2.67,151.33 2.67,151.33 2.67,151.33 10.67,126.67 10.67,126.67 10.67,126.67 19.33,110.00 19.33,110.00 19.33,110.00 34.00,85.33 34.00,85.33 34.00,85.33 52.00,71.33 52.00,71.33 52.00,71.33 76.00,56.67 76.00,56.67 76.00,56.67 106.67,45.33 106.67,45.33 106.67,45.33 132.00,45.33 132.00,45.33 132.00,45.33 161.33,50.67 161.33,50.67 161.33,50.67 178.67,56.67 178.67,56.67 178.67,56.67 198.67,67.33 198.67,67.33 198.67,67.33 216.67,78.67 216.67,78.67 216.67,78.67 230.00,95.33 230.00,95.33 230.00,95.33 240.00,110.67 240.00,110.67 240.00,110.67 248.53,129.37 248.53,129.37 248.53,129.37 251.65,140.15 251.65,140.15 251.65,140.15 255.75,151.50 255.75,151.50 Z'/%3E%3C/svg%3E";


  /* =========================
     THEMES
  ========================= */

  const themePalettes = {

    midnight: {
      particles: [
        "#ff0080",
        "#7928ca",
        "#ff1493",
        "#ff69b4",
        "#da70d6",
        "#c71585",
        "#ff007f"
      ]
    },

    golden: {
      particles: [
        "#ff9900",
        "#ffaa00",
        "#ff0055",
        "#ff6600",
        "#ffcc00",
        "#ff7733",
        "#e67e22"
      ]
    },

    cyber: {
      particles: [
        "#00f2fe",
        "#4facfe",
        "#7928ca",
        "#00d2ff",
        "#a18cd1",
        "#38f9d7",
        "#00c6ff"
      ]
    },

    emerald: {
      particles: [
        "#00b09b",
        "#96c93d",
        "#00e6a8",
        "#2ecc71",
        "#1abc9c",
        "#10ac84",
        "#55efc4"
      ]
    },

    velvet: {
      particles: [
        "#ff0844",
        "#ffb199",
        "#d63031",
        "#e84118",
        "#c0392b",
        "#b2bec3",
        "#e84393"
      ]
    }

  };


  /* =========================
     CURRENT THEME
  ========================= */

  const savedTheme =
    localStorage.getItem("heartfill_theme");

  let currentTheme =
    savedTheme && themePalettes[savedTheme]
      ? savedTheme
      : "midnight";

  let particleColors = [
    ...themePalettes[currentTheme].particles
  ];


  /* =========================
     THEME
  ========================= */

  function applyTheme(themeKey) {

    if (!themePalettes[themeKey]) return;

    currentTheme = themeKey;

    localStorage.setItem(
      "heartfill_theme",
      themeKey
    );

    document.body.dataset.theme = themeKey;

    particleColors.length = 0;

    particleColors.push(
      ...themePalettes[themeKey].particles
    );

    document
      .querySelectorAll(".theme-btn")
      .forEach(btn => {

        btn.classList.toggle(
          "active",
          btn.dataset.theme === themeKey
        );

      });

    if (world) {

      Composite.allBodies(world).forEach(body => {

        if (!body.isStatic) {

          const color =
            Common.choose(particleColors);

          body.render.fillStyle = color;
          body.render.strokeStyle = color;

          if (body.parts) {

            body.parts.forEach(part => {
              part.render.fillStyle = color;
              part.render.strokeStyle = color;
            });

          }

        }

      });

    }

  }


  function bindThemeButtons() {

    document
      .querySelectorAll(".theme-btn")
      .forEach(btn => {

        btn.addEventListener(
          "click",
          () => applyTheme(btn.dataset.theme)
        );

      });

  }


  /* =========================
     CREATE 5-POINT STAR
  ========================= */

  function createStarVertices(outerRadius, innerRadius) {

    const vertices = [];

    for (let i = 0; i < 10; i++) {

      const angle =
        -Math.PI / 2 +
        i * Math.PI / 5;

      const radius =
        i % 2 === 0
          ? outerRadius
          : innerRadius;

      vertices.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      });

    }

    return vertices;

  }


  /* =========================
     CREATE STAR PARTICLE
  ========================= */

  function createStar() {

    const color =
      Common.choose(particleColors);

    const vertices =
      createStarVertices(
        Common.random(7, 12),
        Common.random(2.5, 5)
      );

    const star =
      Bodies.fromVertices(
        centerX,
        centerY,
        [vertices],
        {
          restitution: 0.65,
          friction: 0,
          frictionStatic: 0,
          frictionAir: 0.008,
          density: 0.002,

          render: {
            fillStyle: color,
            strokeStyle: color,
            lineWidth: 0
          }
        },
        true
      );

    Body.setAngle(
      star,
      Math.random() * Math.PI * 2
    );

    Body.setAngularVelocity(
      star,
      Common.random(-0.08, 0.08)
    );

    Body.setVelocity(
      star,
      {
        x: Common.random(-4.8, 4.8),
        y: Common.random(-5.5, -1.5)
      }
    );

    Composite.add(world, star);

  }


  /* =========================
     CONTINUOUS STAR EFFECT
  ========================= */

  function startStarRain() {

    setInterval(() => {

      createStar();

    }, 280);

  }


  /* =========================
     SMALL FLOATING STARS
  ========================= */

  function createSmallStar() {

    const color =
      Common.choose(particleColors);

    const vertices =
      createStarVertices(4.5, 1.8);

    const star =
      Bodies.fromVertices(
        centerX,
        centerY,
        [vertices],
        {
          restitution: 0.5,
          friction: 0,
          frictionAir: 0.015,

          render: {
            fillStyle: color,
            strokeStyle: color,
            lineWidth: 0
          }
        },
        true
      );

    Body.setVelocity(
      star,
      {
        x: Common.random(-1.8, 1.8),
        y: Common.random(-1.8, 1.8)
      }
    );

    Composite.add(world, star);

  }


  function startSmallStars() {

    let count = 0;

    const interval =
      setInterval(() => {

        createSmallStar();

        count++;

        if (count >= 80) {
          clearInterval(interval);
        }

      }, 90);

  }


  /* =========================
     START MATTER.JS
  ========================= */

  function startAnimation() {

    engine = Engine.create();

    world = engine.world;

    engine.gravity.scale = 0;
    engine.gravity.x = 0;
    engine.gravity.y = 0;


    render = Render.create({

      element: document.body,

      engine: engine,

      options: {
        width: WIDTH,
        height: HEIGHT,
        wireframes: false,
        background: "transparent",
        pixelRatio: window.devicePixelRatio || 1
      }

    });


    runner = Runner.create();


    /* =========================
       HEART BOUNDARY
    ========================= */

    fetch(svg_terrain)
      .then(response => response.text())

      .then(text => {

        const svg =
          new DOMParser()
            .parseFromString(
              text,
              "image/svg+xml"
            );

        const paths =
          Array.from(
            svg.querySelectorAll("path")
          );

        const vertices =
          paths.map(path =>
            Svg.pathToVertices(
              path,
              20
            )
          );

        const terrain =
          Bodies.fromVertices(
            centerX,
            215,
            vertices,
            {
              isStatic: true,

              render: {
                fillStyle: "transparent",
                strokeStyle: "transparent",
                lineWidth: 0
              }
            },
            true
          );

        Composite.add(
          world,
          terrain
        );

        centerX = terrain.position.x;
        centerY = terrain.position.y;

        /* Start stars after boundary exists */

        startStarRain();

        setTimeout(
          startSmallStars,
          1000
        );

      })

      .catch(error => {
        console.error(
          "Heart boundary error:",
          error
        );

        /* Fallback: stars still work */

        startStarRain();

        setTimeout(
          startSmallStars,
          1000
        );

      });


    /* =========================
       MOUSE INTERACTION
    ========================= */

    const mouse =
      Mouse.create(
        render.canvas
      );

    const mouseConstraint =
      MouseConstraint.create(
        engine,
        {
          mouse: mouse,

          constraint: {
            stiffness: 0.2,

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
       RUN
    ========================= */

    Runner.run(
      runner,
      engine
    );

    Render.run(
      render
    );

  }


  /* =========================
     DECORATIVE CSS STARS
  ========================= */

  function createDecorativeStars() {

    const container =
      document.getElementById("stars");

    if (!container) return;

    container.innerHTML = "";

    for (let i = 0; i < 55; i++) {

      const star =
        document.createElement("span");

      star.className = "star";

      if (Math.random() > 0.75) {
        star.classList.add("large");
      }

      if (Math.random() > 0.55) {
        star.classList.add("small");
      }

      star.style.setProperty(
        "--x",
        `${Math.random() * 100}%`
      );

      star.style.setProperty(
        "--y",
        `${Math.random() * 100}%`
      );

      star.style.setProperty(
        "--size",
        `${Math.random() * 5 + 3}px`
      );

      star.style.setProperty(
        "--opacity",
        `${Math.random() * 0.55 + 0.25}`
      );

      star.style.setProperty(
        "--duration",
        `${Math.random() * 4 + 3}s`
      );

      star.style.setProperty(
        "--delay",
        `${Math.random() * 4}s`
      );

      container.appendChild(star);

    }

  }


  /* =========================
     INIT
  ========================= */

  function init() {

    document.body.dataset.theme =
      currentTheme;

    applyTheme(currentTheme);

    bindThemeButtons();

    createDecorativeStars();

    startAnimation();

  }


  window.addEventListener(
    "load",
    init
  );

})();
```

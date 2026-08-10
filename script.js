"use strict";

(() => {

  /* =========================
     CHECK MATTER.JS
     ========================= */

  const MatterLib = window.Matter;

  if (!MatterLib) {
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
  } = MatterLib;


  /* =========================
     CANVAS SIZE
     ========================= */

  const width = 512;
  const height = 512;


  /* =========================
     THEMES
     ========================= */

  const themePalettes = {

    midnight: {
      g: [
        "#ff0080",
        "#7928ca",
        "#ff1493",
        "#ff69b4",
        "#da70d6",
        "#c71585",
        "#ff007f"
      ],

      S: [
        "#c71585",
        "#dc143c",
        "#fa8072"
      ]
    },

    golden: {
      g: [
        "#ff9900",
        "#ffaa00",
        "#ff0055",
        "#ff6600",
        "#ffcc00",
        "#ff7733",
        "#e67e22"
      ],

      S: [
        "#d35400",
        "#e74c3c",
        "#f39c12"
      ]
    },

    cyber: {
      g: [
        "#00f2fe",
        "#4facfe",
        "#7928ca",
        "#00d2ff",
        "#a18cd1",
        "#38f9d7",
        "#00c6ff"
      ],

      S: [
        "#2575fc",
        "#6a11cb",
        "#00c6ff"
      ]
    },

    emerald: {
      g: [
        "#00b09b",
        "#96c93d",
        "#00e6a8",
        "#2ecc71",
        "#1abc9c",
        "#10ac84",
        "#55efc4"
      ],

      S: [
        "#009432",
        "#05c46b",
        "#10ac84"
      ]
    },

    velvet: {
      g: [
        "#ff0844",
        "#ffb199",
        "#d63031",
        "#e84118",
        "#c0392b",
        "#b2bec3",
        "#e84393"
      ],

      S: [
        "#9b59b6",
        "#8e44ad",
        "#c0392b"
      ]
    }

  };


  /* =========================
     CURRENT THEME
     ========================= */

  const savedTheme =
    localStorage.getItem("heartfill_theme");

  let currentTheme =
    themePalettes[savedTheme]
      ? savedTheme
      : "midnight";

  let colors =
    [...themePalettes[currentTheme].g];

  let burstColors =
    [...themePalettes[currentTheme].S];


  /* =========================
     MATTER VARIABLES
     ========================= */

  let engine = null;
  let world = null;


  /* =========================
     APPLY THEME
     ========================= */

  function applyTheme(themeKey) {

    if (!themePalettes[themeKey]) {
      return;
    }

    currentTheme = themeKey;

    colors =
      [...themePalettes[themeKey].g];

    burstColors =
      [...themePalettes[themeKey].S];

    localStorage.setItem(
      "heartfill_theme",
      themeKey
    );

    document.body.dataset.theme =
      themeKey;


    /* Update active button */

    document
      .querySelectorAll(".theme-btn")
      .forEach((button) => {

        button.classList.toggle(
          "active",
          button.dataset.theme === themeKey
        );

      });


    /* Recolor existing objects */

    if (world) {

      Composite
        .allBodies(world)
        .forEach((body) => {

          if (body.isStatic) {
            return;
          }

          const color =
            Common.choose(colors);

          body.render.fillStyle =
            color;

          body.render.strokeStyle =
            color;

          body.parts.forEach((part) => {

            part.render.fillStyle =
              color;

            part.render.strokeStyle =
              color;

          });

        });

    }

  }


  /* =========================
     THEME BUTTONS
     ========================= */

  function bindThemeButtons() {

    const buttons =
      document.querySelectorAll(".theme-btn");

    buttons.forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          applyTheme(
            button.dataset.theme
          );

        }
      );

    });

    applyTheme(currentTheme);

  }


  /* =========================
     CREATE HEART
     ========================= */

  function createHeartBody(
    x,
    y,
    scale = 0.2
  ) {

    const heartPath = [

      { x: 0, y: -120 },

      { x: -80, y: -180 },

      { x: -180, y: -120 },

      { x: -160, y: 0 },

      { x: 0, y: 180 },

      { x: 160, y: 0 },

      { x: 180, y: -120 },

      { x: 80, y: -180 }

    ];


    const color =
      Common.choose(colors);


    const body =
      Bodies.fromVertices(

        x,
        y,

        [heartPath],

        {

          restitution: 0.75,

          friction: 0.02,

          frictionAir: 0.012,

          density: 0.001,

          render: {

            fillStyle: color,

            strokeStyle: color,

            lineWidth: 1

          }

        },

        true

      );


    Body.scale(
      body,
      scale,
      scale
    );


    Body.setVelocity(
      body,
      {
        x: Common.random(-2, 2),
        y: Common.random(-2, 0)
      }
    );


    return body;

  }


  /* =========================
     INITIALIZE PHYSICS
     ========================= */

  function initPhysics() {

    engine =
      Engine.create();

    world =
      engine.world;


    /* Disable gravity */

    engine.gravity.scale = 0;
    engine.gravity.x = 0;
    engine.gravity.y = 0;


    /* Matter renderer */

    const render =
      Render.create({

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


    /* =========================
       INVISIBLE WALLS
       ========================= */

    const wallThickness = 30;


    Composite.add(
      world,

      [

        Bodies.rectangle(
          width / 2,
          -wallThickness / 2,
          width,
          wallThickness,
          {
            isStatic: true,
            render: {
              visible: false
            }
          }
        ),

        Bodies.rectangle(
          width / 2,
          height + wallThickness / 2,
          width,
          wallThickness,
          {
            isStatic: true,
            render: {
              visible: false
            }
          }
        ),

        Bodies.rectangle(
          -wallThickness / 2,
          height / 2,
          wallThickness,
          height,
          {
            isStatic: true,
            render: {
              visible: false
            }
          }
        ),

        Bodies.rectangle(
          width + wallThickness / 2,
          height / 2,
          wallThickness,
          height,
          {
            isStatic: true,
            render: {
              visible: false
            }
          }
        )

      ]
    );


    /* =========================
       MOUSE CONTROL
       ========================= */

    const mouse =
      Mouse.create(render.canvas);


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


    render.mouse =
      mouse;


    /* =========================
       START ENGINE
       ========================= */

    Runner.run(
      Runner.create(),
      engine
    );

    Render.run(render);


    /* =========================
       CREATE HEARTS
       ========================= */

    const centerX =
      width / 2;

    const centerY =
      height / 2;


    setTimeout(() => {

      for (
        let i = 0;
        i < 8;
        i++
      ) {

        setTimeout(() => {

          const heart =
            createHeartBody(

              centerX +
                Common.random(-20, 20),

              centerY +
                Common.random(-10, 10),

              0.11 +
                Math.random() * 0.08

            );


          Composite.add(
            world,
            heart
          );

        }, i * 180);

      }

    }, 400);


    /* =========================
       SMALL PARTICLES
       ========================= */

    setTimeout(() => {

      let count = 0;

      const timer =
        setInterval(() => {

          const color =
            Common.choose(
              burstColors
            );


          const particle =
            Bodies.circle(

              centerX +
                Common.random(-25, 25),

              centerY +
                Common.random(-25, 25),

              5 +
                Math.random() * 8,

              {

                restitution: 0.8,

                friction: 0,

                frictionAir: 0.015,

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

              x: Common.random(-1, 1),

              y: Common.random(-1, 1)

            }

          );


          Composite.add(
            world,
            particle
          );


          count++;


          if (count >= 60) {

            clearInterval(timer);

          }

        }, 100);

    }, 2000);

  }


  /* =========================
     START
     ========================= */

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      bindThemeButtons();

      initPhysics();

    }
  );

})();
"use strict";

!(function () {
  let e, n, r, i, o, a;
  let l = 512,
    s = 512;

  let c = Matter.Engine,
    d = Matter.Render,
    u = Matter.Runner,
    f = Matter.Common,
    p = Matter.MouseConstraint,
    m = Matter.Mouse,
    h = Matter.Composite,
    y = Matter.Bodies,
    M = Matter.Body,
    v = Matter.Svg;

  let themePalettes = {
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
      S: ["#c71585", "#dc143c", "#fa8072"]
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
      S: ["#d35400", "#e74c3c", "#f39c12"]
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
      S: ["#2575fc", "#6a11cb", "#00c6ff"]
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
      S: ["#009432", "#05c46b", "#10ac84"]
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
      S: ["#9b59b6", "#8e44ad", "#c0392b"]
    }
  };

  let savedTheme =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("heartfill_theme")
      : null;

  let currentTheme =
    savedTheme && themePalettes[savedTheme]
      ? savedTheme
      : "midnight";

  let g = [...themePalettes[currentTheme].g];
  let S = [...themePalettes[currentTheme].S];

  function applyTheme(themeKey) {
    if (!themePalettes[themeKey]) return;

    currentTheme = themeKey;

    if (typeof localStorage !== "undefined") {
      localStorage.setItem("heartfill_theme", themeKey);
    }

    document.body.setAttribute("data-theme", themeKey);

    g.length = 0;
    g.push(...themePalettes[themeKey].g);

    S.length = 0;
    S.push(...themePalettes[themeKey].S);

    if (e) {
      let bodies = h.allBodies(e);

      bodies.forEach(function (body) {
        if (!body.isStatic) {
          let newColor = f.choose(g);

          body.render.fillStyle = newColor;
          body.render.strokeStyle = newColor;

          if (body.parts && body.parts.length > 1) {
            body.parts.forEach(function (part) {
              part.render.fillStyle = newColor;
              part.render.strokeStyle = newColor;
            });
          }
        }
      });
    }

    document.querySelectorAll(".theme-btn").forEach(function (btn) {
      if (btn.dataset.theme === themeKey) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  applyTheme(currentTheme);

  function bindThemeButtons() {
    document.querySelectorAll(".theme-btn").forEach(function (btn) {
      btn.onclick = function (event) {
        event.stopPropagation();
        applyTheme(btn.dataset.theme);
      };
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindThemeButtons);
  } else {
    bindThemeButtons();
  }

  document.addEventListener("click", function (event) {
    const btn = event.target.closest(".theme-btn");

    if (btn && btn.dataset && btn.dataset.theme) {
      applyTheme(btn.dataset.theme);
    }
  });

  function startAnimation() {
    let t, world;

    o = l / 2;
    a = s / 2;

    n = c.create();
    e = n.world;

    r = d.create({
      element: document.body,
      engine: n,
      options: {
        width: l,
        height: s,
        wireframes: false,
        background: "transparent",
        pixelRatio: window.devicePixelRatio || 1
      }
    });

    i = u.create();

    n.gravity.scale = 0;
    n.gravity.x = 0;
    n.gravity.y = 0;

    /*
     * ============================
     * LOAD HEART TERRAIN
     * ============================
     */

    if (typeof fetch === "undefined") {
      console.warn("Fetch is not available.");
      return;
    }

    function queryAll(root, selector) {
      return Array.prototype.slice.call(
        root.querySelectorAll(selector)
      );
    }

    function loadSVG(data) {
      return fetch(data)
        .then(function (response) {
          if (!response.ok) {
            throw new Error("SVG could not be loaded.");
          }

          return response.text();
        })
        .then(function (text) {
          return new DOMParser().parseFromString(
            text,
            "image/svg+xml"
          );
        });
    }

    /*
     * ============================
     * LOAD TERRAIN
     * ============================
     */

    loadSVG(svg_terrain)
      .then(function (terrainSVG) {
        let paths = queryAll(terrainSVG, "path");

        let vertices = paths.map(function (path) {
          return v.pathToVertices(path, 30);
        });

        let terrain = y.fromVertices(
          256,
          200,
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

        h.add(e, terrain);

        o = terrain.position.x;
        a = terrain.position.y;
      })
      .catch(function (error) {
        console.error("Terrain SVG error:", error);
      });

    /*
     * ============================
     * LOAD HEART
     * ============================
     */

    let heartBody = null;

    loadSVG(svg_heart)
      .then(function (heartSVG) {
        let paths = queryAll(heartSVG, "path");

        let vertices = paths.map(function (path) {
          return v.pathToVertices(path, 30);
        });

        heartBody = y.fromVertices(
          o,
          1.5 * a,
          vertices,
          {
            restitution: 0,
            friction: 0,
            frictionStatic: 0,
            frictionAir: 0,
            mass: 20,
            render: {
              fillStyle: f.choose(g),
              strokeStyle: f.choose(g),
              lineWidth: 0
            }
          },
          true
        );

        M.scale(heartBody, 0.2, 0.2);

        /*
         * QUAN TRỌNG:
         * Chỉ bắt đầu tạo trái tim
         * sau khi SVG đã load xong.
         */

        startHeartRain();
      })
      .catch(function (error) {
        console.error("Heart SVG error:", error);
      });

    /*
     * ============================
     * CREATE HEART
     * ============================
     */

    function createHeart() {
      if (!heartBody) return;

      let heart = structuredClone(heartBody);

      heart.id = f.nextId();

      heart.position.x = o;
      heart.position.y = 1.5 * a;

      let color = f.choose(g);

      heart.render.fillStyle = color;
      heart.render.strokeStyle = color;

      if (heart.parts) {
        heart.parts.forEach(function (part) {
          part.render.fillStyle = color;
          part.render.strokeStyle = color;
        });
      }

      M.setAngle(
        heart,
        Math.round(360 * Math.random()),
        false
      );

      M.setVelocity(heart, {
        x: f.random(-5, 5),
        y: f.random(-5, -1)
      });

      h.add(e, heart);
    }

    /*
     * ============================
     * HEART RAIN
     * ============================
     */

    function startHeartRain() {
      let count = 0;

      setInterval(function () {
        createHeart();

        count++;

        /*
         * Tạo liên tục.
         * Không giới hạn số lượng.
         */
      }, 650);
    }

    /*
     * ============================
     * SMALL FLOATING HEARTS
     * ============================
     */

    setTimeout(function () {
      let count = 0;

      let interval = setInterval(function () {
        let color = f.choose(g);

        let smallHeart = y.circle(
          o,
          a,
          12,
          {
            restitution: 0,
            friction: 0,
            frictionStatic: 0,
            frictionAir: 0,
            mass: 10,
            render: {
              fillStyle: color,
              strokeStyle: color,
              lineWidth: 0
            }
          }
        );

        M.setVelocity(smallHeart, {
          x: f.random(-1, 1),
          y: f.random(-1, 1)
        });

        h.add(e, smallHeart);

        count++;

        if (count >= 60) {
          clearInterval(interval);
        }
      }, 100);
    }, 2000);

    /*
     * ============================
     * MOUSE CONTROL
     * ============================
     */

    let mouse = m.create(r.canvas);

    let mouseConstraint = p.create(n, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    h.add(e, mouseConstraint);

    r.mouse = mouse;

    d.lookAt(r, {
      min: {
        x: 0,
        y: 0
      },
      max: {
        x: l,
        y: s
      }
    });

    u.run(i, n);
    d.run(r);
  }

  window.onload = function () {
    startAnimation();

    bindThemeButtons();
    applyTheme(currentTheme);
  };
})();

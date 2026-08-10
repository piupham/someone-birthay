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

  const svg_terrain =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512px' height='512px' viewBox='0 0 512 512'%3E%3Cpath id='パス' fill='none' stroke='black' stroke-width='1' d='M 256.75,151.50 C 256.75,151.50 263.33,132.67 263.33,132.67 263.33,132.67 272.00,110.67 272.00,110.67 272.00,110.67 283.33,97.33 283.33,97.33 283.33,97.33 296.67,81.33 296.67,81.33 296.67,81.33 314.67,66.00 314.67,66.00 314.67,66.00 332.67,56.67 332.67,56.67 332.67,56.67 350.67,52.00 350.67,52.00 350.67,52.00 374.00,46.00 374.00,46.00 374.00,46.00 392.67,47.33 392.67,47.33 392.67,47.33 416.67,51.33 416.67,51.33 416.67,51.33 435.33,57.33 435.33,57.33 435.33,57.33 456.67,67.33 456.67,67.33 456.67,67.33 472.00,80.00 472.00,80.00 472.00,80.00 485.33,96.67 485.33,96.67 485.33,96.67 495.33,114.67 495.33,114.67 495.33,114.67 504.00,132.67 504.00,132.67 504.00,132.67 510.00,152.67 510.00,152.67 510.00,152.67 509.33,176.00 509.33,176.00 509.33,176.00 508.00,207.33 508.00,207.33 508.00,207.33 497.33,252.67 497.33,252.67 497.33,252.67 484.00,285.33 484.00,285.33 484.00,285.33 467.33,318.00 467.33,318.00 467.33,318.00 446.67,343.33 446.67,343.33 446.67,343.33 426.67,365.33 426.67,365.33 426.67,365.33 404.67,384.67 404.67,384.67 404.67,384.67 380.67,402.00 380.67,402.00 380.67,402.00 358.67,418.67 358.67,418.67 358.67,418.67 328.67,433.33 328.67,433.33 328.67,433.33 307.33,446.67 307.33,446.67 307.33,446.67 284.67,454.00 284.67,454.00 284.67,454.00 257.33,464.67 257.33,464.67 257.33,464.67 224.00,450.67 224.00,450.67 224.00,450.67 194.00,438.67 194.00,438.67 194.00,438.67 173.33,428.00 173.33,428.00 173.33,428.00 146.00,412.00 146.00,412.00 146.00,412.00 122.67,393.33 122.67,393.33 122.67,393.33 95.33,374.00 95.33,374.00 95.33,374.00 72.00,351.33 72.00,351.33 72.00,351.33 50.67,325.33 50.67,325.33 50.67,325.33 39.33,307.33 39.33,307.33 39.33,307.33 25.33,285.33 25.33,285.33 25.33,285.33 14.00,259.33 14.00,259.33 14.00,259.33 4.00,229.33 4.00,229.33 4.00,229.33 2.00,209.33 2.00,209.33 2.00,209.33 0.67,175.33 0.67,175.33 0.67,175.33 2.67,151.33 2.67,151.33 2.67,151.33 10.67,126.67 10.67,126.67 10.67,126.67 19.33,110.00 19.33,110.00 19.33,110.00 34.00,85.33 34.00,85.33 34.00,85.33 52.00,71.33 52.00,71.33 52.00,71.33 76.00,56.67 76.00,56.67 76.00,56.67 106.67,45.33 106.67,45.33 106.67,45.33 132.00,45.33 132.00,45.33 132.00,45.33 161.33,50.67 161.33,50.67 161.33,50.67 178.67,56.67 178.67,56.67 178.67,56.67 198.67,67.33 198.67,67.33 198.67,67.33 216.67,78.67 216.67,78.67 216.67,78.67 230.00,95.33 230.00,95.33 230.00,95.33 240.00,110.67 240.00,110.67 240.00,110.67 248.53,129.37 248.53,129.37 248.53,129.37 251.65,140.15 251.65,140.15 251.65,140.15 255.75,151.50 255.75,151.50 255.75,151.50 259.33,0.67 259.33,0.67 259.33,0.67 0.28,0.57 0.28,0.57 0.28,0.57 -0.85,511.81 -0.85,511.81 -0.85,511.81 511.52,511.81 511.52,511.81 511.52,511.81 512.00,-0.50 512.00,-0.50 512.00,-0.50 263.00,0.50 263.00,0.50 263.00,0.50 256.75,151.50 256.75,151.50 Z' /%3E%3C/svg%3E";

  const svg_heart =
    "data:image/svg+xml,%3Csvg id='_x32_' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='512px' height='512px' viewBox='0 0 512 512' style='width: 512px; height: 512px; opacity: 1;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:%234B4B4B;%7D %3C/style%3E%3Cg%3E%3Cpath class='st0' d='M384,46.469c-70.688,0-128,57.313-128,128.016c0-70.703-57.313-128.016-128-128.016S0,103.781,0,174.484 c0,66.484,31.313,193.391,218.563,276.234c11.844,5.25,35.703,14.469,35.703,14.469c0.547,0.219,1.141,0.344,1.734,0.344 s1.188-0.125,1.734-0.344c0,0,23.859-9.219,35.703-14.469C480.688,367.875,512,240.969,512,174.484 C512,103.781,454.688,46.469,384,46.469z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";

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
     * Tạo phần biên hình trái tim lớn
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

    let heartBody = null;

    /*
     * Tải hình trái tim
     */
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
         * Chỉ bắt đầu hiệu ứng sau khi
         * trái tim đã tải hoàn tất.
         */
        startHeartRain();
      })
      .catch(function (error) {
        console.error("Heart SVG error:", error);
      });

    /*
     * Tạo một trái tim mới
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
     * Tạo trái tim liên tục
     */
    function startHeartRain() {
      setInterval(function () {
        createHeart();
      }, 650);
    }

    /*
     * Các hạt nhỏ bay xung quanh
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
     * Điều khiển bằng chuột
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

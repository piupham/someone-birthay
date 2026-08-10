
"use strict";

!(function () {
  function t() {
    !(function () {
      var t, g;
      if (
        ((o = l / 2),
          (a = s / 2),
          (n = c.create()),
          (e = n.world),
          (r = d.create({
            element: document.body,
            engine: n,
            options: {
              width: l,
              height: s,
              wireframes: !1,
              background: "transparent",
              pixelRatio: 1
            }
          })),
          (i = u.create()),
          u.run(i, n),
          (n.gravity.scale = 0),
          (n.gravity.x = 0),
          (n.gravity.y = 0),
          "undefined" != typeof fetch)
      ) {
        (t = function (t, e) {
          return Array.prototype.slice.call(t.querySelectorAll(e));
        }),
          (g = function (t) {
            return fetch(t)
              .then(function (t) {
                return t.text();
              })
              .then(function (t) {
                return new window.DOMParser().parseFromString(
                  t,
                  "image/svg+xml"
                );
              });
          })(svg_terrain).then(function (n) {
            var r = t(n, "path"),
              i = r.map(function (t) {
                return v.pathToVertices(t, 30);
              }),
              l = y.fromVertices(
                256,
                200,
                i,
                {
                  isStatic: !0,
                  render: {
                    fillStyle: "transparent",
                    strokeStyle: "transparent",
                    lineWidth: 1
                  }
                },
                !0
              );
            h.add(e, l), (o = l.position.x), (a = l.position.y);
          });
        let n = null,
          r = null;
        g(svg_heart).then(function (e) {
          n ||
            ((r = t(e, "path").map(function (t) {
              return v.pathToVertices(t, 50);
            })),
              (n = y.fromVertices(
                o,
                1.5 * a,
                r,
                {
                  restitution: 0,
                  friction: 0,
                  frictionStatic: 0,
                  frictionAir: 0,
                  mass: 20,
                  render: {
                    lineWidth: 2
                  }
                },
                !0
              )),
              M.scale(n, 0.14, 0.14));
        });
        let i = function () {
          let t = structuredClone(n);
          (t.id = f.nextId()),
            (t.position.x = o),
            (t.position.y = 1.5 * a),
            S.push(S.shift());
          let r = S[0];
          (t.render.fillStyle = r),
            (t.render.strokeStyle = r),
            t.parts.forEach(function (e, n) {
              (t.parts[n].render.fillStyle = r),
                (t.parts[n].render.strokeStyle = r);
            }),
            M.setAngle(t, Math.round(360 * Math.random()), !1),
            M.setVelocity(t, {
              x: f.random(-5, 5),
              y: f.random(-5, -1)
            }),
            h.add(e, t);
        };
        setTimeout(function () {
          let t = 0,
            e = setInterval(() => {
              i(), 2 == t && (clearInterval(e), (n = null), (r = null)), t++;
            }, 780);
        }, 220);
      } else f.warn("Fetch is not available. Could not load SVG.");
      let k = m.create(r.canvas),
        x = p.create(n, {
          mouse: k,
          constraint: {
            stiffness: 0.2,
            render: {
              visible: !1
            }
          }
        });
      h.add(e, x),
        (r.mouse = k),
        d.lookAt(r, {
          min: {
            x: 0,
            y: 0
          },
          max: {
            x: l,
            y: s
          }
        }),
        d.run(r);
    })();
  }
  let e,
    n,
    r,
    i,
    o,
    a,
    l = 512,
    s = 512,
    c = (Matter.World, Matter.Engine),
    d = Matter.Render,
    u = Matter.Runner,
    f = (Matter.Composites, Matter.Common),
    p = Matter.MouseConstraint,
    m = Matter.Mouse,
    h = Matter.Composite,
    y = (Matter.Vertices, Matter.Bodies),
    M = Matter.Body,
    v = (Matter.Events, Matter.Query, Matter.Svg),
    themePalettes = {
      midnight: {
        g: ["#ff0080", "#7928ca", "#ff1493", "#ff69b4", "#da70d6", "#c71585", "#ff007f"],
        S: ["#c71585", "#dc143c", "#fa8072"]
      },
      golden: {
        g: ["#ff9900", "#ffaa00", "#ff0055", "#ff6600", "#ffcc00", "#ff7733", "#e67e22"],
        S: ["#d35400", "#e74c3c", "#f39c12"]
      },
      cyber: {
        g: ["#00f2fe", "#4facfe", "#7928ca", "#00d2ff", "#a18cd1", "#38f9d7", "#00c6ff"],
        S: ["#2575fc", "#6a11cb", "#00c6ff"]
      },
      emerald: {
        g: ["#00b09b", "#96c93d", "#00e6a8", "#2ecc71", "#1abc9c", "#10ac84", "#55efc4"],
        S: ["#009432", "#05c46b", "#10ac84"]
      },
      velvet: {
        g: ["#ff0844", "#ffb199", "#d63031", "#e84118", "#c0392b", "#b2bec3", "#e84393"],
        S: ["#9b59b6", "#8e44ad", "#c0392b"]
      }
    },
    savedTheme = typeof localStorage !== "undefined" ? localStorage.getItem("heartfill_theme") : null,
    currentTheme = savedTheme && themePalettes[savedTheme] ? savedTheme : "midnight",
    g = [...themePalettes[currentTheme].g],
    S = [...themePalettes[currentTheme].S];

  function applyTheme(themeKey) {
    if (!themePalettes[themeKey]) return;
    currentTheme = themeKey;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("heartfill_theme", themeKey);
    }
    document.body.setAttribute("data-theme", themeKey);

    // Update active theme palettes
    g.length = 0;
    g.push(...themePalettes[themeKey].g);
    S.length = 0;
    S.push(...themePalettes[themeKey].S);

    // Recolor existing dynamic physics bodies in Matter.js world
    if (e) {
      let bodies = h.allBodies(e);
      bodies.forEach((body) => {
        if (!body.isStatic) {
          let newColor = f.choose(g);
          body.render.fillStyle = newColor;
          body.render.strokeStyle = newColor;
          if (body.parts && body.parts.length > 1) {
            body.parts.forEach((part) => {
              part.render.fillStyle = newColor;
              part.render.strokeStyle = newColor;
            });
          }
        }
      });
    }

    // Update button active state
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      if (btn.dataset.theme === themeKey) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  // Initialize theme state immediately and setup event listeners
  applyTheme(currentTheme);

  function bindThemeButtons() {
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        applyTheme(btn.dataset.theme);
      };
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindThemeButtons);
  } else {
    bindThemeButtons();
  }

  // Event delegation fallback for guaranteed click handling
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".theme-btn");
    if (btn && btn.dataset && btn.dataset.theme) {
      applyTheme(btn.dataset.theme);
    }
  });

  (window.onload = () => {
    t();
    bindThemeButtons();
    applyTheme(currentTheme);
  }),
    setTimeout(function () {
      let t = 0,
        n = setInterval(() => {
          !(function () {
            let t = f.choose(g);
            const n = y.circle(o, a, 25, {
              restitution: 0,
              friction: 0,
              frictionStatic: 0,
              frictionAir: 0,
              mass: 10,
              render: {
                fillStyle: t,
                strokeStyle: t,
                lineWidth: 0
              }
            });
            M.setVelocity(n, {
              x: f.random(-1, 1),
              y: f.random(-1, 1)
            }),
              h.add(e, n);
          })(),
            60 == t && clearInterval(n),
            t++;
        }, 100);
    }, 2e3);
})();

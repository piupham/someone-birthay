"use strict";

/* =========================================================
   BIRTHDAY CARD
   Central heart + surrounding stars + theme switcher
========================================================= */


/* =========================================================
   THEME
========================================================= */

const themeColors = {
    midnight: {
        heart: ["#ff0080", "#ff1493", "#7928ca"],
        star: "#ff69b4"
    },

    golden: {
        heart: ["#ffcc00", "#ff9900", "#ff0055"],
        star: "#ffcc00"
    },

    cyber: {
        heart: ["#00f2fe", "#4facfe", "#7928ca"],
        star: "#00d9ff"
    },

    emerald: {
        heart: ["#00e6a8", "#2ecc71", "#96c93d"],
        star: "#55efc4"
    },

    velvet: {
        heart: ["#ff0844", "#e84393", "#c0392b"],
        star: "#ff4d7d"
    }
};


/* =========================================================
   CURRENT THEME
========================================================= */

let currentTheme = "cyber";

try {
    const savedTheme = localStorage.getItem("heartfill_theme");

    if (savedTheme && themeColors[savedTheme]) {
        currentTheme = savedTheme;
    }
} catch (error) {
    currentTheme = "cyber";
}


/* =========================================================
   THEME APPLY
========================================================= */

function applyTheme(theme) {

    if (!themeColors[theme]) {
        return;
    }

    currentTheme = theme;

    document.body.setAttribute(
        "data-theme",
        theme
    );

    try {
        localStorage.setItem(
            "heartfill_theme",
            theme
        );
    } catch (error) {
        // Ignore localStorage errors
    }

    document
        .querySelectorAll(".theme-btn")
        .forEach((button) => {

            button.classList.toggle(
                "active",
                button.dataset.theme === theme
            );
        });

    updateStars();

    drawHeart();
}


/* =========================================================
   THEME BUTTONS
========================================================= */

function setupThemeButtons() {

    document
        .querySelectorAll(".theme-btn")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const theme =
                        button.dataset.theme;

                    applyTheme(theme);
                }
            );
        });
}


/* =========================================================
   STARS
========================================================= */

const starContainer =
    document.getElementById("stars");


function createStars() {

    if (!starContainer) {
        return;
    }

    starContainer.innerHTML = "";

    const starData = [
        [8, 18, 18, 0.8, 4],
        [17, 28, 12, 0.7, 5],
        [25, 82, 9, 0.55, 3],
        [34, 13, 7, 0.65, 4],
        [43, 27, 15, 0.75, 5],
        [55, 14, 8, 0.55, 3],
        [66, 20, 17, 0.8, 4],
        [76, 12, 8, 0.6, 5],
        [84, 28, 13, 0.75, 4],
        [92, 18, 7, 0.55, 3],

        [4, 45, 9, 0.6, 5],
        [13, 58, 16, 0.8, 4],
        [23, 48, 7, 0.55, 3],
        [79, 51, 9, 0.55, 5],
        [91, 43, 17, 0.75, 4],
        [96, 63, 8, 0.55, 3],

        [7, 77, 14, 0.75, 4],
        [18, 88, 8, 0.6, 5],
        [31, 76, 7, 0.55, 3],
        [69, 78, 8, 0.6, 4],
        [82, 86, 15, 0.75, 5],
        [94, 76, 8, 0.6, 3]
    ];

    starData.forEach(
        ([x, y, size, opacity, duration], index) => {

            const star =
                document.createElement("div");

            star.className = "star";

            if (size >= 15) {
                star.classList.add("large");
            }

            if (size <= 8) {
                star.classList.add("small");
            }

            star.style.setProperty(
                "--x",
                `${x}%`
            );

            star.style.setProperty(
                "--y",
                `${y}%`
            );

            star.style.setProperty(
                "--size",
                `${size}px`
            );

            star.style.setProperty(
                "--opacity",
                opacity
            );

            star.style.setProperty(
                "--duration",
                `${duration}s`
            );

            star.style.setProperty(
                "--delay",
                `${index * -0.23}s`
            );

            starContainer.appendChild(star);
        }
    );
}


function updateStars() {

    const color =
        themeColors[currentTheme].star;

    document.documentElement.style.setProperty(
        "--star-color",
        color
    );
}


/* =========================================================
   CENTRAL HEART CANVAS
========================================================= */

const canvas =
    document.getElementById("heartCanvas");

const ctx =
    canvas.getContext("2d");

let heartParticles = [];

let heartWidth = 0;
let heartHeight = 0;


/* =========================================================
   RESIZE CANVAS
========================================================= */

function resizeCanvas() {

    if (!canvas) {
        return;
    }

    const rect =
        canvas.getBoundingClientRect();

    const ratio =
        Math.min(window.devicePixelRatio || 1, 2);

    canvas.width =
        Math.floor(rect.width * ratio);

    canvas.height =
        Math.floor(rect.height * ratio);

    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );

    heartWidth = rect.width;
    heartHeight = rect.height;

    createHeartParticles();
}


/* =========================================================
   HEART EQUATION
========================================================= */

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


/* =========================================================
   CREATE HEART PARTICLES
========================================================= */

function createHeartParticles() {

    heartParticles = [];

    if (!heartWidth || !heartHeight) {
        return;
    }

    const colors =
        themeColors[currentTheme].heart;

    const scale =
        Math.min(
            heartWidth,
            heartHeight
        ) / 40;

    /*
       Main particles
    */

    for (
        let i = 0;
        i < 420;
        i++
    ) {

        const t =
            Math.random() * Math.PI * 2;

        const point =
            heartPoint(t, scale);

        const spread =
            (Math.random() - 0.5) *
            (scale * 1.6);

        heartParticles.push({

            x:
                heartWidth / 2 +
                point.x +
                spread,

            y:
                heartHeight / 2 +
                point.y +
                spread,

            size:
                1.2 +
                Math.random() * 3.2,

            color:
                colors[
                    Math.floor(
                        Math.random() *
                        colors.length
                    )
                ],

            phase:
                Math.random() *
                Math.PI *
                2,

            speed:
                0.8 +
                Math.random() * 1.8
        });
    }

    /*
       Additional small hearts
       around the outline
    */

    for (
        let i = 0;
        i < 90;
        i++
    ) {

        const t =
            Math.random() *
            Math.PI *
            2;

        const point =
            heartPoint(
                t,
                scale * (
                    1.02 +
                    Math.random() * 0.08
                )
            );

        heartParticles.push({

            x:
                heartWidth / 2 +
                point.x,

            y:
                heartHeight / 2 +
                point.y,

            size:
                2 +
                Math.random() * 3,

            color:
                colors[
                    Math.floor(
                        Math.random() *
                        colors.length
                    )
                ],

            phase:
                Math.random() *
                Math.PI *
                2,

            speed:
                0.7 +
                Math.random() * 1.2
        });
    }
}


/* =========================================================
   DRAW SMALL HEART
========================================================= */

function drawSmallHeart(
    x,
    y,
    size,
    color,
    alpha
) {

    ctx.save();

    ctx.translate(x, y);

    ctx.globalAlpha = alpha;

    ctx.fillStyle = color;

    ctx.shadowColor = color;

    ctx.shadowBlur = size * 4;

    ctx.beginPath();

    const s = size;

    ctx.moveTo(0, s * 0.35);

    ctx.bezierCurveTo(
        -s * 1.5,
        -s * 0.55,
        -s * 0.9,
        -s * 1.25,
        0,
        -s * 0.45
    );

    ctx.bezierCurveTo(
        s * 0.9,
        -s * 1.25,
        s * 1.5,
        -s * 0.55,
        0,
        s * 0.35
    );

    ctx.fill();

    ctx.restore();
}


/* =========================================================
   DRAW CENTRAL HEART
========================================================= */

function drawHeart() {

    if (!ctx) {
        return;
    }

    ctx.clearRect(
        0,
        0,
        heartWidth,
        heartHeight
    );

    const colors =
        themeColors[currentTheme].heart;

    const time =
        performance.now() / 1000;

    /*
       Soft central glow
    */

    const gradient =
        ctx.createRadialGradient(
            heartWidth / 2,
            heartHeight / 2,
            10,
            heartWidth / 2,
            heartHeight / 2,
            Math.min(
                heartWidth,
                heartHeight
            ) * 0.42
        );

    gradient.addColorStop(
        0,
        hexToRgba(colors[0], 0.12)
    );

    gradient.addColorStop(
        0.45,
        hexToRgba(colors[1], 0.05)
    );

    gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.arc(
        heartWidth / 2,
        heartHeight / 2,
        Math.min(
            heartWidth,
            heartHeight
        ) * 0.45,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
       Draw particles
    */

    heartParticles.forEach(
        (particle) => {

            const pulse =
                1 +
                Math.sin(
                    time * particle.speed +
                    particle.phase
                ) * 0.25;

            drawSmallHeart(
                particle.x,
                particle.y,
                particle.size * pulse,
                particle.color,
                0.55 +
                pulse * 0.25
            );
        }
    );


    /*
       Draw thin glowing heart outline
       behind the particles.
    */

    const scale =
        Math.min(
            heartWidth,
            heartHeight
        ) / 40;

    ctx.save();

    ctx.beginPath();

    for (
        let i = 0;
        i <= 200;
        i++
    ) {

        const t =
            (i / 200) *
            Math.PI *
            2;

        const point =
            heartPoint(t, scale);

        const x =
            heartWidth / 2 +
            point.x;

        const y =
            heartHeight / 2 +
            point.y;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.closePath();

    const lineGradient =
        ctx.createLinearGradient(
            0,
            0,
            heartWidth,
            heartHeight
        );

    lineGradient.addColorStop(
        0,
        colors[0]
    );

    lineGradient.addColorStop(
        0.5,
        colors[1]
    );

    lineGradient.addColorStop(
        1,
        colors[2]
    );

    ctx.strokeStyle =
        lineGradient;

    ctx.lineWidth = 1.5;

    ctx.shadowColor =
        colors[0];

    ctx.shadowBlur = 14;

    ctx.globalAlpha = 0.55;

    ctx.stroke();

    ctx.restore();


    requestAnimationFrame(
        drawHeart
    );
}


/* =========================================================
   HEX → RGBA
========================================================= */

function hexToRgba(
    hex,
    alpha
) {

    const clean =
        hex.replace("#", "");

    const r =
        parseInt(
            clean.substring(0, 2),
            16
        );

    const g =
        parseInt(
            clean.substring(2, 4),
            16
        );

    const b =
        parseInt(
            clean.substring(4, 6),
            16
        );

    return `
        rgba(
            ${r},
            ${g},
            ${b},
            ${alpha}
        )
    `;
}


/* =========================================================
   INITIALIZE
========================================================= */

function init() {

    document.body.setAttribute(
        "data-theme",
        currentTheme
    );

    setupThemeButtons();

    createStars();

    updateStars();

    resizeCanvas();

    drawHeart();

    document
        .querySelectorAll(".theme-btn")
        .forEach((button) => {

            button.classList.toggle(
                "active",
                button.dataset.theme ===
                currentTheme
            );
        });
}


/* =========================================================
   EVENTS
========================================================= */

window.addEventListener(
    "resize",
    resizeCanvas
);

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        init
    );

} else {

    init();
}
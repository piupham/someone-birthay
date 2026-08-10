"use strict";

/* =====================================================
   THEME DATA
===================================================== */

const themes = {
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
            "#ffcc00",
            "#ff6600",
            "#ff7733",
            "#e67e22"
        ]
    },

    cyber: {
        colors: [
            "#00f2fe",
            "#4facfe",
            "#00d2ff",
            "#a18cd1",
            "#38f9d7",
            "#00c6ff"
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


/* =====================================================
   CURRENT THEME
===================================================== */

let currentTheme =
    localStorage.getItem("heartfill_theme");

if (!themes[currentTheme]) {
    currentTheme = "midnight";
}

document.body.dataset.theme =
    currentTheme;


/* =====================================================
   THEME BUTTONS
===================================================== */

const themeButtons =
    document.querySelectorAll(".theme-btn");

function updateThemeButtons() {

    themeButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.theme === currentTheme
        );

    });
}

themeButtons.forEach(button => {

    button.addEventListener("click", () => {

        const theme =
            button.dataset.theme;

        if (!themes[theme]) {
            return;
        }

        currentTheme = theme;

        document.body.dataset.theme =
            currentTheme;

        localStorage.setItem(
            "heartfill_theme",
            currentTheme
        );

        updateThemeButtons();

        createHeart();

    });

});

updateThemeButtons();


/* =====================================================
   STARS
===================================================== */

const stars =
    document.getElementById("stars");

function createStars() {

    stars.innerHTML = "";

    const amount =
        window.innerWidth <= 700
            ? 75
            : 140;

    for (let i = 0; i < amount; i++) {

        const star =
            document.createElement("span");

        star.className =
            Math.random() < 0.15
                ? "star big"
                : "star";

        star.style.left =
            Math.random() * 100 + "%";

        star.style.top =
            Math.random() * 100 + "%";

        star.style.setProperty(
            "--duration",
            1.5 + Math.random() * 3 + "s"
        );

        star.style.setProperty(
            "--float-duration",
            6 + Math.random() * 10 + "s"
        );

        star.style.setProperty(
            "--delay",
            -Math.random() * 5 + "s"
        );

        star.style.setProperty(
            "--move-x",
            Math.random() * 60 - 30 + "px"
        );

        star.style.setProperty(
            "--move-y",
            Math.random() * 60 - 30 + "px"
        );

        stars.appendChild(star);
    }
}

createStars();

window.addEventListener(
    "resize",
    createStars
);


/* =====================================================
   CANVAS
===================================================== */

const canvas =
    document.getElementById("heartCanvas");

const ctx =
    canvas.getContext("2d");

let width = 0;
let height = 0;

let particles = [];


/* =====================================================
   RESIZE CANVAS
===================================================== */

function resizeCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    const ratio =
        window.devicePixelRatio || 1;

    width =
        rect.width;

    height =
        rect.height;

    canvas.width =
        Math.floor(width * ratio);

    canvas.height =
        Math.floor(height * ratio);

    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );

    createHeart();
}

window.addEventListener(
    "resize",
    resizeCanvas
);


/* =====================================================
   HEART EQUATION
===================================================== */

function heartPoint(t, scale) {

    const x =
        16 * Math.pow(Math.sin(t), 3);

    const y =
        13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t);

    return {
        x: x * scale,
        y: -y * scale
    };
}


/* =====================================================
   PARTICLE CLASS
===================================================== */

class Particle {

    constructor(x, y, color) {

        this.baseX = x;
        this.baseY = y;

        this.x = x;
        this.y = y;

        this.color = color;

        this.size =
            0.8 + Math.random() * 2.2;

        this.phase =
            Math.random() * Math.PI * 2;

        this.speed =
            0.5 + Math.random() * 1.5;

        this.alpha =
            0.35 + Math.random() * 0.65;
    }

    update(time) {

        const wave =
            Math.sin(
                time * 0.002 * this.speed +
                this.phase
            );

        const wave2 =
            Math.cos(
                time * 0.0015 +
                this.phase
            );

        this.x =
            this.baseX +
            wave * 1.8;

        this.y =
            this.baseY +
            wave2 * 1.8;
    }

    draw() {

        ctx.save();

        ctx.globalAlpha =
            this.alpha;

        ctx.fillStyle =
            this.color;

        ctx.shadowColor =
            this.color;

        ctx.shadowBlur = 10;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }
}


/* =====================================================
   CREATE HEART
===================================================== */

function createHeart() {

    particles = [];

    if (width <= 0 || height <= 0) {
        return;
    }

    const centerX =
        width / 2;

    const centerY =
        height / 2 + 35;

    const scale =
        Math.min(width, height) / 40;

    const colors =
        themes[currentTheme].colors;


    /* Outer heart */

    for (
        let t = 0;
        t < Math.PI * 2;
        t += 0.025
    ) {

        const point =
            heartPoint(t, scale);

        particles.push(
            new Particle(
                centerX + point.x,
                centerY + point.y,
                colors[
                    Math.floor(
                        Math.random() *
                        colors.length
                    )
                ]
            )
        );
    }


    /* Inside heart */

    for (let i = 0; i < 1200; i++) {

        const t =
            Math.random() *
            Math.PI * 2;

        const point =
            heartPoint(t, scale);

        const factor =
            Math.sqrt(
                Math.random()
            ) * 0.96;

        const x =
            centerX +
            point.x * factor;

        const y =
            centerY +
            point.y * factor;

        particles.push(
            new Particle(
                x,
                y,
                colors[
                    Math.floor(
                        Math.random() *
                        colors.length
                    )
                ]
            )
        );
    }
}


/* =====================================================
   DRAW HEART OUTLINE
===================================================== */

function drawHeartOutline() {

    if (width <= 0 || height <= 0) {
        return;
    }

    const centerX =
        width / 2;

    const centerY =
        height / 2 + 35;

    const scale =
        Math.min(width, height) / 40;

    const colors =
        themes[currentTheme].colors;

    ctx.save();

    ctx.beginPath();

    for (
        let t = 0;
        t <= Math.PI * 2;
        t += 0.02
    ) {

        const point =
            heartPoint(t, scale);

        const x =
            centerX + point.x;

        const y =
            centerY + point.y;

        if (t === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.closePath();

    ctx.strokeStyle =
        colors[0];

    ctx.lineWidth = 2;

    ctx.globalAlpha = 0.9;

    ctx.shadowColor =
        colors[0];

    ctx.shadowBlur = 30;

    ctx.stroke();

    ctx.restore();
}


/* =====================================================
   ANIMATION
===================================================== */

function animate(time) {

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    drawHeartOutline();

    for (const particle of particles) {

        particle.update(time);

        particle.draw();
    }

    requestAnimationFrame(
        animate
    );
}


/* =====================================================
   START
===================================================== */

resizeCanvas();

requestAnimationFrame(
    animate
);

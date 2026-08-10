"use strict";

/* =====================================================
   THEME
===================================================== */

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
            "#ffcc00",
            "#ff6600",
            "#ff7733"
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

let currentTheme =
    localStorage.getItem("heartfill_theme") || "midnight";

if (!themePalettes[currentTheme]) {
    currentTheme = "midnight";
}

document.body.setAttribute("data-theme", currentTheme);


/* =====================================================
   THEME BUTTONS
===================================================== */

document.querySelectorAll(".theme-btn").forEach(button => {

    button.addEventListener("click", () => {

        const theme = button.dataset.theme;

        if (!themePalettes[theme]) {
            return;
        }

        currentTheme = theme;

        document.body.setAttribute(
            "data-theme",
            currentTheme
        );

        localStorage.setItem(
            "heartfill_theme",
            currentTheme
        );

        document.querySelectorAll(".theme-btn")
            .forEach(btn => {
                btn.classList.toggle(
                    "active",
                    btn.dataset.theme === currentTheme
                );
            });
    });
});


/* =====================================================
   STARS AROUND THE HEART
===================================================== */

const starsContainer =
    document.getElementById("stars");

function createStars() {

    starsContainer.innerHTML = "";

    const amount =
        window.innerWidth < 700 ? 70 : 130;

    for (let i = 0; i < amount; i++) {

        const star =
            document.createElement("span");

        star.className =
            Math.random() < 0.18
                ? "star big"
                : "star";

        star.style.left =
            Math.random() * 100 + "%";

        star.style.top =
            Math.random() * 100 + "%";

        star.style.setProperty(
            "--duration",
            (1.5 + Math.random() * 3) + "s"
        );

        star.style.setProperty(
            "--float-duration",
            (5 + Math.random() * 10) + "s"
        );

        star.style.setProperty(
            "--delay",
            (-Math.random() * 5) + "s"
        );

        star.style.setProperty(
            "--move-x",
            (Math.random() * 60 - 30) + "px"
        );

        star.style.setProperty(
            "--move-y",
            (Math.random() * 60 - 30) + "px"
        );

        starsContainer.appendChild(star);
    }
}

createStars();

window.addEventListener(
    "resize",
    createStars
);


/* =====================================================
   HEART CANVAS
===================================================== */

const canvas =
    document.getElementById("heartCanvas");

const ctx =
    canvas.getContext("2d");

let width;
let height;
let particles = [];


/* =====================================================
   CANVAS SIZE
===================================================== */

function resizeCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    const ratio =
        window.devicePixelRatio || 1;

    width = rect.width;
    height = rect.height;

    canvas.width =
        width * ratio;

    canvas.height =
        height * ratio;

    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );

    createHeartParticles();
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
   PARTICLE
===================================================== */

class Particle {

    constructor(x, y, color) {

        this.baseX = x;
        this.baseY = y;

        this.x = x;
        this.y = y;

        this.color = color;

        this.size =
            1 + Math.random() * 2.2;

        this.angle =
            Math.random() * Math.PI * 2;

        this.speed =
            0.005 + Math.random() * 0.015;

        this.offset =
            Math.random() * Math.PI * 2;

        this.alpha =
            0.35 + Math.random() * 0.65;
    }

    update(time) {

        this.angle += this.speed;

        const wave =
            Math.sin(
                time * 0.002 +
                this.offset
            );

        this.x =
            this.baseX +
            Math.cos(this.angle) *
            wave *
            2.5;

        this.y =
            this.baseY +
            Math.sin(this.angle) *
            wave *
            2.5;
    }

    draw() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.globalAlpha =
            this.alpha;

        ctx.fillStyle =
            this.color;

        ctx.shadowBlur = 12;

        ctx.shadowColor =
            this.color;

        ctx.fill();

        ctx.globalAlpha = 1;

        ctx.shadowBlur = 0;
    }
}


/* =====================================================
   CREATE HEART PARTICLES
===================================================== */

function createHeartParticles() {

    particles = [];

    const centerX =
        width / 2;

    const centerY =
        height / 2 + 30;

    const scale =
        Math.min(
            width,
            height
        ) / 38;

    const colors =
        themePalettes[currentTheme].colors;

    /*
       Tạo nhiều lớp hạt bên trong trái tim
    */

    for (
        let t = 0;
        t < Math.PI * 2;
        t += 0.035
    ) {

        const point =
            heartPoint(t, scale);

        const x =
            centerX + point.x;

        const y =
            centerY + point.y;

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

    /*
       Các hạt phía trong trái tim
    */

    for (let i = 0; i < 950; i++) {

        const t =
            Math.random() *
            Math.PI * 2;

        const point =
            heartPoint(t, scale);

        const ratio =
            Math.sqrt(
                Math.random()
            ) * 0.95;

        const x =
            centerX +
            point.x * ratio;

        const y =
            centerY +
            point.y * ratio;

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
   DRAW HEART GLOW
===================================================== */

function drawHeartGlow() {

    const centerX =
        width / 2;

    const centerY =
        height / 2 + 30;

    const scale =
        Math.min(
            width,
            height
        ) / 38;

    const colors =
        themePalettes[currentTheme].colors;

    ctx.save();

    ctx.beginPath();

    for (
        let t = 0;
        t <= Math.PI * 2;
        t += 0.025
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

    ctx.shadowBlur = 30;

    ctx.shadowColor =
        colors[0];

    ctx.stroke();

    ctx.restore();
}


/* =====================================================
   ANIMATION
===================================================== */

let startTime =
    performance.now();

function animate(time) {

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    drawHeartGlow();

    particles.forEach(
        particle => {
            particle.update(time);
            particle.draw();
        }
    );

    requestAnimationFrame(
        animate
    );
}


/* =====================================================
   INITIALIZE
===================================================== */

resizeCanvas();

requestAnimationFrame(
    animate
);


/* =====================================================
   UPDATE HEART COLORS WHEN THEME CHANGES
===================================================== */

document.querySelectorAll(".theme-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                setTimeout(() => {
                    createHeartParticles();
                }, 50);

            }
        );

    });

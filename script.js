/* =========================================================
   BIRTHDAY PAGE
   Central heart particle animation + stars + themes
========================================================= */


/* =========================================================
   THEME
========================================================= */

const themeButtons = document.querySelectorAll(".theme-btn");

function setTheme(theme) {
    document.body.setAttribute("data-theme", theme);

    themeButtons.forEach((button) => {
        button.classList.toggle(
            "active",
            button.dataset.theme === theme
        );
    });

    drawHeart(true);
}

themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        setTheme(button.dataset.theme);
    });
});


/* Cyber is the default theme */
setTheme("cyber");


/* =========================================================
   STARS
========================================================= */

const starsContainer = document.getElementById("stars");

function createStars() {
    starsContainer.innerHTML = "";

    const count = 24;

    for (let i = 0; i < count; i++) {
        const star = document.createElement("div");

        star.className = "star";

        const size = random(8, 30);
        const left = random(2, 98);
        const top = random(3, 94);

        const duration = random(5, 10);
        const twinkle = random(2, 5);

        const moveX = random(-18, 18);
        const moveY = random(-18, 18);

        const opacity = random(0.3, 0.9);

        star.style.setProperty("--size", `${size}px`);
        star.style.left = `${left}%`;
        star.style.top = `${top}%`;

        star.style.setProperty(
            "--duration",
            `${duration}s`
        );

        star.style.setProperty(
            "--twinkle",
            `${twinkle}s`
        );

        star.style.setProperty(
            "--move-x",
            `${moveX}px`
        );

        star.style.setProperty(
            "--move-y",
            `${moveY}px`
        );

        star.style.setProperty(
            "--opacity",
            opacity
        );

        star.style.animationDelay =
            `${random(0, 5)}s`;

        starsContainer.appendChild(star);
    }
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

createStars();


/* =========================================================
   CENTRAL HEART
========================================================= */

const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

let particles = [];

let heartWidth = 270;
let heartHeight = 270;

let animationStart = performance.now();

const PARTICLE_COUNT = 950;


/* =========================================================
   CANVAS SIZE
========================================================= */

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();

    const size = Math.min(
        rect.width,
        rect.height
    );

    const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
    );

    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    heartWidth = size;
    heartHeight = size;

    createHeartParticles();

    animationStart = performance.now();
}

window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================================================
   HEART MATHEMATICAL SHAPE
========================================================= */

/*
    Parametric heart:

        x = 16 sin³(t)

        y =
        13 cos(t)
        - 5 cos(2t)
        - 2 cos(3t)
        - cos(4t)

    Sau đó chuẩn hóa về canvas hình vuông.

    Vì X và Y cùng dùng một scale nên trái tim
    luôn giữ đúng tỷ lệ và không bị kéo dài.
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


/* =========================================================
   CREATE PARTICLES
========================================================= */

function createHeartParticles() {
    particles = [];

    const size = Math.min(
        heartWidth,
        heartHeight
    );

    /*
        Heart is intentionally smaller than
        the canvas so the text has enough space.
    */

    const scale = size / 34;

    const centerX = size / 2;
    const centerY = size / 2 + size * 0.035;

    for (let i = 0; i < PARTICLE_COUNT; i++) {

        const t =
            Math.random() *
            Math.PI *
            2;

        /*
            sqrt(random) helps distribute
            particles throughout the inside.
        */
        const r =
            Math.sqrt(Math.random());

        const point =
            heartPoint(t, scale * r);

        const targetX =
            centerX + point.x;

        const targetY =
            centerY + point.y;

        /*
            Start particles around the canvas,
            then gradually fly into the heart.
        */
        const angle =
            Math.random() *
            Math.PI *
            2;

        const distance =
            random(
                size * 0.25,
                size * 0.65
            );

        const startX =
            centerX +
            Math.cos(angle) *
            distance;

        const startY =
            centerY +
            Math.sin(angle) *
            distance;

        particles.push({
            x: startX,
            y: startY,

            targetX,
            targetY,

            size: random(0.7, 1.8),

            delay: random(0, 900),

            speed: random(
                0.8,
                1.25
            ),

            alpha: random(
                0.45,
                0.95
            ),

            phase:
                Math.random() *
                Math.PI *
                2
        });
    }
}


/* =========================================================
   COLOR
========================================================= */

function getHeartColors() {
    const styles =
        getComputedStyle(document.body);

    return {
        first:
            styles
                .getPropertyValue("--heart-1")
                .trim(),

        second:
            styles
                .getPropertyValue("--heart-2")
                .trim(),

        glow:
            styles
                .getPropertyValue("--heart-glow")
                .trim()
    };
}


/* =========================================================
   DRAW HEART
========================================================= */

function drawHeart(forceReset = false) {

    if (forceReset) {
        createHeartParticles();
        animationStart = performance.now();
    }

    requestAnimationFrame(animateHeart);
}


/* =========================================================
   ANIMATION
========================================================= */

function animateHeart(now) {

    const size =
        Math.min(
            heartWidth,
            heartHeight
        );

    ctx.clearRect(
        0,
        0,
        size,
        size
    );

    const colors =
        getHeartColors();

    const elapsed =
        now - animationStart;

    /*
        Reveal duration.
        The heart gradually appears,
        just like the original effect.
    */
    const revealDuration = 2200;

    for (const particle of particles) {

        const localTime =
            Math.max(
                0,
                elapsed - particle.delay
            );

        const progress =
            Math.min(
                1,
                localTime /
                (revealDuration * particle.speed)
            );

        /*
            Smooth easing.
        */
        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );

        particle.x +=
            (
                particle.targetX -
                particle.x
            ) *
            0.045 *
            particle.speed;

        particle.y +=
            (
                particle.targetY -
                particle.y
            ) *
            0.045 *
            particle.speed;

        /*
            Before its reveal time,
            keep particle almost invisible.
        */
        const visibility =
            Math.min(
                1,
                progress * 1.5
            );

        /*
            Small breathing movement
            after particles reach the heart.
        */
        const pulse =
            progress >= 1
                ? Math.sin(
                    now * 0.002 +
                    particle.phase
                ) * 0.7
                : 0;

        const x =
            particle.x +
            pulse;

        const y =
            particle.y;

        const radius =
            particle.size *
            (
                0.75 +
                eased * 0.45
            );

        const alpha =
            particle.alpha *
            visibility;

        if (alpha <= 0) {
            continue;
        }

        /*
            Soft particle glow
        */
        ctx.beginPath();

        ctx.shadowBlur = 8;

        ctx.shadowColor =
            colors.glow;

        const gradient =
            ctx.createRadialGradient(
                x,
                y,
                0,
                x,
                y,
                radius * 2.5
            );

        gradient.addColorStop(
            0,
            colors.first
        );

        gradient.addColorStop(
            0.65,
            colors.second
        );

        gradient.addColorStop(
            1,
            "transparent"
        );

        ctx.fillStyle =
            gradient;

        ctx.globalAlpha =
            alpha;

        ctx.arc(
            x,
            y,
            radius * 2.2,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /*
            Main particle core
        */
        ctx.beginPath();

        ctx.shadowBlur = 5;

        ctx.fillStyle =
            progress > 0.5
                ? colors.second
                : colors.first;

        ctx.globalAlpha =
            Math.min(
                1,
                alpha * 1.15
            );

        ctx.arc(
            x,
            y,
            radius,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    /*
        Gentle glow around the finished heart.
    */
    if (elapsed > revealDuration) {

        const pulse =
            0.5 +
            Math.sin(
                now * 0.002
            ) * 0.12;

        ctx.save();

        ctx.globalAlpha =
            0.12 * pulse;

        ctx.shadowColor =
            colors.glow;

        ctx.shadowBlur = 25;

        ctx.strokeStyle =
            colors.first;

        ctx.lineWidth = 1.5;

        drawHeartOutline(
            size
        );

        ctx.restore();
    }

    requestAnimationFrame(
        animateHeart
    );
}


/* =========================================================
   HEART OUTLINE
========================================================= */

function drawHeartOutline(size) {

    const scale =
        size / 34;

    const centerX =
        size / 2;

    const centerY =
        size / 2 +
        size * 0.035;

    ctx.beginPath();

    const steps = 160;

    for (let i = 0; i <= steps; i++) {

        const t =
            (i / steps) *
            Math.PI *
            2;

        const point =
            heartPoint(
                t,
                scale
            );

        const x =
            centerX + point.x;

        const y =
            centerY + point.y;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.closePath();
    ctx.stroke();
}


/* =========================================================
   START
========================================================= */

resizeCanvas();
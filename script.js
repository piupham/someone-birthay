/* =========================================================
   STAR FIELD
   ========================================================= */

const starsContainer = document.getElementById("stars");

const STAR_COUNT = 110;

for (let i = 0; i < STAR_COUNT; i++) {

    const star = document.createElement("div");

    star.className = "star";

    const size = Math.random() < 0.85
        ? Math.random() * 2 + 1
        : Math.random() * 3 + 2;

    const opacity = Math.random() * 0.55 + 0.25;

    const duration = Math.random() * 2.5 + 1.5;
    const floatDuration = Math.random() * 20 + 15;

    const delay = Math.random() * -8;

    const moveX = (Math.random() - 0.5) * 80;
    const moveY = (Math.random() - 0.5) * 80;

    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;

    star.style.setProperty("--size", `${size}px`);
    star.style.setProperty("--opacity", opacity);
    star.style.setProperty("--duration", `${duration}s`);
    star.style.setProperty("--float-duration", `${floatDuration}s`);
    star.style.setProperty("--delay", `${delay}s`);
    star.style.setProperty("--move-x", `${moveX}px`);
    star.style.setProperty("--move-y", `${moveY}px`);

    starsContainer.appendChild(star);
}


/* =========================================================
   HEART CANVAS
   ========================================================= */

const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;

let particles = [];

const heartContainer = document.getElementById("heartContainer");


function resizeCanvas() {

    const rect = heartContainer.getBoundingClientRect();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = rect.width;
    height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createHeart();
}


function heartX(t) {

    return 16 * Math.pow(Math.sin(t), 3);
}


function heartY(t) {

    return (
        13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t)
    );
}


function createHeart() {

    particles = [];

    /*
     * Giữ hình trái tim lớn, cân đối.
     * Không ép scale quá nhỏ để tránh mất phần đáy.
     */

    const scale = Math.min(width, height) / 35;

    const centerX = width / 2;
    const centerY = height / 2 + scale * 1.5;

    const particleCount = Math.min(
        950,
        Math.max(500, Math.floor(width * 1.15))
    );


    /* Viền trái tim */

    for (let i = 0; i < 280; i++) {

        const t = Math.random() * Math.PI * 2;

        const x = centerX + heartX(t) * scale;
        const y = centerY - heartY(t) * scale;

        particles.push({
            x,
            y,
            baseX: x,
            baseY: y,

            size: Math.random() * 1.5 + 0.8,

            alpha: Math.random() * 0.5 + 0.35,

            speed: Math.random() * 0.015 + 0.005,

            phase: Math.random() * Math.PI * 2,

            edge: true
        });
    }


    /* Hạt bên trong trái tim */

    let created = 0;

    while (created < particleCount) {

        const t = Math.random() * Math.PI * 2;

        const fill = Math.sqrt(Math.random());

        const x =
            centerX +
            heartX(t) * scale * fill;

        const y =
            centerY -
            heartY(t) * scale * fill;

        particles.push({
            x,
            y,
            baseX: x,
            baseY: y,

            size: Math.random() * 1.7 + 0.7,

            alpha: Math.random() * 0.65 + 0.2,

            speed: Math.random() * 0.02 + 0.004,

            phase: Math.random() * Math.PI * 2,

            edge: false
        });

        created++;
    }
}


function getParticleColor(index) {

    const theme = document.body.dataset.theme;

    if (theme === "golden") {
        return index % 2
            ? "255, 211, 106"
            : "255, 153, 0";
    }

    if (theme === "cyber") {
        return index % 2
            ? "105, 239, 255"
            : "79, 172, 254";
    }

    if (theme === "emerald") {
        return index % 2
            ? "102, 245, 196"
            : "150, 201, 61";
    }

    return index % 2
        ? "255, 123, 200"
        : "255, 0, 128";
}


let time = 0;


function animateHeart() {

    requestAnimationFrame(animateHeart);

    time += 0.015;

    ctx.clearRect(0, 0, width, height);


    particles.forEach((p, index) => {

        const pulse =
            Math.sin(time * 1.8 + p.phase) * 0.8;

        const driftX =
            Math.sin(time * p.speed * 40 + p.phase) * 1.2;

        const driftY =
            Math.cos(time * p.speed * 35 + p.phase) * 1.2;

        const x =
            p.baseX +
            driftX +
            pulse * 0.25;

        const y =
            p.baseY +
            driftY;

        const color = getParticleColor(index);

        const alpha =
            Math.max(
                0.08,
                Math.min(1, p.alpha + pulse * 0.05)
            );

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            p.size + pulse * 0.15,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(${color}, ${alpha})`;

        ctx.fill();
    });
}


window.addEventListener("resize", resizeCanvas);

resizeCanvas();

animateHeart();


/* =========================================================
   THEME SWITCHER
   ========================================================= */

const themeButtons =
    document.querySelectorAll(".theme-btn");


themeButtons.forEach(button => {

    button.addEventListener("click", () => {

        const theme =
            button.dataset.theme;

        document.body.dataset.theme =
            theme;


        themeButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
    });
});


/* =========================================================
   MUSIC
   ========================================================= */

const music =
    document.getElementById("birthdayMusic");

const musicButton =
    document.getElementById("musicButton");

const musicIcon =
    document.getElementById("musicIcon");


let musicStarted = false;


function updateMusicUI() {

    if (!music.paused) {

        musicButton.classList.add("playing");

        musicIcon.textContent = "♫";

    } else {

        musicButton.classList.remove("playing");

        musicIcon.textContent = "♪";
    }
}


async function startMusic() {

    try {

        await music.play();

        musicStarted = true;

        updateMusicUI();

    } catch (error) {

        /*
         * Trình duyệt chặn autoplay.
         * Khi người dùng click lần đầu,
         * nhạc sẽ được bật.
         */

        updateMusicUI();
    }
}


musicButton.addEventListener("click", async () => {

    if (music.paused) {

        await startMusic();

    } else {

        music.pause();

        updateMusicUI();
    }
});


/*
 * Thử autoplay khi mở trang.
 * Nếu trình duyệt chặn thì nút nhạc vẫn hoạt động.
 */

window.addEventListener("load", () => {

    setTimeout(() => {
        startMusic();
    }, 500);
});


/*
 * Một số trình duyệt cho phép phát nhạc
 * ngay sau tương tác đầu tiên của người dùng.
 */

document.addEventListener(
    "pointerdown",
    () => {

        if (!musicStarted) {
            startMusic();
        }

    },
    {
        once: true
    }
);

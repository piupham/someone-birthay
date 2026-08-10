/* =========================
   CANVAS HEART
========================= */

const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let dpr = Math.min(window.devicePixelRatio || 1, 2);

let particles = [];
let outlineParticles = [];

const particleCount = 620;
const outlineCount = 170;

let animationTime = 0;


/* =========================
   THEME COLORS
========================= */

const themes = {
    midnight: {
        particle1: "#ff7bc8",
        particle2: "#ff0080",
        particle3: "#c77dff",
        outline: "#ff7bc8"
    },

    golden: {
        particle1: "#ffd36a",
        particle2: "#ff9900",
        particle3: "#ff6b35",
        outline: "#ffd36a"
    },

    cyber: {
        particle1: "#69efff",
        particle2: "#00f2fe",
        particle3: "#4facfe",
        outline: "#69efff"
    },

    emerald: {
        particle1: "#66f5c4",
        particle2: "#00b09b",
        particle3: "#96c93d",
        outline: "#66f5c4"
    },

    velvet: {
        particle1: "#ff8fa6",
        particle2: "#ff0844",
        particle3: "#c0392b",
        outline: "#ff8fa6"
    }
};

let currentTheme = "midnight";


/* =========================
   HEART EQUATION
========================= */

function heartPoint(t, scale = 1) {
    const x = 16 * Math.pow(Math.sin(t), 3);

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


/* =========================
   RANDOM HEART POINT
========================= */

function randomHeartPoint() {

    const t = Math.random() * Math.PI * 2;

    const point = heartPoint(t);

    /*
        sqrt() giúp phân bố hạt đều hơn,
        tránh việc giữa tim quá rỗng.
    */
    const fill = Math.sqrt(Math.random());

    return {
        x: point.x * fill,
        y: point.y * fill,
        size: 0.8 + Math.random() * 2.2,
        alpha: 0.25 + Math.random() * 0.65,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.4
    };
}


/* =========================
   CREATE PARTICLES
========================= */

function createParticles() {

    particles = [];
    outlineParticles = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push(randomHeartPoint());
    }

    for (let i = 0; i < outlineCount; i++) {

        const t =
            (i / outlineCount) *
            Math.PI *
            2;

        const point = heartPoint(t);

        outlineParticles.push({
            x: point.x,
            y: point.y,
            phase: Math.random() * Math.PI * 2
        });
    }
}


/* =========================
   RESIZE
========================= */

function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    width = rect.width;
    height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );
}

window.addEventListener("resize", resizeCanvas);


/* =========================
   DRAW HEART OUTLINE
========================= */

function drawHeartOutline(cx, cy, scale) {

    const theme = themes[currentTheme];

    ctx.beginPath();

    for (let i = 0; i <= 160; i++) {

        const t =
            (i / 160) *
            Math.PI *
            2;

        const p = heartPoint(t, scale);

        const x = cx + p.x;
        const y = cy + p.y;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.closePath();

    ctx.strokeStyle = theme.outline;

    ctx.globalAlpha = 0.42;

    ctx.lineWidth = 1.2;

    ctx.shadowBlur = 12;

    ctx.shadowColor = theme.outline;

    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
}


/* =========================
   DRAW PARTICLES
========================= */

function drawParticles(cx, cy, scale) {

    const theme = themes[currentTheme];

    for (const p of particles) {

        const pulse =
            Math.sin(
                animationTime * p.speed +
                p.phase
            ) * 0.7;

        const x =
            cx +
            p.x * scale +
            Math.sin(
                animationTime * 0.7 +
                p.phase
            ) * 1.4;

        const y =
            cy +
            p.y * scale +
            Math.cos(
                animationTime * 0.55 +
                p.phase
            ) * 1.4;

        const size =
            Math.max(
                0.4,
                p.size + pulse * 0.25
            );

        let color;

        const random = p.phase % 3;

        if (random < 1) {
            color = theme.particle1;
        } else if (random < 2) {
            color = theme.particle2;
        } else {
            color = theme.particle3;
        }

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = color;

        ctx.globalAlpha =
            p.alpha *
            (0.85 + pulse * 0.08);

        ctx.shadowBlur = size > 2 ? 7 : 3;

        ctx.shadowColor = color;

        ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
}


/* =========================
   CENTER GLOW
========================= */

function drawCenterGlow(cx, cy, scale) {

    const theme = themes[currentTheme];

    const gradient = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        scale * 9
    );

    gradient.addColorStop(
        0,
        theme.particle1
    );

    gradient.addColorStop(
        0.25,
        theme.particle2
    );

    gradient.addColorStop(
        1,
        "transparent"
    );

    ctx.globalAlpha = 0.18;

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.arc(
        cx,
        cy,
        scale * 9,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.globalAlpha = 1;
}


/* =========================
   ANIMATION
========================= */

function animate() {

    animationTime += 0.016;

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    /*
        Scale nhỏ hơn trước để
        toàn bộ trái tim nằm trong khung.
    */
    const scale =
        Math.min(
            width / 36,
            height / 31
        ) * 0.88;

    const cx = width / 2;

    /*
        Dịch tim xuống một chút
        để không đè lên chữ.
    */
    const cy =
        height / 2 + scale * 1.5;

    drawCenterGlow(
        cx,
        cy,
        scale
    );

    drawHeartOutline(
        cx,
        cy,
        scale
    );

    drawParticles(
        cx,
        cy,
        scale
    );

    requestAnimationFrame(animate);
}


/* =========================
   STARS
========================= */

const starsContainer =
    document.getElementById("stars");

function createStars() {

    starsContainer.innerHTML = "";

    const count =
        window.innerWidth < 700
            ? 65
            : 105;

    for (let i = 0; i < count; i++) {

        const star =
            document.createElement("div");

        star.className = "star";

        const size =
            Math.random() < 0.85
                ? 1 + Math.random() * 2
                : 2.5 + Math.random() * 2;

        star.style.left =
            Math.random() * 100 + "%";

        star.style.top =
            Math.random() * 100 + "%";

        star.style.setProperty(
            "--size",
            size + "px"
        );

        star.style.setProperty(
            "--opacity",
            0.25 + Math.random() * 0.7
        );

        star.style.setProperty(
            "--duration",
            1.5 + Math.random() * 3 + "s"
        );

        star.style.setProperty(
            "--float-duration",
            8 + Math.random() * 15 + "s"
        );

        star.style.setProperty(
            "--delay",
            -Math.random() * 5 + "s"
        );

        star.style.setProperty(
            "--move-x",
            (Math.random() - 0.5) * 35 + "px"
        );

        star.style.setProperty(
            "--move-y",
            (Math.random() - 0.5) * 35 + "px"
        );

        starsContainer.appendChild(star);
    }
}


/* =========================
   THEME SWITCHING
========================= */

const themeButtons =
    document.querySelectorAll(".theme-btn");

themeButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const theme =
                button.dataset.theme;

            currentTheme = theme;

            document.body.dataset.theme =
                theme;

            themeButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");
        }
    );
});


/* =========================
   MUSIC
========================= */

const music =
    document.getElementById("birthdayMusic");

const musicButton =
    document.getElementById("musicButton");

let musicStarted = false;


/*
    Trình duyệt hiện nay thường chặn
    autoplay có âm thanh.

    Code sẽ thử tự phát ngay khi mở web.
*/
async function tryPlayMusic() {

    try {

        music.volume = 0.45;

        await music.play();

        musicStarted = true;

        musicButton.classList.add("playing");

    } catch (error) {

        /*
            Nếu browser chặn autoplay,
            chờ người dùng tương tác.
        */

        musicStarted = false;

        musicButton.classList.remove("playing");
    }
}


/* Nút bật/tắt nhạc */

musicButton.addEventListener(
    "click",
    async () => {

        if (music.paused) {

            try {

                music.volume = 0.45;

                await music.play();

                musicButton.classList.add(
                    "playing"
                );

            } catch (error) {

                console.log(
                    "Không thể phát nhạc:",
                    error
                );
            }

        } else {

            music.pause();

            musicButton.classList.remove(
                "playing"
            );
        }
    }
);


/*
    Nếu autoplay bị chặn,
    lần click đầu tiên vào trang sẽ
    thử bật nhạc.
*/

document.addEventListener(
    "click",
    () => {

        if (!musicStarted && music.paused) {
            tryPlayMusic();
        }

    },
    {
        once: true
    }
);


/* =========================
   START
========================= */

resizeCanvas();

createParticles();

createStars();

animate();

tryPlayMusic();

window.addEventListener(
    "resize",
    createStars
);

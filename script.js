/* =========================================================
   STAR FIELD
   ========================================================= */

const starsContainer =
    document.getElementById("stars");

const STAR_COUNT = 115;

for (let i = 0; i < STAR_COUNT; i++) {

    const star =
        document.createElement("div");

    star.className = "star";

    const size =
        Math.random() < 0.85
            ? Math.random() * 2 + 1
            : Math.random() * 3 + 2;

    const opacity =
        Math.random() * 0.55 + 0.25;

    const duration =
        Math.random() * 2.5 + 1.5;

    const floatDuration =
        Math.random() * 20 + 15;

    const delay =
        Math.random() * -8;

    const moveX =
        (Math.random() - 0.5) * 80;

    const moveY =
        (Math.random() - 0.5) * 80;

    star.style.left =
        `${Math.random() * 100}%`;

    star.style.top =
        `${Math.random() * 100}%`;

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
        "--float-duration",
        `${floatDuration}s`
    );

    star.style.setProperty(
        "--delay",
        `${delay}s`
    );

    star.style.setProperty(
        "--move-x",
        `${moveX}px`
    );

    star.style.setProperty(
        "--move-y",
        `${moveY}px`
    );

    starsContainer.appendChild(star);
}


/* =========================================================
   HEART CANVAS
   ========================================================= */

const canvas =
    document.getElementById("heartCanvas");

const ctx =
    canvas.getContext("2d");

const heartContainer =
    document.getElementById("heartContainer");

let width = 0;
let height = 0;

let heartParticles = [];
let sparkleParticles = [];

let time = 0;


/* =========================================================
   HEART EQUATION
   ========================================================= */

function heartX(t) {

    return (
        16 *
        Math.pow(
            Math.sin(t),
            3
        )
    );
}

function heartY(t) {

    return (
        13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t)
    );
}


/* =========================================================
   THEME COLORS
   ========================================================= */

function getHeartColors() {

    const theme =
        document.body.dataset.theme;

    if (theme === "golden") {

        return [
            "255, 211, 106",
            "255, 153, 0",
            "255, 235, 170"
        ];
    }

    if (theme === "cyber") {

        return [
            "105, 239, 255",
            "79, 172, 254",
            "190, 250, 255"
        ];
    }

    if (theme === "emerald") {

        return [
            "102, 245, 196",
            "150, 201, 61",
            "200, 255, 225"
        ];
    }

    return [
        "255, 123, 200",
        "255, 0, 128",
        "255, 190, 230"
    ];
}


/* =========================================================
   RESIZE
   ========================================================= */

function resizeCanvas() {

    const rect =
        heartContainer.getBoundingClientRect();

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    width = rect.width;
    height = rect.height;

    canvas.width =
        Math.floor(width * dpr);

    canvas.height =
        Math.floor(height * dpr);

    canvas.style.width =
        `${width}px`;

    canvas.style.height =
        `${height}px`;

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    createHeart();
    createSparkles();
}


/* =========================================================
   CREATE HEART
   ========================================================= */

function createHeart() {

    heartParticles = [];

    /*
     * Scale được tính riêng theo chiều rộng
     * và chiều cao để trái tim luôn nằm
     * hoàn toàn trong canvas.
     */

    const scale =
        Math.min(
            width / 36,
            height / 36
        );

    const centerX =
        width / 2;

    /*
     * Dịch nhẹ lên trên để phần đáy
     * luôn còn khoảng trống.
     */

    const centerY =
        height / 2 + scale * 1.5;


    /* -----------------------------------------------------
       HEART OUTLINE
       ----------------------------------------------------- */

    const outlineCount = 360;

    for (let i = 0; i < outlineCount; i++) {

        const t =
            Math.random() *
            Math.PI *
            2;

        const x =
            centerX +
            heartX(t) * scale;

        const y =
            centerY -
            heartY(t) * scale;

        heartParticles.push({

            x: x,
            y: y,

            baseX: x,
            baseY: y,

            size:
                Math.random() * 1.6 + 0.7,

            alpha:
                Math.random() * 0.4 + 0.5,

            phase:
                Math.random() *
                Math.PI *
                2,

            speed:
                Math.random() * 0.5 + 0.5,

            edge: true
        });
    }


    /* -----------------------------------------------------
       HEART INSIDE
       ----------------------------------------------------- */

    const particleCount =
        Math.min(
            1050,
            Math.max(
                650,
                Math.floor(
                    width * 1.45
                )
            )
        );

    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const t =
            Math.random() *
            Math.PI *
            2;

        const fill =
            Math.sqrt(
                Math.random()
            );

        const x =
            centerX +
            heartX(t) *
            scale *
            fill;

        const y =
            centerY -
            heartY(t) *
            scale *
            fill;

        heartParticles.push({

            x: x,
            y: y,

            baseX: x,
            baseY: y,

            size:
                Math.random() * 1.8 + 0.65,

            alpha:
                Math.random() * 0.6 + 0.25,

            phase:
                Math.random() *
                Math.PI *
                2,

            speed:
                Math.random() * 0.8 + 0.4,

            edge: false
        });
    }
}


/* =========================================================
   FLOATING SPARKLES AROUND HEART
   ========================================================= */

function createSparkles() {

    sparkleParticles = [];

    /*
     * Chỉ tạo sao / hạt sáng.
     * Không tạo trái tim bay.
     */

    const count = 34;

    for (let i = 0; i < count; i++) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const radiusX =
            width *
            (0.32 + Math.random() * 0.17);

        const radiusY =
            height *
            (0.20 + Math.random() * 0.24);

        sparkleParticles.push({

            baseX:
                width / 2 +
                Math.cos(angle) *
                radiusX,

            baseY:
                height / 2 +
                Math.sin(angle) *
                radiusY,

            x: 0,
            y: 0,

            size:
                Math.random() * 3 + 1.3,

            phase:
                Math.random() *
                Math.PI *
                2,

            speed:
                Math.random() * 0.7 + 0.3,

            rotation:
                Math.random() *
                Math.PI
        });
    }
}


/* =========================================================
   DRAW SPARKLE
   ========================================================= */

function drawSparkle(
    x,
    y,
    size,
    rotation,
    color,
    alpha
) {

    ctx.save();

    ctx.translate(x, y);

    ctx.rotate(rotation);

    ctx.globalAlpha =
        alpha;

    ctx.fillStyle =
        `rgba(${color}, ${alpha})`;

    ctx.beginPath();

    /*
     * 4-point star
     */

    ctx.moveTo(
        0,
        -size * 2.5
    );

    ctx.lineTo(
        size * 0.65,
        -size * 0.65
    );

    ctx.lineTo(
        size * 2.5,
        0
    );

    ctx.lineTo(
        size * 0.65,
        size * 0.65
    );

    ctx.lineTo(
        0,
        size * 2.5
    );

    ctx.lineTo(
        -size * 0.65,
        size * 0.65
    );

    ctx.lineTo(
        -size * 2.5,
        0
    );

    ctx.lineTo(
        -size * 0.65,
        -size * 0.65
    );

    ctx.closePath();

    ctx.fill();

    ctx.restore();
}


/* =========================================================
   ANIMATE
   ========================================================= */

function animateHeart() {

    requestAnimationFrame(
        animateHeart
    );

    time += 0.015;

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const colors =
        getHeartColors();


    /* -----------------------------------------------------
       HEART PARTICLES
       ----------------------------------------------------- */

    heartParticles.forEach(
        (p, index) => {

            const pulse =
                Math.sin(
                    time * 2 +
                    p.phase
                );

            const driftX =
                Math.sin(
                    time *
                    p.speed *
                    1.5 +
                    p.phase
                ) * 1.1;

            const driftY =
                Math.cos(
                    time *
                    p.speed *
                    1.3 +
                    p.phase
                ) * 1.1;

            /*
             * Viền trái tim rung ít hơn
             * phần hạt bên trong.
             */

            const amount =
                p.edge
                    ? 0.45
                    : 1;

            const x =
                p.baseX +
                driftX * amount;

            const y =
                p.baseY +
                driftY * amount;

            const color =
                colors[
                    index %
                    colors.length
                ];

            const alpha =
                Math.max(
                    0.12,
                    Math.min(
                        1,
                        p.alpha +
                        pulse * 0.08
                    )
                );

            const radius =
                Math.max(
                    0.35,
                    p.size +
                    pulse * 0.18
                );

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(${color}, ${alpha})`;

            ctx.shadowBlur =
                p.edge ? 5 : 3;

            ctx.shadowColor =
                `rgba(${color}, 0.7)`;

            ctx.fill();
        }
    );


    ctx.shadowBlur = 0;


    /* -----------------------------------------------------
       SPARKLES AROUND HEART
       ----------------------------------------------------- */

    sparkleParticles.forEach(
        (s, index) => {

            const float =
                Math.sin(
                    time *
                    s.speed +
                    s.phase
                );

            const x =
                s.baseX +
                Math.sin(
                    time * 0.35 +
                    s.phase
                ) * 18;

            const y =
                s.baseY +
                float * 22;

            const alpha =
                0.35 +
                (
                    Math.sin(
                        time * 2 +
                        s.phase
                    ) + 1
                ) * 0.25;

            const color =
                colors[
                    index %
                    colors.length
                ];

            drawSparkle(
                x,
                y,
                s.size,
                s.rotation +
                    time * 0.2,
                color,
                alpha
            );
        }
    );
}


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();

animateHeart();


/* =========================================================
   THEME SWITCHER
   ========================================================= */

const themeButtons =
    document.querySelectorAll(
        ".theme-btn"
    );

themeButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const theme =
                    button.dataset.theme;

                document.body.dataset.theme =
                    theme;

                themeButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );
                    }
                );

                button.classList.add(
                    "active"
                );

                /*
                 * Đổi màu ngay lập tức
                 * cho trái tim.
                 */
                createHeart();
                createSparkles();
            }
        );
    }
);


/* =========================================================
   MUSIC
   ========================================================= */

const music =
    document.getElementById(
        "birthdayMusic"
    );

const musicButton =
    document.getElementById(
        "musicButton"
    );

const musicIcon =
    document.getElementById(
        "musicIcon"
    );

let musicStarted = false;


/* ---------------------------------------------------------
   UPDATE MUSIC UI
   --------------------------------------------------------- */

function updateMusicUI() {

    if (!music.paused) {

        musicButton.classList.add(
            "playing"
        );

        musicIcon.textContent =
            "♫";

    } else {

        musicButton.classList.remove(
            "playing"
        );

        musicIcon.textContent =
            "♪";
    }
}


/* ---------------------------------------------------------
   START MUSIC
   --------------------------------------------------------- */

async function startMusic() {

    try {

        await music.play();

        musicStarted = true;

        updateMusicUI();

    } catch (error) {

        /*
         * Chrome có thể chặn autoplay
         * nếu chưa có thao tác người dùng.
         */

        updateMusicUI();
    }
}


/* ---------------------------------------------------------
   MUSIC BUTTON
   --------------------------------------------------------- */

musicButton.addEventListener(
    "click",
    async () => {

        if (music.paused) {

            await startMusic();

        } else {

            music.pause();

            updateMusicUI();
        }
    }
);


/* ---------------------------------------------------------
   TRY AUTOPLAY
   --------------------------------------------------------- */

window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {
                startMusic();
            },
            500
        );
    }
);


/* ---------------------------------------------------------
   FIRST USER INTERACTION
   --------------------------------------------------------- */

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

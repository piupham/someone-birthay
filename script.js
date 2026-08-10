/* =========================================================
   STAR FIELD
   ========================================================= */

const starsContainer =
    document.getElementById("stars");

const STAR_COUNT = 110;

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

let particles = [];

let sparkles = [];

let time = 0;


/* =========================================================
   HEART FORMULA
   ========================================================= */

function heartX(t) {

    return (
        16 *
        Math.pow(Math.sin(t), 3)
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
        width * dpr;

    canvas.height =
        height * dpr;

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

    particles = [];

    /*
     * Giữ đúng kiểu trái tim particle
     * của code gốc nhưng tạo khoảng
     * thưa hơn để trái tim mềm và đẹp.
     */

    const scale =
        Math.min(width, height) / 36;

    const centerX =
        width / 2;

    /*
     * Đưa trái tim hơi lên trên
     * để phần đáy luôn có khoảng trống.
     */

    const centerY =
        height / 2 + scale * 1.8;


    /*
     * Particle count
     */

    const particleCount =
        Math.min(
            850,
            Math.max(
                450,
                Math.floor(width * 0.9)
            )
        );


    /* -----------------------------------------------------
       HEART OUTLINE
       ----------------------------------------------------- */

    for (let i = 0; i < 320; i++) {

        const t =
            Math.random() *
            Math.PI * 2;

        const x =
            centerX +
            heartX(t) * scale;

        const y =
            centerY -
            heartY(t) * scale;

        particles.push({

            x,
            y,

            baseX: x,
            baseY: y,

            size:
                Math.random() * 1.5 +
                0.7,

            alpha:
                Math.random() * 0.5 +
                0.45,

            speed:
                Math.random() * 0.02 +
                0.005,

            phase:
                Math.random() *
                Math.PI * 2,

            edge: true
        });
    }


    /* -----------------------------------------------------
       HEART INSIDE
       ----------------------------------------------------- */

    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const t =
            Math.random() *
            Math.PI * 2;

        /*
         * Phân bố hạt vào bên trong
         */
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

        particles.push({

            x,
            y,

            baseX: x,
            baseY: y,

            size:
                Math.random() * 1.65 +
                0.55,

            alpha:
                Math.random() * 0.65 +
                0.18,

            speed:
                Math.random() * 0.025 +
                0.004,

            phase:
                Math.random() *
                Math.PI * 2,

            edge: false
        });
    }
}


/* =========================================================
   SPARKLES AROUND HEART
   ========================================================= */

function createSparkles() {

    sparkles = [];

    const count =
        Math.min(
            45,
            Math.max(
                25,
                Math.floor(width / 16)
            )
        );

    const scale =
        Math.min(width, height) / 36;

    const centerX =
        width / 2;

    const centerY =
        height / 2 + scale * 1.8;


    for (let i = 0; i < count; i++) {

        /*
         * Chỉ tạo sparkle ở vùng
         * xung quanh trái tim.
         */

        let angle =
            Math.random() *
            Math.PI * 2;

        let distance =
            scale *
            (18 + Math.random() * 10);

        let x =
            centerX +
            Math.cos(angle) *
            distance;

        let y =
            centerY +
            Math.sin(angle) *
            distance;


        /*
         * Một số sparkle được kéo
         * gần trái tim hơn.
         */

        if (Math.random() < 0.45) {

            distance =
                scale *
                (14 + Math.random() * 5);

            x =
                centerX +
                Math.cos(angle) *
                distance;

            y =
                centerY +
                Math.sin(angle) *
                distance;
        }


        sparkles.push({

            x,
            y,

            size:
                Math.random() * 2.5 +
                1,

            alpha:
                Math.random() * 0.7 +
                0.25,

            phase:
                Math.random() *
                Math.PI * 2,

            speed:
                Math.random() * 0.02 +
                0.005,

            rotate:
                Math.random() *
                Math.PI
        });
    }
}


/* =========================================================
   COLORS
   ========================================================= */

function getParticleColor(index) {

    const theme =
        document.body.dataset.theme;

    if (theme === "golden") {

        return index % 3 === 0
            ? "255, 211, 106"
            : "255, 153, 0";
    }

    if (theme === "cyber") {

        return index % 3 === 0
            ? "105, 239, 255"
            : "79, 172, 254";
    }

    if (theme === "emerald") {

        return index % 3 === 0
            ? "102, 245, 196"
            : "150, 201, 61";
    }

    return index % 3 === 0
        ? "255, 180, 225"
        : "255, 55, 155";
}


/* =========================================================
   DRAW SPARKLE
   ========================================================= */

function drawSparkle(
    x,
    y,
    size,
    alpha,
    rotation
) {

    ctx.save();

    ctx.translate(x, y);

    ctx.rotate(rotation);

    /*
     * Glow
     */

    ctx.shadowBlur =
        size * 5;

    ctx.shadowColor =
        `rgba(${getParticleColor(0)}, ${alpha})`;

    ctx.fillStyle =
        `rgba(255,255,255,${alpha})`;


    /*
     * 4-point star
     */

    ctx.beginPath();

    ctx.moveTo(
        0,
        -size * 2.4
    );

    ctx.lineTo(
        size * 0.55,
        -size * 0.55
    );

    ctx.lineTo(
        size * 2.4,
        0
    );

    ctx.lineTo(
        size * 0.55,
        size * 0.55
    );

    ctx.lineTo(
        0,
        size * 2.4
    );

    ctx.lineTo(
        -size * 0.55,
        size * 0.55
    );

    ctx.lineTo(
        -size * 2.4,
        0
    );

    ctx.lineTo(
        -size * 0.55,
        -size * 0.55
    );

    ctx.closePath();

    ctx.fill();

    ctx.restore();
}


/* =========================================================
   ANIMATION
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


    /* -----------------------------------------------------
       PARTICLES
       ----------------------------------------------------- */

    particles.forEach(
        (p, index) => {

            const pulse =
                Math.sin(
                    time * 1.8 +
                    p.phase
                ) * 0.7;


            const driftX =
                Math.sin(
                    time * p.speed * 40 +
                    p.phase
                ) * 1.4;


            const driftY =
                Math.cos(
                    time * p.speed * 35 +
                    p.phase
                ) * 1.4;


            const x =
                p.baseX +
                driftX +
                pulse * 0.2;


            const y =
                p.baseY +
                driftY;


            const color =
                getParticleColor(index);


            const alpha =
                Math.max(
                    0.08,
                    Math.min(
                        1,
                        p.alpha +
                        pulse * 0.06
                    )
                );


            ctx.beginPath();


            /*
             * Viền sáng hơn bên ngoài
             */

            if (p.edge) {

                ctx.shadowBlur =
                    7;

                ctx.shadowColor =
                    `rgba(${color}, ${alpha})`;

            } else {

                ctx.shadowBlur =
                    2.5;

                ctx.shadowColor =
                    `rgba(${color}, ${alpha * 0.6})`;
            }


            ctx.arc(
                x,
                y,
                Math.max(
                    0.35,
                    p.size +
                    pulse * 0.12
                ),
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `rgba(${color}, ${alpha})`;

            ctx.fill();

            ctx.shadowBlur = 0;
        }
    );


    /* -----------------------------------------------------
       SPARKLES
       ----------------------------------------------------- */

    sparkles.forEach(
        (s, index) => {

            const sparklePulse =
                (
                    Math.sin(
                        time *
                        (1.5 + s.speed * 30) +
                        s.phase
                    ) + 1
                ) / 2;


            const alpha =
                s.alpha *
                (
                    0.35 +
                    sparklePulse * 0.65
                );


            const size =
                s.size *
                (
                    0.65 +
                    sparklePulse * 0.65
                );


            drawSparkle(
                s.x,
                s.y,
                size,
                alpha,
                s.rotate +
                time * 0.08
            );
        }
    );
}


/* =========================================================
   START HEART
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
   MUSIC UI
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
         * Trình duyệt có thể chặn
         * autoplay.
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
   AUTOPLAY
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


/*
 * Nếu trình duyệt chặn autoplay,
 * lần click/chạm đầu tiên sẽ bật nhạc.
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

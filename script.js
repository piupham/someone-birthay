"use strict";


/* =========================================================
   THEME
========================================================= */

const themePalettes = {

    midnight: {
        heart: [
            "#ff0080",
            "#ff1493",
            "#ff69b4",
            "#da70d6",
            "#c71585",
            "#7928ca"
        ],
        glow: "#ff0080"
    },

    golden: {
        heart: [
            "#ff9900",
            "#ffaa00",
            "#ffcc00",
            "#ff7733",
            "#e67e22",
            "#ff0055"
        ],
        glow: "#ff9900"
    },

    cyber: {
        heart: [
            "#00f2fe",
            "#4facfe",
            "#00d2ff",
            "#38f9d7",
            "#00c6ff",
            "#7928ca"
        ],
        glow: "#00f2fe"
    },

    emerald: {
        heart: [
            "#00b09b",
            "#96c93d",
            "#00e6a8",
            "#2ecc71",
            "#1abc9c",
            "#55efc4"
        ],
        glow: "#00b09b"
    },

    velvet: {
        heart: [
            "#ff0844",
            "#ffb199",
            "#d63031",
            "#e84118",
            "#c0392b",
            "#e84393"
        ],
        glow: "#ff0844"
    }
};


let currentTheme =
    localStorage.getItem("heartfill_theme") || "midnight";

if (!themePalettes[currentTheme]) {
    currentTheme = "midnight";
}


/* =========================================================
   CANVAS
========================================================= */

const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;

let particles = [];

let currentColors =
    themePalettes[currentTheme].heart;


function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    const dpr =
        Math.min(window.devicePixelRatio || 1, 2);

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


window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================================================
   HEART EQUATION
========================================================= */

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


/* =========================================================
   CREATE HEART PARTICLES
========================================================= */

function createHeart() {

    particles = [];

    const count = 1050;

    const scale =
        Math.min(width, height) / 39;

    for (let i = 0; i < count; i++) {

        const t =
            Math.random() * Math.PI * 2;

        const boundary =
            heartPoint(t, scale);

        /*
         * Lấy điểm ngẫu nhiên bên trong trái tim
         */
        let px;
        let py;

        while (true) {

            const rx =
                (Math.random() * 2 - 1)
                * 17 * scale;

            const ry =
                (Math.random() * 2 - 1)
                * 15 * scale;

            const hx =
                rx / scale;

            const hy =
                -ry / scale;

            const value =
                Math.pow(
                    hx * hx + hy * hy - 1,
                    3
                )
                - hx * hx * hy * hy * hy;

            if (value <= 0) {

                px = rx;
                py = ry;

                break;
            }
        }

        particles.push({

            x: px,
            y: py,

            baseX: px,
            baseY: py,

            size:
                Math.random() * 1.7 + 0.5,

            alpha:
                Math.random() * 0.7 + 0.3,

            speed:
                Math.random() * 0.025 + 0.008,

            phase:
                Math.random() * Math.PI * 2,

            color:
                currentColors[
                    Math.floor(
                        Math.random()
                        * currentColors.length
                    )
                ]
        });
    }
}


/* =========================================================
   DRAW HEART
========================================================= */

function drawHeart(time) {

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    const centerX =
        width / 2;

    const centerY =
        height / 2 + 25;


    /*
     * Nhịp đập nhẹ
     */
    const pulse =
        1 +
        Math.sin(time * 0.0025)
        * 0.035;


    /*
     * Glow
     */
    ctx.save();

    ctx.translate(
        centerX,
        centerY
    );

    ctx.scale(
        pulse,
        pulse
    );

    /*
     * Vẽ glow lớn
     */
    const gradient =
        ctx.createRadialGradient(
            0,
            0,
            20,
            0,
            0,
            Math.min(width, height) * 0.38
        );

    gradient.addColorStop(
        0,
        hexToRgba(
            themePalettes[currentTheme].glow,
            0.20
        )
    );

    gradient.addColorStop(
        0.45,
        hexToRgba(
            themePalettes[currentTheme].glow,
            0.07
        )
    );

    gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        Math.min(width, height) * 0.38,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();


    /*
     * Particles
     */

    ctx.save();

    ctx.translate(
        centerX,
        centerY
    );

    ctx.scale(
        pulse,
        pulse
    );

    for (const p of particles) {

        const wave =
            Math.sin(
                time * p.speed
                + p.phase
            );

        const driftX =
            wave * 1.2;

        const driftY =
            Math.cos(
                time * p.speed * 0.8
                + p.phase
            ) * 1.2;

        const x =
            p.x + driftX;

        const y =
            p.y + driftY;


        /*
         * Particle glow
         */
        ctx.shadowBlur =
            8 + p.size * 3;

        ctx.shadowColor =
            p.color;

        ctx.globalAlpha =
            p.alpha;


        ctx.fillStyle =
            p.color;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.restore();

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
}


/* =========================================================
   HEX → RGBA
========================================================= */

function hexToRgba(hex, alpha) {

    hex = hex.replace("#", "");

    const r =
        parseInt(
            hex.substring(0, 2),
            16
        );

    const g =
        parseInt(
            hex.substring(2, 4),
            16
        );

    const b =
        parseInt(
            hex.substring(4, 6),
            16
        );

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


/* =========================================================
   ANIMATION
========================================================= */

let animationStart =
    performance.now();

function animate(time) {

    drawHeart(
        time - animationStart
    );

    requestAnimationFrame(
        animate
    );
}


/* =========================================================
   STARS
========================================================= */

const starsContainer =
    document.getElementById("stars");


function createStars() {

    starsContainer.innerHTML = "";

    /*
     * Sao nền
     */
    for (let i = 0; i < 90; i++) {

        const star =
            document.createElement("div");

        star.className =
            Math.random() < 0.15
                ? "star big"
                : "star";


        /*
         * Không để sao nằm quá gần vùng chữ
         */
        let x;
        let y;

        do {

            x =
                Math.random() * 100;

            y =
                Math.random() * 100;

        } while (
            x > 27 &&
            x < 73 &&
            y < 32
        );


        star.style.left =
            `${x}%`;

        star.style.top =
            `${y}%`;


        star.style.setProperty(
            "--duration",
            `${1.5 + Math.random() * 3}s`
        );

        star.style.setProperty(
            "--float-duration",
            `${4 + Math.random() * 7}s`
        );

        star.style.setProperty(
            "--delay",
            `${Math.random() * 4}s`
        );

        star.style.setProperty(
            "--move-x",
            `${(Math.random() * 20 - 10)}px`
        );

        star.style.setProperty(
            "--move-y",
            `${(Math.random() * 20 - 10)}px`
        );


        starsContainer.appendChild(
            star
        );
    }


    /*
     * Sao nổi bật quanh trái tim
     */
    for (let i = 0; i < 28; i++) {

        const star =
            document.createElement("div");

        star.className =
            "star big";


        /*
         * Phân bố xung quanh trung tâm
         */
        const angle =
            Math.random()
            * Math.PI
            * 2;

        const radius =
            28 +
            Math.random() * 22;


        const centerX = 50;
        const centerY = 56;


        const x =
            centerX
            + Math.cos(angle)
            * radius;

        const y =
            centerY
            + Math.sin(angle)
            * radius
            * 0.65;


        star.style.left =
            `${x}%`;

        star.style.top =
            `${y}%`;


        star.style.setProperty(
            "--duration",
            `${1.2 + Math.random() * 2}s`
        );

        star.style.setProperty(
            "--float-duration",
            `${3 + Math.random() * 4}s`
        );

        star.style.setProperty(
            "--delay",
            `${Math.random() * 3}s`
        );

        star.style.setProperty(
            "--move-x",
            `${Math.random() * 16 - 8}px`
        );

        star.style.setProperty(
            "--move-y",
            `${Math.random() * 16 - 8}px`
        );


        starsContainer.appendChild(
            star
        );
    }
}


/* =========================================================
   THEME
========================================================= */

function applyTheme(themeKey) {

    if (!themePalettes[themeKey]) {
        return;
    }

    currentTheme =
        themeKey;

    localStorage.setItem(
        "heartfill_theme",
        themeKey
    );

    document.body.setAttribute(
        "data-theme",
        themeKey
    );


    currentColors =
        themePalettes[
            themeKey
        ].heart;


    /*
     * Đổi màu particle hiện tại
     */
    particles.forEach(
        particle => {

            particle.color =
                currentColors[
                    Math.floor(
                        Math.random()
                        * currentColors.length
                    )
                ];
        }
    );


    /*
     * Cập nhật button
     */
    document
        .querySelectorAll(".theme-btn")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.theme
                === themeKey
            );
        });


    /*
     * Tạo lại sao
     */
    createStars();
}


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


let musicPlaying = false;


function updateMusicButton() {

    if (musicPlaying) {

        musicButton.textContent =
            "♫ Music On";

    } else {

        musicButton.textContent =
            "♪ Play Music";
    }
}


musicButton.addEventListener(
    "click",
    async () => {

        try {

            if (
                music.paused
            ) {

                await music.play();

                musicPlaying =
                    true;

            } else {

                music.pause();

                musicPlaying =
                    false;
            }

            updateMusicButton();

        } catch (error) {

            console.error(
                "Không thể phát nhạc:",
                error
            );
        }
    }
);


/* =========================================================
   THEME BUTTONS
========================================================= */

document
    .querySelectorAll(".theme-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                applyTheme(
                    button.dataset.theme
                );
            }
        );
    });


/* =========================================================
   START
========================================================= */

window.addEventListener(
    "load",
    () => {

        resizeCanvas();

        createHeart();

        createStars();

        applyTheme(
            currentTheme
        );

        requestAnimationFrame(
            animate
        );

        updateMusicButton();
    }
);

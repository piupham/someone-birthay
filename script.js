"use strict";

/* =========================================
   HAPPY BIRTHDAY KIK
   Heart + Stars + Music + Themes
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       ELEMENTS
    ===================================== */

    const canvas = document.getElementById("heartCanvas");
    const ctx = canvas.getContext("2d");

    const starsContainer = document.getElementById("stars");

    const music = document.getElementById("birthdayMusic");
    const musicButton = document.getElementById("musicButton");

    const themeButtons =
        document.querySelectorAll(".theme-btn");


    /* =====================================
       THEME COLORS
    ===================================== */

    const themes = {

        midnight: [
            "#ff0080",
            "#7928ca",
            "#ff1493",
            "#ff69b4",
            "#da70d6"
        ],

        golden: [
            "#ff9900",
            "#ffaa00",
            "#ff0055",
            "#ff6600",
            "#ffcc00"
        ],

        cyber: [
            "#00f2fe",
            "#4facfe",
            "#7928ca",
            "#00d2ff",
            "#38f9d7"
        ],

        emerald: [
            "#00b09b",
            "#96c93d",
            "#00e6a8",
            "#2ecc71",
            "#55efc4"
        ],

        velvet: [
            "#ff0844",
            "#ffb199",
            "#d63031",
            "#e84118",
            "#e84393"
        ]
    };


    let currentTheme =
        localStorage.getItem("heartfill_theme")
        || "midnight";

    if (!themes[currentTheme]) {
        currentTheme = "midnight";
    }


    /* =====================================
       APPLY THEME
    ===================================== */

    function applyTheme(theme) {

        if (!themes[theme]) return;

        currentTheme = theme;

        document.body.dataset.theme = theme;

        localStorage.setItem(
            "heartfill_theme",
            theme
        );

        themeButtons.forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.theme === theme
            );
        });

        createStars();

        particles.forEach(particle => {

            particle.color =
                randomChoice(themes[currentTheme]);
        });
    }


    themeButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.stopPropagation();

            applyTheme(button.dataset.theme);
        });
    });


    /* =====================================
       RANDOM HELPERS
    ===================================== */

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }


    function randomInt(min, max) {
        return Math.floor(
            Math.random() * (max - min + 1)
        ) + min;
    }


    function randomChoice(array) {
        return array[
            Math.floor(Math.random() * array.length)
        ];
    }


    /* =====================================
       STARS
    ===================================== */

    function createStars() {

        starsContainer.innerHTML = "";

        const count =
            window.innerWidth < 700
                ? 75
                : 140;

        for (let i = 0; i < count; i++) {

            const star =
                document.createElement("div");

            star.className = "star";

            if (Math.random() < 0.12) {
                star.classList.add("big");
            }

            star.style.left =
                `${random(1, 99)}%`;

            star.style.top =
                `${random(1, 99)}%`;

            star.style.setProperty(
                "--duration",
                `${random(1.2, 3.5)}s`
            );

            star.style.setProperty(
                "--float-duration",
                `${random(7, 18)}s`
            );

            star.style.setProperty(
                "--delay",
                `${random(-5, 0)}s`
            );

            star.style.setProperty(
                "--move-x",
                `${random(-30, 30)}px`
            );

            star.style.setProperty(
                "--move-y",
                `${random(-40, 40)}px`
            );

            starsContainer.appendChild(star);
        }
    }


    createStars();


    /* =====================================
       CANVAS RESIZE
    ===================================== */

    let width = 0;
    let height = 0;
    let dpr = 1;


    function resizeCanvas() {

        const rect =
            canvas.getBoundingClientRect();

        dpr =
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

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }


    resizeCanvas();


    window.addEventListener(
        "resize",
        () => {

            resizeCanvas();
            createStars();
        }
    );


    /* =====================================
       HEART FUNCTION
    ===================================== */

    function heartX(t) {

        return (
            16 * Math.pow(Math.sin(t), 3)
        );
    }


    function heartY(t) {

        return -(
            13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t)
        );
    }


    /* =====================================
       HEART PARTICLES
    ===================================== */

    const particles = [];

    const PARTICLE_COUNT = 900;


    function createHeartParticles() {

        particles.length = 0;

        const scale =
            Math.min(width, height) / 34;

        for (
            let i = 0;
            i < PARTICLE_COUNT;
            i++
        ) {

            const t =
                random(0, Math.PI * 2);

            /*
             * Random radius creates
             * a filled heart.
             */
            const radius =
                Math.sqrt(Math.random());

            const x =
                heartX(t) * scale * radius;

            const y =
                heartY(t) * scale * radius;

            particles.push({

                x: x,
                y: y,

                baseX: x,
                baseY: y,

                size: random(0.8, 2.3),

                alpha: random(0.35, 1),

                phase: random(
                    0,
                    Math.PI * 2
                ),

                speed: random(
                    0.7,
                    2
                ),

                color:
                    randomChoice(
                        themes[currentTheme]
                    )
            });
        }
    }


    createHeartParticles();


    /* =====================================
       DRAW HEART
    ===================================== */

    let animationTime = 0;


    function drawHeart() {

        animationTime += 0.016;

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        const centerX =
            width / 2;

        const centerY =
            height / 2 + 20;


        /*
         * Gentle heartbeat.
         */
        const heartbeat =
            1 +
            Math.sin(animationTime * 2.4)
            * 0.025;


        ctx.save();

        ctx.translate(
            centerX,
            centerY
        );

        ctx.scale(
            heartbeat,
            heartbeat
        );


        /* =================================
           HEART GLOW
        ================================= */

        ctx.shadowBlur = 28;

        ctx.shadowColor =
            getComputedStyle(document.body)
                .getPropertyValue("--accent")
                .trim();


        /* =================================
           PARTICLES
        ================================= */

        for (const particle of particles) {

            const wave =
                Math.sin(
                    animationTime *
                    particle.speed +
                    particle.phase
                );

            const floatX =
                Math.cos(
                    animationTime * 0.8 +
                    particle.phase
                ) * 1.4;

            const floatY =
                wave * 1.4;


            const px =
                particle.baseX +
                floatX;

            const py =
                particle.baseY +
                floatY;


            const alpha =
                Math.max(
                    0.15,
                    Math.min(
                        1,
                        particle.alpha +
                        wave * 0.15
                    )
                );


            ctx.globalAlpha = alpha;

            ctx.fillStyle =
                particle.color;

            ctx.beginPath();

            ctx.arc(
                px,
                py,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }


        /* =================================
           HEART OUTLINE
        ================================= */

        ctx.globalAlpha = 0.3;

        ctx.shadowBlur = 40;

        ctx.strokeStyle =
            getComputedStyle(document.body)
                .getPropertyValue("--text")
                .trim();

        ctx.lineWidth = 1.5;

        ctx.beginPath();


        const scale =
            Math.min(width, height) / 34;


        for (
            let i = 0;
            i <= 200;
            i++
        ) {

            const t =
                (i / 200) *
                Math.PI * 2;

            const x =
                heartX(t) * scale;

            const y =
                heartY(t) * scale;


            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.closePath();

        ctx.stroke();

        ctx.restore();

        ctx.globalAlpha = 1;

        requestAnimationFrame(drawHeart);
    }


    /* =====================================
       START HEART
    ===================================== */

    requestAnimationFrame(drawHeart);


    /* =====================================
       MUSIC
    ===================================== */

    let musicStarted = false;


    async function startMusic() {

        if (musicStarted) return;

        try {

            await music.play();

            musicStarted = true;

            musicButton.classList.add(
                "playing"
            );

        } catch (error) {

            /*
             * Browser blocks autoplay.
             * User can press the music button.
             */
            musicStarted = false;
        }
    }


    musicButton.addEventListener(
        "click",
        async event => {

            event.stopPropagation();

            if (music.paused) {

                try {

                    await music.play();

                    musicButton.classList.add(
                        "playing"
                    );

                    musicStarted = true;

                } catch (error) {

                    console.log(
                        "Music could not start."
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
     * Try to start music after
     * the first interaction anywhere.
     */
    document.addEventListener(
        "click",
        () => {
            startMusic();
        },
        {
            once: true
        }
    );


    document.addEventListener(
        "touchstart",
        () => {
            startMusic();
        },
        {
            once: true
        }
    );


    /* =====================================
       INITIAL THEME
    ===================================== */

    applyTheme(currentTheme);

});

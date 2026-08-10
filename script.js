"use strict";

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       THEME
    ========================================= */

    const themeButtons = document.querySelectorAll(".theme-btn");

    const savedTheme = localStorage.getItem("heartfill_theme");

    const defaultTheme =
        savedTheme || "midnight";

    function applyTheme(theme) {

        document.body.setAttribute(
            "data-theme",
            theme
        );

        localStorage.setItem(
            "heartfill_theme",
            theme
        );

        themeButtons.forEach(function (button) {

            if (button.dataset.theme === theme) {
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }

        });

        updateHeartColors();
        updateStarColors();
    }


    themeButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            applyTheme(
                button.dataset.theme
            );

        });

    });


    applyTheme(defaultTheme);


    /* =========================================
       STARS AROUND THE HEART
    ========================================= */

    const starsContainer =
        document.getElementById("stars");

    const STAR_COUNT = 70;

    function createStars() {

        starsContainer.innerHTML = "";

        for (let i = 0; i < STAR_COUNT; i++) {

            const star =
                document.createElement("div");

            star.classList.add("star");

            /*
             * Random size
             */
            const randomSize =
                Math.random();

            if (randomSize < 0.65) {
                star.classList.add("small");
            } else if (randomSize > 0.92) {
                star.classList.add("large");
            }


            /*
             * Random position
             */
            const x =
                Math.random() * 100;

            const y =
                Math.random() * 100;


            /*
             * Keep stars away from
             * the text and central heart
             */
            const centerDistance =
                Math.sqrt(
                    Math.pow(x - 50, 2) +
                    Math.pow(y - 55, 2)
                );

            if (centerDistance < 23) {
                star.style.left =
                    (x < 50 ? x - 22 : x + 22) + "%";

                star.style.top =
                    (y < 55 ? y - 15 : y + 15) + "%";
            } else {

                star.style.left =
                    x + "%";

                star.style.top =
                    y + "%";
            }


            /*
             * CSS variables
             */
            star.style.setProperty(
                "--x",
                star.style.left
            );

            star.style.setProperty(
                "--y",
                star.style.top
            );


            const size =
                (Math.random() * 8 + 4) + "px";

            star.style.setProperty(
                "--size",
                size
            );


            const opacity =
                Math.random() * 0.65 + 0.25;

            star.style.setProperty(
                "--opacity",
                opacity
            );


            const duration =
                (Math.random() * 4 + 3) + "s";

            star.style.setProperty(
                "--duration",
                duration
            );


            const delay =
                (Math.random() * -5) + "s";

            star.style.setProperty(
                "--delay",
                delay
            );


            starsContainer.appendChild(star);

        }

    }


    createStars();


    function updateStarColors() {

        const color =
            getComputedStyle(document.body)
                .getPropertyValue("--star-color");

        document
            .querySelectorAll(".star")
            .forEach(function (star) {

                star.style.setProperty(
                    "--star-color",
                    color
                );

            });

    }


    /* =========================================
       CENTRAL HEART
    ========================================= */

    const canvas =
        document.getElementById("heartCanvas");

    const container =
        document.getElementById("heartContainer");

    const ctx =
        canvas.getContext("2d");


    let width = 0;
    let height = 0;

    let particles = [];

    let animationTime = 0;


    /*
     * Resize canvas
     */
    function resizeCanvas() {

        const rect =
            container.getBoundingClientRect();

        const dpr =
            window.devicePixelRatio || 1;

        width = rect.width;
        height = rect.height;

        canvas.width =
            width * dpr;

        canvas.height =
            height * dpr;

        canvas.style.width =
            width + "px";

        canvas.style.height =
            height + "px";

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );


        createHeartParticles();

    }


    window.addEventListener(
        "resize",
        resizeCanvas
    );


    /*
     * Heart mathematical equation
     *
     * x = 16 sin³(t)
     * y = 13 cos(t)
     *     - 5 cos(2t)
     *     - 2 cos(3t)
     *     - cos(4t)
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


    /*
     * Create particles inside heart
     */
    function createHeartParticles() {

        particles = [];

        const centerX =
            width / 2;

        const centerY =
            height / 2 + 5;


        const scale =
            Math.min(
                width / 43,
                height / 35
            );


        /*
         * Main heart particles
         */
        for (
            let i = 0;
            i < 900;
            i++
        ) {

            const t =
                Math.random() *
                Math.PI *
                2;


            const point =
                heartPoint(t, scale);


            const inside =
                Math.random();


            const x =
                point.x * Math.sqrt(inside);

            const y =
                point.y * Math.sqrt(inside);


            particles.push({

                baseX:
                    centerX + x,

                baseY:
                    centerY + y,

                x:
                    centerX + x,

                y:
                    centerY + y,

                size:
                    Math.random() * 1.7 + 0.5,

                phase:
                    Math.random() *
                    Math.PI *
                    2,

                speed:
                    Math.random() *
                    0.025 +
                    0.008

            });

        }

    }


    /*
     * Get theme colors
     */
    function getHeartColors() {

        const style =
            getComputedStyle(document.body);

        return [

            style.getPropertyValue(
                "--heart-1"
            ).trim(),

            style.getPropertyValue(
                "--heart-2"
            ).trim(),

            style.getPropertyValue(
                "--heart-3"
            ).trim()

        ];

    }


    let heartColors =
        getHeartColors();


    function updateHeartColors() {

        heartColors =
            getHeartColors();

    }


    /*
     * Draw glowing heart
     */
    function drawHeart() {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        animationTime += 0.016;


        /*
         * Heart pulse
         */
        const pulse =
            1 +
            Math.sin(
                animationTime * 2.2
            ) * 0.035;


        const centerX =
            width / 2;

        const centerY =
            height / 2 + 5;


        /*
         * Glow
         */
        ctx.save();

        ctx.globalAlpha = 0.15;

        ctx.shadowBlur = 45;

        ctx.shadowColor =
            heartColors[0];


        ctx.fillStyle =
            heartColors[0];


        drawHeartShape(
            centerX,
            centerY,
            Math.min(
                width / 43,
                height / 35
            ) * pulse
        );


        ctx.fill();

        ctx.restore();


        /*
         * Particles
         */
        particles.forEach(
            function (particle, index) {

                const wave =
                    Math.sin(
                        animationTime *
                        particle.speed *
                        30 +
                        particle.phase
                    );


                particle.x =
                    particle.baseX +
                    wave * 1.4;


                particle.y =
                    particle.baseY +
                    Math.cos(
                        animationTime *
                        particle.speed *
                        25 +
                        particle.phase
                    ) * 1.2;


                /*
                 * Pulsing particle
                 */
                const particlePulse =
                    0.75 +
                    Math.sin(
                        animationTime * 3 +
                        particle.phase
                    ) * 0.25;


                const color =
                    heartColors[
                        index %
                        heartColors.length
                    ];


                ctx.save();

                ctx.globalAlpha =
                    0.65 +
                    particlePulse * 0.35;


                ctx.fillStyle =
                    color;


                ctx.shadowBlur =
                    8;


                ctx.shadowColor =
                    color;


                ctx.beginPath();

                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.size *
                    particlePulse,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

                ctx.restore();

            }
        );


        /*
         * Bright heart outline
         */
        ctx.save();

        ctx.strokeStyle =
            heartColors[1];

        ctx.lineWidth = 1.5;

        ctx.globalAlpha = 0.35;

        ctx.shadowBlur = 15;

        ctx.shadowColor =
            heartColors[1];


        drawHeartShape(
            centerX,
            centerY,
            Math.min(
                width / 43,
                height / 35
            ) * pulse
        );


        ctx.stroke();

        ctx.restore();


        requestAnimationFrame(
            drawHeart
        );

    }


    /*
     * Draw mathematical heart
     */
    function drawHeartShape(
        centerX,
        centerY,
        scale
    ) {

        ctx.beginPath();


        const steps = 180;


        for (
            let i = 0;
            i <= steps;
            i++
        ) {

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
                centerX +
                point.x;


            const y =
                centerY +
                point.y;


            if (i === 0) {
                ctx.moveTo(
                    x,
                    y
                );
            } else {
                ctx.lineTo(
                    x,
                    y
                );
            }

        }


        ctx.closePath();

    }


    /*
     * Start
     */
    resizeCanvas();

    updateHeartColors();

    updateStarColors();

    drawHeart();

});

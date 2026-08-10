"use strict";

document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       THEME
    ========================= */

    const themeButtons =
        document.querySelectorAll(".theme-btn");

    const savedTheme =
        localStorage.getItem("birthday_theme");

    const initialTheme =
        savedTheme || "midnight";


    function applyTheme(theme) {

        document.body.setAttribute(
            "data-theme",
            theme
        );

        localStorage.setItem(
            "birthday_theme",
            theme
        );

        themeButtons.forEach(function (button) {

            button.classList.toggle(
                "active",
                button.dataset.theme === theme
            );

        });

        updateColors();
    }


    themeButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                applyTheme(
                    button.dataset.theme
                );

            }
        );

    });


    /* =========================
       STARS
    ========================= */

    const starsContainer =
        document.getElementById("stars");

    const STAR_COUNT = 75;


    function createStars() {

        starsContainer.innerHTML = "";

        for (
            let i = 0;
            i < STAR_COUNT;
            i++
        ) {

            const star =
                document.createElement("div");

            star.className = "star";


            if (Math.random() < 0.65) {
                star.classList.add("small");
            }

            if (Math.random() > 0.9) {
                star.classList.add("large");
            }


            const x =
                Math.random() * 100;

            const y =
                Math.random() * 100;


            star.style.left =
                x + "%";

            star.style.top =
                y + "%";


            star.style.setProperty(
                "--size",
                (Math.random() * 7 + 4) + "px"
            );

            star.style.setProperty(
                "--opacity",
                Math.random() * 0.6 + 0.3
            );

            star.style.setProperty(
                "--duration",
                (Math.random() * 4 + 3) + "s"
            );

            star.style.setProperty(
                "--delay",
                (Math.random() * -5) + "s"
            );


            starsContainer.appendChild(star);

        }

    }


    createStars();


    /* =========================
       HEART CANVAS
    ========================= */

    const canvas =
        document.getElementById("heartCanvas");

    const container =
        document.getElementById("heartContainer");

    const ctx =
        canvas.getContext("2d");


    let width = 0;
    let height = 0;

    let particles = [];

    let time = 0;


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


        createHeart();

    }


    window.addEventListener(
        "resize",
        resizeCanvas
    );


    /* =========================
       HEART EQUATION
    ========================= */

    function heartPoint(t, scale) {

        const x =
            16 *
            Math.pow(
                Math.sin(t),
                3
            );

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


    /* =========================
       CREATE HEART PARTICLES
    ========================= */

    function createHeart() {

        particles = [];


        const centerX =
            width / 2;

        const centerY =
            height / 2;


        const scale =
            Math.min(
                width / 42,
                height / 34
            );


        for (
            let i = 0;
            i < 1000;
            i++
        ) {

            const angle =
                Math.random() *
                Math.PI *
                2;


            const point =
                heartPoint(
                    angle,
                    scale
                );


            const distance =
                Math.sqrt(
                    Math.random()
                );


            const x =
                point.x * distance;

            const y =
                point.y * distance;


            particles.push({

                x:
                    centerX + x,

                y:
                    centerY + y,

                baseX:
                    centerX + x,

                baseY:
                    centerY + y,

                size:
                    Math.random() * 1.8 + 0.5,

                phase:
                    Math.random() *
                    Math.PI * 2,

                speed:
                    Math.random() *
                    2 + 1

            });

        }

    }


    /* =========================
       THEME COLORS
    ========================= */

    function getColors() {

        const style =
            getComputedStyle(document.body);

        return [

            style
                .getPropertyValue("--heart-1")
                .trim(),

            style
                .getPropertyValue("--heart-2")
                .trim(),

            style
                .getPropertyValue("--heart-3")
                .trim()

        ];

    }


    let colors =
        getColors();


    function updateColors() {

        colors =
            getColors();

    }


    /* =========================
       DRAW HEART
    ========================= */

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
                Math.PI * 2;


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


    /* =========================
       ANIMATION
    ========================= */

    function animate() {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        time += 0.016;


        const centerX =
            width / 2;

        const centerY =
            height / 2;


        const baseScale =
            Math.min(
                width / 42,
                height / 34
            );


        /*
         * Heart pulse
         */
        const pulse =
            1 +
            Math.sin(
                time * 2.5
            ) * 0.035;


        const scale =
            baseScale * pulse;


        /* =====================
           OUTER GLOW
        ===================== */

        ctx.save();

        ctx.globalAlpha = 0.12;

        ctx.shadowBlur = 50;

        ctx.shadowColor =
            colors[0];

        ctx.fillStyle =
            colors[0];


        drawHeartShape(
            centerX,
            centerY,
            scale
        );

        ctx.fill();

        ctx.restore();


        /* =====================
           HEART PARTICLES
        ===================== */

        particles.forEach(
            function (particle, index) {

                const movement =
                    Math.sin(
                        time *
                        particle.speed +
                        particle.phase
                    );


                particle.x =
                    particle.baseX +
                    movement * 1.5;


                particle.y =
                    particle.baseY +
                    Math.cos(
                        time *
                        particle.speed +
                        particle.phase
                    ) * 1.2;


                const pulseSize =
                    0.75 +
                    Math.sin(
                        time * 3 +
                        particle.phase
                    ) * 0.25;


                const color =
                    colors[
                        index %
                        colors.length
                    ];


                ctx.save();


                ctx.globalAlpha =
                    0.65 +
                    pulseSize * 0.3;


                ctx.fillStyle =
                    color;


                ctx.shadowBlur = 9;

                ctx.shadowColor =
                    color;


                ctx.beginPath();


                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.size *
                    pulseSize,
                    0,
                    Math.PI * 2
                );


                ctx.fill();

                ctx.restore();

            }
        );


        /* =====================
           HEART OUTLINE
        ===================== */

        ctx.save();

        ctx.strokeStyle =
            colors[1];

        ctx.lineWidth = 1.5;

        ctx.globalAlpha = 0.45;

        ctx.shadowBlur = 15;

        ctx.shadowColor =
            colors[1];


        drawHeartShape(
            centerX,
            centerY,
            scale
        );


        ctx.stroke();

        ctx.restore();


        requestAnimationFrame(
            animate
        );

    }


    /* =========================
       START
    ========================= */

    applyTheme(
        initialTheme
    );

    resizeCanvas();

    animate();

});

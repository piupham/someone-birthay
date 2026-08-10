"use strict";

/* =========================================================
   MATTER.JS
   ========================================================= */

const {
    Engine,
    Render,
    Runner,
    Bodies,
    Body,
    Composite,
    Mouse,
    MouseConstraint,
    Common,
    Events
} = Matter;


/* =========================================================
   GLOBAL
   ========================================================= */

const container =
    document.getElementById("heartCanvas");

const width =
    container.clientWidth;

const height =
    container.clientHeight;


/* =========================================================
   ENGINE
   ========================================================= */

const engine = Engine.create();

const world = engine.world;

engine.gravity.scale = 0;

engine.gravity.x = 0;

engine.gravity.y = 0;


/* =========================================================
   RENDERER
   ========================================================= */

const render = Render.create({

    element: container,

    engine: engine,

    options: {

        width: width,

        height: height,

        wireframes: false,

        background: "transparent",

        pixelRatio:
            window.devicePixelRatio || 1

    }

});

Render.run(render);

const runner = Runner.create();

Runner.run(runner, engine);


/* =========================================================
   HEART SHAPE
   ========================================================= */

function heartPoint(t, scale) {

    const x =
        16 *
        Math.pow(
            Math.sin(t),
            3
        );

    const y =
        13 *
            Math.cos(t)
        - 5 *
            Math.cos(2 * t)
        - 2 *
            Math.cos(3 * t)
        - Math.cos(4 * t);

    return {

        x: x * scale,

        y: -y * scale

    };
}


/* =========================================================
   CREATE HEART
   ========================================================= */

function createHeart() {

    const scale =
        Math.min(width, height) / 38;

    const points = [];

    const count = 70;

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const t =
            (Math.PI * 2 * i) /
            count;

        points.push(
            heartPoint(
                t,
                scale
            )
        );
    }

    const heart =
        Bodies.fromVertices(

            width / 2,

            height / 2,

            [points],

            {

                restitution: 0.75,

                friction: 0.02,

                frictionAir: 0.008,

                density: 0.002,

                render: {

                    fillStyle:
                        getHeartColor(),

                    strokeStyle:
                        getHeartColor(),

                    lineWidth: 1

                }

            },

            true

        );

    Body.setMass(
        heart,
        20
    );

    return heart;
}


/* =========================================================
   HEART COLOR
   ========================================================= */

function getHeartColor() {

    const theme =
        document.body.dataset.theme;

    if (theme === "golden") {

        return Common.choose([
            "#ff9900",
            "#ffaa00",
            "#ff0055",
            "#ff6600",
            "#ffcc00",
            "#ff7733"
        ]);

    }

    if (theme === "cyber") {

        return Common.choose([
            "#00f2fe",
            "#4facfe",
            "#7928ca",
            "#00d2ff",
            "#a18cd1",
            "#38f9d7"
        ]);

    }

    if (theme === "emerald") {

        return Common.choose([
            "#00b09b",
            "#96c93d",
            "#00e6a8",
            "#2ecc71",
            "#1abc9c",
            "#10ac84"
        ]);

    }

    return Common.choose([

        "#ff0080",
        "#7928ca",
        "#ff1493",
        "#ff69b4",
        "#da70d6",
        "#c71585",
        "#ff007f"

    ]);
}


/* =========================================================
   HEART
   ========================================================= */

let heart =
    createHeart();

Composite.add(
    world,
    heart
);


/* =========================================================
   KEEP HEART IN PLACE
   ========================================================= */

Body.setVelocity(
    heart,
    {
        x: 0,
        y: 0
    }
);

Body.setAngularVelocity(
    heart,
    0
);


/* =========================================================
   BOUNDED AREA
   ========================================================= */

const wallThickness = 80;


/* bottom */

const ground =
    Bodies.rectangle(

        width / 2,

        height +
            wallThickness / 2,

        width,

        wallThickness,

        {

            isStatic: true,

            render: {
                visible: false
            }

        }

    );


/* left */

const leftWall =
    Bodies.rectangle(

        -wallThickness / 2,

        height / 2,

        wallThickness,

        height,

        {

            isStatic: true,

            render: {
                visible: false
            }

        }

    );


/* right */

const rightWall =
    Bodies.rectangle(

        width +
            wallThickness / 2,

        height / 2,

        wallThickness,

        height,

        {

            isStatic: true,

            render: {
                visible: false
            }

        }

    );


Composite.add(
    world,
    [
        ground,
        leftWall,
        rightWall
    ]
);


/* =========================================================
   MOUSE
   ========================================================= */

const mouse =
    Mouse.create(
        render.canvas
    );

const mouseConstraint =
    MouseConstraint.create(

        engine,

        {

            mouse: mouse,

            constraint: {

                stiffness: 0.2,

                render: {
                    visible: false
                }

            }

        }

    );

Composite.add(
    world,
    mouseConstraint
);

render.mouse = mouse;


/* =========================================================
   EXTRA HEART EFFECT
   ========================================================= */

const extraColors = {

    midnight: [
        "#c71585",
        "#dc143c",
        "#fa8072"
    ],

    golden: [
        "#d35400",
        "#e74c3c",
        "#f39c12"
    ],

    cyber: [
        "#2575fc",
        "#6a11cb",
        "#00c6ff"
    ],

    emerald: [
        "#009432",
        "#05c46b",
        "#10ac84"
    ]

};


/* =========================================================
   CREATE SMALL STAR
   ========================================================= */

function createStarBody() {

    const theme =
        document.body.dataset.theme;

    let color;

    if (theme === "golden") {

        color =
            Common.choose([
                "#ffd36a",
                "#ff9900",
                "#ffcc00"
            ]);

    } else if (theme === "cyber") {

        color =
            Common.choose([
                "#00f2fe",
                "#4facfe",
                "#69efff"
            ]);

    } else if (theme === "emerald") {

        color =
            Common.choose([
                "#66f5c4",
                "#96c93d",
                "#00e6a8"
            ]);

    } else {

        color =
            Common.choose([
                "#ff7bc8",
                "#ff0080",
                "#c77dff",
                "#ffffff"
            ]);

    }


    const x =
        Math.random() * width;

    const y =
        height + 20;


    const star =
        Bodies.polygon(

            x,

            y,

            5,

            5 + Math.random() * 4,

            {

                restitution: 0.8,

                friction: 0,

                frictionAir: 0.01,

                render: {

                    fillStyle: color,

                    strokeStyle: color,

                    lineWidth: 1

                }

            }

        );


    Body.setVelocity(

        star,

        {

            x:
                Common.random(
                    -1.8,
                    1.8
                ),

            y:
                Common.random(
                    -5,
                    -2
                )

        }

    );


    Body.setAngularVelocity(

        star,

        Common.random(
            -0.08,
            0.08
        )

    );


    Composite.add(
        world,
        star
    );


    setTimeout(
        () => {

            Composite.remove(
                world,
                star
            );

        },
        7000
    );
}


/* =========================================================
   CREATE PHYSICS STARS
   ========================================================= */

setInterval(
    () => {

        for (
            let i = 0;
            i < 2;
            i++
        ) {

            createStarBody();

        }

    },
    900
);


/* =========================================================
   BACKGROUND CSS STARS
   ========================================================= */

const starsContainer =
    document.getElementById(
        "stars"
    );

const STAR_COUNT = 100;


for (
    let i = 0;
    i < STAR_COUNT;
    i++
) {

    const star =
        document.createElement(
            "div"
        );

    star.className =
        "star";


    if (
        Math.random() < 0.18
    ) {

        star.classList.add(
            "star-cross"
        );

    }


    const size =
        Math.random() < 0.85

            ? Math.random() * 2 + 1

            : Math.random() * 3 + 2;


    const opacity =
        Math.random() * 0.55 +
        0.25;


    const duration =
        Math.random() * 2.5 +
        1.5;


    const floatDuration =
        Math.random() * 20 +
        15;


    const delay =
        Math.random() * -8;


    const moveX =
        (Math.random() - 0.5) *
        80;


    const moveY =
        (Math.random() - 0.5) *
        80;


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


    starsContainer.appendChild(
        star
    );
}


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


                /* Recolor main heart */

                if (heart) {

                    const color =
                        getHeartColor();

                    heart.render.fillStyle =
                        color;

                    heart.render.strokeStyle =
                        color;

                }

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


async function startMusic() {

    try {

        await music.play();

        musicStarted = true;

        updateMusicUI();

    } catch (error) {

        updateMusicUI();

    }

}


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


/* =========================================================
   AUTOPLAY
   ========================================================= */

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


/* First user interaction */

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


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        const newWidth =
            container.clientWidth;

        const newHeight =
            container.clientHeight;


        render.canvas.width =
            newWidth *
            (window.devicePixelRatio || 1);

        render.canvas.height =
            newHeight *
            (window.devicePixelRatio || 1);


        render.options.width =
            newWidth;

        render.options.height =
            newHeight;

    }
);

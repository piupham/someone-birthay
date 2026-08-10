"use strict";

/* =========================================
   THEME SYSTEM
   ========================================= */

const themeButtons = document.querySelectorAll(".theme-btn");

const savedTheme = localStorage.getItem("birthday-theme");

const defaultTheme = savedTheme || "golden";

document.body.dataset.theme = defaultTheme;

themeButtons.forEach((button) => {
    const theme = button.dataset.theme;

    button.classList.toggle(
        "active",
        theme === defaultTheme
    );

    button.addEventListener("click", () => {
        document.body.dataset.theme = theme;

        localStorage.setItem(
            "birthday-theme",
            theme
        );

        themeButtons.forEach((item) => {
            item.classList.toggle(
                "active",
                item.dataset.theme === theme
            );
        });
    });
});


/* =========================================
   STAR FIELD
   ========================================= */

const starContainer = document.getElementById("stars");

const STAR_COUNT = 24;

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function createStar(index) {
    const star = document.createElement("div");

    star.className = "star";

    const size = random(7, 25);
    const left = random(2, 98);
    const top = random(7, 93);

    const duration = random(4, 9);
    const twinkle = random(2.5, 5);

    const moveX = random(-18, 18);
    const moveY = random(-15, 15);

    const opacity = random(0.25, 0.9);

    star.style.left = `${left}%`;
    star.style.top = `${top}%`;

    star.style.setProperty(
        "--size",
        `${size}px`
    );

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
        `${index * -0.25}s`;

    return star;
}

for (let i = 0; i < STAR_COUNT; i += 1) {
    starContainer.appendChild(
        createStar(i)
    );
}


/* =========================================
   CENTRAL HEART
   ========================================= */

/*
    Trái tim trung tâm được giữ độc lập với
    các ngôi sao xung quanh.

    Quan trọng:
    - SVG có viewBox 32x32.
    - width và height luôn bằng nhau.
    - Không dùng scaleX / scaleY.
    - Vì vậy khi thu nhỏ, hình trái tim
      vẫn giữ nguyên tỉ lệ và không bị kéo dài.
*/

const heart = document.querySelector(
    ".central-heart"
);

if (heart) {
    heart.setAttribute(
        "preserveAspectRatio",
        "xMidYMid meet"
    );
}


/* =========================================
   ACCESSIBILITY
   ========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {
            document.body.dataset.theme =
                defaultTheme;

            themeButtons.forEach((button) => {
                button.classList.toggle(
                    "active",
                    button.dataset.theme === defaultTheme
                );
            });
        }
    }
);
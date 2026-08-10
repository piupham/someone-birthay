/* =====================================================
   THEME SWITCHER
   ===================================================== */

const themeButtons = document.querySelectorAll(".theme-btn");

themeButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const theme = button.dataset.theme;

    if (theme === "midnight") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute(
        "data-theme",
        theme
      );
    }

    themeButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

  });

});


/* =====================================================
   STAR ANIMATION
   ===================================================== */

const stars = document.querySelectorAll(".bubble");

stars.forEach((star, index) => {

  /*
    Tạo thời gian xuất hiện hơi khác nhau
    để các ngôi sao không xuất hiện đồng loạt.
  */

  const delay = index * 0.19;

  star.style.animationDelay = `${delay}s`;

  const svg = star.querySelector(".star");

  if (svg) {
    svg.style.animationDelay = `${delay}s`;
  }

});


/* =====================================================
   RANDOM STAR ROTATION
   ===================================================== */

stars.forEach((star) => {

  const randomRotation =
    Math.floor(Math.random() * 360);

  star.style.setProperty(
    "--random-rotation",
    `${randomRotation}deg`
  );

});


/* =====================================================
   KEEP THEME STATE
   ===================================================== */

window.addEventListener("load", () => {

  document.documentElement.removeAttribute(
    "data-theme"
  );

  themeButtons.forEach((button) => {
    button.classList.remove("active");
  });

  const midnight =
    document.querySelector(
      '[data-theme="midnight"]'
    );

  if (midnight) {
    midnight.classList.add("active");
  }

});

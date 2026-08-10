/* =========================================
   HEART PARTICLES
   ========================================= */

const heartContainer = document.getElementById("heartContainer");

const PARTICLE_COUNT = 52;


/*
 * Tạo vị trí hình trái tim.
 *
 * Công thức:
 * x = 16 sin³(t)
 * y = 13 cos(t)
 *      - 5 cos(2t)
 *      - 2 cos(3t)
 *      - cos(4t)
 *
 * Sau đó chuẩn hóa để hình trái tim luôn
 * nằm trong container hình vuông.
 */

function createHeartPositions(count) {
    const points = [];

    for (let i = 0; i < count; i++) {
        const t = (Math.PI * 2 * i) / count;

        const x =
            16 * Math.pow(Math.sin(t), 3);

        const y =
            13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t);

        points.push({
            x,
            y
        });
    }

    return points;
}


/*
 * Tạo thêm nhiều điểm bên trong trái tim.
 *
 * Điều này giúp trái tim không chỉ có
 * đường viền mà có cảm giác đầy đặn.
 */

function fillHeart(points, extraCount) {
    const result = [...points];

    for (let i = 0; i < extraCount; i++) {

        const angle =
            Math.random() * Math.PI * 2;

        const radius =
            Math.sqrt(Math.random());

        const t =
            angle;

        const x =
            16 * Math.pow(Math.sin(t), 3);

        const y =
            13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t);

        result.push({
            x: x * radius,
            y: y * radius
        });
    }

    return result;
}


/*
 * Xáo trộn để các hạt xuất hiện
 * theo thứ tự tự nhiên hơn.
 */

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];
    }

    return array;
}


/*
 * Tạo trái tim.
 */

function buildHeart() {

    heartContainer.innerHTML = "";

    let points =
        createHeartPositions(30);

    points =
        fillHeart(points, PARTICLE_COUNT - points.length);

    points =
        shuffle(points);


    /*
     * Kích thước hệ tọa độ.
     *
     * Giảm scale để trái tim vừa phải,
     * chừa không gian cho phần chữ.
     */

    const scale = 13.2;


    points.forEach((point, index) => {

        const particle =
            document.createElement("div");

        particle.className =
            "heart-particle";


        /*
         * Kích thước hạt ngẫu nhiên.
         * Tất cả vẫn là hình tròn.
         */

        const size =
            28 + Math.random() * 17;


        /*
         * Vị trí bắt đầu:
         * nằm rải rác xung quanh màn hình.
         */

        const startX =
            (Math.random() - 0.5) * 700;

        const startY =
            (Math.random() - 0.5) * 650;


        /*
         * Vị trí cuối cùng.
         *
         * Không scale X/Y riêng biệt nên
         * hình trái tim không bị kéo dài.
         */

        const targetX =
            point.x * scale;

        const targetY =
            -point.y * scale;


        const delay =
            0.04 * index
            + Math.random() * 0.35;


        particle.style.setProperty(
            "--size",
            `${size}px`
        );

        particle.style.setProperty(
            "--start-x",
            `${startX}px`
        );

        particle.style.setProperty(
            "--start-y",
            `${startY}px`
        );

        particle.style.setProperty(
            "--target-x",
            `${targetX}px`
        );

        particle.style.setProperty(
            "--target-y",
            `${targetY}px`
        );

        particle.style.setProperty(
            "--delay",
            `${delay}s`
        );


        heartContainer.appendChild(particle);


        /*
         * Sau khi hình thành xong,
         * thêm hiệu ứng chuyển động rất nhẹ.
         */

        setTimeout(() => {

            particle.classList.add("formed");

        }, (delay + 1.25) * 1000);

    });
}


/* =========================================
   THEME SWITCHER
   ========================================= */

const themeButtons =
    document.querySelectorAll(".theme-btn");


function setTheme(theme) {

    document.body.dataset.theme =
        theme;


    themeButtons.forEach(button => {

        const isActive =
            button.dataset.theme === theme;

        button.classList.toggle(
            "active",
            isActive
        );

    });


    /*
     * Lưu theme để lần sau mở trang
     * vẫn giữ màu đã chọn.
     */

    try {

        localStorage.setItem(
            "birthday-theme",
            theme
        );

    } catch (error) {

        // Không làm gì nếu localStorage bị chặn.

    }
}


themeButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            setTheme(
                button.dataset.theme
            );

        }
    );

});


/* =========================================
   INITIALIZE
   ========================================= */

function initialize() {

    /*
     * Golden là theme mặc định
     * vì đây là màu bạn thích.
     */

    let savedTheme = "golden";

    try {

        const storedTheme =
            localStorage.getItem(
                "birthday-theme"
            );

        if (storedTheme) {
            savedTheme = storedTheme;
        }

    } catch (error) {

        // Giữ Golden nếu không đọc được storage.

    }


    setTheme(savedTheme);

    buildHeart();
}


/* =========================================
   START
   ========================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initialize
    );

} else {

    initialize();

}
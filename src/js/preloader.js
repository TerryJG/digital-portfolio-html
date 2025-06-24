const preloaderPageData = {
    "index.html": {
        text: "Loading",
        class: "text-dark"
    },
    "projects.html": {
        text: "Loading",
        class: "text-warning"
    },
    "resume.html": {
        text: "Loading",
        class: "text-primary"
    },
    "credits.html": {
        text: "Loading",
        class: "text-success"
    },
}

document.addEventListener('DOMContentLoaded', function () {
    const body = document.getElementsByTagName("body")[0];
    const currentPage = window.location.pathname.split('/').pop();
    const currentPageData = preloaderPageData[currentPage] || {};

    const preloaderWrapper = document.createElement("div");
    preloaderWrapper.classList.add("preloader-wrapper");

    const spinnerBorder = document.createElement("div");
    spinnerBorder.classList.add("spinner-border", currentPageData.class || "text-success");
    spinnerBorder.setAttribute("role", "status");

    const loadingText = document.createElement("p");
    loadingText.classList.add("visually-hidden");
    loadingText.textContent = currentPageData.text || "Loading";

    spinnerBorder.appendChild(loadingText);
    preloaderWrapper.appendChild(spinnerBorder);

    const style = document.createElement("style");
    style.textContent = `
        .preloader-wrapper {
            display: flex;
            position: fixed;
            justify-content: center;
            align-items: center;
            top: 0;
            left: 0;
            height: 100vh;
            width: 100%;
            background-color: rgb(255, 255, 255);
            z-index: 10;
            transition: all ease-out 0.8s;
        }
        .spinner-border {
            width: 75px;
            height: 75px;
        }
    `;
    preloaderWrapper.appendChild(style);
    body.appendChild(preloaderWrapper);
});

window.addEventListener('load', () => {
    const preloaderWrapper = document.querySelector('.preloader-wrapper');
    if (preloaderWrapper) {
        preloaderWrapper.style.opacity = '0';

        setTimeout(() => {
            preloaderWrapper.style.display = 'none';
        }, 800); // fade-out duration
    }

    // Un-hide content once preloader is hidden/done
    const overview = document.querySelector('.overview'); // This is for index.html main container
    const mainContainer = document.querySelector('.main-container');
    const navWrapper = document.querySelector('.nav-wrapper');

    if (overview) {
        overview.style.display = 'flex';
    }
    if (mainContainer) {
        mainContainer.style.display = 'block';
    }
    if (navWrapper) {
        navWrapper.style.display = 'block';
    }
});
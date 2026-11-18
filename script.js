const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const preloader = document.querySelector(".preloader");
const preloaderCount = document.querySelector("[data-preloader-count]");
const preloaderImage = document.querySelector("[data-preload-image]");

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const finishLoading = () => {
  preloader?.classList.add("is-complete");
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-ready");
  window.setTimeout(() => preloader?.remove(), 1100);
};

if (!preloader) {
  document.body.classList.add("is-ready");
} else if (reducedMotion.matches) {
  finishLoading();
} else {
  const images = [
    "./assets/hero-form.svg",
    "./assets/work-04.svg",
    "./assets/work-01.svg",
    "./assets/work-02.svg",
  ];
  let imageIndex = 0;
  let count = 0;

  const imageTimer = window.setInterval(() => {
    imageIndex = (imageIndex + 1) % images.length;
    if (preloaderImage) preloaderImage.src = images[imageIndex];
  }, 210);

  const countTimer = window.setInterval(() => {
    count = Math.min(99, count + Math.ceil((99 - count) * 0.14));
    if (preloaderCount) preloaderCount.textContent = String(count).padStart(3, "0");

    if (count >= 99) {
      window.clearInterval(countTimer);
      window.clearInterval(imageTimer);
      if (preloaderCount) preloaderCount.textContent = "099";
      window.setTimeout(finishLoading, 480);
    }
  }, 48);

  window.setTimeout(() => {
    window.clearInterval(countTimer);
    window.clearInterval(imageTimer);
    finishLoading();
  }, 2400);
}

const stage = document.querySelector("#horizontalStage");
const track = document.querySelector("#horizontalTrack");
const progressLabel = document.querySelector("[data-progress]");
const servicesMenu = document.querySelector(".services-menu");
const desktopQuery = window.matchMedia("(min-width: 901px)");
let horizontalDistance = 0;
let scrollDistance = 0;
let ticking = false;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const animatePageScroll = (targetTop) => {
  if (reducedMotion.matches) {
    document.scrollingElement.scrollTop = targetTop;
    return;
  }

  const startTop = window.scrollY;
  const distance = targetTop - startTop;
  const startTime = performance.now();
  const duration = 900;

  const step = (time) => {
    const elapsed = clamp((time - startTime) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - elapsed, 4);
    document.scrollingElement.scrollTop = startTop + distance * eased;
    if (elapsed < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

const updateHorizontalPosition = () => {
  if (!stage || !track || !desktopQuery.matches) {
    ticking = false;
    return;
  }

  const travelled = clamp(-stage.getBoundingClientRect().top, 0, scrollDistance);
  const progress = scrollDistance > 0 ? travelled / scrollDistance : 0;
  track.style.transform = `translate3d(${-progress * horizontalDistance}px, 0, 0)`;
  if (progressLabel) progressLabel.textContent = `(${Math.round(progress * 100)}%)`;
  servicesMenu?.classList.toggle("is-hidden", progress > 0.025);
  ticking = false;
};

const requestHorizontalUpdate = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateHorizontalPosition);
};

const sizeHorizontalStage = () => {
  if (!stage || !track || !desktopQuery.matches) return;

  horizontalDistance = Math.max(0, track.scrollWidth - window.innerWidth);
  scrollDistance = Math.round(horizontalDistance * 0.39);
  stage.style.height = `${window.innerHeight + scrollDistance}px`;
  updateHorizontalPosition();
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!stage || !desktopQuery.matches) return;

    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    const targetProgress =
      horizontalDistance > 0 ? clamp(target.offsetLeft / horizontalDistance, 0, 1) : 0;
    animatePageScroll(stage.offsetTop + targetProgress * scrollDistance);
  });
});

document.querySelectorAll(".interest-list button").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".interest-list button")
      .forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
  });
});

window.addEventListener("scroll", requestHorizontalUpdate, { passive: true });
window.addEventListener("resize", sizeHorizontalStage);
window.addEventListener("load", sizeHorizontalStage);
scrollTo(0, 0);
sizeHorizontalStage();

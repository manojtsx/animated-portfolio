/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader() {
  const header = document.getElementById("header");
  // When the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
  if (this.scrollY >= 50) header.classList.add("scroll-header");
  else header.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);

/*=============== SERVICES MODAL ===============*/
// Get the modal
const modalViews = document.querySelectorAll(".services__modal"),
  modalBtns = document.querySelectorAll(".services__button"),
  modalClose = document.querySelectorAll(".services__modal-close");

// When the user clicks on the button, open the modal
let modal = function (modalClick) {
  modalViews[modalClick].classList.add("active-modal");
};

modalBtns.forEach((mb, i) => {
  mb.addEventListener("click", () => {
    modal(i);
  });
});

modalClose.forEach((mc) => {
  mc.addEventListener("click", () => {
    modalViews.forEach((mv) => {
      mv.classList.remove("active-modal");
    });
  });
});

/*=============== MIXITUP FILTER PORTFOLIO ===============*/

let mixer = mixitup(".work__container", {
  selectors: {
    target: ".work__card",
  },
  animation: {
    duration: 300,
  },
});

/* Link active work */
const workLinks = document.querySelectorAll(".work__item");

function activeWork(workLink) {
  workLinks.forEach((wl) => {
    wl.classList.remove("active-work");
  });
  workLink.classList.add("active-work");
}

workLinks.forEach((wl) => {
  wl.addEventListener("click", () => {
    activeWork(wl);
  });
});

/*=============== SWIPER TESTIMONIAL ===============*/

let swiperTestimonial = new Swiper(".testimonial__container", {
  spaceBetween: 24,
  loop: true,
  grabCursor: true,

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  breakpoints: {
    576: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 48,
    },
  },
});

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/

const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 58,
      sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.add("active-link");
    } else {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.remove("active-link");
    }
  });
}
window.addEventListener("scroll", scrollActive);

/*=============== LIGHT DARK THEME ===============*/
const themeButton = document.getElementById("theme-button");
const lightTheme = "light-theme";
const iconTheme = "bx-sun";

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

// We obtain the current theme that the interface has by validating the light-theme class
const getCurrentTheme = () =>
  document.body.classList.contains(lightTheme) ? "dark" : "light";
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "bx bx-moon" : "bx bx-sun";

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the light
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
    lightTheme
  );
  themeButton.classList[selectedIcon === "bx bx-moon" ? "add" : "remove"](
    iconTheme
  );
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
  // Add or remove the light / icon theme
  document.body.classList.toggle(lightTheme);
  themeButton.classList.toggle(iconTheme);
  // We save the theme and the current icon that the user chose
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
  origin: "top",
  distance: "60px",
  duration: 2500,
  delay: 400,
  reset: true,
});

sr.reveal(`.nav__menu`, {
  delay: 100,
  scale: 0.1,
  origin: "bottom",
  distance: "300px",
});

sr.reveal(`.home__data`);
sr.reveal(`.home__handle`, {
  delay: 100,
});

sr.reveal(`.home__social, .home__scroll`, {
  delay: 100,
  origin: "bottom",
});

sr.reveal(`.about__img`, {
  delay: 100,
  origin: "left",
  scale: 0.9,
  distance: "30px",
});

sr.reveal(`.about__data, .about__description, .about__button-contact`, {
  delay: 100,
  scale: 0.9,
  origin: "right",
  distance: "30px",
});

sr.reveal(`.skills__content`, {
  delay: 100,
  scale: 0.9,
  origin: "bottom",
  distance: "30px",
});

sr.reveal(`.services__title, services__button`, {
  delay: 100,
  scale: 0.9,
  origin: "top",
  distance: "30px",
});

sr.reveal(`.work__card`, {
  delay: 100,
  scale: 0.9,
  origin: "bottom",
  distance: "30px",
});

sr.reveal(`.testimonial__container`, {
  delay: 100,
  scale: 0.9,
  origin: "bottom",
  distance: "30px",
});

sr.reveal(`.contact__info, .contact__title-info`, {
  delay: 100,
  scale: 0.9,
  origin: "left",
  distance: "30px",
});

sr.reveal(`.contact__form, .contact__title-form`, {
  delay: 100,
  scale: 0.9,
  origin: "right",
  distance: "30px",
});

sr.reveal(`.footer, footer__container`, {
  delay: 100,
  scale: 0.9,
  origin: "bottom",
  distance: "30px",
});

/*=============== BLOG FETCH & PAGINATION ===============*/
const BLOG_API_URL = `https://wordpress-inuw7.wasmer.app/wp-json/wp/v2/posts?_embed`;
const BLOGS_PER_PAGE = 3;
let blogPosts = [];
let currentBlogPage = 1;

async function fetchBlogs() {
  try {
    const res = await fetch(`${BLOG_API_URL}&per_page=100`);
    if (!res.ok) throw new Error('Failed to fetch blogs');
    blogPosts = await res.json();
    renderBlogPage(1);
    renderBlogPagination();
  } catch (err) {
    document.getElementById('blog-posts').innerHTML = `<p style="color:red">Failed to load blogs.</p>`;
  }
}

function renderBlogPage(page) {
  currentBlogPage = page;
  const start = (page - 1) * BLOGS_PER_PAGE;
  const end = start + BLOGS_PER_PAGE;
  const posts = blogPosts.slice(start, end);
  const blogPostsContainer = document.getElementById('blog-posts');
  blogPostsContainer.innerHTML = posts.map(post => {
    const img = post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]?.source_url
      ? `<img class="blog__image" src="${post._embedded['wp:featuredmedia'][0].source_url}" alt="${post.title.rendered}" loading="lazy">`
      : '';
    const date = new Date(post.date).toLocaleDateString();
    const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 120) + '...';
    // Use slug for local blog page
    const slug = post.slug;
    return `
      <div class="blog__card">
        ${img}
        <div class="blog__content">
          <div class="blog__meta">${date} | ${post._embedded?.author?.[0]?.name || 'Admin'}</div>
          <h3 class="blog__title">${post.title.rendered}</h3>
          <div class="blog__excerpt">${excerpt}</div>
          <a class="blog__readmore" href="blog.html?slug=${encodeURIComponent(slug)}">Read More</a>
        </div>
      </div>
    `;
  }).join('');
  // Animate blog cards
  if (window.ScrollReveal) {
    ScrollReveal().reveal('.blog__card', {
      origin: 'bottom',
      distance: '40px',
      duration: 800,
      interval: 120,
      reset: false
    });
  }
}

function renderBlogPagination() {
  const totalPages = Math.ceil(blogPosts.length / BLOGS_PER_PAGE);
  const pagination = document.getElementById('blog-pagination');
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  let buttons = '';
  // Prev button
  buttons += `<button class="blog__page-btn" ${currentBlogPage === 1 ? 'disabled' : ''} data-page="${currentBlogPage - 1}">&laquo;</button>`;
  // Page numbers (show max 5, with ... if needed)
  let start = Math.max(1, currentBlogPage - 2);
  let end = Math.min(totalPages, currentBlogPage + 2);
  if (currentBlogPage <= 4) end = Math.min(4, totalPages);
  if (currentBlogPage >= totalPages - 3) start = Math.max(1, totalPages - 3);
  if (start > 1) buttons += `<span style="padding:0 0.5rem">...</span>`;
  for (let i = start; i <= end; i++) {
    buttons += `<button class="blog__page-btn${i === currentBlogPage ? ' active' : ''}" data-page="${i}">${i}</button>`;
  }
  if (end < totalPages) buttons += `<span style="padding:0 0.5rem">...</span>`;
  // Next button
  buttons += `<button class="blog__page-btn" ${currentBlogPage === totalPages ? 'disabled' : ''} data-page="${currentBlogPage + 1}">&raquo;</button>`;
  pagination.innerHTML = buttons;
  // Add event listeners
  pagination.querySelectorAll('.blog__page-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const page = parseInt(btn.getAttribute('data-page'));
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        renderBlogPage(page);
        renderBlogPagination();
        // Scroll to blog section on page change
        document.getElementById('blog').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Fetch blogs on DOMContentLoaded
window.addEventListener('DOMContentLoaded', fetchBlogs);

// JavaScript to toggle the chatbot visibility
document.getElementById('message-icon').addEventListener('click', function() {
  var chatbotContainer = document.getElementById('chatbot-container');
  if (chatbotContainer.style.display === 'none' || chatbotContainer.style.display === '') {
      chatbotContainer.style.display = 'block';
  } else {
      chatbotContainer.style.display = 'none';
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("assets/js/sw.js").then(
      (registration) => {
        console.log("Service Worker registered: ", registration);
      },
      (err) => {
        console.log("Service Worker registration failed: ", err);
      }
    );
  });
}

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Show a custom install button
  const installBtn = document.getElementById("installBtn");
  installBtn.style.display = "block";

  installBtn.addEventListener("click", () => {
    installBtn.style.display = "none";
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      deferredPrompt = null;
    });
  });
});

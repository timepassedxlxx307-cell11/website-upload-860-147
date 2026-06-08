(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupImages() {
    document.querySelectorAll("img").forEach(function (image) {
      image.addEventListener("error", function () {
        image.classList.add("is-missing");
      }, { once: true });
    });
  }

  function setupMobileNav() {
    var toggle = document.querySelector("[data-mobile-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var next = hero.querySelector("[data-hero-next]");
    var prev = hero.querySelector("[data-hero-prev]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }
    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        restart();
      });
    });
    restart();
  }

  function setupSearch() {
    var input = document.querySelector("[data-site-search]");
    var panel = document.querySelector("[data-search-results]");
    var data = window.SiteSearchIndex || [];
    if (!input || !panel || !data.length) {
      return;
    }

    function close() {
      panel.classList.remove("is-open");
    }

    function render(items) {
      if (!items.length) {
        panel.innerHTML = "<div>没有找到相关影片</div>";
      } else {
        panel.innerHTML = items.slice(0, 10).map(function (item) {
          return "<a href=\"" + item.url + "\"><strong>" + item.title + "</strong><span>" + item.year + " · " + item.region + " · " + item.category + "</span></a>";
        }).join("");
      }
      panel.classList.add("is-open");
    }

    input.addEventListener("input", function () {
      var keyword = input.value.trim().toLowerCase();
      if (!keyword) {
        close();
        return;
      }
      var results = data.filter(function (item) {
        return item.text.indexOf(keyword) !== -1;
      });
      render(results);
    });

    input.addEventListener("focus", function () {
      if (input.value.trim()) {
        input.dispatchEvent(new Event("input"));
      }
    });

    document.addEventListener("click", function (event) {
      if (!panel.contains(event.target) && event.target !== input) {
        close();
      }
    });
  }

  function setupLocalFilter() {
    var input = document.querySelector("[data-filter-input]");
    if (!input) {
      return;
    }
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    input.addEventListener("input", function () {
      var keyword = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search-text") || "").toLowerCase();
        card.classList.toggle("is-hidden-card", keyword && text.indexOf(keyword) === -1);
      });
    });
  }

  ready(function () {
    setupImages();
    setupMobileNav();
    setupHero();
    setupSearch();
    setupLocalFilter();
  });
})();

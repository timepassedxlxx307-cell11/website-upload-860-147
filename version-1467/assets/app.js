(function () {
  var menuButton = document.querySelector(".menu-toggle");
  var mobileNav = document.querySelector(".mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var activeIndex = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5200);
  }

  var searchInput = document.querySelector("[data-catalog-search]");
  var categorySelect = document.querySelector("[data-catalog-category]");
  var yearSelect = document.querySelector("[data-catalog-year]");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".catalog-card .movie-card, .movie-grid .movie-card[data-search]"));
  var emptyState = document.querySelector("[data-empty-state]");

  function applyCatalogFilters() {
    if (!cards.length) {
      return;
    }

    var term = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var category = categorySelect ? categorySelect.value : "all";
    var year = yearSelect ? yearSelect.value : "all";
    var visible = 0;

    cards.forEach(function (card) {
      var text = card.getAttribute("data-search") || "";
      var cardCategory = card.getAttribute("data-category") || "";
      var cardYear = card.getAttribute("data-year") || "";
      var matchesTerm = !term || text.indexOf(term) !== -1;
      var matchesCategory = category === "all" || cardCategory === category;
      var matchesYear = year === "all" || cardYear === year;
      var shouldShow = matchesTerm && matchesCategory && matchesYear;

      card.style.display = shouldShow ? "" : "none";

      if (shouldShow) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle("is-visible", visible === 0);
    }
  }

  [searchInput, categorySelect, yearSelect].forEach(function (control) {
    if (control) {
      control.addEventListener("input", applyCatalogFilters);
      control.addEventListener("change", applyCatalogFilters);
    }
  });
})();

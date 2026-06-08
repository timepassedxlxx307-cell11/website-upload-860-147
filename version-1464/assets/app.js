(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var toggle = qs('[data-menu-toggle]');
  var mobile = qs('[data-mobile-menu]');

  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      mobile.classList.toggle('is-open');
    });
  }

  var slides = qsa('[data-hero-slide]');
  var dots = qsa('[data-hero-dot]');
  var activeSlide = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === activeSlide);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === activeSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        showSlide(activeSlide + 1);
      }, 5200);
    });
  });

  if (slides.length > 1) {
    timer = window.setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  var filterRoot = qs('[data-filter-root]');
  if (filterRoot) {
    var input = qs('[data-filter-input]', filterRoot);
    var cards = qsa('[data-movie-card]', filterRoot);
    var buttons = qsa('[data-filter-category]', filterRoot);
    var empty = qs('[data-empty-state]', filterRoot);
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    var currentCategory = 'all';

    if (input && initial) {
      input.value = initial;
    }

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function applyFilter() {
      var query = normalize(input ? input.value : '');
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-meta')
        ].join(' '));
        var cat = card.getAttribute('data-category') || '';
        var matchesText = !query || haystack.indexOf(query) !== -1;
        var matchesCategory = currentCategory === 'all' || cat === currentCategory;
        var show = matchesText && matchesCategory;
        card.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        currentCategory = button.getAttribute('data-filter-category') || 'all';
        buttons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
        applyFilter();
      });
    });

    applyFilter();
  }
})();

(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        mobileNav.classList.toggle('is-open');
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');
    var active = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    function startCarousel() {
      if (slides.length <= 1) {
        return;
      }
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }

    if (slides.length) {
      showSlide(0);
      startCarousel();
      if (prev) {
        prev.addEventListener('click', function () {
          showSlide(active - 1);
          startCarousel();
        });
      }
      if (next) {
        next.addEventListener('click', function () {
          showSlide(active + 1);
          startCarousel();
        });
      }
      dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
          showSlide(index);
          startCarousel();
        });
      });
    }

    var searchInput = document.querySelector('[data-search-input]');
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));
    var selected = 'all';

    function filterCards() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-keywords') || '').toLowerCase();
        var group = card.getAttribute('data-filter-group') || '';
        var matchesQuery = !query || text.indexOf(query) !== -1;
        var matchesGroup = selected === 'all' || group.indexOf(selected) !== -1;
        card.classList.toggle('hidden-by-filter', !(matchesQuery && matchesGroup));
      });
    }

    if (searchInput && cards.length) {
      searchInput.addEventListener('input', filterCards);
    }

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        selected = button.getAttribute('data-filter-value') || 'all';
        filterButtons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
        filterCards();
      });
    });

    Array.prototype.slice.call(document.querySelectorAll('.stream-player')).forEach(function (player) {
      var video = player.querySelector('video');
      var playButton = player.querySelector('.play-button');
      var poster = player.querySelector('.player-poster');
      var stream = player.getAttribute('data-stream');
      var started = false;
      var hls = null;

      function begin() {
        if (!video || !stream) {
          return;
        }
        if (!started) {
          started = true;
          player.classList.add('is-playing');
          video.setAttribute('controls', 'controls');

          if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
          } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
              maxBufferLength: 30,
              enableWorker: true
            });
            hls.loadSource(stream);
            hls.attachMedia(video);
          } else {
            video.src = stream;
          }
        }

        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {});
        }
      }

      if (playButton) {
        playButton.addEventListener('click', begin);
      }
      if (poster) {
        poster.addEventListener('click', begin);
      }
      if (video) {
        video.addEventListener('click', function () {
          if (!started) {
            begin();
          }
        });
        video.addEventListener('emptied', function () {
          if (hls && typeof hls.destroy === 'function') {
            hls.destroy();
            hls = null;
          }
        });
      }
    });
  });
})();

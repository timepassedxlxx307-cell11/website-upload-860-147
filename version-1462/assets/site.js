(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var nextButton = carousel.querySelector('[data-hero-next]');
    var prevButton = carousel.querySelector('[data-hero-prev]');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function startTimer() {
      if (timer) {
        clearInterval(timer);
      }

      timer = setInterval(function () {
        showSlide(index + 1);
      }, 5000);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(parseInt(dot.getAttribute('data-hero-dot'), 10) || 0);
        startTimer();
      });
    });

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        showSlide(index + 1);
        startTimer();
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        showSlide(index - 1);
        startTimer();
      });
    }

    showSlide(0);
    startTimer();
  }

  var filterPanel = document.querySelector('[data-filter-panel]');

  if (filterPanel) {
    var keywordInput = filterPanel.querySelector('[data-filter-keyword]');
    var yearSelect = filterPanel.querySelector('[data-filter-year]');
    var regionSelect = filterPanel.querySelector('[data-filter-region]');
    var typeSelect = filterPanel.querySelector('[data-filter-type]');
    var resetButton = filterPanel.querySelector('[data-filter-reset]');
    var movieList = document.querySelector('[data-movie-list]');
    var emptyState = document.querySelector('[data-empty-state]');
    var cards = movieList ? Array.prototype.slice.call(movieList.querySelectorAll('.movie-card')) : [];

    function valueOf(node) {
      return node ? node.value.trim().toLowerCase() : '';
    }

    function applyFilters() {
      var keyword = valueOf(keywordInput);
      var year = valueOf(yearSelect);
      var region = valueOf(regionSelect);
      var type = valueOf(typeSelect);
      var visibleCount = 0;

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-year') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-type') || '',
          card.getAttribute('data-genre') || '',
          card.textContent || ''
        ].join(' ').toLowerCase();
        var matched = true;

        if (keyword && text.indexOf(keyword) === -1) {
          matched = false;
        }

        if (year && String(card.getAttribute('data-year') || '').toLowerCase() !== year) {
          matched = false;
        }

        if (region && String(card.getAttribute('data-region') || '').toLowerCase() !== region) {
          matched = false;
        }

        if (type && String(card.getAttribute('data-type') || '').toLowerCase() !== type) {
          matched = false;
        }

        card.style.display = matched ? '' : 'none';

        if (matched) {
          visibleCount += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('is-visible', visibleCount === 0);
      }
    }

    [keywordInput, yearSelect, regionSelect, typeSelect].forEach(function (node) {
      if (node) {
        node.addEventListener('input', applyFilters);
        node.addEventListener('change', applyFilters);
      }
    });

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        [keywordInput, yearSelect, regionSelect, typeSelect].forEach(function (node) {
          if (node) {
            node.value = '';
          }
        });

        applyFilters();
      });
    }
  }

  var searchInput = document.querySelector('[data-search-input]');
  var searchResults = document.querySelector('[data-search-results]');
  var searchCount = document.querySelector('[data-search-count]');

  if (searchInput && searchResults) {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';
    searchInput.value = initialQuery;

    function escapeHtml(value) {
      return String(value || '').replace(/[&<>"']/g, function (character) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[character];
      });
    }

    function renderCard(movie) {
      var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('');

      return [
        '<article class="movie-card">',
        '  <a class="poster-link" href="' + escapeHtml(movie.url) + '" aria-label="观看' + escapeHtml(movie.title) + '">',
        '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
        '    <span class="poster-shade"></span>',
        '    <span class="play-chip">▶ 在线观看</span>',
        '  </a>',
        '  <div class="movie-card-body">',
        '    <h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>',
        '    <p class="movie-meta">' + escapeHtml(movie.year) + ' · ' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.type) + '</p>',
        '    <p class="movie-line">' + escapeHtml(movie.one_line) + '</p>',
        '    <div class="tag-row">' + tags + '</div>',
        '  </div>',
        '</article>'
      ].join('\n');
    }

    function runSearch(items, query) {
      var normalized = String(query || '').trim().toLowerCase();

      if (!normalized) {
        searchResults.innerHTML = '';
        if (searchCount) {
          searchCount.textContent = '请输入关键词开始搜索。';
        }
        return;
      }

      var matched = items.filter(function (movie) {
        return movie.search_text.indexOf(normalized) !== -1;
      }).slice(0, 120);

      searchResults.innerHTML = matched.map(renderCard).join('\n');

      if (searchCount) {
        searchCount.textContent = '找到 ' + matched.length + ' 条相关影片。';
      }
    }

    fetch('assets/movie-search.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (items) {
        runSearch(items, initialQuery);

        searchInput.addEventListener('input', function () {
          runSearch(items, searchInput.value);
        });
      })
      .catch(function () {
        if (searchCount) {
          searchCount.textContent = '搜索数据暂时无法加载。';
        }
      });
  }
}());

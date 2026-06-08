(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-slide-dot]'));
        var prev = carousel.querySelector('[data-slide-prev]');
        var next = carousel.querySelector('[data-slide-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
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

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                restart();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-slide-dot')) || 0);
                restart();
            });
        });

        show(0);
        restart();
    });

    document.querySelectorAll('[data-movie-search]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            var input = form.querySelector('input[name="q"]');
            if (!input || !input.value.trim()) {
                event.preventDefault();
                window.location.href = 'movies.html';
            }
        });
    });

    document.querySelectorAll('[data-filter-page]').forEach(function (page) {
        var textInput = page.querySelector('[data-page-filter]');
        var categorySelect = page.querySelector('[data-category-filter]');
        var typeSelect = page.querySelector('[data-type-filter]');
        var cards = Array.prototype.slice.call(page.querySelectorAll('[data-movie-card]'));
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';

        if (textInput && query) {
            textInput.value = query;
        }

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function apply() {
            var text = normalize(textInput ? textInput.value : '');
            var category = normalize(categorySelect ? categorySelect.value : '');
            var type = normalize(typeSelect ? typeSelect.value : '');

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-category'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-tags')
                ].join(' '));
                var cardCategory = normalize(card.getAttribute('data-category'));
                var cardType = normalize(card.getAttribute('data-type'));
                var visible = true;

                if (text && haystack.indexOf(text) === -1) {
                    visible = false;
                }

                if (category && cardCategory !== category) {
                    visible = false;
                }

                if (type && cardType.indexOf(type) === -1) {
                    visible = false;
                }

                card.hidden = !visible;
            });
        }

        [textInput, categorySelect, typeSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });

        apply();
    });
})();

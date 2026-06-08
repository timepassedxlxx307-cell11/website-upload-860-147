(function () {
    var body = document.body;
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');

    if (toggle && links) {
        toggle.addEventListener('click', function () {
            var open = links.classList.toggle('is-open');
            toggle.classList.toggle('is-open', open);
            body.classList.toggle('locked', open);
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var active = 0;

    function setSlide(index) {
        if (!slides.length) {
            return;
        }
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('is-active', i === active);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('is-active', i === active);
        });
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            setSlide(i);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            setSlide(active + 1);
        }, 5600);
    }

    setSlide(0);

    var panels = Array.prototype.slice.call(document.querySelectorAll('.filter-panel'));

    panels.forEach(function (panel) {
        var input = panel.querySelector('[data-filter-input]');
        var type = panel.querySelector('[data-filter-type]');
        var region = panel.querySelector('[data-filter-region]');
        var scope = panel.getAttribute('data-filter-scope') || 'body';
        var root = scope === 'body' ? document : document.querySelector(scope);
        var cards = root ? Array.prototype.slice.call(root.querySelectorAll('.movie-card, .rank-item')) : [];
        var empty = document.querySelector(panel.getAttribute('data-empty-target') || '');

        function update() {
            var q = input ? input.value.trim().toLowerCase() : '';
            var t = type ? type.value : '';
            var r = region ? region.value : '';
            var shown = 0;

            cards.forEach(function (card) {
                var haystack = (card.getAttribute('data-keywords') || '').toLowerCase();
                var cardType = card.getAttribute('data-type') || '';
                var cardRegion = card.getAttribute('data-region') || '';
                var matched = (!q || haystack.indexOf(q) !== -1) && (!t || cardType === t) && (!r || cardRegion === r);
                card.hidden = !matched;
                if (matched) {
                    shown += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', shown === 0);
            }
        }

        if (input) {
            input.addEventListener('input', update);
        }
        if (type) {
            type.addEventListener('change', update);
        }
        if (region) {
            region.addEventListener('change', update);
        }
        update();
    });
})();

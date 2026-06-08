(function() {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function() {
        var navToggle = document.querySelector(".nav-toggle");
        var navMenu = document.getElementById("navMenu");

        if (navToggle && navMenu) {
            navToggle.addEventListener("click", function() {
                var expanded = navToggle.getAttribute("aria-expanded") === "true";
                navToggle.setAttribute("aria-expanded", String(!expanded));
                navMenu.classList.toggle("open", !expanded);
            });
        }

        document.querySelectorAll("[data-hero]").forEach(function(hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
            var current = 0;
            var timer = null;

            function show(index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function(slide, slideIndex) {
                    slide.classList.toggle("active", slideIndex === current);
                });
                dots.forEach(function(dot, dotIndex) {
                    dot.classList.toggle("active", dotIndex === current);
                });
            }

            function play() {
                if (slides.length > 1) {
                    timer = window.setInterval(function() {
                        show(current + 1);
                    }, 5200);
                }
            }

            dots.forEach(function(dot, index) {
                dot.addEventListener("click", function() {
                    if (timer) {
                        window.clearInterval(timer);
                    }
                    show(index);
                    play();
                });
            });

            show(0);
            play();
        });

        var searchInput = document.getElementById("siteSearch");
        var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-button"));
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
        var activeFilter = "all";

        function normalize(value) {
            return String(value || "").trim().toLowerCase();
        }

        function applyFilter() {
            var keyword = normalize(searchInput ? searchInput.value : "");
            cards.forEach(function(card) {
                var haystack = normalize(card.getAttribute("data-search"));
                var type = normalize(card.getAttribute("data-type"));
                var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var matchesFilter = activeFilter === "all" || type.indexOf(normalize(activeFilter)) !== -1 || haystack.indexOf(normalize(activeFilter)) !== -1;
                card.classList.toggle("hidden-by-filter", !(matchesKeyword && matchesFilter));
            });
        }

        if (searchInput && cards.length) {
            searchInput.addEventListener("input", applyFilter);
        }

        filterButtons.forEach(function(button) {
            button.addEventListener("click", function() {
                activeFilter = button.getAttribute("data-filter") || "all";
                filterButtons.forEach(function(item) {
                    item.classList.toggle("active", item === button);
                });
                applyFilter();
            });
        });
    });
})();

function initMoviePlayer(videoId, sourceUrl) {
    var video = document.getElementById(videoId);

    if (!video || !sourceUrl) {
        return;
    }

    var shell = video.closest(".player-shell");
    var overlay = shell ? shell.querySelector(".player-overlay") : null;
    var attached = false;
    var hlsInstance = null;

    function attachSource() {
        if (attached) {
            return;
        }

        attached = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = sourceUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(sourceUrl);
            hlsInstance.attachMedia(video);
        } else {
            video.src = sourceUrl;
        }
    }

    function startPlayback() {
        attachSource();

        if (shell) {
            shell.classList.add("is-playing");
        }

        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(function() {});
        }
    }

    if (overlay) {
        overlay.addEventListener("click", startPlayback);
    }

    video.addEventListener("click", function() {
        if (video.paused) {
            startPlayback();
        }
    });

    video.addEventListener("play", function() {
        if (shell) {
            shell.classList.add("is-playing");
        }
    });

    window.addEventListener("beforeunload", function() {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}

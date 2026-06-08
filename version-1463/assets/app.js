(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".mobile-panel");

    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        var opened = panel.hasAttribute("hidden");
        if (opened) {
          panel.removeAttribute("hidden");
        } else {
          panel.setAttribute("hidden", "");
        }
        toggle.setAttribute("aria-expanded", opened ? "true" : "false");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var thumbs = Array.prototype.slice.call(document.querySelectorAll(".hero-thumb"));
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === activeIndex);
      });
      thumbs.forEach(function (thumb, thumbIndex) {
        thumb.classList.toggle("active", thumbIndex === activeIndex);
      });
    }

    function startHero() {
      if (slides.length < 2) {
        return;
      }
      timer = window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5600);
    }

    thumbs.forEach(function (thumb, index) {
      thumb.addEventListener("click", function () {
        if (timer) {
          window.clearInterval(timer);
        }
        showSlide(index);
        startHero();
      });
    });

    showSlide(0);
    startHero();

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll("[data-filter-input]"));
    var cardLists = Array.prototype.slice.call(document.querySelectorAll("[data-card-list]"));
    var emptyBox = document.querySelector("[data-empty]");
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";

    searchInputs.forEach(function (input) {
      if (query) {
        input.value = query;
      }

      input.addEventListener("input", function () {
        filterCards(input.value);
      });
    });

    function filterCards(value) {
      var keyword = normalize(value);
      var visible = 0;

      cardLists.forEach(function (list) {
        Array.prototype.slice.call(list.querySelectorAll(".movie-card")).forEach(function (card) {
          var text = normalize(card.getAttribute("data-search"));
          var ok = !keyword || text.indexOf(keyword) !== -1;
          card.style.display = ok ? "" : "none";
          if (ok) {
            visible += 1;
          }
        });
      });

      if (emptyBox) {
        emptyBox.classList.toggle("show", visible === 0);
      }
    }

    if (query) {
      filterCards(query);
    }

    Array.prototype.slice.call(document.querySelectorAll("[data-chip]")).forEach(function (chip) {
      chip.addEventListener("click", function () {
        var target = chip.getAttribute("data-chip") || "";
        searchInputs.forEach(function (input) {
          input.value = target;
        });
        filterCards(target);
        Array.prototype.slice.call(document.querySelectorAll("[data-chip]")).forEach(function (item) {
          item.classList.toggle("active", item === chip);
        });
      });
    });
  });

  window.SitePlayer = {
    init: function (source) {
      var video = document.getElementById("movieVideo");
      var overlay = document.getElementById("playLayer");
      var loaded = false;
      var hlsInstance = null;

      function loadVideo() {
        if (!video || loaded) {
          return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            maxBufferLength: 30
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
        } else {
          video.src = source;
        }

        loaded = true;
      }

      function startPlayback() {
        if (!video) {
          return;
        }
        loadVideo();
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
        var playTask = video.play();
        if (playTask && typeof playTask.catch === "function") {
          playTask.catch(function () {});
        }
      }

      if (overlay) {
        overlay.addEventListener("click", startPlayback);
      }

      if (video) {
        video.addEventListener("play", function () {
          if (overlay) {
            overlay.classList.add("is-hidden");
          }
        });

        video.addEventListener("click", function () {
          if (video.paused) {
            startPlayback();
          }
        });
      }

      window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    }
  };
})();

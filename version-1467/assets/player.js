(function () {
  function initMoviePlayer(source) {
    var video = document.getElementById("moviePlayer");
    var startButton = document.getElementById("startPlayer");
    var loaded = false;
    var hlsInstance = null;

    if (!video || !source) {
      return;
    }

    function attachSource() {
      if (loaded) {
        return;
      }

      loaded = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        return;
      }

      video.src = source;
    }

    function start() {
      attachSource();
      video.controls = true;

      if (startButton) {
        startButton.classList.add("is-hidden");
      }

      var attempt = video.play();

      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () {});
      }
    }

    if (startButton) {
      startButton.addEventListener("click", start);
    }

    video.addEventListener("click", function () {
      if (!loaded) {
        start();
      }
    });

    video.addEventListener("play", function () {
      if (startButton) {
        startButton.classList.add("is-hidden");
      }
    });

    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();

(function () {
  var video = document.getElementById('movieVideo');
  var overlay = document.getElementById('playerOverlay');
  var startButton = document.getElementById('playerStartButton');
  var source = window.MoviePlayerSource;
  var loaded = false;
  var hlsInstance = null;

  function loadSource() {
    if (!video || !source || loaded) {
      return;
    }

    loaded = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = source;
  }

  function beginPlayback() {
    if (!video) {
      return;
    }

    loadSource();

    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    video.controls = true;

    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  if (overlay) {
    overlay.addEventListener('click', beginPlayback);
  }

  if (startButton) {
    startButton.addEventListener('click', function (event) {
      event.stopPropagation();
      beginPlayback();
    });
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        beginPlayback();
      }
    });

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hlsInstance && typeof hlsInstance.destroy === 'function') {
      hlsInstance.destroy();
    }
  });
}());

(function () {
  function select(name) {
    return document.querySelector(name);
  }

  function boot(video, stream) {
    if (video.dataset.ready === '1') {
      video.play().catch(function () {});
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      video.dataset.ready = '1';
      video.play().catch(function () {});
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      video.dataset.ready = '1';
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
      return;
    }

    video.src = stream;
    video.dataset.ready = '1';
    video.play().catch(function () {});
  }

  window.MoviePlayer = {
    mount: function (stream) {
      var video = select('[data-player-video]');
      var cover = select('[data-player-cover]');
      if (!video || !stream) {
        return;
      }

      function start() {
        if (cover) {
          cover.classList.add('is-hidden');
        }
        video.controls = true;
        boot(video, stream);
      }

      if (cover) {
        cover.addEventListener('click', start);
      }

      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        }
      });
    }
  };
})();

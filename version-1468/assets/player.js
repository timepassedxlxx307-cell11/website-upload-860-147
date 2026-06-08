var MoviePlayer = (function () {
  function start(options) {
    var video = document.querySelector(options.videoSelector);
    var trigger = document.querySelector(options.triggerSelector);
    var cover = document.querySelector(options.coverSelector);
    var message = document.querySelector(options.messageSelector);
    var source = options.source;
    var hls = null;
    var loaded = false;

    function setMessage(text) {
      if (!message) {
        return;
      }
      message.textContent = text || "";
      message.classList.toggle("is-open", Boolean(text));
    }

    function load() {
      if (!video || loaded) {
        return;
      }
      loaded = true;
      setMessage("正在加载播放内容...");
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setMessage("");
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
            setMessage("正在重新连接...");
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
            setMessage("正在恢复播放...");
          } else {
            setMessage("播放暂时不可用，请稍后再试");
          }
        });
      } else {
        video.src = source;
      }
    }

    function play() {
      if (!video) {
        return;
      }
      load();
      if (cover) {
        cover.classList.add("is-hidden");
      }
      video.controls = true;
      var result = video.play();
      if (result && typeof result.then === "function") {
        result.then(function () {
          setMessage("");
        }).catch(function () {
          setMessage("点击播放按钮开始观看");
        });
      }
    }

    if (trigger) {
      trigger.addEventListener("click", play);
    }
    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener("canplay", function () {
        setMessage("");
      });
    }

    return {
      load: load,
      play: play,
      destroy: function () {
        if (hls) {
          hls.destroy();
        }
      }
    };
  }

  return {
    start: start
  };
})();

(function () {
    window.initMoviePlayer = function (source) {
        var video = document.querySelector('[data-video]');
        var overlay = document.querySelector('[data-play-overlay]');
        var button = document.querySelector('[data-play-button]');
        var loader = document.querySelector('[data-player-loader]');
        var message = document.querySelector('[data-player-message]');
        var prepared = false;
        var hls = null;

        if (!video || !source) {
            return;
        }

        function setLoading(value) {
            if (loader) {
                loader.hidden = !value;
            }
        }

        function fail() {
            setLoading(false);
            if (message) {
                message.textContent = '暂时无法播放，请稍后再试';
            }
        }

        function prepare() {
            if (prepared) {
                return;
            }
            prepared = true;
            setLoading(true);

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                video.addEventListener('loadedmetadata', function () {
                    setLoading(false);
                }, { once: true });
                video.addEventListener('error', fail, { once: true });
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    setLoading(false);
                });
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (!data || !data.fatal) {
                        return;
                    }
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    } else {
                        fail();
                    }
                });
                return;
            }

            fail();
        }

        function start() {
            prepare();
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            video.controls = true;
            var playRequest = video.play();
            if (playRequest && typeof playRequest.catch === 'function') {
                playRequest.catch(function () {
                    if (overlay) {
                        overlay.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (button) {
            button.addEventListener('click', function (event) {
                event.stopPropagation();
                start();
            });
        }

        if (overlay) {
            overlay.addEventListener('click', start);
        }

        video.addEventListener('click', function () {
            if (!prepared) {
                start();
            }
        });

        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    };
})();

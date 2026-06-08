(function () {
    function attach(videoId, playlistUrl) {
        var video = document.getElementById(videoId);
        if (!video) {
            return;
        }

        var frame = video.closest('.player-frame');
        var button = frame ? frame.querySelector('.player-start') : null;
        var ready = false;
        var instance = null;

        function bind() {
            if (ready) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = playlistUrl;
                ready = true;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                instance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                instance.loadSource(playlistUrl);
                instance.attachMedia(video);
                ready = true;
                return;
            }

            video.src = playlistUrl;
            ready = true;
        }

        function play() {
            bind();
            video.setAttribute('controls', 'controls');
            if (button) {
                button.classList.add('is-hidden');
            }
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {
                    if (button) {
                        button.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                play();
            });
        }

        if (frame) {
            frame.addEventListener('click', function (event) {
                if (event.target === video && video.hasAttribute('controls')) {
                    return;
                }
                play();
            });
        }

        video.addEventListener('ended', function () {
            if (button) {
                button.classList.remove('is-hidden');
            }
        });
    }

    window.startMoviePlayer = attach;
})();

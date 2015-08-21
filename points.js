function YoutubePoint (config) {
	if (typeof config !== 'object') {
		console.log("Must set a configuration object");
		return;
	}

	if (typeof config.videoId == 'string') {
		this.initializePlayer(config.videoId);
	}

	return this;
}

YoutubePoint.prototype.initializePlayer = function (videoId) {
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";

	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	this.player = null;
	var self = this;

	window.onYouTubeIframeAPIReady = function () {
	    self.player = new YT.Player('player', {
	        height: '390',
	        width: '640',
	        videoId: videoId,
	    });

	    self.player.addEventListener('onReady', self.createPointsDisplay.bind(self));
	}
};

YoutubePoint.prototype.createPointsDisplay = function() {
    this.totalPoints = 100,
    this.isPlaying = false,
    this.currentPoint = 0,
    this.timer = null,
    this.videoLength = this.player.getDuration(),
    this.pointsPerSecond = this.totalPoints / this.videoLength;

    this.pointsContainer = document.createElement('div');
    this.pointsContainer.appendChild(document.createTextNode('0'));
    document.body.insertBefore(this.pointsContainer, this.player.f);

    this.player.addEventListener('onStateChange', function(e) {
        if (e.data == YT.PlayerState.PLAYING) {
            this.isPlaying = true;
            this.startCounter();
        } else {
            this.isPlaying = false
            this.stopCounter();
        }
    }.bind(this));
};

YoutubePoint.prototype.startCounter = function () {
    console.log('starting counter');
    if (this.timer !== null)
        return;

    this.timer = setInterval(function() {
        if (!this.isPlaying)
            return;

        this.currentPoint += this.pointsPerSecond;

       this.pointsContainer.innerHTML = parseInt(this.currentPoint);
    }.bind(this), 1000);
};

YoutubePoint.prototype.stopCounter = function () {
    console.log('stopping counter');
    if (this.timer == null)
        return;

    clearInterval(this.timer);
    this.timer = null;
};

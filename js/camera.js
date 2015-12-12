
function Camera() {
	'use strict';
	return;
}

(function strict() {
	Camera.prototype.init = function() {
		this.cameraInit();
		this.galleryInit();
	};
	
	Camera.prototype.galleryInit = function() {
		var self = this;
		self.gallery = new Gallery();
		self.gallery.init();
	};
	
	Camera.prototype.cameraInit = function (){
		var media_options = {	
				video: true,
				audio: false
		};
		
		navigator.getUserMedia = navigator.getUserMedia ||
			navigator.webkitGetUserMedia;
		
		if (typeof (navigator.getUserMedia) === 'function') {
			navigator.getUserMedia(media_options,
					this.cameraSuccess.bind(this));
		}
	};
	
	Camera.prototype.cameraSuccess = function (cameraStream) {
		var video = 
			$('<video/>')
			.attr({
				id:'video',
				autoplay: 'autoplay',
				src: window.webkitURL.createObjectURL(cameraStream)
			})
			.css({ 
				height: '100%',
				width: '100%'
			}).appendTo('#camera-screen').get(0);
		
		$('#capture-bnt').on('click', this.captureVideo.bind(this, video));
	};
	
	Camera.prototype.captureVideo = function (video) {
		var canvas = document.createElement('canvas');
		canvas.width = $(video).width();
		canvas.height = $(video).height();
        
		canvas.getContext('2d').drawImage(video, 0, 0, 
									$(video).width(),$(video).height());
		
		var data = canvas.toDataURL('image/jpeg')
							.replace('data:image/jpeg;base64,','');
		
		tizen.filesystem.resolve(
				'images', 
				this.onResolveSuccess.bind(this, data), 
				this.onError,
				'rw');
	};
	
	Camera.prototype.onResolveSuccess = function(data, dir) {
		var self = this;
		var filename = 'IMG_' + Date.now() + '.jpg';
		var file = dir.createFile(filename);

		file.openStream('w',
						function saveFile(fileStream){
							fileStream.writeBase64(data);
							fileStream.close();
							
							self.gallery.addFile(filename);
							alert('');
						}, 
						this.onError,
						'UTF-8');
	};
	
	Camera.prototype.onError = function (e) {
		 console.log('message: ' + e.message);
	};
}());

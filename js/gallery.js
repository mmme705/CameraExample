
function Gallery() {
	'use strict'
	return;
}
(function strict() {
	Gallery.prototype = {
		current_idx:0,
		max_idx:0,
		filesPath: []
	};
	
	Gallery.prototype.init = function () {
		var self = this;
		
		self.loadFiles();
		
		$('#pre-bnt').on('click', function(){
			if ( self.current_idx > 0) {
				self.current_idx--;
				$('#image').attr({
					src: self.filesPath[self.current_idx]
				});
			}
		});
		
		$('#next-bnt').on('click', function() {
			if ( self.current_idx < self.max_idx) {
				self.current_idx++;
				$('#image').attr({
					src: self.filesPath[self.current_idx]
				});
			}
		});
	};
	
	Gallery.prototype.addFile= function (filename){
		var self = this;
		
		tizen.filesystem.resolve(
				'images',
			   function(dir) {
					try {
						file = dir.resolve(filename);
						self.filesPath[self.filesPath.length] = file.toURI();
						self.loadLastFile();
					} catch (exc) {
						console.log('Could not resolve file: ' + exc.message); 
						return;
					}
			   }, function(e) {
			     console.log("Error" + e.message);
			   }, 'r'
			 );
	};
	
	Gallery.prototype.loadLastFile = function () {
		var self = this;
		
		if (self.filesPath.length >= 1) {
			self.max_idx = self.filesPath.length -1;
			self.current_idx = self.max_idx;
			$('#image').attr({ 
				src: self.filesPath[self.current_idx]
			});
		}
	};
	
	Gallery.prototype.loadFiles = function (){
		var self = this;
		
		function onlistFilesSuccess(files) {
			for (var i = 0; i < files.length; i++) {
				if (files[i].isDirectory == false) {
					console.log("File name is " + files[i].name + ", " +
													"URI is " + files[i].toURI());
					self.filesPath[i] = files[i].toURI();
				}
			}
			self.loadLastFile();
		}

		function onlistFilesError(error) {
			console.log("The error " + error.message);
		}
		
		tizen.filesystem.resolve(
					'images',
				   function(dir) {
				     dir.listFiles(onlistFilesSuccess, onlistFilesError);
				   }, function(e) {
				     console.log("Error" + e.message);
				   }, 'r'
				 );
	};
}());
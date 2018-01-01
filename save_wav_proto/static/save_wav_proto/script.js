//(function(){
	'use strict'
	
	var constraints = {
			audio : true,
	};
	var audioRecorder = null;
	var chunks = [];
	var audioStream = null;
	var audioData = null;
	
	function getAudioStream(){
		navigator.mediaDevices.getUserMedia(constraints)
		.then(function(stream){
			chunks = [];
			audioStream = stream;
			audioRecorder = new MediaRecorder(audioStream);
			startRecording();
			
			audioRecorder.ondataavailable = function(e){
				chunks.push(e.data);
			};
			
			audioRecorder.onstop = function(e){
				audioStream.getTracks()[0].stop();
				audioStream = null;
				var blob = new Blob(chunks, {'type': 'audio/wav'});
				audioData = blob;
				var url = URL.createObjectURL(blob);
				var mt = document.createElement('audio');
				mt.controls = true;
				mt.src = url;
				document.body.appendChild(mt);
			};
		})
		.catch(function(err){
			alert("some error occurred while getting audio stream.");
		})
	}
	
	function startRecording(){
		audioData = null;
		audioRecorder.start();
	}
	
	function stopRecording(){
		audioRecorder.stop();
	}
	
	function submitToServer(){
		var req = new XMLHttpRequest();
		req.open("POST", "/swp/handleaudio/", true)
		req.send(audioData);
	}
	
//})())
//(function(){
	'use strict'
	
	var constraints = {
			audio : true,
	};
	var recorder = null;
	var audioStream = null;
	var audioData = null;
	
	function startRecording(){
		navigator.mediaDevices.getUserMedia(constraints)
		.then(function(stream){
			audioStream = stream;
			var audioContext = new AudioContext();
			var source = audioContext.createMediaStreamSource(stream);
			recorder = audioRecorder.fromSource(source);
			recorder.record();
		})
		.catch(function(err){
			alert("some error occurred while getting audio stream.");
		})
	}
	
	function stopRecording(){
		recorder.stop();
		recorder.exportWAV(function(blob){
			audioStream.getTracks()[0].stop();
			audioStream = null;
			audioData = blob;
			var url = URL.createObjectURL(blob);
			var mt = document.createElement('audio');
			mt.controls = true;
			mt.src = url;
			document.body.appendChild(mt);
		});
		recorder.clear();
	}
	
	function submitToServer(){
		var req = new XMLHttpRequest();
		req.onload = function(response){
			var paraid = document.getElementById("result");
			paraid.innerHTML = response.currentTarget.responseText;
		}
		req.open("POST", "/swp/handleaudio/", true)
		req.send(audioData);
	}
	
//})())
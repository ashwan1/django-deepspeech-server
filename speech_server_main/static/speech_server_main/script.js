//(function(){
    'use strict'

    var constraints = {
            audio : true,
    };
    var recorder = null;
    var audioStream = null;
    var audioData = null;
    var audioContext = null;

    function startRecording(){
        navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream){
            audioStream = stream;
            if(!audioContext){
                audioContext = new AudioContext();
            }
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
            $('#player')[0].innerHTML = "";
            $('#player').append(mt);
        });
        recorder.clear();
    }

    function submitToServer(){
        if(audioData == null) {
            $('#error-panel').addClass('alert-danger');
            $('#error-message').text("There is no audio data here!");
            $('#error-panel').show();
            return;
        }

        $('#error-panel').hide();
        var req = new XMLHttpRequest();
        $('#progress-panel').show();
        $('.progress-bar').css('width', '0%').attr('aria-valuenow', 0);
        $('.progress-bar').animate({
            width: "100%"
        }, 1500);
        req.onload = function(response){
            $('#result').text(response.currentTarget.responseText);
            $('#progress-panel').hide();
        }
        req.open("POST", "/dsserver/handleaudio/", true)
        req.send(audioData);
    }

    var openFile = function(event) {
        var input = event.target;
        var url = URL.createObjectURL(input.files[0]);
        var mt = document.createElement('audio');
        audioData = input.files[0];
        mt.controls = true;
        mt.src = url;
        $('#player')[0].innerHTML = "";
        $('#player').append(mt);
    };

    $(window).on('load',function(){
        $("#file").change(openFile);
    });

//})())

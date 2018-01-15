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

    function getCookie(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie != '') {
          var cookies = document.cookie.split(';');
          for (var i = 0; i < cookies.length; i++) {
              var cookie = cookies[i].trim();
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) == (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
  }

    function submitToServer(){
        if(audioData == null) {
            $('#error-panel').addClass('alert-danger');
            $('#error-message').text("There is no audio data here!");
            $('#error-panel').show();
            return;
        }

        $('#error-panel').hide();
        $('#progress-panel').show();
        $('.progress-bar').css('width', '0%').attr('aria-valuenow', 0);
        $('.progress-bar').animate({
            width: "100%"
        }, 1500);
        $.ajax({
          url: "/dsserver/handleaudio/",
          type: "POST",
          contentType: 'application/octet-stream',
          data: audioData,
          processData: false,
          headers: {
            'X-CSRFTOKEN': getCookie('csrftoken')
          },
          success: function(response){
            $('#result').text(response);
            $('#progress-panel').hide();
          },
          error: function(response){
            $('#result').text(response.responseText);
            $('#progress-panel').hide();
          }
        });
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

from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.http.response import HttpResponse
from datetime import datetime
from .deepspeech import deepspeech as ds
from speech_server_main.config import config

conf = config.ConfigDeepSpeech()

@ensure_csrf_cookie
def index(request):
    return render(request, 'speech_server_main/index.html')

@csrf_exempt
def handle_audio(request):
    try:
        data=request.body
        audiofiledir = conf.get_config('audiofiledir')
        file_name = audiofiledir + 'swp_generated_' + datetime.now().strftime('%y-%m-%d_%H%M%S')
        with open(file_name, 'wb') as f:
            f.write(data)

        msg = ds.stt(file_name)
    except:
        msg = "failed"
    return HttpResponse(msg)

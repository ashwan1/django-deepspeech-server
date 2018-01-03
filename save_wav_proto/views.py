from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from datetime import datetime


def index(request):
    return render(request, 'save_wav_proto/index.html')

@csrf_exempt
def handle_audio(request):
    try:
        data=request.body
        file_name = '/home/ashwanip/Desktop/DeepSpeech/native_client/audio/swp_generated_' + datetime.now().strftime('%y-%m-%d_%H%M%S')
        f = open(file_name, 'wb')
        f.write(data)
        f.close()
        msg = "success"
    except:
        msg = "failed"
    return HttpResponse(msg)

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
import wave


def index(request):
    return render(request, 'save_wav_proto/index.html')

@csrf_exempt
def handle_audio(request):
    try:
        data=request.read()
        wav_file = wave.open('1.wav', 'wb')
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(16000)
        wav_file.writeframes(data)
        wav_file.close()
        msg = "success"
    except:
        msg = "failed"
    return HttpResponse(msg)

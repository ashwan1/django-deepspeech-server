from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse


def index(request):
    return render(request, 'save_wav_proto/index.html')

@csrf_exempt
def handle_audio(request):
    try:
        data=request.body
        f = open('swp_generated_1', 'wb')
        f.write(data)
        f.close()
        msg = "success"
    except:
        msg = "failed"
    return HttpResponse(msg)

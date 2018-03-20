import scipy.io.wavfile as wav
from speech_server_main.apps import SpeechServerMain
from speech_server_main.config import config

audiolength = float(config.ConfigDeepSpeech().get_config("audiofilelength"))

def stt(audioPath):
    try:
        text = ""
        fs, audio = wav.read(audioPath)
        if fs == 16000:
            if check_audio_lenth(len(audio)):
                text = SpeechServerMain.ds.stt(audio, fs)
            else:
                text = "Audio should be less than " + str(audiolength) + " seconds."
        else:
            text = "Frame rate of submitted audio should be 16000 kHz."
        #print('after inference: %s' % text)
    except Exception as e:
        print("exception occurred: ", e)
        text = "Some error occurred while transcribing."

    return text

def check_audio_lenth(len_audio):
    len_audio = len_audio / 16000
    if len_audio > audiolength:
        return False;
    else:
        return True;

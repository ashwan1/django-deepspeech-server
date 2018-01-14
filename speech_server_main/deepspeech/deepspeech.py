import scipy.io.wavfile as wav
from speech_server_main.apps import SpeechServerMain


def stt(audioPath):
    fs, audio = wav.read(audioPath)
    text = SpeechServerMain.ds.stt(audio, fs)
    
    return text

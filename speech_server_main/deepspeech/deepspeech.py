import scipy.io.wavfile as wav
from speech_server_main.apps import SpeechServerMain
from speech_server_main.config import config
from speech_server_main import logging

audiolength = float(config.ConfigDeepSpeech().get_config("audiofilelength"))

def stt(audioPath, from_websocket=False):
    try:
        logging.log("Inside deepspeech.stt function", "info")
        text = ""
        fs, audio = wav.read(audioPath)
        if fs == 16000:
            if from_websocket or check_audio_lenth(len(audio)):
                logging.log("Starting transcribing...", "info")
                text = SpeechServerMain.ds.stt(audio)
                logging.log("Audio transcribed.", "info")
            elif not from_websocket:
                text = "Audio should be less than " + str(audiolength) + " seconds."
        else:
            text = "Frame rate of submitted audio should be 16000 kHz."
        #print('after inference: %s' % text)
    except Exception as err:
        logging.log("exception occurred: {0}".format(err), "error")
        text = "Some error occurred while transcribing."

    return text

def check_audio_lenth(len_audio):
    len_audio = len_audio / 16000
    if len_audio > audiolength:
        return False;
    else:
        return True;

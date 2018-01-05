from django.apps import AppConfig
from .config import config


class SaveWavProtoConfig(AppConfig):
    name = 'save_wav_proto'
    verbose_name = 'save wav file and get speech to text prototype'
    def ready(self):
        config.ConfigDeepSpeech()

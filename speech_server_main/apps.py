from django.apps import AppConfig
from deepspeech import Model
from speech_server_main.config import config

# These constants control the beam search decoder

# Beam width used in the CTC decoder when building candidate transcriptions
BEAM_WIDTH = 500

# The alpha hyperparameter of the CTC decoder. Language Model weight
LM_WEIGHT = 1.75


# Valid word insertion weight. This is used to lessen the word insertion penalty
# when the inserted word is part of the vocabulary
VALID_WORD_COUNT_WEIGHT = 2.25


# These constants are tied to the shape of the graph used (changing them changes
# the geometry of the first layer), so make sure you use the same constants that
# were used during training

# Number of MFCC features to use
N_FEATURES = 26

# Size of the context window used for producing timesteps in the input vector
N_CONTEXT = 9


class SpeechServerMain(AppConfig):
    name = 'speech_server_main'
    conf = config.ConfigDeepSpeech()
    model = conf.get_config('model')
    alphabet = conf.get_config('alphabet')
    lm = conf.get_config('lm')
    trie = conf.get_config('trie')

    ds = Model(model, N_FEATURES, N_CONTEXT, alphabet, BEAM_WIDTH)
    if lm and trie:
        ds.enableDecoderWithLM(alphabet, lm, trie, LM_WEIGHT, VALID_WORD_COUNT_WEIGHT)

    def ready(self):
        print("Deepspeech Server Initialization")

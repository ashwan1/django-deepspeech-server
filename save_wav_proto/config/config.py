import os
import json
import logging

class ConfigDeepSpeech:
    
    def __init__(self):
        self.__logger = logging.getLogger(__name__)
        self.__model = ''
        self.__alphabet = ''
        self.__lm = ''
        self.__trie = ''
        self.__parse_config_json()
    
    def __parse_config_json(self):
        print('inside module')
        module_dir = os.path.dirname(__file__)  # get current directory
        file_path = os.path.join(module_dir, 'config.json')
        with open(file_path, 'r') as f:
            config = json.load(f)
        ds_config = config['deepspeech']
        self.__model = ds_config['model']
        self.__alphabet = ds_config['alphabet']
        self.__lm = ds_config['lm']
        self.__trie = ds_config['trie']
                
def get_model(self):
    return self.__model
    
def get_alphabet(self):
    return self.__alphabet
    
def get_lm(self):
    return self.__lm
    
def get_trie(self):
    return self.__trie
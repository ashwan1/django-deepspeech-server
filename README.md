# django-deepspeech-server
This is [Mozilla deepspeech](https://github.com/mozilla/DeepSpeech) server implemented in django. One can record sound in browser or upload compatible wav file and submit it to get corresponding text.

## Acknowledgement
First of all, thanks to mozilla for such a awesome project. Speech to text is revolutionary technology that has huge scope in future and these type of open source efforts will definitely help nurture this tech.
I have used [wav-encoder](https://github.com/higuma/wav-audio-encoder-js) to encode recorded sound in wav format and [resampler](https://gist.github.com/frequent/34313277a46d5fb050f94a3769804287) to get 16000 Hz sample rate. Got some of my inspiration from [deepspeech-server](https://github.com/MainRo/deepspeech-server).

## Installation
Download or clone this project. This project uses python3. To run this project you need to first install deepspeech. Depending on your system you can use the CPU package:

    pip3 install deepspeech

Or the GPU package

    pip3 install deepspeech-gpu
    
Then run following command to install required dependencies:

    pip3 install -r path/to/requirements.txt

## Configuration
Enter path for your model, alphabet, lm and trie in speech-server-main/config/config.json file. Also make change to **audiofiledir** key in same config.json file, to match some valid path on your system.

Go to directory where manage.py is located and start server:

    python3 manage.py runserver
    
Go to your browser and browse to http://127.0.0.1:8000/dsserver.
Alternatively, you can use use https server, using below command:

    python3 manage.py runsslserver

Now you can access website over https (https://127.0.0.1:8000).

## TODO
- [ ] Make it web socket based.
- [ ] Real time inference
- [ ] Provide Google speech API like response, so that one only has to change websocket address.

## License
MIT(see [LICENSE](https://github.com/sci472bmt/django-deepspeech-server/blob/master/LICENSE))

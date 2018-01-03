importScripts('/static/save_wav_proto/resampler.js');
importScripts('/static/save_wav_proto/WavAudioEncoder.js');

var recLength = 0;
var recBuffersL = [];
var bits = 16;
var sampleRate;
var encoder;
//var resampler;

this.onmessage = function(e){
  switch(e.data.command){
    case 'init':
      init(e.data.config);
      break;
    case 'record':
      record(e.data.buffer);
      break;
    case 'exportWAV':
      exportWAV(e.data.type);
      break;
    case 'clear':
      clear();
      break;
  }
};

function init(config){
	var contextSampleRate = config.contextSampleRate;
	sampleRate = config.desiredSampleRate;
	encoder = new WavAudioEncoder(sampleRate, 1);
	resampler = new Resampler(contextSampleRate, sampleRate, 1, 4096);
}

function record(inputBuffer) {
	if(typeof resampler !== 'undefined'){		
		inputBuffer[0] = resampler.resampler(inputBuffer[0]);
	}
//	recBuffersL.push(inputBuffer);
//	recLength += inputBuffer.length;
	encoder.encode(inputBuffer);
}

function exportWAV(type) {
//	var bufferL = mergeBuffers(recBuffersL, recLength);
//	var dataview = encodeWAV(bufferL);
//	var audioBlob = new Blob([ dataview ], {
//		type : type
//	});
	var audioBlob = encoder.finish(type);
	this.postMessage(audioBlob);
}

function clear() {
//	recLength = 0;
//	recBuffersL = [];
	encoder.cancel();
}

function mergeBuffers(recBuffers, recLength) {
	var result = new Float32Array(recLength);
	var offset = 0;
	for (var i = 0; i < recBuffers.length; i++) {
		result.set(recBuffers[i], offset);
		offset += recBuffers[i].length;
	}
	return result;
}

function floatTo16BitPCM(output, offset, input) {
	for (var i = 0; i < input.length; i++, offset += 2) {
		var s = Math.max(-1, Math.min(1, input[i]));
		output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
	}
}


function writeString(view, offset, string){
  for (var i = 0; i < string.length; i++){
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function encodeWAV(samples) {
	var buffer = new ArrayBuffer(44 + samples.length * 2);
	var view = new DataView(buffer);

	/* RIFF identifier */
	writeString(view, 0, 'RIFF');
	/* file length */
	view.setUint32(4, 32 + samples.length * 2, true);
	/* RIFF type */
	writeString(view, 8, 'WAVE');
	/* format chunk identifier */
	writeString(view, 12, 'fmt ');
	/* format chunk length */
	view.setUint32(16, 16, true);
	/* sample format (raw) */
	view.setUint16(20, 1, true);
	/* channel count */
	view.setUint16(22, 1, true); /*MONO*/
	/* sample rate */
	view.setUint32(24, sampleRate, true);
	/* byte rate (sample rate * block align) */
	view.setUint32(28, sampleRate * 2, true); /*MONO*/
	/* block align (channel count * bytes per sample) */
	view.setUint16(32, 2, true); /*MONO*/
	/* bits per sample */
	view.setUint16(34, 16, true);
	/* data chunk identifier */
	writeString(view, 36, 'data');
	/* data chunk length */
	view.setUint32(40, samples.length * 2, true);

	floatTo16BitPCM(view, 44, samples);

	return view;
}
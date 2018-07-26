$(function() {

	var recognition = new webkitSpeechRecognition();
	var isRecognizing = false;
	var ignoreOnend = false;
	var finalTranscript = '';
 	var audio = document.getElementById('audio');
	var $btnMic = $('#btn-mic');
 	var $result = $('#result');
 	var $iconMusic = $('#icon-music');
	recognition.continuous = true;
	recognition.interimResults = true;

	recognition.onstart = function() {
		console.log('onstart', arguments);
		isRecognizing = true;

		$btnMic.attr('class', 'on');
	};

	recognition.onend = function() {
		console.log('onend', arguments);
		isRecognizing = false;

		if (ignoreOnend) {
			return false;
		}

		// DO end process
		$btnMic.attr('class', 'off');
		if (!finalTranscript) {
			console.log('empty finalTranscript');
			return false;
		}

		if (window.getSelection) {
			window.getSelection().removeAllRanges();
			var range = document.createRange();
			range.selectNode(document.getElementById('final-span'));
			window.getSelection().addRange(range);
		}

	};

	recognition.onresult = function(event) {
		console.log('onresult', event);

		var interimTranscript = '';
		if (typeof(event.results) == 'undefined') {
			recognition.onend = null;
			recognition.stop();
			return;
		}

		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				finalTranscript += event.results[i][0].transcript;
			} else {
				interimTranscript += event.results[i][0].transcript;
			}
		}

		finalTranscript = capitalize(finalTranscript);
		final_span.innerHTML = linebreak(finalTranscript);
		interim_span.innerHTML = linebreak(interimTranscript);

		console.log('finalTranscript', finalTranscript);
		console.log('interimTranscript', interimTranscript);
		fireCommand(interimTranscript);
	};

	recognition.onerror = function(event) {
		console.log('onerror', event);

		if (event.error == 'no-speech') {
			ignoreOnend = true;
		} else if (event.error == 'audio-capture') {
			ignoreOnend = true;
		} else if (event.error == 'not-allowed') {
			ignoreOnend = true;
		}

		$btnMic.attr('class', 'off');
	};

	var two_line = /\n\n/g;
	var one_line = /\n/g;
	var first_char = /\S/;

	function linebreak(s) {
		return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
	}

	function capitalize(s) {
		return s.replace(first_char, function(m) {
			return m.toUpperCase();
		});
	}

	function start(event) {
		if (isRecognizing) {
			recognition.stop();
			return;
		}
		recognition.lang = 'ko-KR';
		recognition.start();
		ignoreOnend = false;

		finalTranscript = '';
		final_span.innerHTML = '';
		interim_span.innerHTML = '';

	}

	/**
	 * init
	 */
	$btnMic.click(start);
});

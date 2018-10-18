window.onload = function() {
	var MULTIPLY_SIGN = 'x';

	var PERCENT_BUTTON_ID = 0;
	var PLUS_MINUS_BUTTON_ID = 1;
	var CLEAR_BUTTON_ID = 2;
	var CALCULATE_BUTTON_ID = 18;
	var MULTIPLY_BUTTON_ID = 7;
	var ZERO_BUTTON_ID = 16;

	var INPUT_MAX_LENGTH = 20;

	function IS_OPERATOR_BUTTON(buttonId) {
		return buttonId % 4 == 3;
	}

	function isNumeric(value) {
		return !isNaN(parseFloat(value)) && isFinite(value);
	}

	var buttons = document.querySelectorAll(".button");
	var inputDisplay = document.getElementById("display-input");
	var outputDisplay = document.getElementById("display-output");

	var buttonTextDictionary = (function() {
		var dictionary = {};

		for (var i = 0; i < buttons.length; i++) {
			var key = "";
			for (var j = 0; j < buttons[i].children.length; j++) {
				key += buttons[i].children[j].innerHTML;
			}
			dictionary[key] = i;
		}

		return dictionary;
	})();


	var setButtonsInput = function() {
		for (var i = 0; i < buttons.length; i++) {
			var onClickAction = function action() {
				if (isNumeric(outputDisplay.value)) {
					inputDisplay.value = outputDisplay.value;
					outputDisplay.value = "";
				}

				switch (action.i) {
					case PERCENT_BUTTON_ID:
						if (isInputLengthNormal('0.01'))
							inputDisplay.value += MULTIPLY_SIGN + '0.01';
						break;
					case PLUS_MINUS_BUTTON_ID:
						if (isNumeric(outputDisplay.value)) {
							outputDisplay.value = "" + (-outputDisplay.value);
							inputDisplay.value = outputDisplay.value;
						}
						break;

					case CLEAR_BUTTON_ID:
						inputDisplay.value = "";
						outputDisplay.value = "";
						break;

					case CALCULATE_BUTTON_ID:
						setOutput();
						break;

					default:
						if (isInputLengthNormal(action.buttonText)) {
							inputDisplay.value += action.buttonText;
						}
						break;
				}
			}

			onClickAction.i = i;
			onClickAction.buttonText = buttons[i].children[0].innerHTML; 

			buttons[i].addEventListener("click", onClickAction);
		}
	}

	var setKeyboardInput = function() {
		var NUMERIC_KEYS = ['0', '1', '2', '3', '4',
			'5', '6', '7', '8', '9', '.', '+', '-', '/'];
		var MULTIPLY_KEY = '*';
		var CALCULATE_KEY = '=';
		var ERASE_KEY = 'Backspace';

		inputDisplay.onkeydown = function(event) {
			if (isNumeric(outputDisplay.value)) {
					inputDisplay.value = outputDisplay.value;
					outputDisplay.value = "";
			}

			if (event.key == MULTIPLY_KEY) {
				if (isInputLengthNormal(MULTIPLY_SIGN))
					inputDisplay.value += MULTIPLY_SIGN;
				buttons[MULTIPLY_BUTTON_ID].style.cssText = 
					"background-color: #333;";
				return false;
			} 
			else if (event.key == CALCULATE_KEY) {
				setOutput();
				buttons[CALCULATE_BUTTON_ID].style.cssText = 
					"background-color: #59ce2b;";
				return false;
			}

			var buttonId = buttonTextDictionary[event.key];
			var isNumericKey = NUMERIC_KEYS.indexOf(event.key) > -1;
			if (buttonId == ZERO_BUTTON_ID) {
				buttons[buttonId].style.cssText = 
					"background-color: #832bce;";
			}
			else if (IS_OPERATOR_BUTTON(buttonId)) {
				buttons[buttonId].style.cssText = 
					"background-color: #333;";
			}
			else if (isNumericKey) {
				buttons[buttonId].style.cssText = 
					"background-color: #999;";
			}

			return isNumericKey || event.key == ERASE_KEY;
		}

		inputDisplay.onkeyup = function(event) {
			var buttonId = event.key == '*' ? MULTIPLY_BUTTON_ID :
				buttonTextDictionary[event.key];

			if (buttonId !== undefined) {
				buttons[buttonId].removeAttribute("style");
			}
		}
	}

	function setOutput() {
		var OUTPUT_MAX_LENGTH = 9;
		var SCIETIFIC_MAX_LENGTH = 12;

		var calcResult = eval(inputDisplay.value
			.replace(/x/g, '*'));

		if (("" + calcResult).length > 
			SCIETIFIC_MAX_LENGTH) {
			calcResult = calcResult.toPrecision(2);
		}
		else if (("" + calcResult).length > 
			OUTPUT_MAX_LENGTH) {
			calcResult = calcResult.toPrecision(3);
		}

		if (isNumeric(calcResult)) {
			outputDisplay.value = "" + calcResult;
		} else {
			outputDisplay.value = "Error!";
		}
	}

	function isInputLengthNormal(addChars) {
		return inputDisplay.value.length <= INPUT_MAX_LENGTH - 
				addChars.length;
	}

	var setInputFieldFocus = function() {
		inputDisplay.focus();
		inputDisplay.onblur = function() {
			setTimeout(function() {
				inputDisplay.focus();
			});
		}
	}

	outputDisplay.onclick = function() {
		outputDisplay.select();
		document.execCommand("copy");
		alert("Result is copied to clipboard");
	}

	setButtonsInput();
	setKeyboardInput();
	setInputFieldFocus();
}
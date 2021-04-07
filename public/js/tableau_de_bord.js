// const { get } = require("../../routes");



// Fonctions
function toggleImg(imgDown, imgUp) {
	if (document.getElementById(imgDown).style.display == "inline") {
		document.getElementById(imgDown).style.display = "none";
		document.getElementById(imgUp).style.display = "inline";
	}
	else {
		document.getElementById(imgDown).style.display = "inline";
		document.getElementById(imgUp).style.display = "none";
	}
}

function hideImg(imgDown, imgUp) {
	document.getElementById(imgDown).style.display = "none";
	document.getElementById(imgUp).style.display = "none";
}

function resetStatus(message, info, imgDown, imgUp) {
	document.getElementById(info).style.background = "none";
	document.getElementById(info).style.color = "#0535AF";
	document.getElementById(message).style.background = "none";
	document.getElementById(message).style.color = "#0535AF";
	hideImg(imgDown, imgUp);
}

function saveValue(sensorId) {
	document.getElementById('sendModalWattcare').value = sensorId;
}
function enablePrecision() {
	document.getElementById('autreDysfonctionnement').disabled = false;
}
function desablePrecision() {
	document.getElementById('autreDysfonctionnement').disabled = true;
	document.getElementById('autreDysfonctionnement').value = "";
}

function tailleMax(element, max) {
	value = element.value;
	max = parseInt(max);
	nbCar = value.length;
	carLeft = max - nbCar;
	if (carLeft < 0) {
		carLeft = 0;
	}
	if (value.length > max) {
		element.value = value.substr(0, max);
	}
	document.getElementById('textHelp').innerHTML = 'Saisir 100 caractères maximum.<br>Disponible: ' + carLeft;
}

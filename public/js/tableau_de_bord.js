// Variable globales
var toggleColor = 0;
var data = {
	title: "foo",
	body: "bar", 
	userId:1
}


// Fonctions
function toggleImg(imgDown, imgUp){
	if (document.getElementById(imgDown).style.display=="inline"){
		document.getElementById(imgDown).style.display="none";
		document.getElementById(imgUp).style.display="inline";
	}
	else{
		document.getElementById(imgDown).style.display="inline";
		document.getElementById(imgUp).style.display="none";
	}
}

function hideImg(imgDown, imgUp){
	document.getElementById(imgDown).style.display="none";
	document.getElementById(imgUp).style.display="none";
}

function resetStatus(message, info, imgDown, imgUp){
	document.getElementById(info).style.background = "none";
	document.getElementById(info).style.color = "#0535AF";
	document.getElementById(message).style.background = "none";
	document.getElementById(message).style.color = "#0535AF";
	hideImg(imgDown, imgUp);
}

// fetch('http://localhost:8080', {
//     method: 'POST',
//     body: JSON.stringify(data) 
// })

// // function to handle success
// function success() {
//     var data = JSON.parse(this.responseText); //parse the string to JSON
//     console.log(data);
// }

// // function to handle error
// function error(err) {
//     console.log('Request Failed', err); //error details will be in the "err" object
// }

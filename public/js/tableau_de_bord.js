// Variable globales
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

const eventSource = new EventSource('http://localhost:3000/stream');

/* Connexion pour sent event */
eventSource.onopen = () => {
  console.log('connected');
};

/* Gestion des erreurs pour la connexion sent event */
eventSource.onerror = event => {
  console.log(event);
  if (eventSource.readyState === EventSource.CLOSED) {
    /* Traitement en cas de perte de connexion définitif avec le serveur */
  }
  if (eventSource.readyState === EventSource.CONNECTING) {
    /* En cas de perte de connexion temporaire avec le serveur */
  }
};
/* Récupération du message provenant du server */
/* Le contenu du message est dans la propriété 'data' */
eventSource.onmessage = event => {
	console.log(event.data);
  };

/* fermeture de la connexion */
// eventSource.close();
// const { get } = require("../../routes");



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

const source = new EventSource('/events');

    // source.addEventListener('message', message => {
    //     // console.log('Got', message);

    //     // Display the event data in the `content` div
    //     // document.querySelector('#content').innerHTML = event.data;
    //     json = JSON.parse(event.data);
    //     if (json.refresh){
    //         location.reload();
    //     }
        
    // });

/* Connexion pour sent event */
source.onopen = () => {
  console.log('connected');
};

/* Gestion des erreurs pour la connexion sent event */
source.onerror = event => {
  console.log(event);
  if (source.readyState === source.CLOSED) {
    /* Traitement en cas de perte de connexion définitif avec le serveur */
  }
  if (source.readyState === source.CONNECTING) {
    /* En cas de perte de connexion temporaire avec le serveur */
  }
};
/* Récupération du message provenant du server */
/* Le contenu du message est dans la propriété 'data' */
source.onmessage = event => {
	console.log(event.data);
	json = JSON.parse(event.data);
	if (json.refresh){
		location.reload();
	}
};

/* fermeture de la connexion */
// source.close();
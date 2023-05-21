/*///////////////////////////////////////////////////////////////////////
Variables JS
///////////////////////////////////////////////////////////////////////*/

/* Variables audio */
let audio = {
    succes: new Audio('medias/audio/sonSucces.mp3'),
    echec: new Audio('medias/audio/sonEchec.mp3'),
    chanson: new Audio('medias/audio/Chanson.mp3')
}

/* Toutes les variables de type numero qu'on utilisera dans les fonctions */
let numeroQuestion = 0;

let nombreBonneReponses = 0;

let nombreMeilleureReponse = 0;

let largeurCibleCercle = 0;

let hauteurCibleCercle = 0;

let largueurCercle = 0;

let hauteurCercle = 0;

let positionY = 100;

/* Toutes les variables document.querySelector pour les controler dans le fonctions */
let quizPrincipal = document.querySelector(".quiz");

let laSectionQuestions = document.querySelector(".questions");

let numeroProgress = document.querySelector(".numero");

let cercleProgress = document.querySelector(".cercle");

let titreQuiz = document.querySelector(".titre-anime");

let imgDebut = document.querySelector(".imagesDebut")

let divCommencer = document.querySelector(".commencer-quiz");

let titreQuestions = document.querySelector(".titre-reponses");

let choixReponses = document.querySelector(".reponses");

let leBouton = document.createElement("button");

let caseFonce = document.querySelector("#cc-changer-couleur")

let finalQuiz = document.querySelector("main.pointage");

let divMeilleurReponse = document.querySelector(".meilleur-score");

let divMeilleurReponse2 = document.querySelector(".meilleur-score-2");

let divParties = document.querySelector(".temps-joue");

let divParties2 = document.querySelector(".temps-joue-2");

/* Variables pour changer les images dans les reponses */
let dossier = "medias/photos/mobile/"

if (window.matchMedia("(min-width:768px)").matches) {
    dossier = "medias/photos/tablette/";
}

/* Variables pour le localStorage */
let historiqueReponses = recupererHistorique();

let partiesJoues = historiqueReponses.length;

/*///////////////////////////////////////////////////////////////////////
ÉVÉNEMENTS
///////////////////////////////////////////////////////////////////////*/

/* Evenements sur l'animation du texte du debut du Quiz */
titreQuiz.addEventListener("animationend", afficherDebutJeu);

/* Evenements sur l'animation des images du debut du Quiz */
imgDebut.addEventListener("animationend", afficherTexte);

/* Evenements sur le main de la fin du Quiz*/
finalQuiz.addEventListener("click", recommencer);

/* Evenements sur le bouton pour changer le theme du Quiz*/
caseFonce.addEventListener("click", mettreFonce);

/*///////////////////////////////////////////////////////////////////////
LES FONCTIONS
///////////////////////////////////////////////////////////////////////*/

/* On cherche le meilleur score dans toutes les essaies du Quiz */
nombreMeilleureReponse = localStorage.getItem("meilleurScoreJeu") || 0;

/* Fonction pour recuperer le historique du Quiz */
function recupererHistorique(){
    let historiqueChaine = localStorage.getItem("quiz-esports-historique");

    return JSON.parse(historiqueChaine ) || [];
} 

/* Fonction pour mettre la classe fonce dans le body */
function mettreFonce(){
    document.querySelector("body").classList.toggle("mode-fonce");

    document.querySelector("label").classList.toggle("label-fonce");
}

/* Lorsque l'animation est fini on affiche le texte et on enleve les images */
function afficherTexte(event){
    if(event.animationName == "disparaitre-image"){
        titreQuiz.innerHTML = "Plus qu'un jeu, c'est un sport";

        titreQuiz.style.display = "block";

        imgDebut.remove();
    }
}

/* Fonction pour mettre toutes les textes dans le debut apres l'animation */ 
function afficherDebutJeu(event){
    if(event.animationName == "revelation-titre"){

        divCommencer.innerHTML = "Cliquer ici pour commencer le quiz";

        divCommencer.style.display = "block";
        
        divMeilleurReponse.style.display = "block";
        
        divMeilleurReponse.innerHTML = `Votre meilleur score est: ${nombreMeilleureReponse}!`

        divParties.style.display = "block";
        
        divParties.innerHTML = `Vous avez joue ${partiesJoues} fois ce quiz!`

        /* evenement pour commencer le Quiz, si on click sur le texte */
        divCommencer.addEventListener("click", commencerQuestions);
    }
}

/* fonction pour commencer le Quiz */
function commencerQuestions(){

/*     On cherche combien de fois le utilisateur a fait le Quiz */
    historiqueReponses.push({date: new Date().toLocaleDateString("fr-CA"), reponses: []});

/*     On met l'item dans le local storage en on le met comme string */
    localStorage.setItem("quiz-esports-historique", JSON.stringify(historiqueReponses));

    /* On detruit le main du debut */
    document.querySelector("main.debut").remove();

/*     On enleve l'evenement sur le texte */
    divCommencer.removeEventListener("click", commencerQuestions);

/*     on met le Quiz principal en flex */
    quizPrincipal.style.display = "flex";

/*     On joue la chanson */
    audio.chanson.play();

/*     On affiche les questions */
    afficherQuestions();
}

/* Fonction pour afficher les questions */
function afficherQuestions(){
/*     On cherche toutes les questions */
    let arrayQuestions = lesQuestions[numeroQuestion];

/*     On mettre l'enonce de la question sur le titre */
    titreQuestions.innerText = arrayQuestions.question;

/*     On mettre contenu sur le choix de reponses */
    choixReponses.innerHTML = "";

/*     Proces pour mettre les differentes choix de reponses */
    let unChoix;
    for(let i = 0; i < arrayQuestions.reponses.length; i++){
        unChoix = document.createElement("div");

        unChoix.classList.add("reponse");

        let unImage = document.createElement("div");

        unImage.classList.add("imageReponse");

        unImage.style.backgroundImage = `url(${dossier + arrayQuestions.images[i]})`;

        unChoix.innerText = arrayQuestions.reponses[i];

        unChoix.indexChoix = i;

        unChoix.addEventListener("mousedown", verifierReponse);

        choixReponses.append(unChoix);

        unChoix.appendChild(unImage);
    }
    
/*     On met la position pour animer la section des questions */
    positionY = 100;

/*     valeurs pour animer le cercle */
    largeurCibleCercle = (numeroQuestion + 1) / lesQuestions.length * 100;
    hauteurCibleCercle = (numeroQuestion + 1) / lesQuestions.length * 100;
/* 
    Request animation pour animer le cercle et la section */
    requestAnimationFrame(animerCercle);
    requestAnimationFrame(animerSection);
}

/* Fonction pour animer le cercle */
function animerCercle(){
/*     On augmente le largeur et l'hauteur du cercle */
    largueurCercle++;
    hauteurCercle++;
    
/*     On change le width et le height avec le valeurs controles par JS */
    cercleProgress.style.width = `${largueurCercle}px`
    cercleProgress.style.height = `${hauteurCercle}px`
    numeroProgress.innerText = `${hauteurCercle}%`


    if(largueurCercle < largeurCibleCercle && hauteurCercle < hauteurCibleCercle){
        requestAnimationFrame(animerCercle);
    }
}

/* Fonction pour animer le cercle */
function animerSection(){
    positionY -= 2;

    laSectionQuestions.style.transform = `translateY(${positionY}vh)`

    if(positionY > 0){
        requestAnimationFrame(animerSection);
    }
}

/* Fonction pour verifier la reponse */
function verifierReponse(event){
/*     On desactive les reponses */
    choixReponses.classList.toggle("desactiver");

/*     On cherche le meilleure pointage de l'utilisateur */
    historiqueReponses[historiqueReponses.length - 1].reponses.push(event.target.indexChoix);
    localStorage.setItem("quiz-esports-historique", JSON.stringify(historiqueReponses));

    let reponseChoisi = event.target.indexChoix;
    console.log(reponseChoisi);

    let bonChoix = lesQuestions[numeroQuestion].bonChoix;
    console.log(bonChoix);

/*     Si l'utilisateur repond bien */
    if(reponseChoisi == bonChoix){
/*         On augmente le pointage, on joue l'animation et on fait jouer le son */
        nombreBonneReponses++;
        event.target.classList.add("bonne-reponse");
        audio.succes.play();
    }else{
/*         Sinon on joue l'animation et on fait jouer le son de echec */
        event.target.classList.add("mauvais-reponse");
        audio.echec.play();
    }

/*     On cherche le meilleure pointage de l'utilisateur */
    nombreMeilleureReponse = Math.max(nombreMeilleureReponse, nombreBonneReponses);
    localStorage.setItem("meilleurScoreJeu", nombreMeilleureReponse);

    console.log(nombreBonneReponses);
/*     Lorsque l'animation du choix est fini on met le bouton */
    event.target.addEventListener("animationend", boutonProchaineQuestion);
}

/* Fonction pour afficher le bouton */
function boutonProchaineQuestion(){

    leBouton.classList.add("bouton");

    leBouton.innerText = "Question suivante"

    laSectionQuestions.after(leBouton);

/*     Evenement pour afficher la prochain question */
    leBouton.addEventListener("click", prochaineQuestion);
}

/* Fonction pour afficher la prochain question */
function prochaineQuestion(){
    choixReponses.classList.toggle("desactiver");
/* 
    On enleve le bouton */
    leBouton.remove();

/*     On change le numero de la question */
    numeroQuestion++;

/*     Si le numero de Question vest plus petit que la quantite des questions */
    if(numeroQuestion < lesQuestions.length){
/*         On affiche un autre question */
        afficherQuestions();
    }else{
/*         Sinon on affiche la fin */
        afficherFin();
    }
}

/* Fonction pour afficher la fin */
function afficherFin(){
    historiqueReponses = recupererHistorique();
/* 
    On cache le quiz principal */
    quizPrincipal.style.display = "none";

    let sectionResultat = document.createElement("section");

    let textScoreFin = document.querySelector(".text-fin");
    
    sectionResultat.innerText = "Votre pointage est: " + nombreBonneReponses + " sur 5";
    
    sectionResultat.classList.add("resultat");
    
    textScoreFin.after(sectionResultat);

/*     On mettre le display du quiz de la fin en flex */
    finalQuiz.style.display = "flex"; 

/*     Si l'utilisateur a moins que 3 bonne reponse on affiche un message */
    if(nombreBonneReponses == 0 || nombreBonneReponses == 1 || nombreBonneReponses == 2){
        textScoreFin.innerText = "Ah bon ? Je pense que vous pouvez faire mieux."
    }else if(nombreBonneReponses  == 3 || nombreBonneReponses == 4){
/*         Sinon on affiche un autre message */
        textScoreFin.innerText = "Vous êtes très proche, ne lâchez pas !"
    }else{
/*         Si on a toute les reponses bonne on affiche un autre message */
        textScoreFin.innerText = "Très bien ! Merci pour vos participations !"
    }


/*     Texte pour dire le meilleur score de l'utilisateur */
    divMeilleurReponse2.innerHTML = `Votre meilleur score est: ${nombreMeilleureReponse}!`

/*     Texte pour dire combien de fois l'utilisateur a joue */
    divParties2.innerHTML = `Vous avez joue ${partiesJoues} fois ce quiz!`
}

/* fonction pour recommencer le quiz */
function recommencer(){
/*     On met toutes les valeurs a 0 */
    numeroQuestion = 0;

    nombreBonneReponses= 0;

    largeurCibleCercle = 0;
    largueurCercle = 0;
    hauteurCercle = 0;
    hauteurCibleCercle = 0;

    let sectionResultat = document.querySelector("section.resultat");

/*     On enleve la section de la fin */
    sectionResultat.remove();

/*     On met le quiz principal en flex et on met la fin du quiz en none */
    quizPrincipal.style.display = "flex";

    finalQuiz.style.display = "none";

/*     On affiche les questions */
    afficherQuestions();
}

// Initialisation du tableau contenant le l'URL des images
let imgUrl = [];
for (let i=0; i<12; i++){
    imgUrl[i] = "<img class='image' src='img/carte" + i + ".png'>";
    imgUrl[i+12] = "<img class='image' src='img/carte" + i + ".png'>";
}

// Initialisation du tableau contenant le l'URL des audios des personnages
let audioPersonnages = [];
for (let i=0; i<12; i++){
    audioPersonnages[i] = "mp3/" + [i] + ".mp3";
}

function menu() {
    $('.info, .menuBtn, .jouer, .jeu, .assombrir, .combo').css('display', 'none');
    $('.menu').css('display', 'block');
    $('main').css({
        'width': '100%',
        'height': '100%',
    });

    // Stoppe la musique
    musique.pause();
    musique.currentTime = 0;

}

function jouer(bouton) {
    /* CHRONO - Censé remettre le chrono à 0
    clearInterval(timerId);
    timerId = null; */

    // Enlève le menu et affiche le plateau de jeu
    $('.info, .menuBtn, .jouer, .combo').css('display', 'block');
    $('.jeu').css('display', 'flex');
    $('.menu').css('display', 'none');
    $('main').css({
        'width': 'auto',
        'height': 'auto',
    });

    // Tri le tableau en fonction de la difficulte
    difficulte = difficulteTab(bouton)

    // Démarre la musique et règle son volume
    musique = new Audio("mp3/vigi.mp3")
    musique.volume = 0.01;
    musique.play();

    // Enlève le tableau des résultats
    $(".assombrir").css('display', 'none');

    // Vide le contenu
    $(".jeu").empty()

    // Mélange les cartes dans le tableau
    let imgUrlMelange = melanger()

    // Affiche les cartes mélangées cachées et stocke le nombre de paires totales
    paires = affichage(imgUrlMelange, difficulte)
    pairesTrouvees = paires;

    // Initialisation des variables et affichage des infos
    premiereImgRetournee = true;
    comboMax = 0;
    nbImgRetournee = 0;
    $(".paires").html(paires);
    combo = 0; $(".combo").html('');
    tentatives = 0; $(".tentatives").html(tentatives);
}

function difficulteTab(difficulteBouton) {
    // Initialise le tableau pour la difficulté FACILE
    if (difficulteBouton.getAttribute('data-value') == "facile") {
        imgUrl = [];
        for (let i=0; i<7; i++){
            imgUrl[i] = "<img class='image' src='img/carte" + i + ".png'>";
            imgUrl[i+7] = "<img class='image' src='img/carte" + i + ".png'>";
        }
    }

    // Initialise le tableau pour la difficulté MOYEN
    if (difficulteBouton.getAttribute('data-value') == "moyen") {
        imgUrl = [];
        for (let i=0; i<12; i++){
            imgUrl[i] = "<img class='image' src='img/carte" + i + ".png'>";
            imgUrl[i+12] = "<img class='image' src='img/carte" + i + ".png'>";
        }
    }

    // Initialise le tableau pour la difficulté DIFFICILE
    if (difficulteBouton.getAttribute('data-value') == "difficile") {
        imgUrl = [];
        for (let i=0; i<15; i++){
            imgUrl[i] = "<img class='image' src='img/carte" + i + ".png'>";
            imgUrl[i+15] = "<img class='image' src='img/carte" + i + ".png'>";
        }
    }
    return difficulteBouton.getAttribute('data-value')
}

function melanger() {
   // Mélange les cartes dans le tableau
   let imgUrlMelange = imgUrl;

   // /!\ Demander des explications sur cette fonction /!\
   // Mélange le tableau
   imgUrlMelange.sort(function() {
       return 0.5 - Math.random()
   });
   return imgUrlMelange;
}

function affichage(imgUrlMelange, difficulte) {
   // Affiche les cartes dans le tableau
   for (let i = 0; i<=imgUrlMelange.length-1; i++){
       $(".jeu").append("<li onclick='reveler(this, this.value)' value='"+ i +"' class='carte verso'" + " style='opacity: 0;'>"+ imgUrlMelange[i] + '</li>');
       $("li").animate({
           opacity: '1',
           transform: 'scale(1)',
       }, 1000);
   }

   // Redimensionne les images suivant le niveau de difficulte
   switch (difficulte) {
       case 'facile': {
           $('li').css({
               'width': '8.25em',
               'height': '11.5em',
           });
           break
       } case 'moyen': {
           $('li').css({
               'width': '7em',
               'height': '9em',
           });
           break
       } case 'difficile': {
           $('li').css({
               'width': '5.8em',
               'height': '7em',
           });
           break
       }
   }

   return imgUrlMelange.length/2
}

function reveler(carte, numCarte) {
   /* CHRONO - Regarde si le chronometre est déjà lancé ou non
   if (timerId == null){
       clearInterval(timerId);
       chronometre()
   }*/
    // Révèle l'image cliquée
    if (nbImgRetournee <= 1) {
        if (premiereImgRetournee) {
            /* Affecte au nombre d'image retournée 1, la limite sera de 2 afin d'éviter de permettre
             à l'utilisateur de cliquer partout en même temps, sans attendre que l'animation se termine */
            nbImgRetournee = 1;
            numCarte1 = numCarte
            carte1 = carte;

            // Fait en sorte de détecter si c'est la première image retournée ou non
            premiereImgRetournee = false;
            premiereImgSrc = $('li[value="'+ numCarte +'"] img').attr("src");

            // Retourne la carte...
            montrer(carte1);
            // ... avec un effet d'opacité
            $('li[value="'+ numCarte +'"] img').animate({
                opacity: '1',
            }, 500);

            // Ajoute une surbrillance neutre
            $(carte1).addClass("neutre");

            // Incrémentation de tentatives
            tentatives++
            $(".tentatives").html(tentatives);
        } else {
            carte2 = carte;
            deuxiemeImgSrc = $('li[value="'+ numCarte +'"] img').attr("src");
            let audioCorrect = new Audio('mp3/vrai.wav');

            if (premiereImgSrc === deuxiemeImgSrc) {
                // SI LES DEUX CARTES SONT IDENTIQUES
                premiereImgRetournee = true;


                // Joue l'audio correct
                audioCorrect.play();
                // Joue l'audio correspondant au personnage
                carteNumPerso = deuxiemeImgSrc.substr(9, 1)
                carteNumPerso = audioPersonnages[carteNumPerso]
                let audioPerso = new Audio(carteNumPerso);
                audioPerso.volume = 0.2;
                audioPerso.play();

                // Ajoute une surbrillance vraie et supprime la surbrillance neutre
                $(carte1).addClass("vraie");
                $(carte2).addClass("vraie");
                $(carte1).removeClass("neutre");

                nbImgRetournee = 2;
                // Supprime les surbrillances après 1 seconde
                setTimeout(
                    function()
                    {
                        $(carte1).removeClass("vraie");
                        $(carte2).removeClass("vraie");
                        $(carte1).removeClass("neutre");
                        nbImgRetournee = 0;
                    }, 800);

                // Révèle la carte cliquée
                montrer(carte);
                // ... avec un effet d'opacité
                $('li[value="'+ numCarte +'"] img').animate({
                    opacity: '1',
                }, 500);

                // Incrémentation du combo et affichage
                combo++;
                if (combo>1) {
                    $(".combo").html('COMBOx' + combo);
                    $(".combo").animate({
                        fontSize: '3em',
                        top: '40%',
                        left: '40%',
                    }, 250);
                }

                setTimeout(
                    function()
                    {
                        $(".combo").animate({
                            fontSize: '1em',
                            top: '0.5em',
                            left: '1em',
                        }, 250);
                    }, 800);

                // Décrémentation de tentatives et affichage
                paires--; $(".paires").html(paires);
            } else {
                // SI LES DEUX CARTES NE SONT PAS IDENTIQUES
                premiereImgRetournee = true;

                // Ajoute une surbrillance fausse et supprime la surbrillance neutre
                $(carte1).addClass("fausse");
                $(carte2).addClass("fausse");
                $(carte1).removeClass("neutre");

                // Supprime les surbrillances après 1 seconde
                montrer(carte);
                // ... avec un effet d'opacité
                $('li[value="'+ numCarte +'"] img').animate({
                    opacity: '1',
                }, 500);
                nbImgRetournee = 2;

                // Effectue cette ligne de code après 750ms
                setTimeout(
                    function()
                    {
                        // Enlève la surbrillance
                        $(carte1).removeClass("fausse");
                        $(carte2).removeClass("fausse");
                        $(carte1).removeClass("neutre");
                        // Cache les deux cartes retournées
                        cacher(carte1)
                        cacher(carte2)
                        // Fixe le nombre de cartes retournées à 0
                        nbImgRetournee = 0;
                        // Met à jour le combo max
                        if (combo > comboMax) {
                            comboMax = combo;
                        }
                        // Fait disparaître le combo
                        combo = 0; $(".combo").html('');
                        // Change l'opacité de l'image des deux cartes
                        $('li[value="'+ numCarte +'"] img').css("opacity", 0)
                        $('li[value="'+ numCarte1 +'"] img').css("opacity", 0)
                    }, 750);
            }
        }
        // Met à jour le combo max
        if (combo > comboMax) {
            comboMax = combo;
        }

        // Accélère l'animation du combo en fonction du nombre de combo réalisé
        $('.infoCombo span').css('animation-duration', (1000/combo)/2 + 'ms')
        if (paires == 0){
            resultats()
        }
    }
}

function montrer(carte){
    // Révèle la carte
    $(carte).addClass("recto");
    $(carte).removeClass("verso");
    $(carte).removeAttr("onclick");
}

function cacher(carte) {
    // Cache la carte
    $(carte).removeClass("recto");
    $(carte).addClass("verso");
    $(carte).attr("onclick",'reveler(this, this.value)');
}

function chronometre(){
    let ms=0;
    let secondes=0
    let minutes=0;

    timerId = setInterval(function(){
        $('.ms').html(ms);
        ms++;
        if (ms%100==0){
            let zero = (secondes < 9) ? '0' : '';
            ms = 0;
            secondes++;
            let dblZero = (secondes == 0) ? '0' : '';
            $('.sec').html(zero + dblZero + secondes);
        } else if (secondes>59){
            let zero = (minutes < 10) ? '0' : '';
            secondes = 0;
            $('.sec').html(secondes);
            minutes++;
            $('.min').html(zero + minutes);
        }
    }, 10);
}

function resultats() {
    // Affiche le tableau des résultats
    $(".assombrir").css('display', 'block');
    $(".trouvees").html(pairesTrouvees)
    $(".comboMax").html(comboMax)
    $(".score").html((pairesTrouvees*100)-tentatives*10)
}

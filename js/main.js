// Inizializzo l'oggetto globale Game
var mGame = new Game;

// funzione per aggiornare il punteggio
function updateScore(score){
  var scoreP = document.getElementById("score");

  // score su 5 caratteri riempiendo a sinistra di spazi vuoti se necessario
  var paddedScore = ("     " + score).slice(-5);

  var record_string = loggedIn?("[RECORD " + highscore + "] "):"";
  scoreP.textContent = record_string + "PUNTI "+ paddedScore;
}

// funzione per aggiornare il numero di vite
function updateLives(lives){
  var livesP = document.getElementById("lives");
  livesP.textContent = "VITE " + lives;
}

// funzione per cambiare dimensione al gioco
function resizeGame(){
  var w = mGame.resize(window.innerWidth, window.innerHeight);

  // aggiorna anche le dimensioni dell'area di gioco affinchè vite e punti
  // siano sempre allineati
  document.getElementById('game_area').style.width = w+'px';
}
// quando la finestra cambia dimensioni, cambiale anche al gioco
window.onresize = resizeGame;

// funzione per iniziare il gioco
function start(){
  updateScore(mGame.score);           //aggiorna il punteggio massimo
  updateLives(3);                     //resetta le vite

  mGame.canvas.onclick = null;        // rimuove il gestore per l'evento del click sul canvas
  mGame.canvas.style.cursor = "none"; // nasconde il puntatore
  mGame.start();                      //inizia il gioco
}

//Ripristina il gioco dopo la pausa
function resume(){
  mGame.canvas.onclick = null;        // rimuove il gestore per l'evento del click sul canvas
  mGame.canvas.style.cursor = "none"; // nasconde il puntatore
  mGame.resume();                     // inizia il gioco
}

// inzializza il gioco quando è tutto pronto
function init(){
  if (mLoader.getProgress()<100)  // se non è pronto
    setTimeout("init()", 100);    // riprova fra 100ms
  else{
    mGame.drawMessage("Clicca qui per iniziare", 20, true);
    if(!loggedIn)
      mGame.drawSubMessage("Accedi o registrati per salvare il punteggio", 10, 20);

    // quando l'utente clicca il canvas parte il gioco
    mGame.canvas.onclick = start;

    // quando finisce il gioco
    mGame.onEnd = function(){
      updateLives(0);               // azzero le vite

      if (mGame.score > highscore)  // nuovo record!
        highscore = mGame.score;

      if(loggedIn){                 // se l'utente è loggato invio il punteggio
        sendScore(mGame.score);
      }

      mGame.reset();                // resetto il gioco

      // quando l'utente clicca il canvas parte il gioco
      mGame.canvas.onclick = start;
      mGame.canvas.style.cursor = "auto"; // mostro nuovamente il cursore

    };

    // alla fine di ogni loop se è cambiata qualche informazione l'aggiorno
    mGame.onLoop = function (scoreChanged, livesChanged){
      if (scoreChanged) updateScore(mGame.score);
      if (livesChanged) updateLives(mGame.ship.lives);
    };

    // quando l'utente mette in pausa
    mGame.onPause = function(){
      mGame.canvas.onclick = resume;      // quando clicca il canvas riparte il gioco
      mGame.canvas.style.cursor = "auto"; // mostro nuovamente il puntatore
    };
  }
}

// Aspetta che sia tutto pronto e poi inizializza il gioco
window.onload = function(){
  mGame.setCanvas(document.getElementById('game_canvas'));
  resizeGame();
  mGame.drawMessage("Caricamento...", 20, true);
  init();
};

// Avvisa l'utente prima di abbandonare la pagina
function askUser(){
  if (mGame.running){
    mGame.pause();
    return confirm("Se abbandoni questa pagina dovrai rincominciare da capo il gioco. Continuare?");
  } else
    return true;
}

window.onblur = function(){
  if (mGame.running)
    mGame.pause();
}

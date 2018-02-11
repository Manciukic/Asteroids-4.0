// Inizializzo l'oggetto Game
var mGame = new Game();

// aggiorna il punteggio
function updateScore(score){
  var scoreP = document.getElementById("score");
  var n_space = 0;
  var spaces = "";
  if (score == 0){
    spaces = "    ";
  } else {
    while (score < Math.pow(10, 4-n_space)){
      n_space++;
      spaces += " ";
    }
  }
  var record_string = loggedIn?("[RECORD " + highscore + "] "):"";
  scoreP.textContent = record_string + "PUNTI "+ spaces + score;
}

// aggiorna il numero di vite
function updateLives(lives){
  var livesP = document.getElementById("lives");
  livesP.textContent = "VITE " + lives;
}

function resizeGame(){
  var w = mGame.resize(window.innerWidth, window.innerHeight);
  document.getElementById('game_area').style.width = w+'px';
}
window.onresize = resizeGame;

// Inizia il gioco
function start(){
  //aggiorna il punteggio massimo
  updateScore(mGame.score);

  //resetta le vite
  updateLives(3);

  mGame.canvas.onclick = null;
  mGame.canvas.style.cursor = "none";
  mGame.start();
}

// Aspetta che sia tutto pronto e poi dà il via al gioco
window.onload = function(){
  mGame.setCanvas(document.getElementById('game_canvas'));
  mGame.drawMessage("Caricamento...", 50, true);

  resizeGame();
  init();
};

function init(){
  if (mLoader.getProgress()<100)
    setTimeout("init()", 100);
  else{
    mGame.drawMessage("Clicca qui per iniziare", 20, true);
    if(!loggedIn)
      mGame.drawSubMessage("Accedi o registrati per salvare il punteggio", 10, 20);
    mGame.canvas.onclick = start;

    mGame.onEnd = function(){
      updateLives(0);

      if (mGame.score > highscore)
        highscore = mGame.score;

      if(loggedIn){
        sendScore(mGame.score);
      }
      
      mGame.reset();
      mGame.canvas.onclick = start;
      mGame.canvas.style.cursor = "auto";

    };

    mGame.onLoop = function (scoreChanged, livesChanged){
      if (scoreChanged) updateScore(mGame.score);
      if (livesChanged) updateLives(mGame.ship.lives);
    };
  }
}

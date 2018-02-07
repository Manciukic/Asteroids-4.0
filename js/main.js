// Inizializzo l'oggetto Game
var mGame = new Game();

// Inizia il gioco
function start(){
  mGame.canvas.onclick = null;
  mGame.start();
}

// Aspetta che sia tutto pronto e poi dà il via al gioco
function init(){
  if (mLoader.getProgress()<100)
    setTimeout("init()", 100);
  else{
    mGame.setCanvas(document.getElementById('game_canvas'));
    mGame.canvas.onclick = start;
    document.onkeyup = onKeyUpHandler;
    document.onkeydown = onKeyDownHandler;
    window.onresize = function(){
      mGame.resize(window.innerWidth, window.innerHeight);
    };
    mGame.resize(window.innerWidth, window.innerHeight);
    document.getElementById('loading').style.display = 'none';

    mGame.onEnd = function(){
      var livesP = document.getElementById("lives");
      livesP.textContent = "LIVES " + 0;

      mGame.reset();
      mGame.canvas.onclick = start;
    };

    mGame.onLoop = function (){
      var scoreP = document.getElementById("score");
      scoreP.textContent = "SCORE " + mGame.score;

      var livesP = document.getElementById("lives");
      livesP.textContent = "LIVES " + mGame.ship.lives;
    };
  }
}

// Inizializzo l'oggetto Game
var mGame = new Game();

// Inizia il gioco
function start(){
  mGame.canvas.onclick = null;
  mGame.start();
}

// Aspetta che sia tutto pronto e poi dà il via al gioco
function atDocumentReady(){
  mGame.setCanvas(document.getElementById('game_canvas'));
  mGame.drawMessage("Loading...");

  document.onkeyup = onKeyUpHandler;
  document.onkeydown = onKeyDownHandler;

  window.onresize = function(){
    var w = mGame.resize(window.innerWidth, window.innerHeight);
    document.getElementById('game_area').style.width = w+'px';
  };

  var w = mGame.resize(window.innerWidth, window.innerHeight);
  document.getElementById('game_area').style.width = w+'px';
  init();
}

function init(){
  if (mLoader.getProgress()<100)
    setTimeout("init()", 100);
  else{
    mGame.drawMessage("Click here to start");
    mGame.canvas.onclick = start;

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

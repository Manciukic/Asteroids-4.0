// Arrau globale che mi memorizza lo stato della tastiera
var keyboard = new Array(256);

// Inizializzo a false (nessun tasto è premuto all'inizio)
for (var i = 0; i<255; i++){
  keyboard[i] = false;
}

// Costanti per i codici dei tasti della tastiera
var LEFT_KEY = 37;
var UP_KEY = 38;
var RIGHT_KEY = 39;
var DOWN_KEY = 40;
var SPACE_KEY = 32;
var SHIFT_KEY = 16;
var P_KEY = 80;
var F1_KEY = 112;
var Q_KEY = 81;
var M_KEY = 77;
var P_KEY = 80;
var ESC_KEY = 27;

// Gestori degli eventi della tastiera

function onKeyDownHandler(e){
  e = (!e) ? window.event: e; //Explorer -> !e
  var key= (e.which!= null) ? e.which: e.keyCode; //Firefox-> e.which
  if (key >= 0 && key < 256)
    keyboard[key] = true;
}
document.onkeydown = onKeyDownHandler;

function onKeyUpHandler(e){
  e = (!e) ? window.event: e; //Explorer -> !e
  var key= (e.which!= null) ? e.which: e.keyCode; //Firefox-> e.which
  if (key >= 0 && key < 256)
      keyboard[key] = false;
}
document.onkeyup = onKeyUpHandler;

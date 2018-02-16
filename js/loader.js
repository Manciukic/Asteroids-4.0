// Classe per caricare le risorse del gioco
function Loader(){
  // Oggetto per i callback
  var that = this;

  // Attributi
  this.elements = {};
  this.status = {};

  var baseURI = 'assets/';

  // Ritorna l'immagine caricata
  this.get = function (elementURI){
    if (elementURI in this.elements)
      return this.elements[elementURI];
    else{
      console.warn(elementURI + " not found!");
    }
  };

  // Richiedi il caricamento di un elemento
  this.load = function (URI, type){
    switch(type){
      case 'image':
        this.elements[URI] = new Image;
        this.elements[URI].src = baseURI + URI;
        this.status[URI] = false;
        this.elements[URI].onload = function (){
          // quando viene caricata setta true lo status
          that.status[URI] = true;
        };
        break;
      case 'audio':
        this.elements[URI] = new Audio(baseURI + URI);
        this.status[URI] = false;
        this.elements[URI].oncanplaythrough  = function (){
          // quando viene caricata setta true lo status
          that.status[URI] = true;
        };
        break;
      default:
        console.warn("Unrecognized type " + type);
    }
  };

  // Richiedi il progresso in percentuale
  this.getProgress = function (){
    var total = Object.keys(mLoader.elements).length;
    var count = 0;
    for (var s in this.status)
      count += this.status[s]?1:0;
    var progress = count/total * 100;
    return progress;
  };
}

// Inizializza l'oggetto globale per ottenere le risorse caricate
var mLoader = new Loader;

// Carica le risorse necessarie

// immagini
mLoader.load('asteroidLarge.png', 'image');
mLoader.load('asteroidMedium.png', 'image');
mLoader.load('asteroidSmall.png', 'image');
mLoader.load('background.png', 'image');
mLoader.load('bullet.png', 'image');
mLoader.load('explosionLarge.png', 'image');
mLoader.load('explosionMedium.png', 'image');
mLoader.load('explosionSmall.png', 'image');
mLoader.load('ship.png', 'image');

// audio
mLoader.load('bangLarge.wav', 'audio');
mLoader.load('bangMedium.wav', 'audio');
mLoader.load('bangSmall.wav', 'audio');
mLoader.load('beat1.wav', 'audio');
mLoader.load('beat2.wav', 'audio');
mLoader.load('death.wav', 'audio');
mLoader.load('extraShip.wav', 'audio');
mLoader.load('fire.wav', 'audio');
mLoader.load('respawn.wav', 'audio');
mLoader.load('teleport.wav', 'audio');
mLoader.load('thrust.wav', 'audio');
mLoader.load('bonusTrack.mp3', 'audio');

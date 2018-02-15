function Loader(){
  // Oggetto per i callback
  var that = this;

  // Attributi
  this.elements = {};
  this.status = {};

  // Ritorna l'immagine caricats
  this.get = function (elementURI){
    if (elementURI in this.elements)
      return this.elements[elementURI];
    else{
      console.warn(elementURI + " not found!");
      return undefined;
    }
  };

  // Richiedi il caricamento di un elemento
  this.load = function (URI, type){
    switch(type){
      case 'image':
        this.elements[URI] = new Image;
        this.elements[URI].src = URI;
        this.status[URI] = false;
        this.elements[URI].onload = function (){
          that.status[URI] = true;
        };
        break;
      case 'audio':
        this.elements[URI] = new Audio(URI);
        this.status[URI] = false;
        this.elements[URI].onload = function (){
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
      count += s?1:0;
    var progress = count/total * 100;
    return progress;
  };
}

var mLoader = new Loader;

mLoader.load('assets/asteroidLarge.png', 'image');
mLoader.load('assets/asteroidMedium.png', 'image');
mLoader.load('assets/asteroidSmall.png', 'image');
mLoader.load('assets/background.png', 'image');
mLoader.load('assets/bullet.png', 'image');
mLoader.load('assets/explosionLarge.png', 'image');
mLoader.load('assets/explosionMedium.png', 'image');
mLoader.load('assets/explosionSmall.png', 'image');
mLoader.load('assets/ship.png', 'image');

mLoader.load('assets/bangLarge.wav', 'audio');
mLoader.load('assets/bangMedium.wav', 'audio');
mLoader.load('assets/bangSmall.wav', 'audio');
mLoader.load('assets/beat1.wav', 'audio');
mLoader.load('assets/beat2.wav', 'audio');
mLoader.load('assets/death.wav', 'audio');
mLoader.load('assets/extraShip.wav', 'audio');
mLoader.load('assets/fire.wav', 'audio');
mLoader.load('assets/respawn.wav', 'audio');
mLoader.load('assets/teleport.wav', 'audio');
mLoader.load('assets/thrust.wav', 'audio');
mLoader.load('assets/bonusTrack.mp3', 'audio');

// Classe per caricare le risorse del gioco
function Loader(){
  // Oggetto per i callback
  var that = this;

  // Attributi
  this.elements = {};
  this.status = {};

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
        this.elements[URI].src = URI;
        this.status[URI] = false;
        this.elements[URI].onload = function (){
          // quando viene caricata setta true lo status
          that.status[URI] = true;
        };
        break;
      case 'audio':
        this.elements[URI] = new Audio(URI);
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

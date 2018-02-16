// Funzione di utility per convertire gradi in radianti
function rad(deg){
  return deg * Math.PI / 180;
}

// Classe di un oggetto di gioco generico
function GameObject(width, height, spriteURI){
  // that è l'istanza della classe (this) quando sono in una funzione callback
  var that = this;

  // Proprietà geometriche dell'oggetto di gioco
  this.width = width;
  this.height = height;

  // L'immagine dell'oggetto nel gioco
  this.spriteURI = spriteURI;
  this.nSprite = 1;                 //quanti sprite ci sono nell'immagine
  if (spriteURI !== undefined)
    this.sprite = mLoader.get(spriteURI);
  this.currentSprite = 0;           // parte sempre dal primo sprite dell'immagine
  this.spriteInterval = undefined;  // dipende dall'animazione
  this.spriteCounter = 0;           // timer

  // callback per la fine animazione. Ritorna true per fermare il disegno
  this.onAnimationEnd = null;

  // posizione spaziale dell'oggetto
  this.position = {'x': 0, 'y': 0, 'theta': 0};

  //Imposta lo sprite
  this.changeSprite = function (spriteURI, width, height, nSprite, spriteInterval){
    this.spriteURI = spriteURI;
    this.sprite = mLoader.get(spriteURI);
    this.width = width;
    this.height = height;
    this.nSprite = nSprite;
    this.spriteInterval = spriteInterval;
    this.currentSprite = 0;
    this.spriteCounter = 0;
  };

  this.stopSpriteAt0 = function (){
    this.spriteInterval = undefined;
  };

  this.playSprite = function (position, interval){
    this.spriteInterval = interval;
    this.spriteCounter = position*interval;
  };

  // Sposta l'oggetto nella posizione desiderata
  this.moveTo = function(x, y){ // lo spazio è toroidale
    if (x < -Game.PADDING) // l'oggetto è completamente uscito a sinistra
      this.position.x = x + Game.WIDTH + Game.PADDING; // compare a dx
    else if (x > Game.WIDTH)  // uscito a dx
      this.position.x = x - Game.WIDTH - Game.PADDING; // compare a sx
    else this.position.x = x;

    if (y < -Game.PADDING) // l'oggetto è completamente uscito in alto
      this.position.y = y + Game.HEIGHT + Game.PADDING; // compare in basso
    else if (y > Game.HEIGHT)  // uscito in basso
      this.position.y = y - Game.HEIGHT - Game.PADDING; // compare in alto
    else this.position.y = y;
  };

  // Sposta l'oggetto (relativamente alla sua posizione)
  this.move = function (deltaX, deltaY){
    this.moveTo(this.position.x + deltaX, this.position.y + deltaY);
  };

  // Ruota l'oggetto fino all'angolo desiderato
  this.rotateTo = function (theta){
    this.position.theta = theta % 360;
  };

  // Ruota l'oggetto dell'angolo desiderato
  this.rotate = function (deltaTheta){
    this.rotateTo(this.position.theta + deltaTheta);
  };

  // Disegna l'oggetto nel canvas il cui context è ctx
  this.draw = function (){
    if (this.spriteInterval !== undefined){
      if(this.spriteCounter % this.spriteInterval == 0){ // cambio sprite
        this.currentSprite = Math.floor(this.spriteCounter / this.spriteInterval);
        if (this.currentSprite == this.nSprite){
          this.currentSprite = 0;
          this.spriteCounter = 0;
          if (this.onAnimationEnd !== null)
            if (this.onAnimationEnd())
              return;
        }
      }
      this.spriteCounter ++;
    } else {
      this.currentSprite = 0;
    }

    // nell'immagine gli sprite sono organizzati in due colonne
    var spritePosition = {
      'x': this.currentSprite % 2 == 0 ? 0 : this.width,
      'y': Math.floor(this.currentSprite / 2) * this.height
    };

    var scale = mGame.canvas.width/Game.WIDTH;
    var ctx = mGame.context;
    // Salvo il context per poterlo ripristinare dopo
    ctx.save();
    // Vado nella posizione dove voglio inserire l'oggetto
    ctx.translate(this.position.x * scale, this.position.y * scale);
    // Ruoto il context dell'angolo desiderato (NB theta è in deg)
    ctx.rotate(rad(this.position.theta));
    // Disegno l'immagine al centro del nuovo SR
    ctx.drawImage(this.sprite,              //imageObj
                  spritePosition.x,         //sourceX
                  spritePosition.y,         //sourceY
                  this.width,               //sourceWidth
                  this.height,              //sourceHeight
                  -this.width/2 * scale,    //destX
                  -this.height/2 * scale,   //destY
                  this.width * scale,       //destWidth
                  this.height * scale       //destHeight
    );
    // Ripristino il context precedente
    ctx.restore();
  };
}

// Classe che rappresenta un asteroide generico
// speed è il modulo della velocità
//    la direzione della velocità è data dall'angolo iniziale dell'oggetto
// angular_speed è il modulo della velocità di rotazione attorno al centro
function Asteroid(width, height, spriteURI, position, speed, angular_speed){
  // setup inheritance
  this.base = GameObject;
  this.base(width, height, spriteURI);

  // verranno definiti nelle classi derivate
  this.dimension = 'average';
  this.score = 0;

  if (position != undefined){
    this.moveTo(position.x, position.y);
    this.rotateTo(position.theta);
    this.speed_theta = position.theta;
  }

  this.speed = speed;
  this.angular_speed = angular_speed;

  this.movement = function (){
      this.move(this.speed * Math.cos(rad(this.speed_theta)),
                this.speed * Math.sin(rad(this.speed_theta))
      );
      this.rotate(this.angular_speed);
  };
}

// Asteroid è figlio di GameObject
Asteroid.prototype = new GameObject;

function AsteroidLarge(position){
  // parent
  this.base = Asteroid;
  // costanti
  var MAX_SPEED = 1;  // velocità massima
  var MIN_SPEED = 0.5;  // velocità minima

  var MAX_ANGULAR_SPEED = 5;  // velocità di rotazione massima
  var MIN_ANGULAR_SPEED = -5;  // velocità di rotazione minima

  // genera valori random di velocità e rotazione
  var SPEED = Math.random() * (MAX_SPEED-MIN_SPEED+1) + MIN_SPEED;
  var ANGULAR_SPEED = Math.random() * (MAX_ANGULAR_SPEED-MIN_ANGULAR_SPEED+1) + MIN_ANGULAR_SPEED;

  this.base(48, 48, 'assets/asteroidLarge.png', position, SPEED, ANGULAR_SPEED);
  this.dimension = 'large';
  this.score = 20;
}

AsteroidLarge.prototype = new Asteroid;

function AsteroidMedium(position){
  // parent
  this.base = Asteroid;
  // costanti
  var MAX_SPEED = 3;  // velocità massima
  var MIN_SPEED = 1;  // velocità minima

  var MAX_ANGULAR_SPEED = 5;  // velocità di rotazione massima
  var MIN_ANGULAR_SPEED = -5;  // velocità di rotazione minima

  // genera valori random di velocità e rotazione
  var SPEED = Math.random() * (MAX_SPEED-MIN_SPEED+1) + MIN_SPEED;
  var ANGULAR_SPEED = Math.random() * (MAX_ANGULAR_SPEED-MIN_ANGULAR_SPEED+1) + MIN_ANGULAR_SPEED;

  this.base(32, 32, 'assets/asteroidMedium.png', position, SPEED, ANGULAR_SPEED);
  this.dimension = 'medium';
  this.score = 50;
}

AsteroidMedium.prototype = new Asteroid;

function AsteroidSmall(position){
  // parent
  this.base = Asteroid;
  // costanti
  var MAX_SPEED = 5;  // velocità massima
  var MIN_SPEED = 3;  // velocità minima

  var MAX_ANGULAR_SPEED = 5;  // velocità di rotazione massima
  var MIN_ANGULAR_SPEED = -5;  // velocità di rotazione minima

  // genera valori random di velocità e rotazione
  var SPEED = Math.random() * (MAX_SPEED-MIN_SPEED+1) + MIN_SPEED;
  var ANGULAR_SPEED = Math.random() * (MAX_ANGULAR_SPEED-MIN_ANGULAR_SPEED+1) + MIN_ANGULAR_SPEED;

  this.base(16, 16, 'assets/asteroidSmall.png', position, SPEED, ANGULAR_SPEED);
  this.dimension = 'small';
  this.score = 100;
}

AsteroidSmall.prototype = new Asteroid;

// l'array di asteroidi con cui iniziare il livello
function generateAsteroids(level){
  var n = level<5 ? level*2+2 : 12;
  var asteroids = new Array();

  while(asteroids.length < n){
    var newAsteroid = new AsteroidLarge({
      'x': Math.random()*Game.WIDTH,
      'y': Math.random()*Game.HEIGHT,
      'theta': Math.random()*360
    });

    // se non collide con nessun altro asteroide appena generato o con la nave
    if (collides(newAsteroid, asteroids.concat(mGame.ship))==-1)
      asteroids.push(newAsteroid);
  }
  return asteroids;
}

// classe che definisce l'esplosione
function Explosion(x, y, dimension){
  this.base = GameObject;

  switch(dimension){
    case 'small':
      this.base(41, 41, 'assets/explosionSmall.png');
      this.sound = mLoader.get('assets/bangSmall.wav');
      break;
    case 'medium':
      this.base(58, 58, 'assets/explosionMedium.png');
      this.sound = mLoader.get('assets/bangMedium.wav');
      break;
    case 'large':
      this.base(64, 64, 'assets/explosionLarge.png');
      this.sound = mLoader.get('assets/bangLarge.wav');
      break;
    default:
      console.warn("Unknown dimension: " + dimension);
      return;
  }

  // mi servirà per rimuovere le esplosioni complete dall'array
  this.dead = false;

  // quando finisce l'animazione non disegnarlo più
  this.onAnimationEnd = function(){
    this.dead = true;
    return true;
  }

  this.moveTo(x, y);

  // imposta l'animazione
  this.changeSprite(this.spriteURI, this.width, this.height, 7, 5);

  // fai partire l'audio dell'esplosione
  this.sound.play();
}

// Explosion è figlio di GameObject
Explosion.prototype = new GameObject;

// Classe che definisce il proiettile
function Bullet(position){
  var SPEED = 30;  // velocità del proiettile
  this.ttl = 10;  // tempo di vita rimasto

  this.moveTo(position.x, position.y);
  this.rotateTo(position.theta);

  this.movement = function (){
    if (this.ttl > 0){
      this.move(SPEED * Math.cos(rad(this.position.theta)),
                SPEED * Math.sin(rad(this.position.theta))
      );
      this.ttl --;
    }
  };

  // mi servirà per rimuovere i proiettili dall'array
  this.checkDeath = function(){
    return this.ttl <= 0;
  };
}

// Bullet è figlio di GameObject
Bullet.prototype = new GameObject(15, 7, 'assets/bullet.png');

// Classe che rappresenta la navicella
function Ship(){
  // Parametri di gioco
  var ACC_P = 0.3;         // accelerazione quando il propulsore è acceso
  var ACC_I = -0.05;       // accelerazione quando il propuòsore è spento
  var K_FRICTION = 0.001;  // coefficiente di resistenza aerodinamica
  var SHOOT_COOLDOWN = 10;       // tempo di attesa fra due proiettili consecutivi
  var TELEPORT_COOLDOWN = 30;       // tempo di attesa fra due teletrasporti
  var ANG_SPEED = 10;      // velocità angolare
  var SPRITE_INTERVAL = 2;  // ogni quanti frame cambia sprite

  // flag morte
  this.dead = false;

  //numero di vite rimaste
  this.lives = 3;

  // Suoni della navicella
  this.fireSound = mLoader.get('assets/fire.wav');
  this.thrustSound = mLoader.get('assets/thrust.wav');
  this.teleportSound = mLoader.get('assets/teleport.wav');
  this.respawnSound = mLoader.get('assets/respawn.wav');

  // Posizione iniziale della navicella
  this.moveTo(Game.WIDTH/2, Game.HEIGHT/2);
  this.rotateTo(-90); //verso l'alto

  // variabili di stato della navicella
  this.v = {'x': 0, 'y':0};         // velocità attuale
  this.shootCooldown = 0;  // timer per il tempo di attesa fra due proiettili consecutivi
  this.teleportCooldown = 0; // timer per il tempo di attesa fra due teletrasporti consecutivi

  // imposta lo sprite  (spriteURI, width, height, nSprite, spriteInterval)
  this.changeSprite(this.spriteURI, this.width, this.height, 2, undefined);

  // propulsori attivi
  var thrustOn = false;

  // funzione per tornare in vita
  this.respawn = function (){
    if (this.lives > 1){  // se non ha finito le vite
      // togli una vita
      this.lives --;

      // riporta in vita la navicella
      this.dead = false;

      // riposiziona la navicella al centro
      this.moveTo(Game.WIDTH/2, Game.HEIGHT/2);
      this.rotateTo(-90);

      // azzera la velocità
      this.v.x = this.v.y = 0;

      // azzera i timer
      this.shootCooldown = 0;
      this.teleportCooldown = 0;

      this.respawnSound.play();
    }
  };

  // funzione per sparare
  this.shoot = function () {
    // aggiunge un nuovo proiettile
    mGame.bullets.push(new Bullet(this.position));

    // fa partire l'audio
    this.fireSound.play();
  };

  //funzione per teletrasporto
  this.teleport = function(){
    // teletrasporta la navicella
    this.moveTo(Math.random()*Game.WIDTH, Math.random()*Game.HEIGHT);

    // fa partire l'audio
    this.teleportSound.play();
  };

  this.movement = function (){
    // Aggiorna le variabili di stato
    var vMod = Math.sqrt(Math.pow(this.v.x, 2)+Math.pow(this.v.y, 2));
    var versoreV = {'x': this.v.x/vMod, 'y': this.v.y/vMod};
    var acceleration = {'x': 0, 'y': 0};

    // Accelerazione dovuta all'attrito con il mezzo fluido
    if (vMod > 0){
      acceleration.x -= K_FRICTION * Math.pow(vMod, 2) * versoreV.x;
      acceleration.y -= K_FRICTION * Math.pow(vMod, 2) * versoreV.y;
    }

    // Accelerazione dovuta alla propulsione. Solo se sta premendo freccia su
    if (keyboard[UP_KEY]){
      acceleration.x += ACC_P*Math.cos(rad(this.position.theta));
      acceleration.y += ACC_P*Math.sin(rad(this.position.theta));

      // fa partire l'audio
      if (this.thrustSound.paused)
        this.thrustSound.play();

      // Se non si stava muovendo, fai partire l'animazione
      if (!thrustOn){
        this.playSprite(1, SPRITE_INTERVAL);
        thrustOn = true;
      }

    } else {
      // ferma l'audio
      if (!this.thrustSound.paused){
        this.thrustSound.pause();
        this.thrustSound.currentTime = 0;
      }

      thrustOn = false;

      // ferma l'animazione e ritorna al primo sprite
      this.stopSpriteAt0();
    }

    // Applico l'accelerazione alla velocità
    this.v.x += acceleration.x;
    this.v.y += acceleration.y;

    // Ruoto la navicella
    if (keyboard[LEFT_KEY] && !keyboard[RIGHT_KEY]){
      this.rotate(-ANG_SPEED);
    }
    if (!keyboard[LEFT_KEY] && keyboard[RIGHT_KEY]){
      this.rotate(+ANG_SPEED);
    }

    // Muovo la navicella
    if (this.teleportCooldown <= 0 && keyboard[SHIFT_KEY]){
      // Se si sta teletrasportando
      this.teleport();
      this.teleportCooldown = TELEPORT_COOLDOWN;
    } else{ //Altrimenti
      this.move(this.v.x, this.v.y);

      // decrementa il timer per il teletrasporto se necessario
      if (this.teleportCooldown > 0)
        this.teleportCooldown --;
    }

    // Controllo per il lancio del proiettile
    if (this.shootCooldown > 0)
      this.shootCooldown --;
    else if(keyboard[SPACE_KEY]){
      this.shoot();
      this.shootCooldown = SHOOT_COOLDOWN;
    }
  };
}

// Ship è la classe figlia di GameObject
Ship.prototype = new GameObject(36, 32, 'assets/ship.png');

// Classe che rappresenta il gioco
function Game(){
  // that è l'oggetto quando sono in una funzione callback
  var that = this;

  // costanti
  var BEAT_INTERVAL = 30;
  var RESPAWN_INTERVAL = 100;
  var IMMUNITY_INTERVAL = 50;
  var CHANGE_SOUND_INTERVAL = 30;

  // il canvas è inizializzato dal main tramite il metodo setCanvas
  this.canvas = null;
  this.context = null;
  this.setCanvas = function (canvas){
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
  };

  // Oggetti di gioco
  this.ship = new Ship;
  this.bullets = new Array();
  this.asteroids = new Array();
  this.explosions = new Array();

  // Audio di gioco
  this.beat1Sound = mLoader.get('assets/beat1.wav');
  this.beat2Sound = mLoader.get('assets/beat2.wav');
  this.soundCounter = 0;  // timer per l'audio di sottofondo

  this.bonusTrack = mLoader.get('assets/bonusTrack.mp3');
  this.bonusTrack.loop = true;
  this.bonusTrackActivated = false;

  this.changeSoundCooldown = 0; // timer per il cambio della traccia audio

  this.deathSound = mLoader.get('assets/death.wav');
  this.extraShipSound = mLoader.get('assets/extraShip.wav');

  // sfondo
  this.background = mLoader.get('assets/background.png');

  //punteggio e livello
  this.level = 0;
  this.score = 0;
  this.bonusLives = 0;

  // counter per il respawn
  this.respawnCounter = RESPAWN_INTERVAL;
  this.immunityCounter = IMMUNITY_INTERVAL - 1;

  //callback per il termine del gioco
  this.onEnd = null;
  //callback per aggiornare elementi esterni al canvas ad ogni loop
  this.onLoop = null;
  //callback per il gioco in pausa
  this.onPause = null;

  // id dell'interval
  var loopInterval;

  // inizia il gioco
  this.start = function (){
    this.level = 0;
    this.score = 0;
    this.bonusLives = 0;
    loopInterval = setInterval('mGame.loop()', 30);
  };

  // mette in pausa il gioco
  this.pause = function (){
    clearInterval(loopInterval);

    this.drawMessage("Gioco in pausa", 40, false);
    this.drawSubMessage("Clicca di nuovo per ripartire", 20, 40);

    if (this.onPause != null){
      this.onPause();
    }
  }

  // riprendi il gioco dalla pausa
  this.resume = function(){
    loopInterval = setInterval('mGame.loop()', 30);
  }

  // termina il gioco
  this.end = function(){
    clearInterval(loopInterval);

    // disegna tutte le scritte
    this.drawMessage('GAME OVER', 50, false);
    this.drawSubMessage('PUNTEGGIO: ' + this.score, 25, 50);
    this.drawSubMessage('Clicca di nuovo per rigiocare', 12, 220);
    if(this.score > highscore){
      this.drawSubMessage('NUOVO RECORD', 25, -100);
    }

    // fa partire l'audio
    this.deathSound.play();

    // ferma la musica di sottofondo
    if (!this.bonusTrack.paused)
      this.bonusTrack.pause();

    // chiama il callback se definito
    if (this.onEnd != null)
      this.onEnd();
  };

  // Azzera le variabili per iniziare un nuovo gioco
  this.reset = function(){
    // Oggetti di gioco
    this.ship = new Ship;
    this.bullets = new Array();
    this.asteroids = new Array();
    this.explosions = new Array();

    // Audio di gioco
    this.soundCounter = 0;

    //punteggio e livello
    this.level = 0;
    this.score = 0;
    this.bonusLives = 0;

    // counter vari
    this.respawnCounter = RESPAWN_INTERVAL;
    this.immunityCounter = IMMUNITY_INTERVAL - 1;
  };

  // metodo per rimuovere un asteroide
  // azioni che deve fare:
  //    - aumentare il punteggio
  //    - creare l'esplosione
  //    - rimuovere l'asteroide dall'Array
  //    - aggiungere all'array nuovi asteroidi più piccoli
  //      la cui direzione di movimento dipende da theta
  this.destroyAsteroid = function (asteroidIdx, theta){
    var dim = this.asteroids[asteroidIdx].dimension;
    var pos = this.asteroids[asteroidIdx].position;

    // aumenta il punteggio
    this.score += this.asteroids[asteroidIdx].score;

    // crea un'esplosione
    this.explosions.push(new Explosion(
            this.asteroids[asteroidIdx].position.x,
            this.asteroids[asteroidIdx].position.y,
            dim)
    );

    // rimuove dall'array l'asteroide
    this.asteroids.splice(asteroidIdx, 1);

    // aggiunge all'array nuovi asteroidi più piccoli
    switch(dim){
      case 'large':
        this.asteroids.push(new AsteroidMedium({
          'x': pos.x,
          'y': pos.y,
          'theta': (pos.theta + theta)/2 - 45
        }));
        this.asteroids.push(new AsteroidMedium({
          'x': pos.x,
          'y': pos.y,
          'theta': (pos.theta + theta)/2 + 45
        }));
        break;
      case 'medium':
        this.asteroids.push(new AsteroidSmall({
          'x': pos.x,
          'y': pos.y,
          'theta': (pos.theta + theta)/2 - 45
        }));
        this.asteroids.push(new AsteroidSmall({
          'x': pos.x,
          'y': pos.y,
          'theta': (pos.theta + theta)/2 + 45
        }));
      break;
      case 'small':
        break;
      default:
        console.warn("Unrecognized dimension " + dim);
    }
  };

  // main game loop
  this.loop = function (){
    // --- AZIONI PRELIMINARI ---

    // variabili per salvare se ci sono stati cambiamenti
    // saranno poi passate al callback per aggiornare punteggio / vite
    var scoreChanged = false;
    var livesChanged = false;

    //Check fine gioco
    if (this.ship.dead){  // se la navicella è morta
      if (this.ship.lives <= 1){  // e non ha più vite
        if (this.explosions.length == 0){ // e sono finite le animazioni delle esplosioni
          // game over
          this.end();
          return;
        }
      } else {  // se ha ancora altre vite
        if (this.respawnCounter > 0){ // se non è finito il timer per rinascere
          // decrementa il timer
          this.respawnCounter --;
        } else{ // se può rinascere
          // reimposta il timer
          this.respawnCounter = RESPAWN_INTERVAL;

          //fa rinascere la nave
          this.ship.respawn();

          // memorizza il cambiamento del numero di vite
          livesChanged = true;

          // inizia l'immunità
          this.immunityCounter --;
        }
      }
    }

    // --- AUDIO ---

    // Cambio audio in background
    if (this.changeSoundCooldown == 0){ // se è finito il timer fra due cambiamenti
      if(keyboard[M_KEY]){              // e l'utente vuole cambiare musica
        // cambia musica
        this.bonusTrackActivated = !this.bonusTrackActivated;

        // resetta il timer
        this.changeSoundCooldown = CHANGE_SOUND_INTERVAL;
      }
    } else{ // se non è finito il timer, decrementalo
      this.changeSoundCooldown --;
    }

    // Audio in background
    if (!this.bonusTrackActivated){ // se è attivato l'audio normale
      if (!this.bonusTrack.paused)  // ma non è ancora stato fermato quello bonus
        this.bonusTrack.pause();    // fermalo
      this.soundCounter ++;         // aumenta il timer per l'intervallo fra due "battiti"
      if (this.soundCounter % BEAT_INTERVAL == 0){  // se è multiplo di BEAT_INTERVAL
        if (Math.floor(this.soundCounter / BEAT_INTERVAL) % 2 == 0){  // e il quoziente è pari
          this.beat1Sound.play();   // allora riproduci il primo "battito"
        } else {
          this.beat2Sound.play();   // altrimenti riproduci il secondo "battito"
        }
        // per evitare overflow, azzero soundCounter quando sono stati riprodotti entrambi i "battiti"
        if (this.soundCounter >= BEAT_INTERVAL*2)
          this.soundCounter = 0;
      }
    } else{                         // se è attivato l'audio bonus
        if (this.bonusTrack.paused) // ma è in pausa
          this.bonusTrack.play();   // riattivalo
    }

    // --- INIZIALIZZAZIONE ---

    // cancello il frame precedente
    this.context.clearRect(0, 0,
      this.canvas.width,
      this.canvas.height
    );

    // disegno lo sfondo
    this.context.drawImage(this.background, 0, 0,
      this.canvas.width,
      this.canvas.height
    );

    // --- MOVIMENTO ---

    // Navicella
    if(!this.ship.dead)
      this.ship.movement();

    // Asteroidi
    if (this.asteroids.length == 0){  // se ha distrutto tutti gli asteroidi
      this.level ++;                  // aumenta il livello
      this.asteroids = generateAsteroids(this.level); // ripopola la mappa
      this.immunityCounter --;  // rendo immune per un po' per evitare inconvenienti
    }
    // Muovo gli asteroidi
    for (var idx in this.asteroids){
      this.asteroids[idx].movement();
    }

    //Proiettili
    for (var i=this.bullets.length-1; i>=0; i--){
      if (!this.bullets[i].checkDeath()){ //se "vivi"
        this.bullets[i].movement();
      } else {  // se "morti"
        this.bullets.splice(i,1);
      }
    }

    //Esplosioni (non si muovono ma rimuovo quelle finite)
    for (var i=this.explosions.length-1; i>=0; i--){
      if (this.explosions[i].dead){
        this.explosions.splice(i,1);
      }
    }

    // --- COLLISIONI ---

    // Asteroidi con navicella
    if (!this.ship.dead){ // se la navicella è viva
      if (this.immunityCounter == IMMUNITY_INTERVAL){ // e non è immune
        // verifica la collisione con gli asteroidi
        var shipCollision = collides(this.ship, this.asteroids);

        // se collide
        if (shipCollision != -1){
          this.ship.dead = true;    // imposta la navicella come morta
          this.explosions.push(new Explosion( // disegna l'esplosione
                  this.ship.position.x,
                  this.ship.position.y,
                  'large')
          );
          // distrugge l'asteroide che l'ha colpita
          this.destroyAsteroid(shipCollision, this.ship.position.theta);
          scoreChanged = true;
        }
      } else{ // se è immune aggiorno il timer
        if (this.immunityCounter > 0)
          this.immunityCounter --;
        else this.immunityCounter = IMMUNITY_INTERVAL;
      }
    }

    // Asteroidi con proiettili
    for(var i = this.bullets.length-1; i>=0; i--){  // per ogni proiettile
      // cerco la collisione con un qualsiasi asteroide
      var bulletCollision = collides(this.bullets[i], this.asteroids);

      if (bulletCollision != -1){ // se collide
        var theta = this.bullets[i].position.theta;
        this.bullets.splice(i,1); // rimuovi il proiettile
        this.destroyAsteroid(bulletCollision, theta);

        // segnala il cambiamento del punteggio
        scoreChanged = true;
      }
    }

    // --- RENDERING ---

    // Navicella
    if (!this.ship.dead){
      this.ship.draw();
    }

    // Asteroidi
    for (var idx in this.asteroids){
      this.asteroids[idx].draw();
    }

    // Proiettili
    for (var idx in this.bullets){
      this.bullets[idx].draw();
    }

    // Esplosioni
    for (var idx in this.explosions){
      this.explosions[idx].draw();
    }

    // --- AZIONI FINALI ---

    // Verifica l'idoneità alla vita bonus
    if (this.score > 10000 * (this.bonusLives+1)){
      this.bonusLives ++;
      this.ship.lives ++;
      this.extraShipSound.play();
    }

    // Chiama il callback
    if(this.onLoop != null)
      this.onLoop(scoreChanged, livesChanged);

    // Verifica che l'utente non voglia mettere in pausa
    if(keyboard[P_KEY] || keyboard[ESC_KEY])
      this.pause();
  };


  // Cambia la dimensione del canvas in base a width e height della window
  this.resize = function(width, height){
    var SCALE = 0.7;  // costante
    var w, h;

    if (width/height > Game.WIDTH/Game.HEIGHT){ // se lo schermo è più largo del gioco (4:3)
      w = height * Game.WIDTH/Game.HEIGHT * SCALE;
      h = height * SCALE;
    } else if (width/height < Game.WIDTH/Game.HEIGHT){ // se lo schermo è più stretto del gioco (4:3)
      w = width * SCALE;
      h = width * Game.HEIGHT/Game.WIDTH * SCALE;
    } else{
      w = width * SCALE;
      h = height * SCALE;
    }

    // se non ci sono stati errori
    // (non dovrebbe ma essendo una funzione delicata un controllo in più non fa male)
    if (!isNaN(w) && !isNaN(h)){
      this.canvas.width = w;
      this.canvas.height = h;
      return w;
    } else
      return -1;
  };


  // Disegna un messaggio centrato con stritto text di grandezza fontSize
  // Può essere specificato se lasciare il canvas così com'è o se "pulirlo" (wipe)
  this.drawMessage = function(text, fontSize, wipe){
    var x = this.canvas.width / 2;
    var y = this.canvas.height / 2;

    // Scala il font in base alla dimensione del canvas
    fontSize = Math.floor(fontSize * this.canvas.width/Game.WIDTH);

    // pulisco tutto se richiesto
    if(wipe){
      this.context.clearRect(0, 0,
        this.canvas.width,
        this.canvas.height
      );
    }

    // disegno
    this.context.save();
    this.context.font = fontSize + 'px Press-Start-2P';
    this.context.textAlign = 'center';
    this.context.fillStyle = 'white';
    this.context.fillText(text, x, y, this.canvas.width);
    this.context.restore();
  };

  // Disegna un messaggio con stritto text di grandezza fontSize
  // Il messaggio è centrato orizzontalmente e si discosta di verticalShift dal
  // centro verticale
  this.drawSubMessage = function(text, fontSize, verticalShift){
    var x = this.canvas.width / 2;
    var y = this.canvas.height / 2 + verticalShift;

    // Scala il font in base alla dimensione del canvas
    fontSize = Math.floor(fontSize * this.canvas.width/Game.WIDTH);

    // disegno
    this.context.save();
    this.context.font = fontSize + 'px Press-Start-2P';
    this.context.textAlign = 'center';
    this.context.fillStyle = 'white';
    this.context.fillText(text, x, y, this.canvas.width);
    this.context.restore();
  };
} // fine della classe Game

// Variabili statiche
// Dimensioni del campo di gioco
Game.WIDTH = 640;
Game.HEIGHT = 480;
Game.PADDING = 25;

// Stima veloce sulla possibilità di collisione fra obj e obstacle
// controlla se la distanza fra gli oggetti è maggiore del massimo della somma
// delle metà delle loro altezze o larghezze
function mayCollide(obj, obstacle){
  var d = Math.sqrt(Math.pow(obj.position.x - obstacle.position.x, 2),
                    Math.pow(obj.position.y - obstacle.position.y, 2)
  );
  var maxD = Math.max(obj.width, obj.height)/2 + Math.max(obstacle.width, obstacle.height)/2;
  return d <= maxD;
}

// Trasforma le coordinate di v nel SR di centro O e ruotato di theta radianti
// pos è un booleano e indica se va sommato o sottratto o.* da v.*
function rototranslation(v, o, theta, pos){
  // Coordinate di v nel SR con centro in O
  var relPosT = {
    'x': v.x - (pos?1:-1)*o.x,
    'y': v.y - (pos?1:-1)*o.y
  };

  // Coordinate di v ruotanto il sistema di riferimento precedente
  var relPos = {
    'x': relPosT.x * Math.cos(theta) - relPosT.y * Math.sin(theta),
    'y': relPosT.x * Math.sin(theta) + relPosT.y * Math.cos(theta)
  };

  return relPos;
}

// Verifica della collisione fra obj e obstacle utilizzando l'algoritmo SAT
function shadowOverlapes(obj, obstacle){
  var theta = -rad(obj.position.theta);

  // calcolo i vertici del rettangolo obstacle rispetto al centro di obstacle
  var A = rototranslation(
    {'x': obstacle.width/2, 'y': obstacle.height/2},
    {'x': 0, 'y': 0},
    rad(obstacle.position.theta),
    true
  );
  var B = rototranslation(
    {'x': -obstacle.width/2, 'y': obstacle.height/2},
    {'x': 0, 'y': 0},
    rad(obstacle.position.theta),
    true
  );
  var C = rototranslation(
    {'x': -obstacle.width/2, 'y': -obstacle.height/2},
    {'x': 0, 'y': 0},
    rad(obstacle.position.theta),
    true
  );
  var D = rototranslation(
    {'x': obstacle.width/2, 'y': -obstacle.height/2},
    {'x': 0, 'y': 0},
    rad(obstacle.position.theta),
    true
  );

  // calcolo le coordinate assolute
  A = rototranslation(A, obstacle.position, 0, false);
  B = rototranslation(B, obstacle.position, 0, false);
  C = rototranslation(C, obstacle.position, 0, false);
  D = rototranslation(D, obstacle.position, 0, false);

  // Trovo le loro coordinate sul SR descritto sopra
  A = rototranslation(A, obj.position, theta, true);
  B = rototranslation(B, obj.position, theta, true);
  C = rototranslation(C, obj.position, theta, true);
  D = rototranslation(D, obj.position, theta, true);

  // Trovo gli estremi della proiezione del rettangolo lungo gli assi
  var shadowX = [
    Math.min(A.x, B.x, C.x, D.x),
    Math.max(A.x, B.x, C.x, D.x)
  ];
  var shadowY = [
    Math.min(A.y, B.y, C.y, D.y),
    Math.max(A.y, B.y, C.y, D.y)
  ];

  // Collidono se NON ci sono gap tra le ombre
  return !((shadowX[0] > obj.width/2 && shadowX[1] > obj.width/2)
    || (shadowX[0] < -obj.width/2 && shadowX[1] < -obj.width/2)
    || (shadowY[0] > obj.height/2 && shadowY[1] > obj.height/2)
    || (shadowY[0] < -obj.height/2 && shadowY[1] < -obj.height/2));
}

// Ritorna true se obj e obstacle collidono
function reallyCollides(obj, obstacle){
  return shadowOverlapes(obj, obstacle) && shadowOverlapes(obstacle, obj);
}

// Verifica la collisione fra obj e ogni ostacolo in obstacles
// Ritorna l'indice dell'oggetto che collide oppure -1
function collides(obj, obstacles){
  for (var idx in obstacles){
    if (mayCollide(obj, obstacles[idx]))  // algoritmo veloce ma soggetto a falsi positivi
      if (reallyCollides(obj, obstacles[idx]))  // algoritmo lento ma preciso
        return idx; // collisione!
  }
  // Nessuna collisione
  return -1;
}

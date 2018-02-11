// Funzione di utility per convertire gradi in radianti
function rad(deg){
  return deg * Math.PI / 180;
}

// Classe di un oggetto di gioco generico
function GameObject(width, height, spriteURI){
  // that è l'oggetto quando sono in una funzione callback
  var that = this;

  // Proprietà geometriche dell'oggetto di gioco
  this.width = width;
  this.height = height;

  // L'immagine dell'oggetto nel gioco
  this.spriteURI = spriteURI;
  this.nSprite = 1;
  if (spriteURI !== undefined)
    this.sprite = mLoader.get(spriteURI);
  this.currentSprite = 0;
  this.spriteInterval = undefined;
  this.spriteCounter = 0;

  // callback per la fine animazione. Ritorna true per fermare il disegno
  this.onAnimationEnd = null;

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

function Asteroid(width, height, spriteURI, position, speed, angular_speed){
  // setup inheritance
  this.base = GameObject;
  this.base(width, height, spriteURI);

  this.dimension = 'average';
  this.score = 0;

  if (position != undefined){
    this.moveTo(position.x, position.y);
    this.speed_theta = position.theta;
  }

  this.speed = speed;

  this.movement = function (){
      this.move(this.speed * Math.cos(rad(this.speed_theta)),
                this.speed * Math.sin(rad(this.speed_theta))
      );
      this.rotate(angular_speed);
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

function generateAsteroids(level){
  var n = level<5 ? level*2+2 : 12;
  var asteroids = new Array();

  while(asteroids.length < n){
    var newAsteroid = new AsteroidLarge({
      'x': Math.random()*Game.WIDTH,
      'y': Math.random()*Game.HEIGHT,
      'theta': Math.random()*360
    });

    if (collides(newAsteroid, asteroids.concat(mGame.ship))==-1)
      asteroids.push(newAsteroid);
  }
  return asteroids;
}

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
      console.log("Unknown dimension: " + dimension);
      return;
  }

  this.dead = false;

  this.onAnimationEnd = function(){
    this.dead = true;
    return true;
  }

  this.moveTo(x, y);

  //(spriteURI, width, height, nSprite, spriteInterval)
  this.changeSprite(this.spriteURI, this.width, this.height, 7, 5);
  this.sound.play();
}

Explosion.prototype = new GameObject;

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

  this.checkDeath = function(){
    return this.ttl <= 0;
  };

}

// Bullet è figlio di GameObject
Bullet.prototype = new GameObject(15, 7, 'assets/bullet.png');

function Ship(){
  // Parametri di gioco
  this.ACC_P = 0.3;         // accelerazione quando il propulsore è acceso
  this.ACC_I = -0.05;       // accelerazione quando il propuòsore è spento
  this.K_FRICTION = 0.001;  // coefficiente di resistenza aerodinamica
  this.SHOOT_COOLDOWN = 10;       // tempo di attesa fra due proiettili consecutivi
  this.TELEPORT_COOLDOWN = 30;       // tempo di attesa fra due teletrasporti
  this.ANG_SPEED = 10;      // velocità angolare
  this.SPRITE_INTERVAL = 2;  // ogni quanti frame cambia sprite

  // flag morte
  this.dead = false;
  this.lives = 3;

  // Suoni della navicella
  this.fireSound = mLoader.get('assets/fire.wav');
  this.thrustSound = mLoader.get('assets/thrust.wav');
  this.teleportSound = mLoader.get('assets/teleport.wav');

  // Posizione iniziale della navicella
  this.moveTo(Game.WIDTH/2, Game.HEIGHT/2);
  this.rotateTo(-90);

  // variabili di stato della navicella
  this.v = {'x': 0, 'y':0};         // velocità attuale
  this.shootCooldown = 0;  // tempo di attesa prima di poter lanciare un proiettile
  this.teleportCooldown = 0;

  // imposta lo sprite  (spriteURI, width, height, nSprite, spriteInterval)
  this.changeSprite(this.spriteURI, this.width, this.height, 2, undefined);
  var thrustOn = false;

  // funzione per tornare in vita
  this.respawn = function (){
    console.log("HEROES NEVER DIE!");
    if (this.lives > 1){
      this.lives --;
      this.dead = false;
      this.moveTo(Game.WIDTH/2, Game.HEIGHT/2);
      this.rotateTo(-90);
      this.v.x = this.v.y = 0;
      this.shootCooldown = 0;
      this.teleportCooldown = 0;

      mLoader.get('assets/respawn.wav').play();
    } else {
        console.warn("ALL YOUR BASE ARE BELONG TO US!");
    }
  };

  // funzione per sparare
  this.shoot = function () {
    mGame.bullets.push(new Bullet(this.position));
    // TODO audio
    this.fireSound.play();
  };

  //funzione per teletrasporto
  this.teleport = function(){
    this.moveTo(Math.random()*Game.WIDTH, Math.random()*Game.HEIGHT);
    this.teleportSound.play();
  }

  this.movement = function (){
    // Aggiorna le variabili di stato
    var vMod = Math.sqrt(Math.pow(this.v.x, 2)+Math.pow(this.v.y, 2));
    var versoreV = {'x': this.v.x/vMod, 'y': this.v.y/vMod};
    var acceleration = {'x': 0, 'y': 0};

    // Accelerazione dovuta all'attrito con il mezzo fluido
    if (vMod > 0){
      acceleration.x -= this.K_FRICTION * Math.pow(vMod, 2) * versoreV.x;
      acceleration.y -= this.K_FRICTION * Math.pow(vMod, 2) * versoreV.y;
    }

    // Accelerazione dovuta alla propulsione
    if (keyboard[UP_KEY]){
      acceleration.x += this.ACC_P*Math.cos(rad(this.position.theta));
      acceleration.y += this.ACC_P*Math.sin(rad(this.position.theta));

      // Play thrust sound
      if (this.thrustSound.paused)
        this.thrustSound.play();

      // Start moving  sprite
      if (!thrustOn){
        this.playSprite(1, this.SPRITE_INTERVAL);
        thrustOn = true;
      }

    } else {
      // pause thrust sound
      if (!this.thrustSound.paused){
        this.thrustSound.pause();
        this.thrustSound.currentTime = 0;
      }

      thrustOn = false;
      this.stopSpriteAt0();
    }

    // Applico l'accelerazione alla velocità
    this.v.x += acceleration.x;
    this.v.y += acceleration.y;

    // Ruoto la navicella
    if (keyboard[LEFT_KEY] && !keyboard[RIGHT_KEY]){
      this.rotate(-this.ANG_SPEED);
    }
    if (!keyboard[LEFT_KEY] && keyboard[RIGHT_KEY]){
      this.rotate(+this.ANG_SPEED);
    }

    // Muovo la navicella
    if (this.teleportCooldown <= 0 && keyboard[SHIFT_KEY]){
      this.teleport();
      this.teleportCooldown = this.TELEPORT_COOLDOWN;
    } else{
      this.move(this.v.x, this.v.y);
      this.teleportCooldown --;
    }

    // Controllo per il lancio del proiettile
    if (this.shootCooldown > 0)
      this.shootCooldown --;
    else if(keyboard[SPACE_KEY]){
      this.shoot();
      this.shootCooldown = this.SHOOT_COOLDOWN;
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

  // il canvas è inizializzato dall'init
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
  this.backgroundSoundPaused = false;
  this.soundCounter = 0;
  this.bonusTrack = null;
  this.bonusTrackActivated = false;

  // sfondo
  this.backgroundloaded = false;
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

  var loopInterval;

  this.start = function (){
    loopInterval = setInterval('mGame.loop()', 30);
    this.backgroundSoundPaused = false;
    this.level = 0;
    this.score = 0;
    this.bonusLives = 0;
  };

  this.end = function(){
    clearInterval(loopInterval);

    this.drawMessage('GAME OVER', 50, false);
    this.drawSubMessage('PUNTEGGIO: ' + this.score, 25, 50);
    this.drawSubMessage('Clicca di nuovo per rigiocare', 12, 220);
    if(this.score > highscore){
      this.drawSubMessage('NUOVO RECORD', 25, -100);
    }

    mLoader.get('assets/death.wav').play();

    if (this.bonusTrack != null)
      this.bonusTrack.pause();

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
    this.backgroundSoundPaused = false;
    this.soundCounter = 0;

    //punteggio e livello
    this.level = 0;
    this.score = 0;
    this.bonusLives = 0;

    // counter vari
    this.respawnCounter = RESPAWN_INTERVAL;
    this.immunityCounter = IMMUNITY_INTERVAL - 1;
  };

  this.destroyAsteroid = function (asteroidIdx, theta){
    //crea un'esplosione
    var dim = this.asteroids[asteroidIdx].dimension;
    var pos = this.asteroids[asteroidIdx].position;
    this.score += this.asteroids[asteroidIdx].score;
    this.explosions.push(new Explosion(
            this.asteroids[asteroidIdx].position.x,
            this.asteroids[asteroidIdx].position.y,
            dim)
    );
    this.asteroids.splice(asteroidIdx, 1);

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
    };
  }

  // main game loop
  this.loop = function (){
    var scoreChanged = false;
    var livesChanged = false;

    //Check fine gioco
    if (this.ship.dead){
      if (this.ship.lives <= 1){
        if (this.explosions.length == 0){
          this.end();
          return;
        }
      } else {
        if (this.respawnCounter > 0){
          this.respawnCounter --;
        } else{
          this.respawnCounter = RESPAWN_INTERVAL;
          this.ship.respawn();
          livesChanged = true;
          this.immunityCounter --;  // inizia l'immunità
        }
      }
    }

    // Audio in background
    if(keyboard[M_KEY]){
      this.bonusTrackActivated = true;
    }
    if (!this.bonusTrackActivated){
      this.soundCounter ++;
      if (this.soundCounter % BEAT_INTERVAL == 0 && !this.backgroundSoundPaused){
        if (Math.floor(this.soundCounter / BEAT_INTERVAL) % 2 == 0){
          this.beat1Sound.play();
        } else {
          this.beat2Sound.play();
        }
        if (this.soundCounter >= BEAT_INTERVAL*2)
          this.soundCounter = 0;
      }
    } else{
      if (this.bonusTrack == null){
        mLoader.load('assets/bonusTrack.mp3', 'audio');
        this.bonusTrack = mLoader.get('assets/bonusTrack.mp3');
        this.bonusTrack.loop = true;
      } else{
        if (this.bonusTrack.paused)
          this.bonusTrack.play();
      }
    }

    // cancello il frame precedente
    this.context.clearRect(0, 0,
      this.canvas.width,
      this.canvas.height
    );

    //disegno lo sfondo
    this.context.drawImage(this.background, 0, 0,
      this.canvas.width,
      this.canvas.height
    );

    // Movimento degli oggetti del gioco
    //Navicella
    if(!this.ship.dead)
      this.ship.movement();

    //Asteroidi
    if (this.asteroids.length == 0){
      this.level ++;
      this.asteroids = generateAsteroids(this.level);
      this.immunityCounter --;  // rendo immune per un po' per evitare inconvenienti\
    }
    for (var idx in this.asteroids){
      this.asteroids[idx].movement();
    }

    //Proiettili
    for (var i=this.bullets.length-1; i>=0; i--){
      if (!this.bullets[i].checkDeath()){
        this.bullets[i].movement();
      } else {
        this.bullets.splice(i,1);
      }
    }

    //Esplosioni (non si muovono ma rimuovo quelle finite)
    for (var i=this.explosions.length-1; i>=0; i--){
      if (this.explosions[i].dead){
        this.explosions.splice(i,1);
      }
    }

    // Controllo delle collisioni
    // Con navicella
    if (!this.ship.dead){
      // se la navicella non è immune
      if (this.immunityCounter == IMMUNITY_INTERVAL){
        var shipCollision = collides(this.ship, this.asteroids);
        if (shipCollision != -1){
          this.ship.dead = true;
          this.explosions.push(new Explosion(
                  this.ship.position.x,
                  this.ship.position.y,
                  'large')
          );
          this.destroyAsteroid(shipCollision, this.ship.position.theta);
          scoreChanged = true;
        }
      } else{
        if (this.immunityCounter > 0)
          this.immunityCounter --;
        else this.immunityCounter = IMMUNITY_INTERVAL;
      }
    }

    // Con proiettili
    for(var i = this.bullets.length-1; i>=0; i--){
      var bulletCollision = collides(this.bullets[i], this.asteroids);
      if (bulletCollision != -1){ //se collide
        var theta = this.bullets[i].position.theta;
        this.bullets.splice(i,1); //rimuovi il proiettile
        this.destroyAsteroid(bulletCollision, theta);
        scoreChanged = true;
      }
    }

    // Rendering degli oggetti
    if (!this.ship.dead){
      this.ship.draw();
    }
    for (var idx in this.asteroids){
      this.asteroids[idx].draw();
    }
    for (var idx in this.bullets){
      this.bullets[idx].draw();
    }
    for (var idx in this.explosions){
      this.explosions[idx].draw();
    }

    if (this.score > 10000 * (this.bonusLives+1)){
      this.bonusLives ++;
      this.ship.lives ++;
      mLoader.get('assets/extraShip.wav').play();
    }

    if(this.onLoop != null)
      this.onLoop(scoreChanged, livesChanged);
  };

  this.resize = function(width, height){
    var SCALE = 0.7;
    //console.log(width + " x " + height);
    var w, h;
    if (width/height > Game.WIDTH/Game.HEIGHT){
      w = height * Game.WIDTH/Game.HEIGHT * SCALE;
      h = height * SCALE;
    } else if (width/height < Game.WIDTH/Game.HEIGHT){
      w = width * SCALE;
      h = width * Game.HEIGHT/Game.WIDTH * SCALE;
    }
    if (w !== undefined && !isNaN(w) && h !== undefined && !isNaN(h)){
      // this.canvas.style.marginLeft  = (width - w - 15)/2 + 'px';
      // this.canvas.style.marginRight = (width - w - 15)/2 + 'px';
      this.canvas.width = w;
      this.canvas.height = h;
      console.log(w + " x " + h);
      return w;
    }
    return -1;
  };

  this.drawMessage = function(text, fontSize, wipe){
    var x = this.canvas.width / 2;
    var y = this.canvas.height / 2;

    fontSize = Math.floor(fontSize * this.canvas.width/Game.WIDTH);

    // pulisco tutto
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

  this.drawSubMessage = function(text, fontSize, verticalShift){
    var x = this.canvas.width / 2;
    var y = this.canvas.height / 2 + verticalShift;

    fontSize = Math.floor(fontSize * this.canvas.width/Game.WIDTH);

    // disegno
    this.context.save();
    this.context.font = fontSize + 'px Press-Start-2P';
    this.context.textAlign = 'center';
    this.context.fillStyle = 'white';
    this.context.fillText(text, x, y, this.canvas.width);
    this.context.restore();
  };
}

// Variabili statiche
// Dimensioni del campo di gioco
Game.WIDTH = 640;
Game.HEIGHT = 480;
Game.PADDING = 25;

// Stima sulla possibilità di collisione fra obj e obstacle
function mayCollide(obj, obstacle){
  var d = Math.sqrt(Math.pow(obj.position.x - obstacle.position.x, 2),
                    Math.pow(obj.position.y - obstacle.position.y, 2)
  );
  var maxD = Math.max(obj.width, obj.height)/2 + Math.max(obstacle.width, obstacle.height)/2;
  return d <= maxD;
}


// Trasforma le coordinate di v nel SR di centro O e ruotato di theta
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
  var test1 = rototranslation(
    {'x': obj.width/2, 'y': obj.height/2},
    {'x': 0, 'y': 0},
    rad(obstacle.position.theta),
    true
  );

  // calcolo le coordinate assolute
  A = rototranslation(A, obstacle.position, 0, false);
  B = rototranslation(B, obstacle.position, 0, false);
  C = rototranslation(C, obstacle.position, 0, false);
  D = rototranslation(D, obstacle.position, 0, false);
  var test2 = rototranslation(test1, obj.position, 0, false);

  // Trovo le loro coordinate sul SR descritto sopra
  A = rototranslation(A, obj.position, theta, true);
  B = rototranslation(B, obj.position, theta, true);
  C = rototranslation(C, obj.position, theta, true);
  D = rototranslation(D, obj.position, theta, true);
  var test = rototranslation(test2, obj.position, theta, true);

  //console.log("test: from (" + obj.width/2 + ", " + obj.height/2 + ") to (" + test.x + ", "+ test.y + ")");

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

//
function reallyCollides(obj, obstacle){
  return shadowOverlapes(obj, obstacle) && shadowOverlapes(obstacle, obj);
}

// Verifica la collisione fra obj e uno degli obstacles
function collides(obj, obstacles){
  var start = Date.now();
  for (var idx in obstacles){
    if (mayCollide(obj, obstacles[idx]))
      if (reallyCollides(obj, obstacles[idx]))
        return idx;
  }
  var end = Date.now();
  //console.log((start-end)+"ms");
  return -1;
}

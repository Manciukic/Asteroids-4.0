<?php
  session_start();
  $title = "Asteroids 4.0 - Guida";
  $section = 1;
  $include_css = ['article'];
  include_once("includes/header.php");
?>
<main>
  <article>
    <h2>Introduzione</h2>
      <img class="left" src="img/carl_fredricksen.png" alt="Foto del nostro eroe"/>
      <p>Spazio, anno 4018. Carl Fredricksen sta tornando a casa da una missione spaziale nella galassia Salto Angel, dove si era recato per studiare i resti di un uccello preistorico simile ad uno struzzo, quando si imbatte in una fascia di asteroidi. </p>
      <p>L'unico modo per uscirne vivo &egrave; pilotare un drone a forma di astronave per distruggere il maggior numero di asteroidi. Le probabilit&agrave; di successo crescono proporzionalmente al numero di asteroidi distrutti.</p>
    <h2>Comandi</h2>
      <h3>Movimento</h3>
        <ul>
          <li><img src="img/up.png" alt="Freccia su"/>: attiva il propulsore ad elio per ricevere una spinta nella direzione della navicella.</li>
          <li><img src="img/left_right.png" alt="Freccia sinistra/destra"/>: ruota in senso antiorario/orario la navicella.</li>
        </ul>
        <p>Achtung! Nello spazio l'attrito &egrave; pressoch&egrave; assente e non c'&egrave; alcun sistema di freni. L'unico modo per rallentare &egrave; girarsi di 180&deg; e attivare i propulsori.</p>
        <p>Achtung! La mappa &egrave; toroidale, ovvero se la navicella o gli asteroidi escono da sopra ricompaiono sotto e viceversa, se escono da destra ricompaiono a sinistra e viceversa.</p>
      <h3>Abilit&agrave; speciali</h3>
        <ul>
          <li><img src="img/space.png" alt="Barra spaziatrice"/>: attiva il cannone laser per lanciare un proiettile nella direzione della navicella.</li>
          <li><img src="img/shift.png" alt="Shift"/>: attiva il teletrasporto instabile per essere teletrasportato in un punto casuale della mappa. Tra un'attivazione e l'altra bisogna attendere il tempo di ricarica di 2 secondi. Attenzione: pu&ograve; causare la distruzione della navicella, usare con cautela. </li>
        </ul>
    <h2>Regole del gioco</h2>
      <h3>Vite</h3>
        <p>Si hanno a disposizione 3 droni. Questo numero &egrave; aumentato di 1 ogni volta che il punteggio supera un multiplo positivo di 10.000.</p>
        <p>Ogni volta che un drone viene piazzato sulla mappa, esso &egrave; immune dagli urti per 1,5 secondi.</p>
      <h3>Asteroidi</h3>
        <p>Esistono tre tipologie di asteroidi: grandi, medi e piccoli.</p>
        <p>All'inizio della partite e ogni volta che vengono distrutti tutti gli asteroidi, compariranno un certo numero di asteroidi grandi (vedi sotto per sapere il numero corretto). Ogni volta che un asteroide grande o medio viene colpito, questo si frammenta in due asteroidi medi o piccoli, rispettivamente.</p>
        <p>Inizialmente il livello &egrave; pari ad 1 e aumenta ogni volta che vengono distrutti tutti gli asteroidi.</p>
        <img id="asteroid-img" class="right" src="img/asteroids.png" alt="Asteroidi">
        <ul>
          <li class="pre">Livello 1:   4</li>
          <li class="pre">Livello 2:   6</li>
          <li class="pre">Livello 3:   8</li>
          <li class="pre">Livello 4:  10</li>
          <li class="pre">Livello 5+: 12</li>
        </ul>
      <h3>Punteggio</h3>
        <p>Il punteggio aumenta distruggendo gli asteroidi. </p>
        <ul>
          <li class="pre">Asteroide grande:   20 punti</li>
          <li class="pre">Asteroide medio:    50 punti</li>
          <li class="pre">Asteroide piccolo: 100 punti</li>
        </ul>
  </article>
</main>
<?php
  include_once("includes/footer.php");
 ?>

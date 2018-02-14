<?php
  session_start();

  // controlla la validità del tipo e lo salva in una variabile
  $validTipo = array('highscore', 'avgscore', 'hscore');
  if (isset($_GET['type']) && in_array($_GET['type'], $validTipo))
    $tipo = $_GET['type'];
  else
    $tipo = 'highscore';

  // controlla la validità della pagina e la salva in una variabile
  if(isset($_GET['page'])){
    $page = intval($_GET['page']);  //ritorna 0 se non è un int -> perfetto!
  } else{
    $page = 0;
  }

  // carica i dati dal database
  include_once('includes/db_helper.php');
  $db = new DBHelper;
  $array = $db->getRanking($page, $tipo);
  $n_pages = $db->getNumberOfPagesRanking($tipo);
  $db->close();

  $title = "Asteroids 4.0 - Classifica";
  $section = 2;
  $include_css = ['table'];
  include_once("includes/header.php");
?>
<main>
  <h1 class="table-title">Classifica</h1>
  <ul class = "type-selector">
    <li><a href="?type=highscore" <?php echo $tipo=='highscore'?'class="active"':'';?>>Punteggio<br>Massimo</a></li>
    <li><a href="?type=avgscore"  <?php echo $tipo=='avgscore'?'class="active"':'';?> >Punteggio<br>Medio</a></li>
    <li><a href="?type=hscore"    <?php echo $tipo=='hscore'?'class="active"':'';?>   >Punteggio<br>H-score</a></li>
  </ul>
  <table>
    <thead>
      <tr>
        <th class="col1_3">Posizione</th>
        <th class="col2_3">Utente</th>
        <th class="col3_3">Punteggio</th>
      </tr>
    </thead>
    <tbody><?php
      $pos = 0;
      $old = -1;
      foreach ($array as $key => $value) {
        $pos = $old != $value['score'] ? $pos+1 : $pos;
        $old = $value['score'];
        echo "<tr><td class='col1'>${pos}</td><td class='col2'>{$value['user']}</td><td class='col3'>{$value['score']}</td></tr>\n";
      }
      for ($i=count($array); $i < ITEMS_PER_PAGE; $i++) {
        echo "<tr><td class='col1'>-</td><td class='col2'>-</td><td class='col3'>-</td></tr>\n";
      }
    ?></tbody>
  </table>
  <?php if($n_pages > 1){?>
    <div class="arrows">
      <?php if($page>0){ ?>
        <a class="left" href="?type=<?php echo $tipo;?>&page=<?php echo $page-1;?>">&lt;</a>
      <?php } if($page < $n_pages-1){ ?>
        <a class="right" href="?type=<?php echo $tipo;?>&page=<?php echo $page+1;?>">&gt;</a>
      <?php } ?>
    </div>
  <?php } ?>
</main>
<?php
  include_once("includes/footer.php");
 ?>

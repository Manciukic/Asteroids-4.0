<?php
  session_start();

  // controlla la validità del tipo e lo salva in una variabile
  $validTipo = array('stats', 'history');
  if (isset($_GET['type']) && in_array($_GET['type'], $validTipo))
    $tipo = $_GET['type'];
  else
    $tipo = 'stats';

  // controlla la validità della pagina e la salva in una variabile
  if(isset($_GET['page'])){
    $page = intval($_GET['page']);  //ritorna 0 se non è un int -> perfetto!
  } else{
    $page = 0;
  }

  // carica i dati dal database
  include_once('includes/db_helper.php');
  $db = new DBHelper;
  if ($tipo == 'history'){
    $array = $db->getHistory($_SESSION['username'], $page);
    $n_pages = $db->getNumberOfPagesHistory($_SESSION['username']);
  } else{
    $db->loadStats();
    $nGames = $db->getNumberOfGames($_SESSION['username']);
    $rankPositionHighscore = $db->getRankPosition($_SESSION['username'], 'highscore');
    $rankPositionAvgscore  = $db->getRankPosition($_SESSION['username'], 'avgscore');
    $rankPositionHscore    = $db->getRankPosition($_SESSION['username'], 'hscore');
  }
  $db->close();

  $subtitle = ($tipo == 'history') ? 'Cronologia':'Statistiche';
  $title = "Asteroids 4.0 - {$subtitle}";
  $section = -1;
  $isProfilePage = true;
  $include_js = [];
  $include_css = ['table'];
  include_once("includes/header.php");
?>
<main>
  <h1 class="table-title"><?php echo $subtitle;?></h1>
  <h2 class="table-title"><?php echo $_SESSION['username'];?></h2>
  <ul class = "type-selector">
    <li><a href="?type=stats"   <?php echo $tipo=='stats'  ?'class="active"':'';?>>Statistiche</a></li>
    <li><a href="?type=history" <?php echo $tipo=='history'?'class="active"':'';?>>Cronologia</a></li>
  </ul>
  <table>
    <?php if($tipo == 'history'){?>
      <thead>
        <tr>
          <th class="col1_2">Data</th>
          <th class="col2_2">Punteggio</th>
        </tr>
      </thead>
    <?php } ?>
    <tbody>
      <?php if($tipo == 'history'){
        $format = '%d/%m/%Y %H:%M';
        foreach ($array as $key => $value) {
          $data = strftime($format, $value['timestamp']);
          echo "<tr><td class='col1_2'>{$data}</td><td class='col2_2'>{$value['score']}</td></tr>\n";
        }
        for ($i=count($array); $i < ITEMS_PER_PAGE; $i++) {
          echo "<tr><td class='col1_2'>-</td><td class='col2_2'>-</td></tr>\n";
        }
      } else { ?>
      <tr>
        <td class="col1_2">Partite giocate</td>
        <td class="col2_2"><?php echo $nGames;?></td>
      </tr>
      <tr class="divider"></tr>
      <tr>
        <td class="col1_2">Punteggio Massimo</td>
        <td class="col2_2"><?php echo $_SESSION['highscore'];?></td>
      </tr>
      <tr>
        <td class="col1_2">Posizione in classifica </td>
        <td class="col2_2"><?php echo $rankPositionHighscore;?></td>
      </tr>
      <tr class="divider"></tr>
      <tr>
        <td class="col1_2">Punteggio Medio</td>
        <td class="col2_2"><?php echo $_SESSION['avgscore'];?></td>
      </tr>
      <tr>
        <td class="col1_2">Posizione in classifica </td>
        <td class="col2_2"><?php echo $rankPositionAvgscore;?></td>
      </tr>
      <tr class="divider"></tr>
      <tr>
        <td class="col1_2">Punteggio H-score</td>
        <td class="col2_2"><?php echo $_SESSION['hscore'];?></td>
      </tr>
      <tr>
        <td class="col1_2">Posizione in classifica </td>
        <td class="col2_2"><?php echo $rankPositionHscore;?></td>
      </tr>
    <?php } ?>
    </tbody>
  </table>

  <?php if($tipo == 'history' && $n_pages > 1){?>
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

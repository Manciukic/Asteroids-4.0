<?php
  session_start();
  include('includes/require_login.php');

  // controlla la validità della pagina e la salva in una variabile
  if(isset($_GET['page'])){
    $page = intval($_GET['page']);  //ritorna 0 se non è un int -> perfetto!
  } else{
    $page = 0;
  }

  // carica i dati dal database
  include_once('includes/db_helper.php');
  $db = new DBHelper;
  $array = $db->getHistory($_SESSION['username'], $page);
  $n_pages = $db->getNumberOfPagesHistory($_SESSION['username']);
  $db->close();

  $subtitle = 'Cronologia';
  include_once("includes/profile_title_and_menu.php");
?>
  <table>
    <thead>
      <tr>
        <th class="col1_2">Data</th>
        <th class="col2_2">Punteggio</th>
      </tr>
    </thead>
    <tbody>
      <?php
        $format = '%d/%m/%Y %H:%M';
        foreach ($array as $key => $value) {
          $data = strftime($format, $value['timestamp']);
          echo "<tr><td class='col1_2'>{$data}</td><td class='col2_2'>{$value['score']}</td></tr>\n";
        }
        for ($i=count($array); $i < ITEMS_PER_PAGE; $i++) {
          echo "<tr><td class='col1_2'>-</td><td class='col2_2'>-</td></tr>\n";
        }
      ?>
    </tbody>
  </table>

  <?php if($n_pages > 1){?>
    <div class="arrows">
      <?php if($page>0){ ?>
        <a class="left" href="?page=<?php echo $page-1;?>">&lt;</a>
      <?php } else {?>
        <div class='empty'> </div>
      <?php } ?>
        <p><?php echo ($page+1)."/"."$n_pages"; ?></p>
      <?php if($page < $n_pages-1){ ?>
        <a class="right" href="?page=<?php echo $page+1;?>">&gt;</a>
      <?php } ?>
    </div>
  <?php } ?>

</main> <!-- aperto all'interno di profile_title.php -->
<?php
  include_once("includes/footer.php");
 ?>

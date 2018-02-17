<?php
  session_start();

  $loggedIn = isset($_SESSION["login"]) && $_SESSION["login"];
  if ($loggedIn){
    include_once("includes/db_helper.php");
    $db = new DBHelper;
    $db->loadStats($_SESSION['username']);
    $db->close();
  }

  $title = "Asteroids 4.0";
  $isGame = true;
  $include_js = ['loader', 'ajax', 'keyboard', 'game', 'main'];
  $include_css = ['game'];
  $section = 0;
  include_once("includes/header.php");
?>
<main>
  <div id="game_area">
    <p class="game_info left" id="lives">VITE 0</p>
    <p class="game_info right pre" id="score"><?php
      if ($loggedIn){
        echo "[RECORD {$_SESSION['highscore']}] ";
      }
    ?>PUNTI     0</p>
    <canvas id="game_canvas">Ooops, sembra che il tuo browser non supporti i canvas</canvas>
  </div>
</main>

<script>
  loggedIn = <?php echo $loggedIn?"true":"false";?>;
  highscore = <?php echo $loggedIn?$_SESSION["highscore"]:0;?>;
</script>

<?php include_once("includes/footer.php"); ?>

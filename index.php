<?php
  session_start();
  $title = "Asteroids 4.0";
  $isGame = true;
  $include_js = ['loader', 'keyboard', 'game', 'main'];
  $include_css = ['game'];
  $section = 0;
  include_once("includes/header.php");
?>
<main>
  <div id="game_area">
    <p class="game_info left" id="lives">VITE 0</p>
    <p class="game_info right pre" id="score"><?php
      if (isset($_SESSION["login"]) && $_SESSION["login"] && isset($_SESSION["highscore"])){
        echo "[RECORD {$_SESSION['highscore']}]";
      }
    ?>PUNTI     0</p>
    <canvas id="game_canvas">
  </div>
</main>
<?php
  $isShortPage = true;
  include_once("includes/footer.php");
?>
<script type="text/javascript">
  loggedIn = <?php echo (isset($_SESSION["login"]) && $_SESSION["login"])?"true":"false";?>;
  highscore = <?php echo (isset($_SESSION["login"]) && $_SESSION["login"] && isset($_SESSION["highscore"]))?$_SESSION["highscore"]:0;?>;
</script>

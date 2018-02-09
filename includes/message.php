<?php
// pagina con messaggio e pulsante per giocare.
// prima di includere bisogna impostare $title e $message
$section = -1;
$include_js = [];
$include_css = ['message'];
include_once("includes/header.php");
?>
  <main>
    <div class="message">
      <p><?php echo isset($message)?$message:''?></p>
      <a href="index.php" title="Gioca">Gioca</a>
    </div>
  </main>
<?php
  $isShortPage = true;
  include_once("includes/footer.php");
?>

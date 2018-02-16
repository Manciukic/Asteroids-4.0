<?php
  if(isset($subtitle)){
    $title = "Asteroids 4.0 - {$subtitle}";
  } else $title = "Asteroids 4.0 - Profilo";
  $section = -1;
  $isProfilePage = true;
  $include_css [] = 'table';
  include_once("includes/header.php");
?>
<main>
  <h1 class="table-title"><?php echo $subtitle;?></h1>
  <h2 class="table-title"><?php echo $_SESSION['username'];?></h2>
  <h3 class="table-title"><?php echo $_SESSION['email'];?></h3>
  <ul class = "type-selector">
    <li><a href="stats.php"   <?php echo (isset($subtitle) && $subtitle=='Statistiche') ?'class="active"':'';?>>Statistiche Utente</a></li>
    <li><a href="history.php" <?php echo (isset($subtitle) && $subtitle=='Cronologia')  ?'class="active"':'';?>>Cronologia Partite</a></li>
    <li><a href="edit.php"    <?php echo (isset($subtitle) && $subtitle=='Modifica')    ?'class="active"':'';?>>Modifica password</a></li>
    <li><a href="delete.php"  <?php echo (isset($subtitle) && $subtitle=='Elimina')    ?'class="active"':'';?>
           onclick="return confirm('Questa azione non pu\u00f2 essere annullata, continuare?');">Elimina account</a></li>
  </ul>

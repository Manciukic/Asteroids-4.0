<?php
  session_start();
  if (isset($_SESSION['login']) && $_SESSION['login'] && isset($_SESSION['username'])){
    if (isset($_POST['score'])){
      include_once('includes/db_helper.php');
      $db = new DBHelper;
      $db->insertScore($_SESSION['username'], $_POST['score']);
      $db->close();
      die('ok');
    } else{
      die("Nessun punteggio inviato.");
    }
  } else{
    die("Bisogna aver effettuato il login per inviare il punteggio.");
  }
?>

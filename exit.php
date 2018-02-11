<?php
  session_start();
  $_SESSION['login'] = false;
  $title = "Asteroids 4.0 - Logout";
  $message = "Logout avvenuto con successo";
  include_once("includes/message.php");
?>

<?php
  session_start();
  $_SESSION['login'] = false;
  $title = "Asteroids 4.0 - Logout";
  $message_text = "Logout avvenuto con successo";
  $message_href = "login.php";
  $message_button = "Accedi";
  include_once("includes/message.php");
?>

<?php
  session_start();

  include('includes/require_login.php');

  function no_edit($message = ''){
    $subtitle = 'Modifica';
    $include_js = ['edit'];
    $include_css = ['form'];
    include_once("includes/profile_title_and_menu.php");
?>
  <form name="edit" action="edit.php" method="POST" onsubmit="return validateForm();">
    <h2>Modifica Password</h2>
    <p id="error"><?php echo $message != ''?$message:"Dummy error";?></p>
    <div class="form-item">
      <p>Nuova Password</p>
      <input type="password" placeholder="Nuova Password" name="password" required>
    </div>
    <div class="form-item">
      <p>Ripeti Password</p>
      <input type="password" placeholder="Ripeti Password" name="password_repeat" required>
    </div>
    <button type="submit">Cambia password</button>
  </form>
</main> <!-- aperto all'interno di profile_title.php -->
<?php
    include_once("includes/footer.php");
  }

  function ok_edit(){
    $title = "Asteroids 4.0 - Modifica avvenuta";
    $message_text = "Modifica avvenuta con successo!";
    include_once("includes/message.php");
  }

  if (isset($_POST['password'])){
    if (!preg_match('/^[A-Za-z0-9\-_]{8,}$/', $_POST['password'])){
      no_edit("La password deve contenere almeno 8 caratteri alfanumerici (sono ammessi anche - e _)", $_POST['username']);
    } else{
      include_once("includes/db_helper.php");
      $db = new DBHelper;
      $edit_result = $db->editPassword($_SESSION['username'], $_POST['password']);
      $db->close();
      if ($edit_result) {
        ok_edit();
      } else{
        no_edit("Errore indefinito");
      }
    }
  } else{
    no_edit();
  }
 ?>

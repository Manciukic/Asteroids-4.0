<?php
  session_start();

  function no_register($message){
    $title = "Asteroids 4.0 - Registrati";
    $section = -1;
    $include_js = ['register'];
    $include_css = ['login'];
    include_once("includes/header.php");
?>
  <main>
    <form name="register" action="register.php" method="POST" onsubmit="return validateForm()">
      <p id="error"><?php echo $message;?></p>
      <div class="form-item">
        <label for="username">Username</label>
        <input type="text" placeholder="Username" name="username" required>
      </div>
      <div class="form-item">
        <label for="password">Password</label>
        <input type="password" placeholder="Password" name="password" required>
      </div>
      <div class="form-item">
        <label for="password_repeat">Ripeti Password</label>
        <input type="password" placeholder="Ripeti Password" name="password_repeat" required>
      </div>
      <button type="submit">Registrati</button>
    </form>

  </main>
<?php
    if($message != ''){
?>
    <script type="text/javascript">
      document.getElementById("error").style.display = 'block';
    </script>
<?php
    }
    $isShortPage = true;
    include_once("includes/footer.php");
  }

  function ok_register(){
    $title = "Asteroids 4.0 - Registrazione effettuata";
    $message = "Registrazione avvenuta con successo!";
    include_once("includes/message.php");
  }

  if (isset($_POST['username']) && isset($_POST['password'])){
      include_once("includes/db_helper.php");
      $db = new DBHelper;
      if ($db->register($_POST['username'], $_POST['password']))
        ok_register();
      else
        no_register('Username gi&agrave; in uso');
  } else
    no_register('');
?>

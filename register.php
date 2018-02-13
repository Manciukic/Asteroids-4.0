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
    <form name="register" action="register.php" method="POST" onsubmit="return validateForm();">
      <h2>Registrazione</h2>
      <p id="error"><?php echo $message != ''?$message:"Dummy error";?></p>
      <div class="form-item">
        <p>Username</p>
        <input type="text" placeholder="Username" name="username" required>
      </div>
      <div class="form-item">
        <p>Password</p>
        <input type="password" placeholder="Password" name="password" required>
      </div>
      <div class="form-item">
        <p>Ripeti Password</p>
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
    $message_text = "Registrazione avvenuta con successo!";
    include_once("includes/message.php");
  }

  if (isset($_POST['username']) && isset($_POST['password'])){
    if (!preg_match('/^[A-Za-z0-9]{4,10}$/', $_POST['username'])){
      no_login("L'username deve contenere da 4 a 10 caratteri alfanumerici");
    } else if (!preg_match('/^[A-Za-z0-9\-_]{8,}$/', $_POST['password'])){
      no_login("La password deve contenere almeno 8 caratteri alfanumerici (sono ammessi anche - e _)");
    } else{
      include_once("includes/db_helper.php");
      $db = new DBHelper;
      if ($db->register($_POST['username'], $_POST['password'])){
        ok_register();
      } else
        no_register('Username gi&agrave; in uso');
      $db->close();
    }
  } else
    no_register('');
?>

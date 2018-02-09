<?php
  session_start();

  function no_login($message){
    $title = "Asteroids 4.0 - Login";
    $section = 3;
    $include_js = ['login'];
    $include_css = ['login'];
    include_once("includes/header.php");
?>
  <main>
    <form name="login" action="login.php" method="POST" onsubmit="return validateForm()">
      <p id="error"><?php echo $message;?></p>
      <div class="form-item">
        <label for="username">Username</label>
        <input type="text" placeholder="Username" name="username" required>
      </div>
      <div class="form-item">
        <label for="password">Password</label>
        <input type="password" placeholder="Password" name="password" required>
      </div>
      <button type="submit">Login</button>
      <a href="register.php">Non hai un account? Registrati!</a>
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

  function ok_login(){
    $title = "Asteroids 4.0 - Login avvenuto";
    $message = "Login avvenuto con successo!";
    include_once("includes/message.php");
  }

  if (isset($_POST['username']) && isset($_POST['password'])){
    include_once("includes/db_helper.php");
    $db = new DBHelper;
    $login_result = $db->login($_POST['username'], $_POST['password']);
    switch ($login_result) {
      case 0:
        ok_login();
        break;
      case 1:
        no_login("Username non trovato");
        break;
      case 2:
        no_login("Password errata");
        break;
      default:
        no_login('');
        break;
    }
  } else{
    no_login('');
  }
?>
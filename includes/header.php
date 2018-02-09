<!DOCTYPE html>
<html>
  <head>
    <title><?php if(isset($title)) echo $title;?></title>
    <meta name="author" content="Riccardo Mancini">

    <meta http-equiv="Content-Script-Type" content="text/javascript">

    <link rel="icon" type="image/png" href="favicon.ico"/>

    <link rel="stylesheet" type="text/css" href="style/styles.css">
    <link rel="stylesheet" type="text/css" href="style/fonts.css">
    <?php
      if (isset($include_css)){
        foreach ($include_css as $key => $value) {
          echo "<link rel='stylesheet' type='text/css' href='style/{$value}.css'>\n";
        }
      }
      if (isset($include_js)){
        foreach ($include_js as $key => $value) {
          echo "<script type='text/javascript' src='js/{$value}.js'></script>\n";
        }
      }
    ?>
  </head>
  <body>
    <header>
      <nav>
        <ul>
          <li><a href="index.php" title="Gioca" <?php if(isset($section) && $section==0) echo 'class="active"'?>>Gioca</a></li>
          <li><a href="guide.php" title="Guida" <?php if(isset($section) && $section==1) echo 'class="active"'?>>Guida</a></li>
        </ul>
      </nav>
      <a href="index.php"><img src="img/logo.png"/></a>
      <nav>
        <ul>
          <li><a href="#" title="Classifica" <?php if(isset($section) && $section==2) echo 'class="active"'?>>Classifica</a></li>
          <li><a href="<?php echo (isset($_SESSION["login"]) && $_SESSION["login"])?"profile.php":"login.php";?>"
            title="<?php  echo (isset($_SESSION["login"]) && $_SESSION["login"])?'Profilo':'Accedi';?>"
            <?php if(isset($section) && $section==3) echo 'class="active"'?>>
            <?php
              if(isset($_SESSION["login"]) && $_SESSION["login"] && isset($_SESSION["username"]))
                echo $_SESSION["username"];
              else
                echo "Accedi";
            ?>
          </a></li>
        </ul>
      </nav>
    </header>

<?php
class DBHelper{
  private $mysqli;

  function __construct(){
    $this->mysqli = new mysqli('localhost', 'webserver', '6T6e9R7EYXfquVZN', 'asteroids');
    if ($this->mysqli->connect_error) {
      die('Connect Error (' . $this->mysqli->connect_errno . ') '. $this->mysqli->connect_error);
    }
  }

  // effettua il login con $username e $password e ritorna 0 in caso di successo
  // 1 in caso di username non trovato e 2 in caso di password errata
  public function login($username, $password){
    $stmt = $this->mysqli->prepare("SELECT password, highscore FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    if($result->num_rows == 0){
      $result->close();
      $stmt->close();
      return 1;
    }
    while($row = $result->fetch_assoc()) {
      if (password_verify($password, $row['password'])){
        $_SESSION['login'] = true;
        $_SESSION['username'] = $username;
        $_SESSION['highscore'] = $row['highscore'];

        $result->close();
        $stmt->close();
        return 0;
      } else{
        $result->close();
        $stmt->close();
        return 2;
      }
    }
  }

  // registra l'utente salvando nel database nome utente e hash della password
  // ritorna true se l'inserimento è avvenuto con successo, false se l'utente esiste già (o in caso di errore)
  public function register($username, $password){
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $this->mysqli->prepare("INSERT INTO users(username, password) VALUE(?, ?)");
    $stmt->bind_param("ss", $username, $hash);
    $success = $stmt->execute();
    $stmt->close();
    if($success){
      $_SESSION['login'] = true;
      $_SESSION['username'] = $username;
      $_SESSION['highscore'] = 0;
    }
    return $success;
  }

  // inserisce il nuovo punteggio e ritorna il nuovo highscore
  // ritorna -1 in caso di errore
  public function insertScore($username, $score){
    $stmt_insert = $this->mysqli->prepare("INSERT INTO scores(user, score) VALUE(?, ?)");
    $stmt_insert->bind_param("si", $username, $score);
    $success = $stmt_insert->execute();
    $stmt_insert->close();

    if($success){
      $stmt_select = $this->mysqli->prepare("SELECT MAX(score) AS max FROM scores WHERE user = ?");
      $stmt_select->bind_param("s", $username);
      $stmt_select->execute();
      $result = $stmt_select->get_result();
      if($result->num_rows == 0){
        $result->close();
        $stmt->close();
        return -1;
      }
      while($row = $result->fetch_assoc()) {
        $_SESSION['highscore'] = $row['max'];
        $result->close();
        $stmt_select->close();

        return $_SESSION['highscore'];
      }
    } else{
      return -1;
    }
  }

  //crea un array di dizionari che contengono user e punteggio
  public function arrayfy($result){
    while($row = $result->fetch_assoc()) {
      $array[] = array('user' => $row['username'], 'score' => $row['score']);
    }
    return $array;
  }

  // ritorna la classifica per punteggio massimo
  public function getRankingByHighScore(){
    $result = $this->mysqli->query("SELECT username, highscore AS score FROM users WHERE highscore > 0 ORDER BY highscore DESC");
    $array = arrayfy($result);
    $result->close();
    return $array;
  }

  // ritorna la classifica per punteggio medio
  public function getRankingByAvgScore(){
    $result = $this->mysqli->query("SELECT username, avgscore AS score FROM users WHERE avgscore > 0 ORDER BY avgscore DESC");
    $array = arrayfy($result);
    $result->close();
    return $array;
  }

  //riorna la classifica per H-score
  public function getRankingByHScore(){
    $result = $this->mysqli->query("SELECT username, hscore AS score FROM users WHERE hscore > 0 ORDER BY hscore DESC");
    $array = arrayfy($result);
    $result->close();
    return $array;
  }

}
 ?>

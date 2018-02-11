function validateForm (){
  var errorMessage = document.getElementById("error");
  if (!/^[A-Za-z0-9]{4,10}$/.test(document.forms.login.elements.username.value)){
    errorMessage.firstChild.nodeValue = "L'username deve contenere da 4 a 10 caratteri alfanumerici";
    errorMessage.style.display = "block";
    return false;
  }
  if (!/^[A-Za-z0-9\-_]{8,}$/.test(document.forms.login.elements.password.value)){
    errorMessage.firstChild.nodeValue = "La password deve contenere almeno 8 caratteri alfanumerici (sono ammessi anche - e _)";
    errorMessage.style.display = "block";
    return false;
  }

  errorMessage.style.display = "none";
  return true;
}

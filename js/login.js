function validateForm (){
  var errorMessage = document.getElementById("error");
  if (!document.forms.login.elements.username.value.match(/[A-Za-z0-9]{4,10}/g)){
    errorMessage.firstChild.nodeValue = "L'username deve contenere da 4 a 10 caratteri alfanumerici";
    errorMessage.style.display = "block";
    return false;
  }
  if (!document.forms.login.elements.password.value.match(/[A-Za-z0-9\-_]{8,}/g)){
    errorMessage.firstChild.nodeValue = "La password deve contenere almeno 8 caratteri alfanumerici (sono ammessi anche - e _)";
    errorMessage.style.display = "block";
    return false;
  }

  errorMessage.style.display = "none";
  return true;
}

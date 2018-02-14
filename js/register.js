function validateForm (){
  var errorMessage = document.getElementById("error");
  if (!/^[A-Za-z0-9]{4,10}$/.test(document.forms.register.elements.username.value)){
    errorMessage.firstChild.nodeValue = "L'username deve contenere da 4 a 10 caratteri alfanumerici";
    errorMessage.style.display = "block";
    return false;
  }
  if(!document.forms.register.elements.email.checkValidity()){
    errorMessage.firstChild.nodeValue = "L'indirizzo email non &egrave; valido";
    errorMessage.style.display = "block";
    return false;
  }
  if(document.forms.register.elements.email.value != document.forms.register.elements.email_repeat.value){
    errorMessage.firstChild.nodeValue = "Le due email non combaciano";
    errorMessage.style.display = "block";
    return false;
  }

  if (!/^[A-Za-z0-9\-_]{8,}$/.test(document.forms.register.elements.password.value)){
    errorMessage.firstChild.nodeValue = "La password deve contenere almeno 8 caratteri alfanumerici (sono ammessi anche - e _)";
    errorMessage.style.display = "block";
    return false;
  }
  if(document.forms.register.elements.password.value != document.forms.register.elements.password_repeat.value){
    errorMessage.firstChild.nodeValue = "Le due password non combaciano";
    errorMessage.style.display = "block";
    return false;
  }

  errorMessage.style.display = "none";
  return true;
}

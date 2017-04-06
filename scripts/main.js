$(function(){
  $('#sign-up').click(function(e) {
    e.preventDefault();
    var field = $('#inputEmail');
    var email = field.val();
    if (validateEmail(email)) {
      writeEmail(email);
      field.val("");
      $('.sign-up').hide();
      $('.ideology').show();
    } else {
      $('#signup > form > .form-group').addClass('has-error').addClass('has-feedback');
      $('#signup > form > .form-group > .glyphicon-remove').show();
    }
  });

  $('#select-ideology').click(function(e) {
    e.preventDefault();
    var tabIndex = $('#ideology-tabs li.active').index();
    writeIdeology(tabIndex);
    $('.ideology').hide();
    $('.survey').show();
  });

  $('#submit-survey').click(function(e) {
    e.preventDefault();
    $('.survey').hide();
    $('.thanks').show();
  });

  $('input[type="radio"]').click(function(e) {
    var question = $(this).attr('name');
    var value = $(this).attr('value');
    writeQuestion(question, value);
  });

  $('[type="checkbox"]').click(function(e) {
    var question = $(this).attr('name');
    var values = getSelectedValues();
    writeQuestion(question, values);
  });

  function getSelectedValues() {
    return $("input[type=checkbox]:checked").map(
       function () {
         return $(this).attr('value');
       }).get().join(",");
  }
});


var database = firebase.database();
var userId;
var loc = {};

getLoc();

firebase.auth().signInAnonymously().catch(function(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    userId = user.uid;
  } else {
    // User is signed out.
  }
});

function writeEmail(email) {
  database.ref('users/' + userId).update({
    email: email,
    location: loc,
    time: new Date(Date.now()).toUTCString()
  });
}

function writeIdeology(ideology) {
  if (userId === undefined) return;
  database.ref('users/' + userId).update({
    ideology: ideology
  });
}

function writeQuestion(question, value) {
  if (userId === undefined) return;
  database.ref('users/' + userId + '/survey-1/' + question).update({
    response: value
  });
}

function validateEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function getLoc() {
  $.get("http://ipinfo.io", function(response) {
    loc.city = response.city;
    loc.region = response.region;
  }, "jsonp");
}

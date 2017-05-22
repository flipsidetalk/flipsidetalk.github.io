$(function(){
  $('#submit-article').click(function(e) {
    e.preventDefault();
    var field = $('#inputArticleLink');
    var url = field.val();
    writeSubmitArticle(url);
    field.val("");
    $('#submit-article-modal').modal('hide');
  });
  $('#submit-your-thoughts-yes').click(function(e) {
    e.preventDefault();
    writeSubmitThoughtsYes();
    $('#your-thoughts-modal').modal('hide');
  });
  $('#submit-your-thoughts').click(function(e) {
    e.preventDefault();
    writeSubmitThoughtsNo();
    $('#your-thoughts-modal').modal('hide');
    $('#your-thoughts-textarea').val("");
  });
  $('#submit-your-thoughts-no').click(function(e) {
    e.preventDefault();
    $('#submit-your-thoughts-yes,#submit-your-thoughts-no').css('display', 'none');
    $('#your-thoughts-textarea').css('display', 'block');
  });
  start = Date.now();
  $(window).unload(function() {
      end = Date.now();
      writeVisited(end - start);
   });
});


var database = firebase.database();
var userId;

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

function writeSubmitArticle(url) {
  if (userId === undefined) return;
  database.ref('submit-article/' + userId).update({
    link: url
  });
}

function writeSubmitThoughtsYes() {
  if (userId === undefined) return;
  database.ref('submit-thoughts/' + userId).update({
    yes: $('#article-title').text()
  });
}

function writeSubmitThoughtsNo(comments) {
  if (userId === undefined) return;
  if ($('#your-thoughts-textarea').val() === "") return;
  database.ref('submit-thoughts/' + userId).update({
    article: $('#article-title').text(),
    comments: $('#your-thoughts-textarea').val()
  });
}

function writeVisited(time) {
  if (userId === undefined) return;
  database.ref('visited/' + userId).update({
    id: urlParam('id'),
    time: time
  });
}

function urlParam(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

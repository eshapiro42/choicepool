var database, currentPool;

$(document).ready(function() {
  database = firebase.database();
  var btnSearchPools = document.getElementById('btnSearchPools');
  var inputSearchPools = document.getElementById('inputSearchPools');
  var btnAddChoice = document.getElementById('btnAddChoice');
  var inputAddChoice = document.getElementById('inputAddChoice');
  var poolContents = document.getElementById('poolContents');
  var poolsList = document.getElementById('poolsList');
  var linkCreatePool = document.getElementById('linkCreatePool');
  var textCurrentPool = document.getElementById('textCurrentPool');
  var btnRandomChoice = document.getElementById('btnRandomChoice');
  
  inputSearchPools.addEventListener('keyup', function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
      btnSearchPools.click();
    }
  });
  
  btnSearchPools.addEventListener('click', function() {
    if(inputSearchPools.value) {
      changePool(inputSearchPools.value);
    }
    inputSearchPools.value = '';
  });
  
  inputAddChoice.addEventListener('keyup', function() {
    event.preventDefault();
    if (event.keyCode == 13) {
      btnAddChoice.click();
    }
  });
  
  btnAddChoice.addEventListener('click', function() {
    if(inputAddChoice.value) {
      writeChoice(inputAddChoice.value);     
    }
  });
  
  linkCreatePool.addEventListener('click', function() {
    changePool(generatePoolId());
    console.log('changed pool');
  });
  
  btnRandomChoice.addEventListener('click', function() {
    $('#modalRandomChoice').modal('show');
  });
  
  $(document).on('click', '.pool', function() {
    changePool(this.textContent);
  });
  
  $('#modalRandomChoice').on('show.bs.modal', function() {
    $(this).find('#textRandomChoice').text(randomChoice().choice);
  });
  
  database.ref('pools').on('value', function(snapshot) {
    var reverseList =  []
    var list = '';
    snapshot.forEach(function(childSnapshot) {
      list += '<li class="pool clickable" pool-id="' + childSnapshot.key + '">';
      list += childSnapshot.key;
      list += '</li>';
      list += '<hr>';
      reverseList.push(list);
      list = ''
    });
    reverseList = reverseList.reverse();
    for (i = 0; i < reverseList.length; i++) {
      list += reverseList[i];
    };
    poolsList.innerHTML = list;
  });
  
  
  
});

function generatePoolId() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 8; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function writeChoice(choice) {
  currentPool.push({
    username: currentUserName,
    uid: currentUserId,
    userphoto: currentUserPhoto,
    choice: choice
  });
  inputAddChoice.value = '';
}

function changePool(pool) {
  database = firebase.database();
  currentPool = database.ref('pools/' + pool);
  
  currentPool.on('value', function(snapshot) {
    var reverseList = []
    var list = '';
    snapshot.forEach(function(childSnapshot) {
      list += '<li data-key="' + childSnapshot.key + '">';
      list += childSnapshot.val().choice;
      list += '<div class="float-right text-muted">'
      list += childSnapshot.val().username;
      // If the item was added by the current user, make it deletable.
      if (childSnapshot.val().uid == currentUserId) {
        list += '&nbsp;<a href="javascript:del(\'' + childSnapshot.key + '\')" class="text-danger">&times;</a>';
      }
      list += '</div></li>';
      list += '<hr>';
      reverseList.push(list);
      list = ''
    });
    var reversedList = reverseList.reverse();
    for (i = 0; i < reversedList.length; i++) {
      list += reversedList[i];
    };
    poolContents.innerHTML = list;
    textCurrentPool.innerHTML = 'current pool: ' + pool + '<button id="btnRandomChoice" type="button" class="btn btn-outline-dark clickable float-right">random choice</button>';
    
    btnRandomChoice.addEventListener('click', function() {
      $('#modalRandomChoice').modal('show');
    });;
  });
}

function randomChoice(snapshot) {
  list = [];
  currentPool.on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      list.push(childSnapshot.val());
    });
  });
  randomIndex = Math.floor(Math.random() * list.length);
  return (list[randomIndex]);
}

function del(key) {
  currentPool.child(key).remove();
}
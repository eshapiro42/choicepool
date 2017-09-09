var currentUserId;
var currentUserName;
var currentUserPhoto;

initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var uid = user.uid;
      var phoneNumber = user.phoneNumber;
      var providerData = user.providerData;
      var username = document.getElementById('username');
        if (displayName) {
          currentUserName = displayName;
        } else if (email) {
          currentUserName = email;
        } else if (phoneNumber) {
          currentUserName = phoneNumber;
        } else {
          currentUserName = 'Unknown User';
        }
      username.textContent = currentUserName;
      currentUserId = user.uid;
      currentUserPhoto = user.photoURL;
    } else {
      // User is signed out.
      window.location = 'auth.html'
    }
  }, function(error) {
    console.log(error);
  });
};

window.addEventListener('load', function() {
  initApp()
});

$(document).ready(function() {
  var btnLogout = document.getElementById('btnLogout');
  btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
    window.location = 'auth.html'
  });
});
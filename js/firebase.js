var firebaseConfig = {
	apiKey: "AIzaSyAR6hFGNnSYEwKAGx4lsSp5brwsbpMKp88",
	authDomain: "hackathonistas-97572.firebaseapp.com",
	databaseURL: "https://hackathonistas-97572.firebaseio.com",
	projectId: "hackathonistas-97572",
	storageBucket: "hackathonistas-97572.appspot.com",
	messagingSenderId: "822318635327",
	appId: "1:822318635327:web:14aae62f1a30082a"
};

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function(user) {
	let ul = document.getElementsByClassName('navbar')[0].getElementsByTagName('ul')[0];

	if ( user ) {
		let lb = document.getElementById('login_button');

		if ( lb != null ) {
			lb.remove();	
		}

		// display sign out button if the user is logged in
		ul.innerHTML = ul.innerHTML + '<li id="signout_button"><a href="#" class="text-right">Sign Out</a></li>';

		let sb = document.getElementById('signout_button');

		sb.addEventListener('click', () => {
			firebase.auth().signOut().then(() => {
				document.getElementById('signout_button').remove();
				location.reload();
			});
		});
	} else {
		ul.innerHTML = ul.innerHTML + '<li id="login_button"><a href="login.html" class="text-right">Log in</a></li>';
	}
});
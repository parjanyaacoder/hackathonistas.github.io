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

		// display account button if the user is logged in
		ul.innerHTML = ul.innerHTML + '<li id="account_menu">\
			<a id="account_button" class="text-shine">Account &#128317;</a>\
			<div id="account_dropdown">\
				<a class="account_dropdown_item btn btn-secondary" href="#">Settings</a>\
				<a class="account_dropdown_item btn btn-secondary" id="signout_button" href="#">Sign out</a>\
			</div>\
		</li>';

		let ab = document.getElementById('account_button');
		let sb = document.getElementById('signout_button');
		let ad = document.getElementById('account_dropdown');

		ab.addEventListener('click', () => {
			if ( ad.style.display == 'none' || ad.style.display == '' ) {
				ad.style.display = 'flex';

				setTimeout(() => {
					//attatch click listener on the rest of the body to close the dropdown whenever it's open
					document.getElementsByTagName("body")[0].addEventListener('click', function(e) {
						e = e || event
						let target = e.target || e.srcElement
						innerId = target.id;

						if ( 	innerId == "account_button" ||
								innerId == "account_menu" ||
								innerId == "account_dropdown" ||
								target.className.indexOf('account_dropdown_item') > -1 ) {
						} else {
							ad.style.display = 'none';
						}
					});
				}, 100);

			} else {
				ad.style.display = 'none';
			}		
		});

		sb.addEventListener('click', () => {
			firebase.auth().signOut().then(() => {
				document.getElementById('account_menu').remove();
				location.reload();
			});
		});

	} else {
		ul.innerHTML = ul.innerHTML + '<li id="login_button"><a href="login.html" class="text-shine">Log in</a></li>';
	}
});
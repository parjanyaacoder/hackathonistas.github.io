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
	let ul = document.getElementsByClassName('nav-links')[0];

	if ( user ) {
		let lb = document.getElementById('login_button');

		if ( lb != null ) {
			lb.remove();	
		}

		// display account button if the user is logged in
		let html = '\
			<a id="account_button" class="text-shine">Account</a>\
			<div id="account_dropdown">\
				<a class="account_dropdown_item btn btn-secondary" href="settings.html">Settings</a>';

		if ( user.uid == 'UsROzfm6alTDEBMXdn63oGIMUwL2' ) {
			html += '<a class="account_dropdown_item btn btn-secondary" href="pending_hackathons.html">Pending hackathons</a>';
		}

		html += '<a class="account_dropdown_item btn btn-secondary" id="signout_button" href="index.html">Sign out</a>\
			</div>';

		ul.innerHTML = ul.innerHTML + html;

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
				//location.reload();
				window.location.href = 'hackathons.html';
			});
		});

	} else {
		ul.innerHTML = ul.innerHTML + '<a id="login_button" href="login.html" class="text-shine">Log in</a>';
	}
});
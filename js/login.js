function createErrorMessage (message, id) {
	let e = document.createElement('h6');
	e.id = id;
	e.className = "text-danger";
	e.innerHTML = message;

	setTimeout(() => {
		e.remove();
	}, 5000);

	return e;
}

function createSpinner () {
	let e = document.createElement('div');
	e.className = "spinner-border text-success";
	e.setAttribute("role", "status");

	return e;
}

function createRedirectMessage() {
	let e = document.createElement('h1');
	e.className = "mb-3";
	e.innerHTML = "Redirecting to upcoming hackathons...";

	return e;
}

function loginSubmit () {
	// handle the rare case where user manages to 
	// access login.html and try logging in again
	// even though the user is already logged in
	if ( firebase.auth().currentUser ) {
		alert('You are already logged in!');
		return false	;
	}

	let content = document.getElementsByClassName('content')[0];
	let email = document.getElementById('user_email').value;
	let password = document.getElementById('user_password').value;

	content.appendChild(createSpinner());

	firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
		document.getElementsByTagName('form')[0].reset();

		content.innerHTML = '<br><br><h1 class="mb-3"><span class="text-success">Successfully</span> logged in!</h1>';

		content.appendChild(createRedirectMessage());

		setTimeout(() => {
			window.location.href = "hackathons.html";
		}, 1500);

	}).catch(function(error) {
		let err_login = document.getElementById('auth_error_login');

		document.getElementsByClassName('spinner-border')[0].remove();

		if ( err_login == null ) {
			//show login error message for 5 seconds
			content.appendChild(createErrorMessage(error.code, 'auth_error_login'));
		}

		console.log(error);
	});

	return false;
}

function signupSubmit (event) {
	let content = document.getElementsByClassName('content')[0];
	let email = document.getElementById('signup_email').value;
	let password = document.getElementById('signup_password').value;
	let confirm_password = document.getElementById('signup_password_confirm').value;
	let first_name = document.getElementById('first_name').value;
	let last_name = document.getElementById('last_name').value;
	let err_no_match = document.getElementById("auth_error_no_match");

	if ( confirm_password != password ) {
		if ( err_no_match == null ) {
			//show error message saying your passwords do not match
			content.appendChild(createErrorMessage("Your passwords do not match", "auth_error_no_match"));
		}

		event.preventDefault();
		return false;
	} else {
		//clear err_no_match errors
		if ( err_no_match != null ) {
			err_no_match.remove();
		}
	}

	content.appendChild(createSpinner());

	firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
		let user = firebase.auth().currentUser;

		document.getElementsByTagName('form')[1].reset();

		user.updateProfile({
			displayName: first_name + ' ' + last_name,
		}).catch(function(error) {
			console.log(error);
		});

		content.innerHTML = '<br><br><h1 class="mb-3">You have <span class="text-success">successfully</span> signed up and are now logged in!</h1>';
		content.appendChild(createRedirectMessage());

		setTimeout(() => {
			window.location.href = "hackathons.html";
		}, 3000);

	}).catch(function(error) {
		let err_signup = document.getElementById('auth_error_signup');

		document.getElementsByClassName('spinner-border')[0].remove();

		if ( err_signup == null ) {
			//show login error message for 5 seconds
			content.appendChild(createErrorMessage(error.code, 'auth_error_signup'));
		}

		console.log(error);
	});

	return false;
}

(function () {

window.onload = () => {
	document.getElementsByTagName('form')[0].reset();
	document.getElementsByTagName('form')[1].reset();

	let box_toggle1 = document.getElementsByClassName('box_toggle')[0];
	let box_toggle2 = document.getElementsByClassName('box_toggle')[1];
	let signup_box = document.getElementsByClassName('signup_box')[0];
	let login_box = document.getElementsByClassName('login_box')[0];
	let box_title = document.getElementById('box_title');

	box_toggle1.addEventListener('click', () => {
		login_box.style.display = 'none';
		signup_box.style.display = 'block';
		box_title.innerHTML = 'Sign up';
	});

	box_toggle2.addEventListener('click', () => {
		signup_box.style.display = 'none';
		login_box.style.display = 'block';
		box_title.innerHTML = 'Login';
	});
}

})();
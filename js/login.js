function loginSubmit () {

	// handle the rare case where user manages to 
	// access login.html and try logging in again
	// even though the user is already logged in
	if ( firebase.auth().currentUser ) {
		alert('You are already logged in!');
		return true;
	}

	let content = document.getElementsByClassName('content')[0];
	let email = document.getElementById('user_email').value;
	let password = document.getElementById('user_password').value;

	document.getElementsByTagName('form')[0].reset();

	//show spinner during processing
	content.innerHTML = content.innerHTML + '<div class="spinner-border text-success" role="status"><span class="sr-only">Loading...</span></div>';

	firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
		content.innerHTML = "<br><br><h1 class='mb-3'>Successfully logged in!</h1>";

	}).catch(function(error) {
		document.getElementsByClassName('spinner-border')[0].remove();

		//show login error message for 5 seconds
		content.innerHTML = content.innerHTML + '<h3 id="auth_error">' + error.code + '</h3>';
		setTimeout(() => {
			document.getElementById('auth_error').remove();
		}, 5000);
		console.log(error);
	});

	return false;
}

function signupSubmit () {

}

(function () {

window.onload = () => {
	let box_toggle1 = document.getElementsByClassName('box_toggle')[0];
	let box_toggle2 = document.getElementsByClassName('box_toggle')[1];
	let signup_box = document.getElementsByClassName('signup_box')[0];
	let login_box = document.getElementsByClassName('login_box')[0];

	box_toggle1.addEventListener('click', () => {
		login_box.style.display = 'none';
		signup_box.style.display = 'block';
	});

	box_toggle2.addEventListener('click', () => {
		signup_box.style.display = 'none';
		login_box.style.display = 'block';
	});
}

})();
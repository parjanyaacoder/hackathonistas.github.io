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

function createUpdateButton () {
	let e = document.createElement('button');
	e.setAttribute('type', 'submit');
	e.className = 'btn btn-primary';
	e.innerHTML = 'Update';

	return e;
}

function updateEmail () {
	let email = document.getElementById('update_email').value;
	let form = document.getElementById('email_update_box').querySelector('form');

	form.querySelector('button[type="submit"]').remove();
	form.appendChild(createSpinner());

	firebase.auth().currentUser.updateEmail(email).then(() => {
		form.reset();
		form.querySelector('.spinner-border').remove();
		form.innerHTML = form.innerHTML + '<p>Email <span class="text-success">successfully</span> updated!</p>';
		showUserCurrentEmail();

	}).catch((error) => {
		form.querySelector('.spinner-border').remove();
		form.innerHTML = form.innerHTML + '<p id="update_email_error" class="text-danger">' + error + '</p>';

		setTimeout(() => {
			form.querySelector('#update_email_error').remove();
			form.appendChild(createUpdateButton());

		}, 3000);

	});
	
	return false;
}

function updateName () {
	let first_name = document.getElementById('update_first_name').value;
	let last_name = document.getElementById('update_last_name').value;
	let form = document.getElementById('name_update_box').querySelector('form');

	form.querySelector('button[type="submit"]').remove();
	form.appendChild(createSpinner());

	firebase.auth().currentUser.updateProfile({
		displayName: first_name + ' ' + last_name

	}).then(() => {
		form.reset();
		form.querySelector('.spinner-border').remove();
		form.innerHTML = form.innerHTML + '<p>Name <span class="text-success">successfully</span> updated!</p>';
		showUserDisplayName();

	}).catch((error) => {
		form.querySelector('.spinner-border').remove();
		form.innerHTML = form.innerHTML + '<p id="update_name_error" class="text-danger">' + error + '</p>';

		setTimeout(() => {
			form.querySelector('#update_name_error').remove();
			form.appendChild(createUpdateButton());

		}, 3000);

	});
	
	return false;
}

function updatePassword (event) {
	let password = document.getElementById('update_password').value;
	let confirm_password = document.getElementById('update_password_confirm').value;
	let form = document.getElementById('password_update_box').querySelector('form');

	if ( confirm_password != password ) {
		//show error message saying your passwords do not match
		document.getElementById('err_no_match').style.display = 'block';
		event.preventDefault();

		return false;
	} else {
		//clear err_no_match errors
		if ( err_no_match != null ) {
			err_no_match.style.display = 'none';
		}
	}

	form.querySelector('button[type="submit"]').remove();
	form.appendChild(createSpinner());

	firebase.auth().currentUser.updatePassword(password).then(() => {
		form.reset();
		form.querySelector('.spinner-border').remove();
		form.innerHTML = form.innerHTML + '<p>Password <span class="text-success">successfully</span> updated!</p>';

	}).catch((error) => {
		form.querySelector('.spinner-border').remove();
		form.innerHTML = form.innerHTML + '<p id="udpate_password_error" class="text-danger">' + error + '</p>';

		setTimeout(() => {
			form.querySelector('#udpate_password_error').remove();
			form.appendChild(createUpdateButton());

		}, 3000);

	});

	return false;
}

function deleteAccount (event) {
	let content = document.getElementsByClassName('content')[0];
	let form = document.getElementById('delete_account_box').querySelector('form');
	let form_g = document.getElementById('delete_account_box').querySelector('.form-group');

	form.querySelector('button[type="submit"]').remove();

	let your_final_spinner = createSpinner();
	your_final_spinner.className = your_final_spinner.className.replace('success', 'danger');
	form.appendChild(your_final_spinner);

	firebase.auth().currentUser.delete().then(() => {
		window.location.href = "hackathons.html";

	}).catch((error) => {
		form.querySelector('.spinner-border').remove();
		let e = document.createElement('p');
		e.id = "account_delete_error";
		e.className = 'text-danger';
		e.innerHTML = error;

		form_g.appendChild(e);

		setTimeout(() => {
			form.querySelector('#account_delete_error').remove();
			let e = document.createElement('button');
			e.setAttribute('type', 'submit');
			e.className = 'btn btn-danger';
			e.innerHTML = 'Yes, Proceed';

			form_g.appendChild(e);

		}, 3000);

	});

	return false;
}

function displaySettingsPage () {
	let load_spinner = document.getElementsByClassName('spinner-border')[0];
	let boxes = document.getElementsByClassName('update_box');

	for (let i = 0; i < boxes.length; i++) {
		boxes[i].style.display = 'block';
	}

	load_spinner.style.display = 'none';
}

function showLoggedOutMessage () {
	let load_spinner = document.getElementsByClassName('spinner-border')[0];

	setTimeout(() => {
		load_spinner.style.display = 'none';
		document.getElementsByClassName('content')[0].innerHTML = "<br><br><h3>It seems like you are not logged in.</h3>";
	}, 500);
}

function showUserDisplayName () {
	document.getElementById('user_current_name').textContent = firebase.auth().currentUser.displayName;
}

function showUserCurrentEmail () {
	document.getElementById('user_current_email').textContent = firebase.auth().currentUser.email;
}

(function () {

window.onload = () => {
	let boxes = document.getElementsByClassName('update_box');
	let sdc = document.getElementById('show_delete_confirmation');
	let delete_box = document.getElementById('delete_account_box');
	let go_back = document.getElementById('no_go_back');

	for (let i = 0; i < boxes.length; i++) {
		let form = boxes[i].querySelector('form');

		if ( form ) {
			form.reset();
		}
	}

	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			displaySettingsPage();
			showUserCurrentEmail();
			showUserDisplayName();
		} else {
			showLoggedOutMessage();
		}
	});

	sdc.addEventListener('click', () => {
		let prior_delete = document.getElementsByClassName('prior_delete');
		let form = document.getElementById('delete_account_box').querySelector('form');

		for (let i = 0; i < prior_delete.length; i++) {
			prior_delete[i].style.display = 'none';
		}

		form.style.display = 'block';		
	});

	go_back.addEventListener('click', () => {
		let prior_delete = document.getElementsByClassName('prior_delete');
		let form = document.getElementById('delete_account_box').querySelector('form');

		for (let i = 0; i < prior_delete.length; i++) {
			prior_delete[i].style.display = 'block';
		}

		form.style.display = 'none';
	});
}

})();